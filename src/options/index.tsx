import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/layout';
import Logo from '../static/logo/logo.svg';

export const Options: React.FC = () => {
  return (
    <Layout>
      <Box minHeight="100vh" component="main">
        <Container
          component={Paper}
          maxWidth="sm"
          sx={{ height: '100%', minHeight: '100vh', borderRadius: 0 }}
          elevation={24}
        >
          <Box height="100%">
            <Grid container spacing={2}>
              <Grid item xs={8} display="flex" justifyContent="flex-end" alignItems="flex-end">
                <Typography variant="h2" textAlign="right">
                  Duolingo Memo
                </Typography>
              </Grid>
              <Grid item xs={4} display="flex" justifyContent="flex-start" alignItems="flex-end">
                <img src={Logo} alt="Logo" width="100%" />
              </Grid>
            </Grid>
            <Divider />
            <Typography variant="h4">Options</Typography>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

createRoot(document.getElementById('root')!).render(<Options />);
