<script lang="ts">
    import type { HoverElementHandler, SelectElementHandler } from "../app/types";

    export let id: string | null = null;
    export let label = "";
    export let onSelect: SelectElementHandler | null = null;
    export let onHover: HoverElementHandler | null = null;

    function handleSelect() {
        if (!id) return;
        onSelect?.(id);
    }

    function handleHover(active: boolean) {
        onHover?.(active ? id : null);
    }
</script>

<div
    class="vrv-tree-breadcrumb"
    data-id={id ?? undefined}
    on:click={handleSelect}
    on:mouseenter={() => handleHover(true)}
    on:mouseleave={() => handleHover(false)}
>
    {label}
</div>
