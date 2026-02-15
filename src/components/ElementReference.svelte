<script lang="ts">
    import type { HoverElementHandler, ReferenceObject, SelectElementHandler } from "../app/types";
    import { iconFor } from "../app/icons";

    export let references: ReferenceObject[] | null = null;
    export let direction: "from" | "to" = "from";
    export let onSelectElement: SelectElementHandler | null = null;
    export let onHoverElement: HoverElementHandler | null = null;

    function handleClick(id: string) {
        onSelectElement?.(id);
    }

    function handleMouseEnter(id: string) {
        onHoverElement?.(id);
    }

    function handleMouseLeave() {
        onHoverElement?.(null);
    }
</script>

<div class="vrv-reference-list-wrapper">
    {#if references}
        {#each references as reference}
            <div
                class="vrv-reference-list-item vrv-mei-element"
                data-id={reference.id}
                data-element={reference.element}
                data-before={direction === "to" ? "← " : "→ "}
                style={`background-image: url("${iconFor(reference.element)}");`}
                on:click={() => handleClick(reference.id)}
                on:mouseenter={() => handleMouseEnter(reference.id)}
                on:mouseleave={handleMouseLeave}
            >
                {reference.element} @ {reference.referenceAttribute}
            </div>
        {/each}
    {/if}
</div>
