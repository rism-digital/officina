<script lang="ts">
    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "XML Content Changed";
    export let onYes: (() => void) | null = null;
    export let onNo: (() => void) | null = null;
    export let onCancel: (() => void) | null = null;

    function handleYes() {
        onYes?.();
    }

    function handleNo() {
        onNo?.();
    }

    function handleCancel() {
        onCancel?.();
    }

    function handleActionKeydown(
        event: KeyboardEvent,
        action: "yes" | "no" | "cancel",
    ) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (action === "yes") {
            handleYes();
            return;
        }
        if (action === "no") {
            handleNo();
            return;
        }
        handleCancel();
    }
</script>

<Dialog
    {open}
    {title}
    icon="question"
    type="custom"
    onCancel={handleCancel}
>
    XML has changed. Do you want to reload it into the score editor?

    <svelte:fragment slot="buttons">
        <div
            class="vrv-dialog-btn"
            role="button"
            tabindex="0"
            data-before="Cancel"
            on:click={handleCancel}
            on:keydown={(event) => handleActionKeydown(event, "cancel")}
        ></div>
        <div
            class="vrv-dialog-btn"
            role="button"
            tabindex="0"
            data-before="Discard changes"
            on:click={handleNo}
            on:keydown={(event) => handleActionKeydown(event, "no")}
        ></div>
        <div
            class="vrv-dialog-btn"
            role="button"
            tabindex="0"
            data-before="Yes"
            on:click={handleYes}
            on:keydown={(event) => handleActionKeydown(event, "yes")}
        ></div>
    </svelte:fragment>
</Dialog>
