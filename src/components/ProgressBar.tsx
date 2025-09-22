import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function ProgressBar({currentProgress}: {currentProgress: number}) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="determinate" value={currentProgress} />
    </Box>
  );
}