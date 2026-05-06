<script lang="ts">
    import ScorePropertiesAttributeList from "../ScorePropertiesAttributeList.svelte";
    import type { EditActionSetParam, TreeNodeData } from "../../app/types";
    import Tree from "../Tree.svelte";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Score properties";
    export let scoreDef: TreeNodeData | null = null;
    export let onConfirm: ((scoreDef: TreeNodeData | null, edited: boolean) => void) | null = null;
    export let onCancel: (() => void) | null = null;

    let selectedNodeId: string | null = null;
    let localScoreDef: TreeNodeData | null = null;
    let initialSerializedScoreDef = "";

    function findNodeById(node: TreeNodeData | null, id: string | null): TreeNodeData | null {
        if (!node || !id) return null;
        if (node.id === id) return node;
        for (const child of node.children ?? []) {
            const found = findNodeById(child, id);
            if (found) return found;
        }
        return null;
    }

    function handleTreeSelect(id: string) {
        selectedNodeId = id;
    }

    function cloneScoreDef(node: TreeNodeData | null): TreeNodeData | null {
        if (!node) return null;
        return JSON.parse(JSON.stringify(node)) as TreeNodeData;
    }

    function serializeScoreDef(node: TreeNodeData | null): string {
        if (!node) return "";
        return JSON.stringify(node);
    }

    function replaceNodeById(
        node: TreeNodeData | null,
        id: string | null,
        updater: (node: TreeNodeData) => TreeNodeData,
    ): TreeNodeData | null {
        if (!node || !id) return node;
        if (node.id === id) return updater(node);
        if (!node.children?.length) return node;
        return {
            ...node,
            children: node.children.map((child) =>
                replaceNodeById(child, id, updater) as TreeNodeData,
            ),
        };
    }

    function updateSelectedAttribute(name: string, value: string) {
        if (name === "xml:id") return;
        localScoreDef = replaceNodeById(localScoreDef, selectedNodeId, (node) => ({
            ...node,
            attributes: {
                ...(node.attributes ?? {}),
                [name]: value,
            },
        }));
    }

    function updateSelectedText(value: string) {
        localScoreDef = replaceNodeById(localScoreDef, selectedNodeId, (node) => ({
            ...node,
            text: value,
        }));
    }

    function handleAttributeEdit(param: EditActionSetParam, _commit: boolean) {
        if (!selectedNode || param.elementId !== selectedNode.id) return;
        updateSelectedAttribute(param.attribute, param.value);
    }

    $: ancestors = [];
    $: selectedNode = findNodeById(localScoreDef, selectedNodeId) ?? localScoreDef;
    $: selectedText = selectedNode?.text == null ? "" : String(selectedNode.text);
    $: showTextInput = selectedNode?.text != null;
    $: isEdited = serializeScoreDef(localScoreDef) !== initialSerializedScoreDef;

    $: if (!open) {
        selectedNodeId = null;
        localScoreDef = null;
        initialSerializedScoreDef = "";
    } else if (!localScoreDef && scoreDef) {
        localScoreDef = cloneScoreDef(scoreDef);
        initialSerializedScoreDef = serializeScoreDef(localScoreDef);
        selectedNodeId = localScoreDef?.id ?? null;
    } else if (localScoreDef && !findNodeById(localScoreDef, selectedNodeId)) {
        selectedNodeId = localScoreDef.id;
    }

    function handleOk() {
        onConfirm?.(localScoreDef, isEdited);
    }

    function handleCancel() {
        onCancel?.();
    }

</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    boxClass="vrv-dialog-score-properties"
    onOk={handleOk}
    onCancel={handleCancel}
>
    <div class="vrv-dialog-score-properties-columns">
        <div class="vrv-dialog-score-properties-column">
            <div class="vrv-dialog-score-properties-title">Score structure</div>
            <div class="vrv-dialog-score-properties-panel">
                {#if !localScoreDef}
                    <div>No score element selected.</div>
                {:else}
                    <Tree
                        {ancestors}
                        context={localScoreDef}
                        selectedId={selectedNodeId}
                        onSelectElement={handleTreeSelect}
                    />
                {/if}
            </div>
        </div>
        <div class="vrv-dialog-score-properties-column">
            <div class="vrv-dialog-score-properties-title">Attributes</div>
            <div class="vrv-dialog-score-properties-panel">
                {#if selectedNode}
                    {#if showTextInput}
                    <input
                        class="vrv-dialog-score-properties-panel-text"
                        value={selectedText}
                        on:input={(event) =>
                            updateSelectedText((event.target as HTMLInputElement).value)}
                    />
                    {:else}
                    <ScorePropertiesAttributeList
                        node={selectedNode}
                        onEditSet={handleAttributeEdit}
                    />
                    {/if}
                {:else}
                    <div>Select a score node to view attributes.</div>
                {/if}
            </div>
        </div>
    </div>
</Dialog>
