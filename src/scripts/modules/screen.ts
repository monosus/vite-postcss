const breakpointSm = 767;
const breakpointMd = 991;

export const isSmLte = () => window.matchMedia(`(max-width: ${breakpointSm}px)`).matches;
export const isSmGt = () => window.matchMedia(`(min-width: ${breakpointSm + 1}px)`).matches;
export const isMdLte = () => window.matchMedia(`(max-width: ${breakpointMd}px)`).matches;
export const isMdGt = () => window.matchMedia(`(min-width: ${breakpointMd + 1}px)`).matches;

export function screenLock(): void {
  const top = window.scrollY || 0;
  document.documentElement.setAttribute('data-screen-locked', 'true');
  document.documentElement.style.top = `-${top}px`;
  document.documentElement.dataset.top = top.toString();
}

export function screenUnlock(): void {
  const top = Number.parseInt(document.documentElement.dataset.top || '0', 10);
  document.documentElement.setAttribute('data-screen-locked', 'false');
  document.documentElement.style.top = '';
  window.scrollTo(0, top);
}
