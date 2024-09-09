// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

//project import
import atomLogo from '../icons/atom.png';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(10px)',
        zIndex: -1,
        bottom: 50, // Adjust the bottom position
        left: '50%', // Center horizontally
        transform: 'translateX(-220%)', // Center horizontally
      }}
    >
      <img src={atomLogo} alt="Atom Logo" width="120%" height="calc(100vh - 175px)" />
    </Box>
  );
}