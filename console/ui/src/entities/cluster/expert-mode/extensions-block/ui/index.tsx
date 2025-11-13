import { ChangeEvent, FC, useEffect, useRef, useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Checkbox, FormControlLabel, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { ResponseDatabaseExtension, useGetDatabaseExtensionsQuery } from '@shared/api/api/other.ts';
import Spinner from '@shared/ui/spinner';
import { useWatch } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import SearchIcon from '@mui/icons-material/Search';
import { ErrorBoundary } from 'react-error-boundary';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/cluster/expert-mode/extensions-block/model/const.ts';
import { filterValues } from '@entities/cluster/expert-mode/extensions-block/lib/functions.ts';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import './styles.css';
import ErrorBox from '@shared/ui/error-box/ui';
import ExtensionsSwiper from '@entities/cluster/expert-mode/extensions-block/ui/ExtenstionsSwiper.tsx';

const ExtensionsBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const [searchValue, setSearchValue] = useState('');
  const [isShowOnlyEnabled, setIsShowOnlyEnabled] = useState(false);
  const [filteredExtensions, setFilteredExtensions] = useState<ResponseDatabaseExtension[]>([]);
  const [pending, startTransition] = useTransition();

  const watchPostgresVersion = useWatch({ name: CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION });
  const watchEnabledExtensions = useWatch({ name: EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS });

  const extensionIcons = useRef<Record<string, string>>({});

  useEffect(() => {
    extensionIcons.current = Object.entries(
      import.meta.glob('../assets/*.{png,jpg,jpeg,svg,PNG,JPEG,SVG}', {
        eager: true,
        query: '?url',
        import: 'default',
      }),
    ).reduce((acc, [key, value]) => {
      const iconName = key.match(/(\w*.\w*)$/gi);
      return iconName?.[0] ? { ...acc, [iconName[0]]: value } : acc;
    }, {});
  }, []);

  const extensions = useGetDatabaseExtensionsQuery({
    postgresVersion: watchPostgresVersion,
    extensionType: 'all',
    limit: 999_999_999,
  });

  useEffect(() => {
    startTransition(() => {
      const filteredExtensions = filterValues(
        searchValue,
        isShowOnlyEnabled
          ? (extensions.data?.data?.filter((extension) => watchEnabledExtensions?.[extension?.name]?.length) ?? []) // filter to pass only enabled extensions
          : (extensions.data?.data ?? []),
      );
      if (extensions.data?.data) {
        setFilteredExtensions(filteredExtensions);
      }
    });
  }, [searchValue, isShowOnlyEnabled, extensions.data]);

  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  return extensions.isLoading ? (
    <Spinner />
  ) : (
    <ErrorBoundary fallback={<ErrorBox />}>
      <Box width="60vw">
        <Stack direction="column" gap={2} width="100%">
          <Typography fontWeight="bold" marginBottom="8px">
            {t('extensions')}
          </Typography>
          <Stack direction="row" justifyContent="space-between">
            <TextField
              size="small"
              sx={{
                width: '300px',
              }}
              value={searchValue}
              onChange={handleSearchValueChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControlLabel
              checked={isShowOnlyEnabled}
              onChange={(e) => setIsShowOnlyEnabled(e.target.checked)}
              control={<Checkbox />}
              label={<Typography marginRight={1}>{t('showEnabled')}</Typography>}
            />
          </Stack>
          <ExtensionsSwiper
            isPending={pending}
            filteredExtensions={filteredExtensions}
            extensionIcons={extensionIcons.current}
          />
        </Stack>
      </Box>
    </ErrorBoundary>
  );
};

export default ExtensionsBlock;
