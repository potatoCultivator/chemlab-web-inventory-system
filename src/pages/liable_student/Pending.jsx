import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Typography, Grid, Box } from '@mui/material';
import { UserOutlined } from '@ant-design/icons';

// Import the function
import { getCountPending } from '../Query';

// project imports
import MainCard from 'components/MainCard';

const Pending = ({ isLoading }) => {
    const theme = useTheme();
    const [countPending, setCountPending] = useState(0);

    // Fetch pending counts on component mount
    useEffect(() => {
        getCountPending(
            (data) => setCountPending(data.totalPending), // Success callback
            (error) => console.error('Error fetching pending counts: ', error) // Error callback
        );
    }, []);

    return (
        <>
            {isLoading ? (
                <>Loading...</>
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: 'warning.light',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 3,
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                            borderRadius: '50%',
                            top: { xs: -105, sm: -85 },
                            right: { xs: -140, sm: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(45deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
                            borderRadius: '50%',
                            top: { xs: -155, sm: -125 },
                            right: { xs: -70, sm: -15 },
                            opacity: 0.5
                        }
                    }}
                >
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 700, mr: 1, mt: 1.75, mb: 0.75 }}>{countPending}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                bgcolor: 'warning.main',
                                                mt: 1
                                            }}
                                        >
                                            <UserOutlined style={{ fontSize: '1.5rem', color: '#fff' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: 'secondary.200' }}>
                                    Pending
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

export default Pending;
