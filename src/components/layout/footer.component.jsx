import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography align="center" variant="h6" gutterBottom>
        F.R.I.E.N.D.S.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Typography align="center" variant="h6">
            App
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
