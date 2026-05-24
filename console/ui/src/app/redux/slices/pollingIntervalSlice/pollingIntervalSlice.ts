import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CLUSTERS_POLLING_INTERVAL,
  CLUSTER_OVERVIEW_POLLING_INTERVAL,
  OPERATIONS_POLLING_INTERVAL,
  OPERATION_LOGS_POLLING_INTERVAL,
} from '@shared/config/constants.ts';

export type PollingContext = 'clusters' | 'clusterOverview' | 'operations' | 'operationLogs';

export type PollingIntervalState = Record<PollingContext, number>;

const STORAGE_KEY_PREFIX = 'pollingInterval.';

// The dropdown's allowed values. `0` means "Off" — polling is disabled but the
// manual refresh button still works.
export const POLLING_INTERVAL_OPTIONS: readonly number[] = Object.freeze([
  0, 5_000, 10_000, 30_000, 60_000, 5 * 60_000, 15 * 60_000, 30 * 60_000, 60 * 60_000,
]);

const envDefaults: PollingIntervalState = {
  clusters: Number(CLUSTERS_POLLING_INTERVAL) || 60_000,
  clusterOverview: Number(CLUSTER_OVERVIEW_POLLING_INTERVAL) || 60_000,
  operations: Number(OPERATIONS_POLLING_INTERVAL) || 60_000,
  operationLogs: Number(OPERATION_LOGS_POLLING_INTERVAL) || 10_000,
};

const readStored = (key: PollingContext, fallback: number): number => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw === null) return fallback;
    const parsed = Number(raw);
    // Accept the exact menu values plus 0 (Off).
    if (Number.isFinite(parsed) && POLLING_INTERVAL_OPTIONS.includes(parsed)) {
      return parsed;
    }
  } catch (e) {
    // localStorage can throw in private browsing modes — fall through.
  }
  return fallback;
};

const initialState: PollingIntervalState = {
  clusters: readStored('clusters', envDefaults.clusters),
  clusterOverview: readStored('clusterOverview', envDefaults.clusterOverview),
  operations: readStored('operations', envDefaults.operations),
  operationLogs: readStored('operationLogs', envDefaults.operationLogs),
};

export const pollingIntervalSlice = createSlice({
  name: 'pollingInterval',
  initialState,
  reducers: {
    setPollingInterval: (
      state,
      action: PayloadAction<{ context: PollingContext; intervalMs: number }>,
    ) => {
      const { context, intervalMs } = action.payload;
      state[context] = intervalMs;
      try {
        localStorage.setItem(STORAGE_KEY_PREFIX + context, String(intervalMs));
      } catch (e) {
        // Best-effort persistence; ignore quota / private-mode failures.
      }
    },
  },
});

export const { setPollingInterval } = pollingIntervalSlice.actions;

export const selectPollingInterval =
  (context: PollingContext) =>
  (state: { pollingInterval: PollingIntervalState }): number =>
    state.pollingInterval[context];

export default pollingIntervalSlice.reducer;
