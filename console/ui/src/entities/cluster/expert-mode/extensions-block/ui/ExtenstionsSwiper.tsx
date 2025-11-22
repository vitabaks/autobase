import { FC, useState } from 'react';
import Spinner from '@shared/ui/spinner';
import { IconButton, Stack, Typography, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Pagination } from 'swiper/modules';
import ExtensionBox from '@entities/cluster/expert-mode/extensions-block/ui/ExtensionBox.tsx';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SwiperTypes from 'swiper';
import { useTranslation } from 'react-i18next';
import { ExtensionsSwiperProps } from '@entities/cluster/expert-mode/extensions-block/model/types.ts';
import ErrorBox from '@shared/ui/error-box/ui';
import { ErrorBoundary } from 'react-error-boundary';

const ExtensionsSwiper: FC<ExtensionsSwiperProps> = ({ isPending = false, filteredExtensions, extensionIcons }) => {
  const { t } = useTranslation('clusters');
  const [swiperRef, setSwiperRef] = useState<SwiperTypes | null>(null);
  const theme = useTheme();

  const handleSwipeNext = () => swiperRef?.slideNext();
  const handleSwipePrev = () => swiperRef?.slidePrev();

  return (
    <ErrorBoundary fallback={<ErrorBox text={t('somethingWentWrongWhileRenderingExtensionsSwiper')} />}>
      <Stack direction="row" width="100%" gap={1} minHeight="340px" alignItems="center" justifyContent="center">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {filteredExtensions.length ? (
              <>
                <IconButton onClick={handleSwipePrev}>
                  <ChevronLeftIcon />
                </IconButton>
                <Swiper
                  style={{
                    // @ts-expect-error ts cannot see this field in Swiper styles
                    '--swiper-pagination-color': theme.palette.primary.main,
                    '--swiper-pagination-bullet-inactive-color': theme.palette.primary.main,
                  }}
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
                    <SwiperSlide key={`${extension?.name} + ${extension?.description}`}>
                      <ExtensionBox extension={extension} extensionIcons={extensionIcons} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <IconButton onClick={handleSwipeNext}>
                  <ChevronRightIcon />
                </IconButton>
              </>
            ) : (
              <Typography fontWeight="bold">{t('noExtensionsFound')}</Typography>
            )}
          </>
        )}
      </Stack>
    </ErrorBoundary>
  );
};

export default ExtensionsSwiper;
