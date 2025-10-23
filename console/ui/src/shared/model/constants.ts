export const AUTHENTICATION_METHODS = Object.freeze({
  // changing names might break secrets POST request
  SSH: 'ssh_key',
  PASSWORD: 'password',
});

export const LOCAL_STORAGE_ITEMS = Object.freeze({
  IS_EXPERT_MODE: 'isExpertMode',
});

export let IS_EXPERT_MODE = localStorage.getItem(LOCAL_STORAGE_ITEMS.IS_EXPERT_MODE)?.toString() === 'true';

window.addEventListener('storage', () => {
  IS_EXPERT_MODE = localStorage.getItem(LOCAL_STORAGE_ITEMS.IS_EXPERT_MODE)?.toString() === 'true'; // TODO: refactor
});
