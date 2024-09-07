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
        filter: 'blur(18px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
      <img src={atomLogo} alt="Atom Logo" width="100%" height="calc(100vh - 175px)" />
    </Box>
  );
}
