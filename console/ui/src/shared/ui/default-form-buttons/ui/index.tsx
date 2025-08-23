import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';
import { DefaultFormButtonsProps } from '@shared/ui/default-form-buttons/model/types.ts';

const StyledDefaultFormButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledStandardButtons = styled.div`
  display: grid;
  grid-template: 1fr / repeat(2, auto);
  grid-column-gap: 16px;
  width: fit-content;
`;

const DefaultFormButtons: FC<DefaultFormButtonsProps> = ({
  isDisabled = false,
  isSubmitting = false,
  cancelHandler,
  submitButtonLabel,
  cancelButtonLabel,
  children,
}) => {
  const { t } = useTranslation('shared');

  return (
    <StyledDefaultFormButtons>
      <StyledStandardButtons>
        <Button
          variant="contained"
          disabled={isDisabled}
          loading={isSubmitting}
          loadingIndicator={<CircularProgress size={24} />}
          type="submit">
          <span>{submitButtonLabel ?? t('save')}</span>
        </Button>
        <Button variant="outlined" onClick={cancelHandler} type="button">
          <span>{cancelButtonLabel ?? t('cancel')}</span>
        </Button>
      </StyledStandardButtons>
      {children}
    </StyledDefaultFormButtons>
  );
};

export default DefaultFormButtons;
