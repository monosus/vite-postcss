const breakpointSm = 767;
const breakpointMd = 991;

export const isSmLte = () => window.matchMedia(`(max-width: ${breakpointSm}px)`).matches;
export const isSmGt = () => window.matchMedia(`(min-width: ${breakpointSm + 1}px)`).matches;
export const isMdLte = () => window.matchMedia(`(max-width: ${breakpointMd}px)`).matches;
export const isMdGt = () => window.matchMedia(`(min-width: ${breakpointMd + 1}px)`).matches;

const isIOS = (): boolean => {
  return (
    ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};

const isMacSafari = (): boolean => {
  return (
    navigator.userAgent.includes('Mac') &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome') &&
    !navigator.userAgent.includes('Firefox')
  );
};

export function screenLock(): void {
  if (isIOS() || isMacSafari()) {
    const top = window.scrollY || 0;

    document.documentElement.setAttribute('data-screen-locked', 'true');
    document.documentElement.style.top = `-${top}px`;
    document.documentElement.dataset.top = top.toString();
  } else {
    document.documentElement.style.overflowY = 'hidden';
    document.body.style.overflowY = 'scroll';
  }
}

export function screenUnlock(): void {
  if (isIOS() || isMacSafari()) {
    const top = Number.parseInt(document.documentElement.dataset.top || '0', 10);

    document.documentElement.setAttribute('data-screen-locked', 'false');
    document.documentElement.style.top = '';
    window.scrollTo(0, top);
  } else {
    document.documentElement.style.overflowY = '';
    document.body.style.overflowY = '';
  }
}
