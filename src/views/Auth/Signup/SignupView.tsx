import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import { useAppStore } from '../../../store';
import { AppButton, AppIconButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import { supabase } from '../../../api/supabaseClient';

const VALIDATE_FORM_SIGNUP = {
  email: {
    email: true,
    presence: true,
  },
  // phone: {
  //   type: 'string',
  //   format: {
  //     pattern: '^$|[- .+()0-9]+',
  //     message: 'should contain numbers',
  //   },
  // },
  firstName: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$',
      message: 'should contain only alphabets',
    },
  },
  lastName: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$',
      message: 'should contain only alphabets',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 8,
      maximum: 32,
      message: 'must be between 8 and 32 characters',
    },
  },
};

const VALIDATE_EXTENSION = {
  confirmPassword: {
    equality: 'password',
  },
};

interface FormStateValues {
  firstName: string;
  lastName: string;
  email: string;
  // phone: string;
  password: string;
  confirmPassword?: string;
}

const SignupView = () => {
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM_SIGNUP,
    ...VALIDATE_EXTENSION,
  });
  const { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid } = useAppForm({
    validationSchema: validationSchema,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      // phone: '',
      password: '',
      confirmPassword: '',
    } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues;

  useEffect(() => {
    let componentMounted = true;
    async function fetchData() {
      // If you have any async tasks to run on mount, do them here.
      if (!componentMounted) return;
      setLoading(false);
    }
    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    let newSchema;
    if (showPassword) {
      newSchema = VALIDATE_FORM_SIGNUP;
    } else {
      newSchema = { ...VALIDATE_FORM_SIGNUP, ...VALIDATE_EXTENSION };
    }
    setValidationSchema(newSchema);
  }, [showPassword]);

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  // Updated handleFormSubmit using Supabase auth
  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      const { error: signupError, data} = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          }
        } 
      });
      
      if (signupError) {
        setError(signupError.message);
        return;
      }
      
      dispatch({ type: 'SIGN_UP' });
      navigate('/', { replace: true });
    },
    [dispatch, navigate, values.email, values.password]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Sign Up" />
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
          <TextField
            required
            label="First Name"
            name="firstName"
            value={values.firstName}
            error={fieldHasError('firstName')}
            helperText={fieldGetError('firstName') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Last Name"
            name="lastName"
            value={values.lastName}
            error={fieldHasError('lastName')}
            helperText={fieldGetError('lastName') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type={showPassword ? 'text' : 'password'}
            label="Password"
            name="password"
            value={values.password}
            error={fieldHasError('password')}
            helperText={fieldGetError('password') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AppIconButton
                    aria-label="toggle password visibility"
                    icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                    onClick={handleShowPasswordClick}
                    onMouseDown={eventPreventDefault}
                  />
                </InputAdornment>
              ),
            }}
          />
          {!showPassword && (
            <TextField
              required
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={values.confirmPassword}
              error={fieldHasError('confirmPassword')}
              helperText={fieldGetError('confirmPassword') || ' '}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
          )}
          <FormControlLabel
            control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
            label="You must agree with Terms of Use and Privacy Policy to use our service"
          />
          {error && (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          )}
          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!(isFormValid() && agree)}>
              Confirm and Sign Up
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default SignupView;
