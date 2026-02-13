<script lang="ts">
    import { createEventDispatcher, tick } from "svelte";
    import TreeCrumb from "./TreeCrumb.svelte";
    import TreeNode from "./TreeNode.svelte";
    import AttributeList from "./AttributeList.svelte";
    import type { EditInfoContent } from "../app/types";
    import type { RNGLoader } from "../app/rng-loader";

    export let editInfoContent: EditInfoContent | null = null;
    export let rngMEIAll: RNGLoader | null = null;
    export let rngMEIBasic: RNGLoader | null = null;

    let breadcrumbsWrapper: HTMLDivElement | null = null;
    let treeRoot: HTMLDivElement | null = null;
    let closedSections = {
        structure: false,
        attributes: false,
        referencing: false,
        referenced: false,
    };

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

    $: if (editInfoContent?.ancestors) {
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

    $: if (editInfoContent?.object?.id) {
        scrollToSelectedNode(editInfoContent?.object?.id);
    }

    function toggleSection(key: keyof typeof closedSections) {
        closedSections = { ...closedSections, [key]: !closedSections[key] };
    }
</script>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.structure}>
    Score structure<span
        class="icon"
        on:click={() => toggleSection("structure")}>▼</span
    >
</div>
<div
    class="vrv-field-set vrv-collapsible"
    class:close={closedSections.structure}
    style="flex-grow: 3;"
>
    <div class="vrv-field-set-panel" style="display: flex;">
        <div
            class="vrv-tree-breadcrumbs-wrapper"
            bind:this={breadcrumbsWrapper}
        >
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

<div class="vrv-legend vrv-collapsible" class:close={closedSections.attributes}>
    Attributes or text<span
        class="icon"
        on:click={() => toggleSection("attributes")}>▼</span
    >
</div>
<div
    class="vrv-field-set vrv-collapsible"
    class:close={closedSections.attributes}
    style="flex-grow: 3;"
>
    <div class="vrv-field-set-panel" style="display: flex;">
        <AttributeList {editInfoContent} {rngMEIAll} {rngMEIBasic} />
    </div>
</div>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.referencing}>
    Referencing elements<span
        class="icon"
        on:click={() => toggleSection("referencing")}>▼</span
    >
</div>

<div class="vrv-field-set vrv-collapsible" class:close={closedSections.referencing}>
    <div class="vrv-field-set-panel" style="display: flex;">
        <div class="vrv-reference-list-wrapper"></div>
    </div>
</div>

<div class="vrv-legend vrv-collapsible" class:close={closedSections.referenced}>
    Referenced elements<span
        class="icon"
        on:click={() => toggleSection("referenced")}>▼</span
    >
</div>

<div class="vrv-field-set vrv-collapsible" class:close={closedSections.referenced}>
    <div class="vrv-field-set-panel">
        <div class="vrv-reference-list-wrapper"></div>
    </div>
</div>
