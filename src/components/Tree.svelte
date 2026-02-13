<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";
    import TreeCrumb from "./TreeCrumb.svelte";
    import TreeNode from "./TreeNode.svelte";
    import type { TreeNodeData } from "../app/types";

    export let ancestors: TreeNodeData[] | null = null;
    export let context: TreeNodeData | null = null;
    export let selectedId: string | null = null;

    let breadcrumbsWrapper: HTMLDivElement | null = null;
    let treeRoot: HTMLDivElement | null = null;

    const dispatch = createEventDispatcher<{
        selectElement: string;
        hoverElement: string | null;
    }>();

    function handleSelect(event: CustomEvent<string>) {
        dispatch("selectElement", event.detail);
    }

    function handleHover(event: CustomEvent<string | null>) {
        dispatch("hoverElement", event.detail);
    }

    async function scrollBreadcrumbsToEnd() {
        await tick();
        if (breadcrumbsWrapper) {
            breadcrumbsWrapper.scrollLeft = breadcrumbsWrapper.scrollWidth;
        }
    }

    $: if (ancestors) {
        scrollBreadcrumbsToEnd();
    }

    async function scrollToSelectedNode(id: string) {
        await tick();
        if (!treeRoot) return;
        const target = treeRoot.querySelector(
            `[data-id="${id}"]`,
        ) as HTMLElement | null;
        if (!target) return;
        const parentRect = treeRoot.getBoundingClientRect();
        const childRect = target.getBoundingClientRect();
        const offsetTop = childRect.top - parentRect.top + treeRoot.scrollTop;
        treeRoot.scrollTo({ top: Math.max(offsetTop - 50, 0) });
    }

    $: if (selectedId) {
        scrollToSelectedNode(selectedId);
    }
</script>

<div class="vrv-tree-breadcrumbs-wrapper" bind:this={breadcrumbsWrapper}>
    <div class="vrv-tree-breadcrumbs">
        <div class="vrv-tree-breadcrumb" />
        {#if ancestors}
            {#each [...ancestors].reverse() as ancestor}
                <TreeCrumb
                    id={ancestor.id}
                    label={ancestor.element}
                    on:select={handleSelect}
                    on:hover={handleHover}
                />
            {/each}
        {/if}
    </div>
</div>
<div class="vrv-tree-root" bind:this={treeRoot}>
    {#if context}
        <TreeNode
            node={context}
            isRoot
            {selectedId}
            on:select={handleSelect}
            on:hover={handleHover}
        />
    {/if}
</div>
