import {
    VEROVIO_METHOD_ALIASES,
    type VerovioToolkit,
} from "./verovio-types";

export type VerovioInitMessage = {
    taskId: string;
    verovioUrl: string;
};

export type VerovioRequest = {
    taskId: string;
    method: string;
    args?: unknown[];
};

export type WorkerRequest = VerovioInitMessage | VerovioRequest;

export type WorkerResponse = {
    taskId: string;
    method: string;
    args?: unknown[];
    result: unknown;
    error?: string;
};


let seq = 0;

type VerovioMethod = keyof VerovioToolkit;
type VerovioMethodAliases = Partial<Record<VerovioMethod, string>>;

export type WorkerBridge = {
    init: (verovioUrl: string) => Promise<void>;
    call: <M extends VerovioMethod>(
        method: M,
        args?: Parameters<VerovioToolkit[M]>
    ) => Promise<ReturnType<VerovioToolkit[M]>>;
    verovio: {
        [M in VerovioMethod]: (...args: Parameters<VerovioToolkit[M]>) => Promise<ReturnType<VerovioToolkit[M]>>;
    };
};

export function createWorkerBridge(
    worker: Worker,
    methodAliases: VerovioMethodAliases = VEROVIO_METHOD_ALIASES,
): WorkerBridge {
    const pending = new Map<
        string,
        { resolve: (value: any) => void; reject: (err: Error) => void }
    >();

    worker.addEventListener('message', (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        const handler = pending.get(message.taskId);
        if (!handler) return;
        pending.delete(message.taskId);
        if (message.error) {
            handler.reject(new Error(message.error));
            return;
        }
        handler.resolve(message.result);
    });

    worker.addEventListener('error', (event) => {
        const message = event.message || 'Worker error';
        for (const [taskId, handler] of pending) {
            pending.delete(taskId);
            handler.reject(new Error(message));
        }
    });

    worker.addEventListener('messageerror', () => {
        for (const [taskId, handler] of pending) {
            pending.delete(taskId);
            handler.reject(new Error('Worker message error'));
        }
    });

    function call<M extends VerovioMethod>(
        method: M,
        args?: Parameters<VerovioToolkit[M]>
    ): Promise<ReturnType<VerovioToolkit[M]>> {
        const taskId = `task_${seq++}`;
        const originalMethod = methodAliases[method] ?? String(method);
        const payload: VerovioRequest = {
            taskId,
            method: originalMethod,
            args,
        };
        return new Promise((resolve, reject) => {
            pending.set(taskId, { resolve, reject });
            worker.postMessage(payload as WorkerRequest);
        });
    }

    const verovio = new Proxy(
        {},
        {
            get(_target, prop: string) {
                return (...args: unknown[]) =>
                    call(prop as VerovioMethod, args as never);
            },
        },
    ) as WorkerBridge["verovio"];

    return {
        async init(verovioUrl: string) {
            const taskId = `task_${seq++}`;
            const payload: VerovioInitMessage = {
                taskId,
                verovioUrl,
            };
            await new Promise<void>((resolve, reject) => {
                pending.set(taskId, { resolve, reject });
                worker.postMessage(payload as WorkerRequest);
            });
        },
        call,
        verovio
    };
}
