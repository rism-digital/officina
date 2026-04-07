<script lang="ts">
    import type { MEIExportOptions } from "../../app/types";
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "Select the MEI export options";
    export let value: MEIExportOptions = {
        basic: false,
        removeIds: false,
        ignoreHeader: false
    };
    export let onConfirm: ((options: MEIExportOptions) => void) | null = null;
    export let onClose: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onCancel: ((value: number) => void) | null = null;

    let basic = value.basic;
    let removeIds = value.removeIds;
    let ignoreHeader = value.ignoreHeader;

    $: if (open) {
        basic = value.basic;
        removeIds = value.removeIds;
        ignoreHeader = value.ignoreHeader;
    }

    function handleOk(result: number) {
        const options: MEIExportOptions = {
            ...value,
            basic,
            removeIds,
            ignoreHeader,
        };
        onConfirm?.(options);
        onOk?.(result);
    }
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="okcancel"
    onOk={handleOk}
    {onClose}
    {onCancel}
>
    <div class="vrv-dialog-form">
        <div class="vrv-dialog-label">MEI Basic</div>
        <input class="vrv-dialog-input" type="checkbox" bind:checked={basic} />

        <div class="vrv-dialog-label">Remove IDs</div>
        <input class="vrv-dialog-input" type="checkbox" bind:checked={removeIds} />

        <div class="vrv-dialog-label">Ignore MEI Header</div>
        <input class="vrv-dialog-input" type="checkbox" bind:checked={ignoreHeader} />
    </div>
</Dialog>
