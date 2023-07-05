import { LoadingButton } from '@mui/lab';
import { Link } from '@mui/material';
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
  const [storageUsed, setStorageUsed] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const { settings } = await chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
      setSettings(settings);
      setLoading(false);
      setStorageUsed(await chrome.storage.local.getBytesInUse(null));
    })();

    chrome.storage.local.onChanged.addListener(async () => {
      setStorageUsed(await chrome.storage.local.getBytesInUse(null));
    });
  }, []);

  const handleSaveSettingsClick = React.useCallback(async () => {
    setLoading(true);
    await chrome.storage.sync.set({ settings });
    setLoading(false);
  }, [settings]);

  const handleResetSettingsClick = React.useCallback(async () => {
    setSettings(defaultSettings);
  }, []);

  const handleDeleteAllAnswersClick = React.useCallback(async () => {
    setLoading(true);
    const confirmed = confirm('Are you sure you want to delete all saved answers?');
    if (confirmed) {
      const allKeys = Object.keys(await chrome.storage.local.get(null));
      await chrome.storage.local.remove(allKeys);
    }
    setLoading(false);
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
            <Grid container my={2} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4">Settings Menu</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">General</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12}>
                <Typography variant="h5">Data</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  Size of answers in storage:{' '}
                  {storageUsed >= 1000000
                    ? `${(storageUsed / 1000000).toFixed(2)} MB`
                    : storageUsed >= 1000
                    ? `${(storageUsed / 1000).toFixed(2)} kB`
                    : `${storageUsed} B`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  variant="contained"
                  color="error"
                  fullWidth
                  loading={loading}
                  onClick={handleDeleteAllAnswersClick}
                >
                  Delete all saved answers
                </LoadingButton>
              </Grid>
            </Grid>
            <Divider />
            <Grid container my={2} spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                  About
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" textAlign="center">
                  <Link
                    href="https://github.com/MatiasDuhalde/duolingo-memo"
                    target="_blank"
                    underline="none"
                  >
                    Github
                  </Link>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" textAlign="center">
                  <Link
                    href="https://github.com/MatiasDuhalde/duolingo-memo/blob/master/LICENSE"
                    target="_blank"
                    underline="none"
                  >
                    License
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Divider />
            <Box my={2}>
              <Typography variant="body1" textAlign="center" fontSize={12}>
                🄯 Copyleft 2023 /{' '}
                <Link href="https://duhal.de/" target="_blank" underline="none">
                  Matías Duhalde
                </Link>
                . Very few rights reserved. Made with ❤️ in Chile.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

createRoot(document.getElementById('root')!).render(<Options />);
