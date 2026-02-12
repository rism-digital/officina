<script lang="ts">
    export let name: string;
    export let value: string;
    export let optionsAll: string[] | null = null;
    export let optionsBasic: string[] | null = null;

    const hasOptions = (optionsAll && optionsAll.length > 0) || (optionsBasic && optionsBasic.length > 0);

    function renderOptions(values: string[], selected: string) {
        return values.map((opt) => ({
            value: opt,
            selected: opt === selected,
        }));
    }
</script>

<tr class="vrv-attribute-item">
    <td class="vrv-attribute-name">{name}</td>
    <td class="vrv-attribute-value">
        {#if hasOptions}
            <select class="vrv-form-input">
                <option value=""></option>
                {#if optionsBasic && optionsAll && optionsAll.length > optionsBasic.length}
                    <optgroup label="MEI-basic">
                        {#each renderOptions(optionsBasic, value) as opt}
                            <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                        {/each}
                    </optgroup>
                    <optgroup label="MEI-all">
                        {#each renderOptions(optionsAll, value) as opt}
                            <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                        {/each}
                    </optgroup>
                {:else}
                    {#each renderOptions(optionsAll ?? optionsBasic ?? [], value) as opt}
                        <option value={opt.value} selected={opt.selected}>{opt.value}</option>
                    {/each}
                {/if}
            </select>
        {:else}
            <input class="vrv-form-input" value={value} />
        {/if}
    </td>
</tr>
