<div class="container">
  <h1><a href="/">Wordex</a></h1>
  <img src="https://avatars.githubusercontent.com/u/26071571?v=4" alt="" />
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

  img {
    border-radius: 100%;
    margin-top: 6rem;
    width: 300px;
  }

  p {
    font-size: 2rem;
    margin-top: 2rem;
  }

  p a {
    text-decoration: underline;
  }

  p a:hover {
    opacity: 0.75;
  }
</style>
