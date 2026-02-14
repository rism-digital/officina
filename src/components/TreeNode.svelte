<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { TreeNodeData } from "../app/types";
    import { iconFor } from "../app/icons";

    export let node: TreeNodeData;
    export let isRoot = false;
    export let selectedId: string | null = null;

    let htmlTreeNode: HTMLDivElement | null = null;

    const dispatch = createEventDispatcher<{
        select: string;
        hover: string | null;
    }>();

    function handleOpenClose() {
        if (!htmlTreeNode) return;
        if (htmlTreeNode.classList.contains("open")) {
            htmlTreeNode.classList.remove("open");
        } else {
            htmlTreeNode.classList.add("open");
            handleSelect();
        }
    }

    function handleSelect() {
        dispatch("select", node.id);
    }

    function handleMouseEnter() {
        dispatch("hover", node.id);
    }

    function handleMouseLeave() {
        dispatch("hover", null);
    }
</script>

<div
    class={isRoot
        ? "vrv-tree-root open"
        : `vrv-tree-node${node.isLeaf ? " leaf" : ""} ${node.children?.length ? " open" : ""}`}
    data-id={node.id}
    data-element={node.element}
    on:click|stopPropagation={handleOpenClose}
    bind:this={htmlTreeNode}
>
    <div
        class="vrv-mei-element vrv-node-label {node.id === selectedId ? 'target checked' : ''}"
        data-id={node.id}
        data-element={node.element}
        style={`background-image: url("${iconFor(node.element)}");${isRoot ? " display: none;" : ""}`}
        on:click|stopPropagation={handleSelect}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
    >
        {node.element} {node.attributes?.["n"] ? `${node.attributes["n"]}` : ""}
     </div>
    <div class="vrv-node-children">
        {#if node.children?.length}
            {#each node.children as child}
                <svelte:self node={child} {selectedId} on:select on:hover />
            {/each}
        {/if}
    </div>
</div>
