import PropTypes from 'prop-types';

// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function ToolAnalytics({ color = 'primary', title, count, percentage, isLoss, extra }) {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center"
        spacing={2}>
          <Grid item>
            <Typography variant="h2" color="inherit">
              {count}
            </Typography>
          </Grid>
          {percentage && (
            <Grid item>
              <Stack direction="column" spacing={1}>
                <Chip
                  variant="combined"
                  color={color}
                  // icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${percentage}`}
                  // sx={{ ml: -1.25 }}
                  size="small"
                />
                <Chip
                  variant="combined"
                  color={color}
                  // icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${percentage}`}
                  sx={{ ml: 1.25, pl: 1 }}
                  size="small"
                />
              </Stack>
            </Grid>
          )}
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          borrowers this month of{' '}
          <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
            {currentMonth}
          </Typography>
        </Typography>
      </Box>
    </MainCard>
  );
}

ToolAnalytics.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string
};
