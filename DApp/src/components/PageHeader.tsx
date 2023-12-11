import React from 'react';
import { Container, Grid, Typography } from '@material-ui/core';

interface PageHeaderProps {
  textLeft: string;
  textRight: string;
  removeSpaceBetweenText?: boolean;
  description: string;
  opacity?: boolean;
  color?: 'yellow' | 'purple';
}

const PageHeader: React.FC<{ props: PageHeaderProps }> = ({ props }) => {
  if (!props.color) props.color = "yellow";

  return (
    <Container maxWidth="sm">
      <Grid container spacing={4} alignItems="center" justify="center">
        <Grid item xs={12}>
          <Typography variant="h3" align="center">
            <span
              style={{
                position: 'relative',
                fontWeight: 600,
              }}
            >
              {props.textLeft}
            </span>
            {props.removeSpaceBetweenText ? '' : ' '}
            <span style={{ color: `${props.color}.500`, fontWeight: 600 }}>
              {props.textRight}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" align="center">
            {props.description}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PageHeader;
