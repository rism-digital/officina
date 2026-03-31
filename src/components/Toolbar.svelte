<script lang="ts">
    import type { Mode } from "../app/types";

    export let mode: Mode;
    export let onToggleMode: () => void;
    export let xmlMode = false;
    export let workerBusy = false;
    export let onApplyXml: (() => void) | null = null;
    export let onReloadXml: (() => void) | null = null;
</script>

<section class="vrv-editor-toolbar vrv-text-no-select">
    {#if xmlMode}
        <div class="vrv-btn-group">
            <div class="vrv-btn-text" data-before="Apply" class:disabled={workerBusy} on:click={() => onApplyXml?.()}></div>
            <div class="vrv-btn-text" data-before="Reload" class:disabled={workerBusy} on:click={() => onReloadXml?.()}></div>
        </div>
    {:else}
        <div class="vrv-btn-group">
            <div class="vrv-btn vrv-toggleable {mode === 'insert' ? 'toggled' : ''}" on:click={onToggleMode}>
                {mode === "insert" ? "Insert" : "Edit"}
            </div>
        </div>
        <div class="vrv-h-separator"></div>
        <div class="vrv-btn-icon-large disabled" style="background-image: url('/icons/editor/undo.png');">
            <span class="vrv-tooltip">Undo ('Shift-Ctrl-V')</span>
        </div>
        <div class="vrv-btn-icon-large disabled" style="background-image: url('/icons/editor/redo.png');">
            <span class="vrv-tooltip">Redo ('Shift-Ctrl-V')</span>
        </div>
    {/if}
</section>
