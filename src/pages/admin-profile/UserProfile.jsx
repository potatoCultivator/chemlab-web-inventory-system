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
} from '@mui/material';
import EditOutlinedIcon from '@ant-design/icons';

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
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 4,
      }}
    >
      <Card sx={{ maxWidth: 900, width: '100%', padding: 3 }}>
        <CardHeader
          avatar={<Avatar src={userData.avatarUrl} sx={{ width: 80, height: 80 }} />}
          action={
            <IconButton aria-label="edit profile">
              <EditOutlinedIcon />
            </IconButton>
          }
          title={<Typography variant="h4">{userData.name}</Typography>}
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {userData.certifications.map((certification, index) => (
              <Typography key={index} variant="body1" color="textSecondary">
                • {certification}
              </Typography>
            ))}
          </Box>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        {/* Projects Section */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Projects
          </Typography>
          <Grid container spacing={2}>
            {userData.projects.map((project, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card variant="outlined" sx={{ padding: 2, height: '100%' }}>
                  <Typography variant="h6">{project.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {project.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>

        <Divider sx={{ my: 2 }} />

        {/* Publications Section */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Publications
          </Typography>
          <Box>
            {userData.publications.map((publication, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body1">
                  <strong>{publication.title}</strong> ({publication.year})
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Published in {publication.journal}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                  <a href={publication.link} target="_blank" rel="noopener noreferrer">
                    View Publication
                  </a>
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;
