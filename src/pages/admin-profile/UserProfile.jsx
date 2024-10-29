import React from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Divider,
  Box,
  Chip,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditOutlinedIcon from '@ant-design/icons/EditOutlined';

// User data for high school chemistry lab staff
const userData = {
  name: 'Ms. Sarah Lee',
  bio: 'Experienced chemistry lab technician focused on lab safety, equipment maintenance, and supporting student experiments.',
  email: 'sarah.lee@highschool.edu',
  phone: '+1 (555) 987-6543',
  address: 'Science Lab, Building A, High School Name, City, Country',
  avatarUrl: 'https://via.placeholder.com/150', // replace with user's avatar URL
  skills: ['Lab Safety', 'Equipment Maintenance', 'Chemical Preparation', 'Basic Analysis'],
  certifications: ['Certified Lab Technician', 'Basic First Aid', 'Lab Safety Training'],
};

const UserProfile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 2,
        ...(isMobile && {
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          padding: 0,
        }),
      }}
    >
      <Card sx={{ maxWidth: 900, width: '100%', padding: isMobile ? 0 : 3 }}>
        <CardHeader
          avatar={<Avatar src={userData.avatarUrl} sx={{ width: isMobile ? 60 : 80, height: isMobile ? 60 : 80 }} />}
          title={<Typography variant={isMobile ? 'h5' : 'h4'}>{userData.name}</Typography>}
          subheader={<Typography color="textSecondary">{userData.bio}</Typography>}
        />
        <Divider sx={{ my: 2 }} />

        {/* Contact Info */}
        <CardContent>
          <Typography variant="body1" color="textSecondary">
            <strong>Email:</strong> {userData.email}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Phone:</strong> {userData.phone}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            <strong>Address:</strong> {userData.address}
          </Typography>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        {/* Skills Section */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Skills
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {userData.skills.map((skill, index) => (
              <Chip key={index} label={skill} color="primary" variant="outlined" />
            ))}
          </Box>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        {/* Certifications Section */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Certifications
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {userData.certifications.map((certification, index) => (
              <Chip key={index} label={certification} color="secondary" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
