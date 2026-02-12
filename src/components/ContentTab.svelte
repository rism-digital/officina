<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";
    import TreeCrumb from "./TreeCrumb.svelte";
    import TreeNode from "./TreeNode.svelte";
    import type { EditInfoContent } from "../app/types";

    export let editInfoContent: EditInfoContent | null = null;

    let breadcrumbsWrapper: HTMLDivElement | null = null;
    let treeRoot: HTMLDivElement | null = null;

    const dispatch = createEventDispatcher<{ selectElement: string; hoverElement: string | null }>();

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

    $: if (editInfoContent?.ancestors) {
        scrollBreadcrumbsToEnd();
    }

    async function scrollToSelectedNode(id: string) {
        await tick();
        if (!treeRoot) return;
        const target = treeRoot.querySelector(`[data-id="${id}"]`) as HTMLElement | null;
        if (!target) return;
        const parentRect = treeRoot.getBoundingClientRect();
        const childRect = target.getBoundingClientRect();
        const offsetTop = childRect.top - parentRect.top + treeRoot.scrollTop;
        treeRoot.scrollTo({ top: Math.max(offsetTop - 50, 0) });
    }

    $: if (editInfoContent?.object?.id) {
        scrollToSelectedNode(editInfoContent?.object?.id);
    }
</script>

<div class="vrv-legend">
    Score structure<span class="icon">▼</span>
</div>
<div class="vrv-field-set" style="flex-grow: 3;">
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-tree-breadcrumbs-wrapper" bind:this={breadcrumbsWrapper}>
            <div class="vrv-tree-breadcrumbs">
                <div class="vrv-tree-breadcrumb" />
                {#if editInfoContent && editInfoContent.ancestors}
                    {#each editInfoContent.ancestors.reverse() as ancestor}
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
            {#if editInfoContent && editInfoContent.context}
                <TreeNode
                    node={editInfoContent.context}
                    isRoot
                    selectedId={editInfoContent.object?.id ?? null}
                    on:select={handleSelect}
                    on:hover={handleHover}
                />
            {/if}
        </div>
    </div>
</div>

<div class="vrv-legend">
    Attributes or text<span class="icon">▼</span>
</div>
<div class="vrv-field-set" style="flex-grow: 3;">
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-attribute-list-wrapper">
            <div class="vrv-attribute-filter"></div>
        </div>
    </div>
</div>
<div class="vrv-legend">
    Referencing elements<span class="icon">▼</span>
</div>
<div class="vrv-field-set">
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-reference-list-wrapper"></div>
    </div>
</div>
<div class="vrv-legend">
    Referenced elements<span class="icon">▼</span>
</div>
<div class="vrv-field-set">
    <div class="vrv-field-set-panel">
        <div class="vrv-reference-list-wrapper"></div>
    </div>
</div>
