import React, { ReactNode, useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Connector from './components/Connector';
import { ModeSwitcher } from './components/ModeSwitcher';
import Home from './components/dapp/Home';
import { Flex, Icon, FlexProps, useDisclosure } from '@chakra-ui/react';
import { EtherContext } from './ethers/EtherContext';
import { EtherContextRepository } from './ethers/EtherContextRepository';
import { IconType } from 'react-icons';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Welcome from './components/Welcome';
import AppsIcon from '@mui/icons-material/Apps';
import { useLocation } from 'react-router-dom';
import WalletUser from './components/dapp/Home';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Grid, Paper } from '@material-ui/core';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import { PrecisionManufacturing } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Staking from './components/dapp/Staking';
import Launchpad from './components/dapp/Launchpad';
import SwapSection from './components/dapp/SwapSection';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Alert, AlertTitle } from '@mui/material';
import EtherHelper from './ethers/EtherHelper';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'black',
  border: '2px solid #8A00F6',
  color: 'white',
  borderRadius: 5,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const style2 = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  bgcolor: 'black',
  border: '2px solid #8A00F6',
  color: 'white',
  borderRadius: 5,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  marginRight: 10
};
const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      background: 'linear-gradient(135deg, #000000, #0B0230)',
      color: '#fff',
      minHeight: '100vh',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '2px solid #8500FF',
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      height: 66,
      "@media screen and (max-width: 768px)": {
        height: 58,
      },
    },
    hyStyle: {
      background: 'rgba(216,178,167, 1)', /* Imposta il gradient bianco-azzurrino */
      animation: '$rainbow 5s infinite',  // Sostituisci con il nome del tuo font "pazzachi" per HY
    },
    enaStyle: {
      background: `rgba(216,178,167, 1)`,
      animation: '$rainbow 5s infinite', // Sostituisci con il nome del tuo font "pazzachi" per ENA
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    drawer: {
      [theme.breakpoints.up('md')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
      background: '#000',
      border: '2px solid #8B3EFF',
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      height: '100%'
    },
    content: {
      flexGrow: 1,
      marginTop: 20,
      minWidth: "100%"
    },
    nav: {
      width: '100%',
      maxWidth: 360,
      background: '#111', // Darker drawer background
      color: 'white',
    },
    gradient: {
      background: 'linear-gradient(90deg, rgba(251,251,250,1) 0%, rgba(139,198,195,0.6409143518518519) 40%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      color: 'white',
      height: 48,
      padding: '0 30px',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1),
      marginLeft: theme.spacing(0),
      borderRadius: theme.spacing(2),
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'background-color 0.3s, color 0.3s',
      '&:hover': {
        background: '#8A00F6',
        color: 'white',
      },
    },
    navIcon: {
      marginRight: theme.spacing(1),
      fontSize: 18,
    },
    catchyText: {
      alignItems: 'center',
      textAlign: 'center',
      marginLeft: 10,
      marginRight: 10,
      color: 'white',
      fontSize: 16,

    },
    rootLoader: {
      position: 'relative',
      flexGrow: 1,
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      minWidth: '100%',
      height: '100%',
      backgroundColor: 'black',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      marginLeft: 0,
      marginRight: 0,
      alignItems: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
        backdropFilter: 'blur(10px)', // Backdrop filter for blurring the background
        zIndex: -1,
      },
    },
    overlayLoader: {
      position: 'absolute',
      height: '100%',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
      backdropFilter: 'blur(10px)', // Backdrop filter for blurring the background
      zIndex: 0,
    },
    logoSpin: {
      animation: '$spin 2s linear infinite', // Applying the spinning animation
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Adjust this value based on your layout
    },
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)', // Initial rotation angle
      },
      '100%': {
        transform: 'rotate(360deg)', // Final rotation angle after 360 degrees
      },
    },
    logoImage: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    rainbowText: {
      background: `linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)`,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      animation: '$rainbow 5s infinite',
      fontWeight: 'bold', // Aggiunto il grassetto
    },
    rainbowText2: {
      background: `linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)`,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      animation: '$rainbow 5s infinite',
      fontWeight: 'bold', // Aggiunto il grassetto
    },
    '@keyframes rainbow': {
      '0%': { color: theme.palette.secondary.main },
      '25%': { color: theme.palette.error.main },
      '50%': { color: theme.palette.primary.main },
      '75%': { color: theme.palette.info.main },
      '100%': { color: theme.palette.success.main },
    },
    drawerPaperDesktop: {
      width: drawerWidth,
      background: '#111',
      border: '2px solid #8A00F6',
      borderTop: 'none',
      borderBottom: 'none',
      borderRight: 'none',
    },
    paperAlert: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '2px solid transparent',
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      borderImage: 'linear-gradient(45deg, #FE6B8B 30%, #8500FF 90%) 1',
      borderRadiusTopRight: 100,
      borderRadiusTopLeft: 100,
      position: 'fixed',
      zIndex: 9999,
      width: '100%',
      minHeight: 10,
      height: '100%',
      maxHeight: 'auto',
      top: 55,
    },
  })
);

