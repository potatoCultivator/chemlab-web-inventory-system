import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import EditOutlinedIcon from '@ant-design/icons';

// Sample user data (this can come from props, API, or state)
const initialUserData = {
  name: 'Dr. John Smith',
  bio: 'Experienced lab administrator specializing in analytical chemistry and laboratory management.',
  email: 'johnsmith@chemistrylab.com',
  phone: '+1 (555) 123-4567',
  address: 'Chemistry Lab, Science Building, 123 University St, City, Country',
  avatarUrl: 'https://via.placeholder.com/150',
  skills: ['Analytical Chemistry', 'Lab Management', 'Spectroscopy', 'Chromatography', 'Data Analysis'],
};

const EditProfile = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [newSkill, setNewSkill] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setUserData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({ ...prevData, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add logic to save changes to backend or state management
    console.log('Updated profile data:', userData);
    // You can also handle password change logic here if necessary
    if (newPassword && newPassword === confirmPassword) {
      console.log('Password changed successfully');
      // Add logic to update password in your backend here
    } else if (newPassword !== confirmPassword) {
      console.error('New passwords do not match');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5', padding: 4 }}>
      <Card sx={{ maxWidth: 800, width: '100%', padding: 3 }}>
        <CardHeader
          avatar={<Avatar src={userData.avatarUrl} sx={{ width: 80, height: 80 }} />}
          action={<IconButton><EditOutlinedIcon /></IconButton>}
          title={<Typography variant="h4">Edit Profile</Typography>}
          subheader="Update your profile details and skills"
        />
        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleFormSubmit}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={3}
                  value={userData.bio}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Profile Picture Upload Section */}
            <Typography variant="h5" gutterBottom>Profile Picture</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={userData.avatarUrl} sx={{ width: 80, height: 80 }} />
              <Button variant="contained" component="label">
                Upload Picture
                <input type="file" hidden accept="image/*" onChange={handleProfilePicChange} />
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Skills Section */}
            <Typography variant="h5" gutterBottom>Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {userData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                  onDelete={() => handleRemoveSkill(skill)}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                fullWidth
                label="Add Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                variant="outlined"
              />
              <Button variant="contained" color="primary" onClick={handleAddSkill}>Add</Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Password Change Section */}
            <Typography variant="h5" gutterBottom>Change Password</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save Changes
            </Button>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};

export default EditProfile;
