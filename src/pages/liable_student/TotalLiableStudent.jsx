import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Ant Design
import { useTheme } from '@mui/material/styles';
import { Avatar, Typography, Grid, Box } from '@mui/material';
import { UserOutlined } from '@ant-design/icons';

import { getCountLiable } from '../Query'

// project imports
import MainCard from 'components/MainCard';
// import SkeletonTotalCards from 'ui-component/cards/Skeleton/TotalCards';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const TotalLiableStudent = ({ isLoading }) => {
    const theme = useTheme();
    const [coountLiable, setCountLiable] = useState(0);

    // Fetch pending counts on component mount
    useEffect(() => {
        getCountLiable(
            (data) => setCountLiable(data.totalCount), // Success callback
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
                        bgcolor: 'primary.light',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: 3,
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, // Updated gradient to use primary color
                            borderRadius: '50%',
                            top: { xs: -105, sm: -85 },
                            right: { xs: -140, sm: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`, // Updated gradient to use primary color
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
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 700, mr: 1, mt: 1.75, mb: 0.75 }}>{coountLiable}</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                bgcolor: 'primary.main',
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
                                    Liable Students
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

TotalLiableStudent.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalLiableStudent;
