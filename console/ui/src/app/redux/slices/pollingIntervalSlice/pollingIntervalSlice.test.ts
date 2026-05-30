import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

// Node 25 ships a broken experimental `localStorage` global (constructor is
// undefined, methods are missing). It pre-occupies the global slot so jsdom's
// real implementation can't take effect. We install a minimal stub instead.
const installLocalStorageStub = () => {
  const store = new Map<string, string>();
  const fake: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    key: (i) => Array.from(store.keys())[i] ?? null,
    removeItem: (k) => void store.delete(k),
    setItem: (k, v) => void store.set(k, String(v)),
  };
  Object.defineProperty(globalThis, 'localStorage', { value: fake, configurable: true });
};

type SliceModule = typeof import('./pollingIntervalSlice.ts');
let mod: SliceModule;
let baseState: SliceModule['default'] extends (s: infer S, a: never) => unknown ? S : never;

beforeAll(async () => {
  installLocalStorageStub();
  mod = await import('./pollingIntervalSlice.ts');
  baseState = {
    clusters: 60_000,
    clusterOverview: 60_000,
    operations: 60_000,
    operationLogs: 10_000,
  } as never;
});

describe('pollingIntervalSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('setPollingInterval updates the requested context only', () => {
    const next = mod.default(
      baseState,
      mod.setPollingInterval({ context: 'clusters', intervalMs: 5_000 }),
    );
    expect(next.clusters).toBe(5_000);
    expect(next.clusterOverview).toBe(60_000);
    expect(next.operations).toBe(60_000);
    expect(next.operationLogs).toBe(10_000);
  });

  it('setPollingInterval persists the new value to localStorage', () => {
    mod.default(baseState, mod.setPollingInterval({ context: 'operations', intervalMs: 30_000 }));
    expect(localStorage.getItem('pollingInterval.operations')).toBe('30000');
  });

  it('setPollingInterval accepts 0 (Off) and persists it', () => {
    const next = mod.default(
      baseState,
      mod.setPollingInterval({ context: 'operationLogs', intervalMs: 0 }),
    );
    expect(next.operationLogs).toBe(0);
    expect(localStorage.getItem('pollingInterval.operationLogs')).toBe('0');
  });
});

describe('normalizeInterval', () => {
  it('returns the value unchanged when it matches a dropdown option', () => {
    expect(mod.normalizeInterval(60_000, 10_000)).toBe(60_000);
    expect(mod.normalizeInterval(0, 10_000)).toBe(0);
  });

  it('snaps an out-of-range env value to the nearest dropdown option', () => {
    // 15000ms is closer to 10s (5s away) than 30s (15s away).
    expect(mod.normalizeInterval(15_000, 10_000)).toBe(10_000);
    // 90000ms is closer to 60000 than 300000.
    expect(mod.normalizeInterval(90_000, 10_000)).toBe(60_000);
    // Equidistant cases tie-break to the smaller (more conservative) option:
    // 20000 is 10s from both 10000 and 30000.
    expect(mod.normalizeInterval(20_000, 10_000)).toBe(10_000);
    // 45000 is 15s from both 30000 and 60000.
    expect(mod.normalizeInterval(45_000, 10_000)).toBe(30_000);
  });

  it('returns the fallback for invalid env values', () => {
    expect(mod.normalizeInterval(Number.NaN, 60_000)).toBe(60_000);
    expect(mod.normalizeInterval(-1, 60_000)).toBe(60_000);
    expect(mod.normalizeInterval(Infinity, 60_000)).toBe(60_000);
  });
});