interface NavItemProps extends FlexProps {
  to: string;
}

const NavItem = ({ to, children, ...rest }: NavItemProps) => {
  const classes = useStyles();

  return (
    <Link to={to} className={classes.navItem}>
      <Typography variant="body1" className={classes.catchyText}>{children}</Typography>
    </Link>
  );
};

interface LinkItemProps {
  paths: string[];
  name: string;
  icon?: IconType;
  element?: ReactNode;
  isExternal?: boolean;
  divider?: boolean;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', paths: ['/home'], element: <Welcome /> },
  { name: 'Swap', paths: ['/swap'], element: <SwapSection /> },
  { name: 'Launchpad', paths: ['/launchpad'], element: <Launchpad /> },
  { name: 'Staking', paths: ['/staking'], element: <Staking /> },

];

const App: React.FC = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:960px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { context } = React.useContext(EtherContext) as EtherContextRepository;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false)
  const [isCasinoSubMenuOpen, setIsCasinoSubMenuOpen] = useState(false); // Stato per il sottomenu "Casinò"
  const [openModal, setOpenModal] = useState(false)

  const handleOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalUser = () => {
    if (mobileOpen === true) {
      setMobileOpen(false);

    }
    else {
      setMobileOpen(true);
    }
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Stato per il drawer

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer); // Clear the timeout on unmount
    };
  }, []);

  const currentPathname = window.location.pathname;

  // Conditionally render the logo based on the current pathname
  const shouldRenderLogo = ![''].includes(currentPathname);

  if (isLoading) {
    return (
      <div className={classes.rootLoader}>
        <div className={classes.logoSpin}>
          <img src="loader.png" alt="Logo" className={classes.logoImage} />
        </div>
      </div>
    )
  }

  const isConnected = context.connected ?? false;

  const verifyChain = () => {
    if (context.chainId !== 1 && context.chainId !== 11155111) {
      return false
    } else {
      return true
    }
  }

  const isChainId = verifyChain()

  const chainId = context.chainId ?? undefined;


  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar} style={{ justifyContent: context.addressSigner === undefined ? 'space-between' : 'flex-start' }}>
          <Toolbar>
            <IconButton
              style={{ color: '#8500FF' }}
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            {shouldRenderLogo ? (
              isMobile ? (
                <img src="DiviLogo.png" alt={'Logo'} style={{ height: '30px', marginRight: '20px', marginLeft: -10 }} />
              ) : (
                <img src="DiviLogo.png" alt={'Logo'} style={{ height: '50px', marginRight: '10px' }} />
              )
            ) : (
              <Typography variant="h5">
                <span className={classes.hyStyle}>DIVI</span>
                <span className={classes.enaStyle}>TREND</span>
              </Typography>
            )}
            {!isMobile && (
              <Drawer
                variant="temporary"
                anchor="right"
                open={isDrawerOpen}
                onClose={handleDrawerToggle} // Chiudi il drawer quando si fa clic sull'icona dell'hamburger
                classes={{
                  paper: classes.drawerPaperDesktop,
                }}
                style={{ zIndex: 9999 }}
              >
                <div style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 20, marginTop: 20, flexDirection: 'column' }}>
                  {LinkItems.map((link, key) => (
                    <div key={key}>
                      <NavItem
                        to={link.paths[0]}
                        onClick={handleDrawerToggle}
                      >
                        {link.name}
                      </NavItem>
                    </div>
                  ))}
                </div>
              </Drawer>
            )}
            {!isMobile && (
              <>
                <IconButton
                  style={{ color: '#8500FF' }}
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuOpenIcon fontSize="large" />
                </IconButton>
              </>
            )}
            {isMobile && (
              <div style={{ width: '100%', marginLeft: 20, display: 'flex', alignItems: 'center', gap: 10, marginRight: 10 }}>
                <div style={{ flexGrow: context.addressSigner === undefined ? 1 : 0 }}>
                  <Connector>
                    <ModeSwitcher mr={4} />
                  </Connector>
                </div>
                <IconButton style={{ marginLeft: 10, color: '#8500FF' }} onClick={handleOpen} aria-label="Menu">
                  <AppsIcon fontSize="large" />
                </IconButton>
              </div>
            )}
            {!isMobile && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 40, marginLeft: 'auto' }}>
                <Connector>
                  <ModeSwitcher mr={4} />
                </Connector>
                <IconButton style={{ color: '#8500FF' }} onClick={handleOpen} aria-label="Menu">
                  <AppsIcon fontSize="large" />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="top"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            style={{ zIndex: 9999 }}
          >
            <div style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexDirection: 'column' }}>
              {LinkItems.map((link, key) => (
                <React.Fragment key={key}>
                  <NavItem to={link.paths[0]} onClick={onClose}>
                    {link.name}
                  </NavItem>
                </React.Fragment>
              ))}
            </div>
          </Drawer>
        )}
        {isMobile ? (
          <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            style={{ width: '100%' }}
          >
            <Box sx={{ ...style2, alignItems: 'center', justifyContent: 'center', padding: 1 }}>
              <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Wallet" >
                    <DashboardIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Dashboard
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Calculate">
                    <CalculateIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Calculate
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon3">
                    <AccountBalanceWalletIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Wallet
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon4">
                    <SwapHorizontalCircleIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Swap
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon5">
                    <Diversity1Icon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Referral
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon5">
                    <SmartToyIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Buy Bot
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon5">
                    <PrecisionManufacturing fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Raid Bot
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        ) : (
          <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, width: '100%', minHeight: 500, alignItems: 'center', justifyContent: 'center' }}>
              <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Wallet" >
                    <DashboardIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Wallet
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Calculate">
                    <CalculateIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Calculate
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon3">
                    <AccountBalanceWalletIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Wallet
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon4">
                    <SwapHorizontalCircleIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Swap
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon5">
                    <Diversity1Icon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Referral
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon5">
                    <SmartToyIcon fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Buy Bot
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton color="primary" aria-label="Icon5">
                    <PrecisionManufacturing fontSize="large" />
                  </IconButton>
                  <Typography variant="subtitle1" align="center">
                    Raid Bot
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        )}
        {isConnected === false && (
          <Paper elevation={3} className={classes.paperAlert}>
            <Alert
              variant="outlined"
              severity={"info"}
            >
              <AlertTitle>{"Connect Your Wallet — Please connect your wallet! "}</AlertTitle>
            </Alert>
          </Paper>
        )}
        {isConnected === true && isChainId === false && (
          <Paper elevation={3} className={classes.paperAlert}>
            <Alert
              variant="outlined"
              severity={"info"}
            >
              <AlertTitle>{"WRONG NETWORK — Please switch to ETH network!"}</AlertTitle>
            </Alert>
          </Paper>
        )}
        <div className={classes.content}>
          {isLoading && (
            <div className={classes.rootLoader}>
              <div className={classes.logoSpin}>
                <img src="loader.png" alt="Logo" className={classes.logoImage} />
              </div>
              <div className={classes.overlayLoader} />
            </div>
          )}
          <Routes>
            {LinkItems.map((link, key) => {
              return link.paths.map((path, pathKey) => <Route key={`${key}_${pathKey}`} path={path} element={link.element} />)
            })}
            <Route path="/" element={<Welcome />} />
          </Routes>
        </div>
        <div
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #8A00F6',
            borderRight: 'none',
            borderLeft: 'none',
            borderBottom: 'none',
            position: 'fixed',
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 16,
            zIndex: 3
          }}
        >
          © DIVITREND - 2023 | <a> Powered by Ethercode</a>
        </div>
      </div>
    </Router>
  );
};

export default App;