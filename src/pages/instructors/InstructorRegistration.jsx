import { useState, useRef } from 'react';
import React from 'react';
// import emailjs from 'emailjs-com';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

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
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const form = useRef();

  // const sendEmail = async () => {
  //   try {
  //     await emailjs.sendForm('service_rs71h8n', 'template_mvq7bdh', form.current, 'HnRtI-nQOt92ux3oK');
  //     console.log('Email sent successfully');
  //   } catch (error) {
  //     console.error('Error sending email:', error.text);
  //     setSnackbarMessage('Instructor uploaded, but email not sent.');
  //     setSnackbarOpen(true);
  //   }
  // };

  return (
    <>
      <Formik
        initialValues={{
          firstname: '',
          lastname: '',
          email: '',
          subject: '',
          position: '',
          department: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string().max(255).required('First Name is required'),
          lastname: Yup.string().max(255).required('Last Name is required'),
          subject: Yup.string().max(255).required('Subject is required'),
          position: Yup.string().max(255).required('Position is required'),
          department: Yup.string().max(255).required('Department is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          try {
            const instructorData = {
              name: values.firstname + ' ' + values.lastname,
              email: values.email,
              subject: values.subject,
              position: values.position,
              department: values.department,
              password: generatePassword()
            };
            await uploadInstructor(instructorData);
            console.log('Instructor successfully uploaded');
            setSnackbarMessage('Instructor successfully uploaded!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            resetForm();
            // sendEmail(); // Send email after successful upload
          } catch (error) {
            console.error('Error uploading instructor:', error);
            setSnackbarMessage('Error uploading instructor. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setErrors({ submit: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form ref={form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Firstname */}
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                  <OutlinedInput
                    id="firstname-login"
                    type="text"
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
                    type="text"
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
              
              {/* Subject */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="subject-signup">Subject*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.subject && errors.subject)}
                    id="subject-signup"
                    type="text"
                    value={values.subject}
                    name="subject"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Chemistry"
                    inputProps={{}}
                  />
                </Stack>
                {touched.subject && errors.subject && (
                  <FormHelperText error id="helper-text-subject-signup">
                    {errors.subject}
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
                    type="text"
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
                    type="text"
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
              
              {/* Create Account Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {isSubmitting ? <CircularProgress size={24} /> : 'Create Account'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}