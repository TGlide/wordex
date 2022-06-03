<div class="container">
  <h1><a href="/">Wordex</a></h1>
  <p>
    Wordex is a
    <a href="https://github.com/TGlide/wordex" target="_blank" rel="noreferrer noopener">
      open-source
    </a>
    <a
      href="https://www.nytimes.com/games/wordle/index.html"
      target="_blank"
      rel="noreferrer noopener"
    >
      wordle
    </a>
    clone, made with
    <a href="https://kit.svelte.dev/" target="_blank" rel="noreferrer noopener">SvelteKit</a>.
  </p>
  <p>
    Made by
    <a href="https://www.thomasglopes.com" target="_blank" rel="noreferrer noopener"
      >Thomas G. Lopes</a
    >
  </p>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-family: var(--ff-display);
    font-size: clamp(1.5rem, 4vw, 3rem);
    text-align: center;
    font-weight: 600;
    user-select: none;
  }

  p {
    font-size: 1.75rem;
    text-align: center;
    line-height: 2.5rem;
    margin-top: 2rem;
    max-width: 30rem;
  }

  p a {
    text-decoration: underline;
  }

  p a:hover {
    opacity: 0.75;
  }
</style>
