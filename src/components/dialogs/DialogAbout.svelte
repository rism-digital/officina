<script lang="ts">
    import { marked } from 'marked'

    import Dialog from "./Dialog.svelte";

    export let open = false;
    export let title = "About";
    export let libraries = "";
    export let licenseUrl = "";
    export let changelogUrl = "";
    export let renderContent: (value: string) => string = (value) => value;
    export let onClose: ((value: number) => void) | null = null;
    export let onOk: ((value: number) => void) | null = null;
    export let onCancel: ((value: number) => void) | null = null;

    let licenseContent = "";
    let changelogContent = "";
    let loaded = false;

    async function fetchSection(url: string): Promise<string> {
        if (!url) return "";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        return response.text();
    }

    async function load() {
        if (loaded) return;
        loaded = true;

        try {
            licenseContent = renderContent(await fetchSection(licenseUrl));
        } catch (error) {
            console.error(error);
        }

        try {
            changelogContent = renderContent(await fetchSection(changelogUrl));
        } catch (error) {
            console.error(error);
        }
    }

    $: if (open) {
        load();
    }
</script>

<Dialog
    {open}
    {title}
    icon="info"
    type="msg"
    okLabel="Close"
    {onClose}
    {onOk}
    {onCancel}
>
    {#if libraries}
        <div>{@html marked(libraries)}</div>
    {/if}

    {#if licenseContent}
        <details>
            <summary>License (AGPL-3.0)</summary>
            <div>{@html marked(licenseContent)}</div>
        </details>
    {/if}

    {#if changelogContent}
        <details>
            <summary>Change log</summary>
            <div>{@html marked(changelogContent)}</div>
        </details>
    {/if}
</Dialog>
