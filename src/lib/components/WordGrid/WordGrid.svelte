<script lang="ts">
  import { keyDispatcher } from '$lib/dispatchers/keyDispatcher';
  import { store } from '$lib/store';
  import { GameState } from '$lib/types';
  import { range } from '$lib/utils/array';
  import { getCellStates } from '$lib/utils/state';
  import Cell from './Cell.svelte';

  // State
  $: currentRow = $store.tries.length - 1;

  // Lifecycle
  keyDispatcher.addListenerOnMount((key, code) => {
    store.onKeyDown({ key: key.toLowerCase(), code: code ?? '', metaKey: false });
  });

  // Methods
  $: getRowCellsState = (row: number) => {
    if (row >= currentRow) return [];
    const state = getCellStates($store.tries[row], $store.dailyWord);
    return state;
  };
</script>

<svelte:window on:keydown={store.onKeyDown} />

<div
  class="grid"
  style:--rows={$store.maxTries}
  style:--cols={$store.wordSize}
  style:--fs-base={Math.max($store.maxTries, $store.wordSize)}
>
  {#each range(0, $store.maxTries) as row}
    {@const cellsState = getRowCellsState(row)}

    {#each range(0, $store.wordSize) as col}
      {@const letter = $store.tries[row]?.[col]}
      {@const selected =
        $store.gameState === GameState.PLAYING && row === currentRow && $store.letterIdx === col}

      <Cell
        disabled={row !== currentRow || $store.disabled || $store.gameState !== GameState.PLAYING}
        state={cellsState[col]}
        {selected}
        {letter}
        {col}
        on:click={() => {
          $store.letterIdx = col;
        }}
      />
    {/each}
  {/each}
</div>

<style>
  @keyframes scale {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);

    font-size: clamp(1rem, calc(50vmin / var(--fs-base, 1)), 4.5rem);
    gap: 0.15em;

    animation: scale 1s ease 0.25s;
    animation-fill-mode: backwards;
  }
</style>
