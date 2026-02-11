<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let id: string | null = null;
    export let label = "";

    const dispatch = createEventDispatcher<{ select: string; hover: string | null }>();

    function handleSelect() {
        if (!id) return;
        dispatch("select", id);
    }

    function handleHover(active: boolean) {
        dispatch("hover", active ? id : null);
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
