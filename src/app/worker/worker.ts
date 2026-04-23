import type { WorkerRequest, WorkerResponse } from "./bridge";

declare const verovio: any;
let verovioToolkit: any;

const isVerovioModuleReady = (() => {
    let resolve: (value: null) => void;
    const promise = new Promise<null>((res) => {
        resolve = res;
    });
    return { promise, resolve: resolve! };
})();

addEventListener(
    'message',
    function (event: MessageEvent<WorkerRequest>) {
        if ('verovioUrl' in event.data) {
            const { taskId, verovioUrl } = event.data;

            const postInitError = (error: unknown) => {
                postMessage({
                    taskId,
                    method: "init",
                    result: null,
                    error: error instanceof Error ? error.message : String(error),
                } as WorkerResponse);
            };

            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                importScripts(verovioUrl);

                // Initialize the Verovio module once the script is loaded
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                verovio.module.onRuntimeInitialized = function () {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        verovio.enableLog(verovio.LOG_DEBUG);
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        verovioToolkit = new verovio.toolkit();
                        isVerovioModuleReady.resolve(null);
                        postMessage({
                            taskId,
                            method: "init",
                            result: null,
                        } as WorkerResponse);
                    } catch (error) {
                        postInitError(error);
                    }
                };
            } catch (error) {
                postInitError(error);
            }
            return;
        }

        const { taskId, method, args } = event.data;

        if (method === 'onRuntimeInitialized') {
            isVerovioModuleReady.promise.then(() => {
                postMessage({ taskId, method, args, result: null } as WorkerResponse);
            });
            return;
        }

        const fn = verovioToolkit?.[method || ''];
        let result;
        if (fn) {
            result = fn.apply(verovioToolkit, args || []);
        } else {
            console.warn('Unknown method:', method);
        }

        postMessage({ taskId, method, args, result } as WorkerResponse);
    },
    false
);
