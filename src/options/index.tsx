import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '../components/layout';
import Logo from '../static/logo/logo.svg';
import { SETTINGS_STORAGE_KEY } from '../utils/constants';
import { Settings } from '../utils/interfaces';

const defaultSettings = { autoFill: true, saveAnswers: true };

export const Options: React.FC = () => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const { settings } = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
      setSettings(settings);
      setLoading(false);
    })();
  }, []);

  const handleSaveSettingsClick = React.useCallback(async () => {
    setLoading(true);
    await chrome.storage.sync.set({ settings });
    setLoading(false);
  }, [settings]);

  const handleResetSettingsClick = React.useCallback(async () => {
    setSettings(defaultSettings);
  }, []);

  const handleAutoFillChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, autoFill: event.target.checked }));
  }, []);

  const handleSaveAnswersChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prev) => ({ ...prev, saveAnswers: event.target.checked }));
    },
    [],
  );

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
            <Grid container my={2} spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3">Settings Menu</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">General</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={settings?.autoFill} onChange={handleAutoFillChange} />
                    }
                    label={
                      <Tooltip title="Auto-completes the answer.">
                        <Typography variant="body1">Auto Fill</Typography>
                      </Tooltip>
                    }
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch checked={settings?.saveAnswers} onChange={handleSaveAnswersChange} />
                    }
                    label={
                      <Tooltip title="Remembers your correct answers so they can be auto-completed.">
                        <Typography variant="body1">Save Answers</Typography>
                      </Tooltip>
                    }
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <LoadingButton
                  variant="contained"
                  fullWidth
                  onClick={handleSaveSettingsClick}
                  loading={loading}
                >
                  Save Settings
                </LoadingButton>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  variant="outlined"
                  color="error"
                  fullWidth
                  loading={loading}
                  onClick={handleResetSettingsClick}
                >
                  Reset defaults
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

createRoot(document.getElementById('root')!).render(<Options />);
