import { useEffect, useState, useRef } from 'react';
import React from 'react';
import emailjs from 'emailjs-com';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Snackbar, Alert } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { uploadInstructor } from '../TE_Backend'; // Adjust the import path based on your project structure

function generatePassword(length = 8) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "@#$&";
  const allChars = lowercase + uppercase + digits + special;

  let password = "";
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += digits.charAt(Math.floor(Math.random() * digits.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  for (let i = 4; i < length; ++i) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password to ensure randomness
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  return password;
}

export default function InstructorRegistration() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_rs71h8n', 'template_mvq7bdh', form.current, 'HnRtI-nQOt92ux3oK')
      .then((result) => {
          console.log('Email sent successfully:', result.text);
      }, (error) => {
          console.error('Error sending email:', error.text);
      });
  };

  return (
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          position: '',
          subject:'',
          department: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          position: Yup.string().max(255).required('Position is required'),
          department: Yup.string().max(255).required('Department is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          try {
            const instructorData = {
              name: values.firstname + ' ' + values.lastname,
              email: values.email,
              position: values.position,
              department: values.department,
              password: values.password
            };
            await uploadInstructor(instructorData);
            console.log('Instructor successfully uploaded');
            setSnackbarMessage('Instructor successfully uploaded!');
            setSnackbarOpen(true);
            resetForm();
            sendEmail(); // Send email after successful upload
          } catch (error) {
            console.error('Error uploading instructor:', error);
            setSnackbarMessage('Error uploading instructor. Please try again.');
            setSnackbarOpen(true);
            setErrors({ submit: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
          <form ref={form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>

              {/* Firstname */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                  <OutlinedInput
                    id="firstname-login"
                    type="firstname"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Juan"
                    fullWidth
                    error={Boolean(touched.firstname && errors.firstname)}
                  />
                </Stack>
                {touched.firstname && errors.firstname && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.firstname}
                  </FormHelperText>
                )}
              </Grid>

              {/* Lastname */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastname && errors.lastname)}
                    id="lastname-signup"
                    type="lastname"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Dela Cruz"
                    inputProps={{}}
                  />
                </Stack>
                {touched.lastname && errors.lastname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.lastname}
                  </FormHelperText>
                )}
              </Grid>
              
              {/* Position */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="position-signup">Position*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.position && errors.position)}
                    id="position-signup"
                    type="position"
                    value={values.position}
                    name="position"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Associate Professor"
                    inputProps={{}}
                  />
                </Stack>
                {touched.position && errors.position && (
                  <FormHelperText error id="helper-text-position-signup">
                    {errors.position}
                  </FormHelperText>
                )}
              </Grid>
              
              {/* Department */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="department-signup">Department*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.department && errors.department)}
                    id="department-signup"
                    type="department"
                    value={values.department}
                    name="department"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Information Technology"
                    inputProps={{}}
                  />
                </Stack>
                {touched.department && errors.department && (
                  <FormHelperText error id="helper-text-department-signup">
                    {errors.department}
                  </FormHelperText>
                )}
              </Grid>
              
              {/* Email Address */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="bogart@yehey.com"
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>

              {/* Password */}
              <Grid item xs={7} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type="password"
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                    inputProps={{}}
                    disabled 
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={5} md={6}>
                <Stack spacing={1}>
                <InputLabel htmlFor="password-signup">Generate Password</InputLabel>
                <Button
                  variant="outlined"
                  onClick={() => setFieldValue('password', generatePassword())}
                  sx={{ mt: 2 }}
                >
                  Generate
                </Button>
                </Stack>
              </Grid>
              
              {/* Create Account Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}