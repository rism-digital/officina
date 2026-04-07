<script lang="ts">
    import type { EditInfoContent, TreeNodeData } from "../../app/types";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Score properties";
    export let editInfoContent: EditInfoContent | null = null;
    export let onOk: (() => void) | null = null;
    export let onCancel: (() => void) | null = null;
    export let onClose: (() => void) | null = null;

    let selectedNodeId: string | null = null;

    function uniqueNodes(nodes: TreeNodeData[]): TreeNodeData[] {
        const seen = new Set<string>();
        const result: TreeNodeData[] = [];
        for (const node of nodes) {
            if (!node?.id || seen.has(node.id)) continue;
            seen.add(node.id);
            result.push(node);
        }
        return result;
    }

    function formatNodeLabel(node: TreeNodeData): string {
        const n = node.attributes?.["n"];
        return n ? `${node.element} ${String(n)}` : node.element;
    }

    function normalizeAttributes(node: TreeNodeData | null): Record<string, string> {
        if (!node?.attributes) return {};
        return Object.fromEntries(
            Object.entries(node.attributes).map(([key, value]) => [
                key,
                value == null ? "" : String(value),
            ]),
        );
    }

    $: nodes = editInfoContent
        ? uniqueNodes([
            ...editInfoContent.ancestors,
            editInfoContent.context,
            editInfoContent.object,
        ])
        : [];
    $: selectedNode =
        nodes.find((node) => node.id === selectedNodeId) ?? nodes[nodes.length - 1] ?? null;
    $: selectedAttributes = normalizeAttributes(selectedNode);
    $: selectedText =
        selectedNode?.text == null || selectedNode.text === ""
            ? ""
            : String(selectedNode.text);

    $: if (!open) {
        selectedNodeId = null;
    } else if (nodes.length > 0 && !nodes.some((node) => node.id === selectedNodeId)) {
        selectedNodeId = nodes[nodes.length - 1].id;
    }

    function handleOk() {
        onOk?.();
        onClose?.();
    }

    function handleCancel() {
        onCancel?.();
        onClose?.();
    }

    function handleRowKeydown(event: KeyboardEvent, nodeId: string) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        selectedNodeId = nodeId;
    }
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    boxClass="vrv-dialog-score-properties vrv-dialog-score-props"
    onOk={handleOk}
    onCancel={handleCancel}
>
    <div class="vrv-dialog-score-props-columns">
        <div class="vrv-dialog-score-props-column">
            <div class="vrv-dialog-score-props-title">Score structure</div>
            <div class="vrv-dialog-score-props-panel">
                {#if nodes.length === 0}
                    <div>No score element selected.</div>
                {:else}
                    {#each nodes as node}
                        <div
                            class="vrv-dialog-score-tree-row {selectedNodeId === node.id ? 'selected' : ''}"
                            role="button"
                            tabindex="0"
                            on:click={() => (selectedNodeId = node.id)}
                            on:keydown={(event) => handleRowKeydown(event, node.id)}
                        >
                            {formatNodeLabel(node)}
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="vrv-dialog-score-props-column">
            <div class="vrv-dialog-score-props-title">Attributes</div>
            <div class="vrv-dialog-score-props-panel">
                {#if selectedNode}
                    <div class="vrv-dialog-form">
                        <div class="vrv-dialog-label">Element</div>
                        <input
                            class="vrv-dialog-input"
                            value={selectedNode.element}
                            disabled
                        />

                        {#if selectedText}
                            <div class="vrv-dialog-label">Text</div>
                            <input
                                class="vrv-dialog-input"
                                value={selectedText}
                                disabled
                            />
                        {/if}

                        {#each Object.entries(selectedAttributes) as [name, value]}
                            <div class="vrv-dialog-label">{name}</div>
                            <input class="vrv-dialog-input" value={value} disabled />
                        {/each}
                    </div>
                {:else}
                    <div>Select a score node to view attributes.</div>
                {/if}
            </div>
        </div>
    </div>
</Dialog>
