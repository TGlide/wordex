<script lang="ts">
  import { store } from '$lib/store';
  import { getKeyStates } from '$lib/utils/state';
  import KeyboardButton from './KeyboardButton.svelte';

  $: keyStates = getKeyStates($store.tries.slice(0, -1), $store.dailyWord);
</script>

<div class="wrapper">
  <KeyboardButton key="Q" variant={keyStates['q']} />
  <KeyboardButton key="W" variant={keyStates['w']} />
  <KeyboardButton key="E" variant={keyStates['e']} />
  <KeyboardButton key="R" variant={keyStates['r']} />
  <KeyboardButton key="T" variant={keyStates['t']} />
  <KeyboardButton key="Y" variant={keyStates['y']} />
  <KeyboardButton key="U" variant={keyStates['u']} />
  <KeyboardButton key="I" variant={keyStates['i']} />
  <KeyboardButton key="O" variant={keyStates['o']} />
  <KeyboardButton key="P" variant={keyStates['p']} />
  <KeyboardButton key="A" variant={keyStates['a']} gridColumn="3 / span 3" />
  <KeyboardButton key="S" variant={keyStates['s']} />
  <KeyboardButton key="D" variant={keyStates['d']} />
  <KeyboardButton key="F" variant={keyStates['f']} />
  <KeyboardButton key="G" variant={keyStates['g']} />
  <KeyboardButton key="H" variant={keyStates['h']} />
  <KeyboardButton key="J" variant={keyStates['j']} />
  <KeyboardButton key="K" variant={keyStates['k']} />
  <KeyboardButton key="L" variant={keyStates['l']} />
  <KeyboardButton key="del" keyCodes={['Backspace', 'Delete']} />
  <KeyboardButton key="Z" variant={keyStates['z']} gridColumn="4 / span 3" />
  <KeyboardButton key="X" variant={keyStates['x']} />
  <KeyboardButton key="C" variant={keyStates['c']} />
  <KeyboardButton key="V" variant={keyStates['v']} />
  <KeyboardButton key="B" variant={keyStates['b']} />
  <KeyboardButton key="N" variant={keyStates['n']} />
  <KeyboardButton key="M" variant={keyStates['m']} />
  <KeyboardButton key="enter" gridColumn="span 8" />
</div>

<style>
  .wrapper {
    display: grid;
    gap: clamp(0.15rem, 1vw, 1rem);
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(32, 1fr);
    justify-content: center;

    width: 100%;
    max-width: 900px;
    height: 25vh;
    max-height: 250px;
  }

  @media (min-width: 768px) {
  }
</style>
