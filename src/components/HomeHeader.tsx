import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function HomeHeader({contact}: {contact: string}) {

    const [copied, setCopied] = React.useState(false);
  
  
    return (
      <Stack>
        <Snackbar
              open={copied}
              onClose={() => setCopied(false)}
              autoHideDuration={2000}
              message="Copied to clipboard"
            />
        <Typography variant="h3" component="h1" align='center'>
            Braian Pita
        </Typography>
        <Typography variant="caption" align='center' marginBottom={3}>
          {contact}
          <IconButton onClick={() => {
            navigator.clipboard.writeText(contact);
            setCopied(true);
          }} >
            <ContentCopyIcon sx={{ width: '15px', height: '15px'}} />
          </IconButton>
        </Typography>
      </Stack>
    );
  }