<script lang="ts">
    import { onMount } from "svelte";

    export let value = "";
    export let selectedId: string | null = null;
    export let workerBusy = false;
    export let onChange: ((value: string) => void) | null = null;

    function handleInput(event: Event) {
        const target = event.currentTarget as HTMLTextAreaElement;
        onChange?.(target.value);
    }
    
    onMount(() => {
        console.log(selectedId)
    })
</script>

<div class="vrv-main-panel vrv-xml-panel">
    <textarea
        class="vrv-xml-editor"
        spellcheck="false"
        value={value}
        on:input={handleInput}
        disabled={workerBusy}
    ></textarea>
</div>
