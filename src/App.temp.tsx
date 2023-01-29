import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import LinkTree from './LinkTree';
import Paper from '@mui/material/Paper';


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

export default function App() {
  return (
    <Container maxWidth="sm">
      <Stack sx={{
        alignItems: "center",
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Typography variant="h3" component="h1" align='center' marginBottom={3}>
          Braian Pita
        </Typography>
        <LinkTree />
        <Copyright />
      </Stack>
    </Container>
  );
}
