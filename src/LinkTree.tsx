import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link'

import IconButton from '@mui/material/IconButton';
// Icons
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import ResumeIcon from '@mui/icons-material/AssignmentInd';
import ShareIcon from '@mui/icons-material/Share';

const Buttons = [
  {
    Icon: LinkedInIcon,
    text: "LinkedIn",
    color: "blue",
    link: "https://www.linkedin.com/in/braian-pita/"
  },
  {
    Icon: ResumeIcon,
    text: "Resume",
    color: "red",
    link: "/Braian_Pita_Resume.pdf"
  },
  {
    Icon: GitHubIcon,
    text: "Github",
    color: "text.primary",
    link: "https://github.com/BraianPita"
  }
]

export default function LinkTree() {
  return (
    <Stack direction="column" spacing={2} alignItems="center">

      {
        Buttons.map((btn, idx) => (
          <Button key={idx} sx={{
            minWidth: "150px",
            color: btn.color,
            borderColor: btn.color
          }}
          component={Link} 
          variant='outlined'
          href={btn.link}
          rel="noopener"
          target="_blank">
            <btn.Icon />
            {btn.text}
          </Button>
        ))
      }


      <IconButton sx={{
        border: 2
      }}
      onClick={shareAction}>
        <ShareIcon />
      </IconButton>


      {/* <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
        See more <Link href="https://mui.com/getting-started/templates/">about MUI</Link>.
      </Typography> */}
    </Stack>
  );
}

const shareAction = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Braian Pita',
      text: 'Share my website with others quick and easy!',
      url: 'https://braianpita.info',
    });
  }
  else {
    alert("Share is not supported on this browser.");
  }
}
