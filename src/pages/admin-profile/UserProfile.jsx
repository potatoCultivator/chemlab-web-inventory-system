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

// Sample user data for a chemistry lab admin or staff member
const userData = {
  name: 'Dr. John Smith',
  bio: 'Experienced lab administrator specializing in analytical chemistry and laboratory management.',
  email: 'johnsmith@chemistrylab.com',
  phone: '+1 (555) 123-4567',
  address: 'Chemistry Lab, Science Building, 123 University St, City, Country',
  avatarUrl: 'https://via.placeholder.com/150', // replace with user's avatar URL
  skills: ['Analytical Chemistry', 'Lab Management', 'Spectroscopy', 'Chromatography', 'Data Analysis'],
  certifications: ['OSHA Certified', 'Certified Laboratory Manager', 'Good Laboratory Practice (GLP)'],
  projects: [
    { title: 'Water Quality Analysis', description: 'Analysis of local water sources for contaminants.', link: '#' },
    { title: 'Chemical Inventory System', description: 'Developed an inventory system for lab chemicals and equipment.', link: '#' },
    { title: 'Pharmaceutical Compound Testing', description: 'Tested and documented new pharmaceutical compounds.', link: '#' },
  ],
  publications: [
    { title: 'Analytical Techniques in Water Quality Testing', journal: 'Chemistry Journal', year: '2023', link: '#' },
    { title: 'Advancements in Chromatographic Separation', journal: 'International Journal of Analytical Chemistry', year: '2022', link: '#' },
  ],
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
          action={
            <IconButton aria-label="edit profile">
              <EditOutlinedIcon />
            </IconButton>
          }
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

        <Divider sx={{ my: 2 }} />

        {/* Projects Section */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Projects
          </Typography>
          {userData.projects.map((project, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6">{project.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {project.description}
              </Typography>
            </Box>
          ))}
        </CardContent>

        <Divider sx={{ my: 2 }} />

        {/* Publications Section */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Publications
          </Typography>
          {userData.publications.map((publication, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="h6">{publication.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                {publication.journal}, {publication.year}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;