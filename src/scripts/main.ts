import { setupCounter } from './modules/counter.ts';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `<div>
    <a href="https://vite.dev" target="_blank">
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>`;

  const counterEl = document.querySelector<HTMLButtonElement>('#counter');
  if (counterEl) {
    setupCounter(counterEl);
  }
}
