<script lang="ts">
  import { keyDispatcher } from '$lib/dispatchers/keyDispatcher';
  import { store } from '$lib/store';
  import { KeyState } from '$lib/types';
  import { cva, type VariantProps } from 'class-variance-authority';

  export let key: string;
  export let keyCodes: string[] | undefined = undefined;
  export let gridColumn: string = 'span 3';

  let pressed = false;

  const eventHasKey = (event: KeyboardEvent) => {
    return event.key.toLowerCase() === key.toLowerCase() || keyCodes?.includes(event.code);
  };

  const onKey = (event: KeyboardEvent, action: 'up' | 'down') => {
    if (!event.metaKey && eventHasKey(event)) {
      pressed = action === 'down';
    }
  };

  const onClick = () => {
    pressed = false;

    if (keyCodes) {
      keyDispatcher.dispatch(key, keyCodes[0]);
    } else {
      keyDispatcher.dispatch(key);
    }
  };

  const keyboardBtn = cva('keyboard-btn', {
    variants: {
      variant: {
        [KeyState.CORRECT]: 'keyboard-btn--correct',
        [KeyState.PRESENT]: 'keyboard-btn--present',
        [KeyState.PARTIAL]: 'keyboard-btn--partial',
        [KeyState.ABSENT]: 'keyboard-btn--absent'
      },
      pressed: {
        true: 'keyboard-btn--pressed'
      }
    }
  });

  export let variant: VariantProps<typeof keyboardBtn>['variant'] = undefined;
  let delayedVariant = variant;

  $: {
    if (variant !== delayedVariant && !$store.disabled) {
      delayedVariant = variant;
    }
  }
</script>

<svelte:window on:keydown={(e) => onKey(e, 'down')} on:keyup={(e) => onKey(e, 'up')} />

<button
  class={keyboardBtn({ variant: delayedVariant, pressed })}
  on:click={onClick}
  style:grid-column={gridColumn}
>
  <span>
    {key}
  </span>
</button>

<style>
  .keyboard-btn {
    cursor: pointer;
    font-weight: 800;
  }

  span {
    display: grid;
    place-items: center;

    background-color: var(--foreground);
    border-radius: var(--radii-sm);
    font-size: clamp(0.5rem, 4vw, 1.25rem);

    width: 100%;
    height: 100%;
    transition: all var(--appearance), transform var(--motion);
  }

  .keyboard-btn:hover span {
    opacity: 0.9;
  }

  :is(.keyboard-btn:active, .keyboard-btn--pressed) span {
    transform: translateY(0.25rem);
  }

  .keyboard-btn--correct span {
    background-color: var(--correct);
  }

  .keyboard-btn--present span {
    background-color: var(--present);
  }

  .keyboard-btn--partial span {
    background: linear-gradient(
      to right,
      var(--present) 0%,
      var(--present) 50%,
      var(--correct) 50%,
      var(--correct) 100%
    );
  }

  .keyboard-btn--absent span {
    opacity: 0.25;
  }
</style>
