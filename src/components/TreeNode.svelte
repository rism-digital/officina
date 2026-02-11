<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TreeNodeData } from '../app/types';

  export let node: TreeNodeData;
  export let isRoot = false;

  const dispatch = createEventDispatcher<{ select: string; hover: string | null }>();

  function handleSelect() {
    dispatch('select', node.id);
  }

  function handleMouseEnter() {
    dispatch('hover', node.id);
  }

  function handleMouseLeave() {
    dispatch('hover', null);
  }
</script>

<div
  class={isRoot ? 'vrv-tree-root open' : `vrv-tree-node${node.isLeaf ? ' leaf' : ''}`}
  data-id={node.id}
  data-element={node.element}
  data-app-el-id={node.appElId}
>
  <div
    class="vrv-mei-element vrv-node-label"
    data-id={node.id}
    data-element={node.element}
    style={isRoot ? 'display: none;' : undefined}
    on:click|stopPropagation={handleSelect}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    {node.element}
  </div>
  <div class="vrv-node-children">
    {#if node.children?.length}
      {#each node.children as child}
        <svelte:self node={child} on:select on:hover />
      {/each}
    {/if}
  </div>
</div>
