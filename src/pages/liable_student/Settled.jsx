import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Ant Design
import { useTheme } from '@mui/material/styles';
import { Avatar, Typography, Grid, Box } from '@mui/material';
import { UserOutlined } from '@ant-design/icons';

import { getCountSettled } from '../Query'

// project imports
import MainCard from 'components/MainCard';
// import SkeletonTotalCards from 'ui-component/cards/Skeleton/TotalCards';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const Settled = ({ isLoading }) => {
    const theme = useTheme();
    const [countSettled, setCountSettled] = useState(0);

    // Fetch pending counts on component mount
    useEffect(() => {
        getCountSettled(
            (data) => setCountSettled(data.totalPending), // Success callback
            (error) => console.error('Error fetching pending counts: ', error) // Error callback
        );
    }, []);

    return (
        <>
            {isLoading ? (
                // <SkeletonTotalCards />
                <> </> 
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: 'success.light',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 3,
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                            borderRadius: '50%',
                            top: { xs: -105, sm: -85 },
                            right: { xs: -140, sm: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
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
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 700, mr: 1, mt: 1.75, mb: 0.75 }}>{countSettled}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                bgcolor: 'success.main',
                                                mt: 1
                                            }}
                                        >
                                            <UserOutlined style={{ fontSize: '1.5rem', color: '#fff' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: 'secondary.200'
                                    }}
                                >
                                    Settled
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

Settled.propTypes = {
    isLoading: PropTypes.bool
};

export default Settled;
