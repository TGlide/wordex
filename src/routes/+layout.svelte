<script lang="ts">
  import '../styles/index.css';
  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';

  inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
  <title>Wordex</title>
</svelte:head>

<main>
  <slot />
</main>

<style>
  main {
    height: 100%;
  }
</style>
