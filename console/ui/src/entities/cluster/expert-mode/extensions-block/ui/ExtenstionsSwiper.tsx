import { FC, useRef, useState } from 'react';
import Spinner from '@shared/ui/spinner';
import { IconButton, Stack, Typography } from '@mui/material';
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

const ExtensionsSwiper: FC<ExtensionsSwiperProps> = ({ isPending = false, filteredExtensions }) => {
  const { t } = useTranslation('clusters');
  const [swiperRef, setSwiperRef] = useState<SwiperTypes | null>(null);

  const extensionIcons = useRef(
    Object.entries(
      import.meta.glob('../assets/*.{png,jpg,jpeg,svg,PNG,JPEG,SVG}', {
        eager: true,
        as: 'url',
      }),
    ).reduce((acc, [key, value]) => {
      const iconName = key.match(/(\w*.\w*)$/gi);
      return iconName?.[0] ? { ...acc, [iconName[0]]: value } : acc;
    }, {}),
  );

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
                      <ExtensionBox extension={extension} extensionIcons={extensionIcons.current} />
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
