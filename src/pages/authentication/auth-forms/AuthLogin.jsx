import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import { loginUser, fetchUserProfile } from 'src/pages/TE_Backend';

// ============================|| JWT - LOGIN ||============================ // 

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

 // Automatic login if user data is available in local storage
 useEffect(() => {
  const storedEmail = localStorage.getItem('email');
  const storedPassword = localStorage.getItem('password');
  console.log('storepassword:', storedPassword);

  // Check if both email and password are stored
  if (storedEmail && storedPassword) {
    navigate('/dashboard/default', { replace: true });
  }
}, []); // Empty dependency array to run only once on mount

const handleLogin = async (values, { setErrors, setSubmitting }) => {
  try {
    const response = await loginUser(values);
    if (response.success) {
      const { user } = response;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);

      // Fetch user profile using the UID
      const userProfile = await fetchUserProfile(user.uid);
      if (userProfile) {
        localStorage.setItem('firstName', userProfile.firstName);
        localStorage.setItem('lastName', userProfile.lastName);
      }

      // Save email and password to local storage if you want to keep user signed in
      localStorage.setItem('email', values.email);
      if (values.password) {
        localStorage.setItem('password', values.password); // Ensure password is defined
      }

      navigate('/dashboard/default', { replace: true });
    } else {
      setErrors({ submit: 'Login failed. Please check your credentials.' });
    }
  } catch (error) {
    console.error('Login Error:', error); // Log error for debugging
    if (error.message === 'auth/user-not-found') {
      setErrors({ submit: 'Account does not exist!' });
    } else if (error.message === 'Firebase: Error (auth/wrong-password).') {
      setErrors({ submit: 'Incorrect password. Please try again.' });
    } else {
      setErrors({ submit: 'Account does not exist!' });
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={handleLogin}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login" // Fixed typo here
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me signed in</Typography>}
                  />
                  {errors.submit && (
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
