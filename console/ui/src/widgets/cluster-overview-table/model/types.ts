import { CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES } from '@widgets/cluster-overview-table/model/constants.ts';
import { ClusterInfoInstance } from '@shared/api/api/clusters.ts';

export interface ClusterOverviewTableProps {
  clusterName?: string;
  items?: ClusterInfoInstance[];
  isLoading?: boolean;
}

export interface ClusterOverviewTableValues {
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.NAME]: string;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.HOST]: string;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.ROLE]: string;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.STATE]: string;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TIMELINE]: number;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.LAG]: number | null | undefined;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.PENDING_RESTART]: string;
  [CLUSTER_OVERVIEW_TABLE_COLUMN_NAMES.TAGS]: string;
}
