<script lang="ts">
    import { onDestroy, tick } from "svelte";

    type DialogType = "msg" | "okcancel" | "custom";

    export let open = false;
    export let title = "";
    export let icon = "info";
    export let type: DialogType = "okcancel";
    export let okLabel = "OK";
    export let cancelLabel = "Cancel";
    export let boxClass = "";
    export let onCancel: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onClose: ((value: number) => void) | null = null;

    let okButton: HTMLDivElement | null = null;

    function onKeydown(event: KeyboardEvent) {
        if (!open) return;
        if (event.key === "Escape") {
            handleCancel();
            return;
        }
        if (type === "custom") {
            return;
        }
        if (event.key === "Enter") {
            handleOk();
        }
    }

    function handleCancel() {
        onCancel?.(0);
        onClose?.(0);
    }

    function handleOk() {
        const value = type === "okcancel" ? 1 : 0;
        onOk?.(value);
        onClose?.(value);
    }

    function handleActionKeydown(event: KeyboardEvent, action: "cancel" | "ok") {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        if (action === "cancel") {
            handleCancel();
            return;
        }
        handleOk();
    }

    $: if (open) {
        tick().then(() => okButton?.focus());
        document.addEventListener("keydown", onKeydown);
    } else {
        document.removeEventListener("keydown", onKeydown);
    }

    onDestroy(() => {
        document.removeEventListener("keydown", onKeydown);
    });
</script>

<div class="vrv-dialog" style:display={open ? "block" : "none"}>
    <div class={`vrv-dialog-box ${boxClass}`.trim()}>
        <div class="vrv-dialog-top">
            <div class={`vrv-dialog-icon ${icon}`}></div>
            <div class="vrv-dialog-title">{title}</div>
            <div
                class="vrv-dialog-close"
                role="button"
                tabindex="0"
                on:click={handleCancel}
                on:keydown={(event) => handleActionKeydown(event, "cancel")}
            ></div>
        </div>

        <div class="vrv-dialog-content">
            <slot></slot>
        </div>

        <div class="vrv-dialog-bottom">
            <slot name="buttons"></slot>
            {#if type === "okcancel"}
                <div
                    class="vrv-dialog-btn"
                    role="button"
                    tabindex="0"
                    data-before={cancelLabel}
                    on:click={handleCancel}
                    on:keydown={(event) => handleActionKeydown(event, "cancel")}
                ></div>
            {/if}
            {#if type !== "custom"}
                <div
                    class="vrv-dialog-btn"
                    role="button"
                    tabindex="0"
                    data-before={okLabel}
                    bind:this={okButton}
                    on:click={handleOk}
                    on:keydown={(event) => handleActionKeydown(event, "ok")}
                ></div>
            {/if}
        </div>
    </div>
</div>
