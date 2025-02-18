import { SyntheticEvent, useCallback, useState } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@mui/material';
import { AppButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';


const VALIDATE_FORM_RECOVERY_PASSWORD = {
  email: {
    presence: true,
    email: true,
  },
};

interface FormStateValues {
  email: string;
}

interface Props {
  email?: string;
}


const RecoveryPasswordView = ({ email = '' }: Props) => {
  const { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid } = useAppForm({
    validationSchema: VALIDATE_FORM_RECOVERY_PASSWORD,
    initialValues: { email } as FormStateValues,
  });
  const [message, setMessage] = useState<string>();
  const values = formState.values as FormStateValues; 

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    setMessage('Email with instructions has been sent to your address');
  };

  const handleCloseError = useCallback(() => setMessage(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Recover Password" />
        <CardContent>
          <TextField
            required
            label="Email"
            name="email"
            value={values.email}
            error={fieldHasError('email')}
            helperText={fieldGetError('email') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />

          {message ? (
            <AppAlert severity="success" onClose={handleCloseError}>
              {message}
            </AppAlert>
          ) : null}

          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!isFormValid()}>
              Send Password Recovery Email
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default RecoveryPasswordView;
