export function switchTheme() {
  const oldValue = document.documentElement.getAttribute('data-theme');
  const newValue = oldValue === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newValue);
  localStorage.setItem('theme', newValue);
}
