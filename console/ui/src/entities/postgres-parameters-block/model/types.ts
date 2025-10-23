import { POSTGRES_PARAMETERS_FIELD_NAMES } from '@entities/postgres-parameters-block/model/const.ts';

export interface PostgresParametersBlockValues {
  [POSTGRES_PARAMETERS_FIELD_NAMES.POSTGRES_PARAMETERS]?: string;
}
