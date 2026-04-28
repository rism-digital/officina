<script lang="ts">
    import type { ContextMenuItem, EditActionParam } from "../app/types";
    import { actionCatalog, actionDefinitions } from "../app/actions/action.bundle";

    export let x = 0;
    export let y = 0;
    export let elementName = "";
    export let onSelect: ((action: string, label: string, param?: EditActionParam) => void) | null = null;
    export let onClose: (() => void) | null = null;

    type ActionCatalogEntry = {
        name: string;
        action: string;
    };

    type ActionDefinition = {
        action: string;
        param?: EditActionParam;
    };

    let items: ContextMenuItem[] = [];

    function actionItemsFor(name: string): ContextMenuItem[] {
        const entries = actionCatalog[name] ?? [];
        const resolvedItems: ContextMenuItem[] = [];
        for (const entry of entries) {
            const definition = actionDefinitions[entry.action];
            if (!definition) continue;
            resolvedItems.push({
                label: entry.name,
                action: definition.action,
                param: definition.param,
            });
        }
        return resolvedItems;
    }

    $: items = actionItemsFor(elementName);
    $: if (elementName && items.length === 0) close();

    function close() {
        onClose?.();
    }

    function handleWindowContextMenu(event: MouseEvent) {
        event.preventDefault();
        close();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            close();
        }
    }

    function handleAction(action: string, label: string, param?: EditActionParam) {
        onSelect?.(action, label, param);
    }

    function handleActionKeydown(
        event: KeyboardEvent,
        action: string,
        label: string,
        param?: EditActionParam,
    ) {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleAction(action, label, param);
    }
</script>

<svelte:window
    on:click={close}
    on:contextmenu={handleWindowContextMenu}
    on:keydown={handleKeydown}
    on:resize={close}
/>

<div
    class="vrv-context-menu open vrv-text-no-select"
    style={`left: ${x}px; top: ${y}px;`}
    role="menu"
    tabindex="-1"
    on:click|stopPropagation
    on:contextmenu|preventDefault|stopPropagation
    on:keydown={handleKeydown}
>
    <div class="vrv-menu-content vrv-context-menu-content">
        {#each items as item}
            <div
                class="vrv-menu-text"
                data-before={item.label}
                role="menuitem"
                tabindex="0"
                on:click={() => handleAction(item.action, item.label, item.param)}
                on:keydown={(event) =>
                    handleActionKeydown(
                        event,
                        item.action,
                        item.label,
                        item.param,
                    )}
            ></div>
        {/each}
    </div>
</div>
