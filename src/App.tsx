import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import LinkTree from './LinkTree';
import Link from '@mui/material/Link';
import CssBaseline from '@mui/material/CssBaseline';
import myTheme from './theme';


function Copyright() {
    return (
      <Paper sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        paddingY: '5px'
      }} variant="outlined">
        <Typography variant="body2" color="text.secondary" mt="auto" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://braianpita.info/">
            braianpita.info
          </Link>{' '}
          {new Date().getFullYear()}.
        </Typography>
      </Paper>
    );
  }
  


const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function MyApp() {

    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

  return (
    <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Container maxWidth="sm">
            <Stack sx={{
            alignItems: "center",
            justifyContent: 'center',
            minHeight: '100vh'
            }}>
                <ThemeToggleButton theme={theme} toggleColor={colorMode.toggleColorMode} />
                <Typography variant="h3" component="h1" align='center' marginBottom={3}>
                    Braian Pita
                </Typography>
                <LinkTree />
            </Stack>
            <Copyright />
        </Container>
    </ThemeProvider>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      myTheme(mode),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyApp />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const ThemeToggleButton = ({theme, toggleColor}: {theme: any, toggleColor: any}) => {

    return (
      <Button
      sx={{
        color: "text.primary"
      }}
      onClick={toggleColor}>
        {theme.palette.mode === 'dark' ? <Brightness4Icon sx={{ mr: 1 }} /> : <Brightness7Icon sx={{ mr: 1 }} />}
        {theme.palette.mode} mode
      </Button>
    );
};