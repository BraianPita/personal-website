import React from 'react';

import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import LinkTree from './LinkTree';
import HomeHeader from './components/HomeHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

// Icons
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';


export default function HomePage({theme, colorMode}: {theme: any, colorMode: any}) {


    return (
        <Container maxWidth="sm">
            <Stack sx={{
            alignItems: "center",
            justifyContent: 'center',
            minHeight: '100vh'
            }}>
                <ThemeToggleButton theme={theme} toggleColor={colorMode.toggleColorMode} />
                <HomeHeader contact='contact.braianpita@gmail.com' />
                <LinkTree />
            </Stack>
            {/* <Box sx={{
                display:'flex',
                position: 'fixed',
                height: '100px',
                width: '120vw',
                bottom:0,
                left:'-10vw',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0,
                transition: 'opacity 200ms',
                '&:hover': {
                    boxShadow: 'inset 0 -50px 25px -7px rgba(128,128,128,0.5)',
                    opacity: 1
                }
            }}>
                <ExpandMoreIcon sx={{fontSize: '50px'}} />
            </Box> */}
            <Copyright />
        </Container>
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