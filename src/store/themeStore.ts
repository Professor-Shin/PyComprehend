import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'pycomprehend.theme';

const media = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

export function systemTheme(): ResolvedTheme {
  return media()?.matches ? 'dark' : 'light';
}

function readStored(): ThemePreference {
  if (typeof localStorage === 'undefined') return 'system';
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

export function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  document.documentElement.style.colorScheme = resolved;
}

interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
  /** Cycles system -> light -> dark -> system. */
  cycle: () => void;
  /** Subscribes to OS changes; returns an unsubscribe. Call once, from App. */
  init: () => () => void;
}

const initialPreference = readStored();

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: initialPreference,
  resolved: initialPreference === 'system' ? systemTheme() : initialPreference,

  setPreference: (preference) => {
    const resolved = preference === 'system' ? systemTheme() : preference;
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      /* private mode — the choice simply does not persist */
    }
    applyTheme(resolved);
    set({ preference, resolved });
  },

  cycle: () => {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(get().preference) + 1) % order.length];
    get().setPreference(next);
  },

  init: () => {
    applyTheme(get().resolved);
    const mq = media();
    if (!mq) return () => {};
    // Only the OS matters while the preference is 'system'.
    const onChange = () => {
      if (get().preference !== 'system') return;
      const resolved = systemTheme();
      applyTheme(resolved);
      set({ resolved });
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  },
}));
