import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ResponseDatabaseExtension, useGetDatabaseExtensionsQuery } from '@shared/api/api/other.ts';
import Spinner from '@shared/ui/spinner';
import { useFormContext } from 'react-hook-form';
import { CLUSTER_FORM_FIELD_NAMES } from '@widgets/cluster-form/model/constants.ts';
import ExtensionBox from '@entities/extensions-block/ui/ExtensionBox.tsx';
import SearchIcon from '@mui/icons-material/Search';
import { EXTENSION_BLOCK_FIELD_NAMES } from '@entities/extensions-block/model/const.ts';
import { filterValues } from '@entities/extensions-block/lib/functions.ts';

import SwiperTypes from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import './styles.css';

const ExtensionsBlock: FC = () => {
  const { t } = useTranslation('clusters');
  const [swiperRef, setSwiperRef] = useState<SwiperTypes | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isShowOnlyEnabled, setIsShowOnlyEnabled] = useState(false);
  const [filteredExtensions, setFilteredExtensions] = useState<ResponseDatabaseExtension[]>([]);
  const [enabledExtensions, setEnabledExtensions] = useState<ResponseDatabaseExtension[]>([]);

  const { watch, setValue } = useFormContext();

  const watchPostgresVersion = watch(CLUSTER_FORM_FIELD_NAMES.POSTGRES_VERSION);

  const extensions = useGetDatabaseExtensionsQuery({
    postgresVersion: watchPostgresVersion,
    extensionType: 'all',
    limit: 999_999_999,
  });

  useEffect(() => {
    setValue(EXTENSION_BLOCK_FIELD_NAMES.EXTENSIONS, enabledExtensions);
  }, [enabledExtensions, setValue]);

  useEffect(() => {
    if (extensions.data?.data) {
      setFilteredExtensions(
        filterValues(searchValue, isShowOnlyEnabled ? enabledExtensions : (extensions.data?.data ?? [])),
      );
    }
  }, [searchValue, isShowOnlyEnabled, extensions.data]);

  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const handleSwipeNext = () => swiperRef?.slideNext();
  const handleSwipePrev = () => swiperRef?.slidePrev();

  return extensions.isLoading ? (
    <Spinner />
  ) : (
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
      <Stack direction="row" width="100%" gap={1} alignItems="center">
        {filteredExtensions.length ? (
          <IconButton onClick={handleSwipePrev}>
            <ChevronLeftIcon />
          </IconButton>
        ) : null}
        <Swiper
          onSwiper={setSwiperRef}
          slidesPerView={3}
          grid={{
            rows: 2,
            fill: 'row',
          }}
          spaceBetween={16}
          pagination={{
            clickable: true,
          }}
          allowTouchMove={false}
          modules={[Grid, Pagination]}>
          {filteredExtensions?.map((extension) => (
            <SwiperSlide key={extension.name}>
              <ExtensionBox
                extension={extension}
                setEnabledExtensions={setEnabledExtensions}
                // name={extension.name}
                // description={extension.description}
                // isEnabled={extension.contrib}
                // imgPath={extension?.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {filteredExtensions.length ? (
          <IconButton onClick={handleSwipeNext}>
            <ChevronRightIcon />
          </IconButton>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default ExtensionsBlock;
