import React from 'react';
import {
  CircularProgress,
  makeStyles,
  Modal,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { Autorenew as AutorenewIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.1)',
    outline: 'none',
  },
  icon: {
    animation: '$spin 2s linear infinite',
  },
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}));

interface LogoSpinnerAnimationProps {
  loading: boolean;
}

const LogoSpinnerAnimation: React.FC<LogoSpinnerAnimationProps> = ({ loading }) => {
  const classes = useStyles();

  return (
    <Modal open={loading} disableAutoFocus disableEnforceFocus style={{background: 'rgba(0,0,0, 0.1)'}}>
      <Paper className={classes.paper}>
        {/*<AutorenewIcon fontSize="large" className={loading ? classes.icon : ''} />*/}
        <img src="Android.png" alt="" className={classes.icon} style={{borderRadius: 50, border: '2px solid #52af77'}} />
      </Paper>
    </Modal>
  );
};

export default LogoSpinnerAnimation;
