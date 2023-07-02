import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/layout';

export const Popup: React.FC = () => {
  return (
    <Layout>
      <Box height="400px" width="200px">
        <Typography variant="h4">Popup</Typography>
      </Box>
    </Layout>
  );
};

console.log('Create root');

createRoot(document.getElementById('root')!).render(<Popup />);
