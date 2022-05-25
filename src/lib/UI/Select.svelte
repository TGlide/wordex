<script lang="ts">
  export let value: string | number;
</script>

<select on:change {value}>
  <slot />
</select>

<style>
  select {
    background: var(--underground);
    border: 0.1rem solid var(--border);
    border-radius: var(--radii-sm);
    color: var(--primary);

    padding: 0.75rem 0.25rem;
    width: 100%;
    max-width: 80px;
  }

  select:hover {
    border-color: var(--border-hover);
  }

  select:active {
    border-color: var(--border-active);
  }
</style>
