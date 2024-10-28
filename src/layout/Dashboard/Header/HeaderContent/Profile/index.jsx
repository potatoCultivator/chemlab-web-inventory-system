import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileTab from './ProfileTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import avatar1 from 'assets/images/users/avatar-1.png';
import { fetchUserProfile } from 'pages/TE_Backend';

export default function Profile() {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ firstname: '', lastname: '' });

  useEffect(() => {
    const storedData = localStorage.getItem('userData');

    if (storedData) {
      setData(JSON.parse(storedData)); // Set data from local storage
    } else {
      const fetchData = async () => {
        try {
          const userData = await fetchUserProfile();
          const { firstname, lastname } = userData;

          if (firstname && lastname) {
            setData({ firstname, lastname });
            localStorage.setItem('userData', JSON.stringify({ firstname, lastname })); // Save to local storage
          } else {
            console.error('Profile data is incomplete.');
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };
      fetchData(); // Fetch data if not found in local storage
    }
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? 'grey.100' : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar alt="profile user" src={avatar1} size="sm" />
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {data.firstname ? `${data.firstname} ${data.lastname}` : 'Fullname'}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                          <Stack>
                            <Typography variant="h6">{data.firstname ? `${data.firstname} ${data.lastname}` : 'Fullname'}</Typography>
                            <Typography variant="body2" color="text.secondary"></Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <ProfileTab />
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
