import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@mui/material/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@mui/material/Grid";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Chip from "@mui/material/Chip";
import { Button, Divider, useMediaQuery } from "@material-ui/core";
import { EtherContext } from "../../ethers/EtherContext";
import { EtherContextRepository } from "../../ethers/EtherContextRepository";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EtherHelper from "../../ethers/EtherHelper";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "140vh",
    overflow: "auto",
    background: "url('bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginLeft: 0,
    marginRight: 0,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(10px)",
      zIndex: -1,
    },
    "@media screen and (max-width: 768px)": {
      height: "140vh",
    },
  },
  overlay: {
    position: "absolute",
    height: "100%",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    zIndex: 0,
  },
  paper: {
    minHeight: 170,
    backgroundColor: "rgba(255, 255, 255, 0)",
    padding: theme.spacing(2),
    border: "2px solid rgba(216,178,167, 1)",
    borderRadius: 30,
    boxShadow: "0 3px 15px 2px rgba(255, 105, 135, 0.3)",
    textAlign: "center",
    position: "relative",
    borderLeft: 'none',
    borderRight: 'none',
  },
  paperRew: {
    minHeight: 110,
    backgroundColor: "rgba(255, 255, 255, 0)",
    padding: theme.spacing(2),
    border: "2px solid rgba(216,178,167, 1)",
    borderRadius: 30,
    boxShadow: "0 3px 15px 2px rgba(255, 105, 135, 0.3)",
    textAlign: "center",
    position: "relative",
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
  },
  paperB: {
    minHeight: 170,
    backgroundColor: "rgba(255, 255, 255, 0)",
    padding: theme.spacing(2),
    border: "2px solid rgba(216,178,167, 1)",
    borderRadius: 30,
    borderLeft: 'none',
    borderRight: 'none',
    boxShadow: "0 3px 15px 2px rgba(255, 105, 135, 0.3)",
    textAlign: "center",
    position: "relative",
    justifyContent: 'center'
  },
  paperA: {
    minHeight: 80,
    backgroundColor: "rgba(255, 255, 255, 0)",
    padding: theme.spacing(2),
    border: "2px solid rgba(216,178,167, 1)",
    borderRadius: 30,
    borderBottom: 'none',
    borderTop: 'none',
    boxShadow: "0 3px 15px 2px rgba(255, 105, 135, 0.3)",
    textAlign: "center",
    position: "relative",
    "@media screen and (max-width: 768px)": {
      minHeight: 100,
    },
  },
  title: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: "bold",
    color: "rgba(216,178,167, 1)",
    textShadow: "3px 3px 2px rgba(255, 105, 135, 0.5)",
    fontFamily: "Lilita One",
    fontSize: "24px",
    "@media screen and (max-width: 768px)": {
      width: '100%',
    },
  },
  desc: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    textShadow: "0px 3px 2px rgba(255, 105, 135, 0.5)",
    fontFamily: "Lilita One",
    fontSize: "18px",
    "@media screen and (max-width: 768px)": {
      width: '100%',
    },
  },
  balance: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    textShadow: "0px 3px 2px rgba(255, 105, 135, 0.5)",
    fontFamily: "Lilita One",
    fontSize: "22px",
    display: 'flex',
    flexDirection: 'row',
    "@media screen and (max-width: 768px)": {
      width: '100%',
      justifyContent: 'center'
    },
  },
  subtitle: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "white",
    fontSize: "32px",
    fontFamily: "Lilita One",
  },
  icon: {
    position: "absolute",
    top: "23px",
    left: "10%",
    transform: "translateX(-50%)",
    color: "rgba(216, 178, 167, 1)",
    "@media screen and (max-width: 768px)": {
      top: "30px",
      left: "10%",
    },
  },
  user: {
    position: "absolute",
    top: "0",
    right: "95%",
    height: 40,
    width: 40,
    transform: "translateX(-50%)",
    color: "rgba(216, 178, 167, 1)",
    "@media screen and (max-width: 768px)": {
      top: "35px",
      left: "50%",
    },
  },
  chip: {
    position: "absolute",
    top: "70%",
    left: "18%",
    transform: "translateX(-50%)",
    margin: theme.spacing(1),
    fontFamily: "Josefin Sans",
  },
  chip2: {
    position: "absolute",
    top: "70%",
    left: "48%",
    transform: "translateX(-50%)",
    margin: theme.spacing(1),
  },
  chip3: {
    position: "absolute",
    top: "70%",
    left: "78%",
    transform: "translateX(-50%)",
    margin: theme.spacing(1),
  },
  chipContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  mobile: {
    "@media screen and (max-width: 768px)": {
      marginTop: 100,
    },
  },
  menuButton: {
    position: "absolute",
    top: "20px",
    right: `-${drawerWidth}px`, // Slide out from the right
    transform: "translateX(50%)", // Center the icon horizontally
    fontSize: "52px",
    color: 'white',
  },

  drawerHeader: {
    marginTop: 100,
    background: 'black',
    color: 'white',
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // Add other styles as needed
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    background: 'black',
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'black',
  },

  drawerContent: {
    background: 'black',
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  
}));

const WalletUser = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery("(max-width:960px)");
  const [openDrawer, setOpenDrawer] = useState(false);
  const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  
  useEffect(() => {
    async function getInitDataPool() {
      const data_ctx = await EtherHelper.initialInfoPool(context);
      saveContext(data_ctx)
      console.log(data_ctx)
    }
    getInitDataPool()
  }, [])

  const handleCopyClick = () => {
    navigator.clipboard.writeText(context.addressSigner ?? '');
    setIsSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className={classes.root}>
      <div className={classes.overlay}></div>
      <Container maxWidth="xl">
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          style={{ marginTop: 50 }}
          open={isSnackbarOpen}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          message="Text copied to clipboard"
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <FileCopyIcon fontSize="small" />
            </IconButton>
          }
        />
        <Grid container spacing={5} style={{ marginTop: 50 }} className={classes.mobile}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paperA} >
              <MonetizationOnIcon fontSize="large" className={classes.icon} />
              <div className={classes.title}>$TRND BALANCE:</div>
              <div className={classes.desc}>273.234 | <a style={{ fontSize: '16px', color: 'lightgrey' }}><em>$1,234.56</em></a></div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.paperA}>
              <CurrencyExchangeIcon fontSize="large" className={classes.icon} />
              <div className={classes.title}>$TRND STAKED:</div>
              <div className={classes.desc}>1.754.325,54</div>
            </Paper>
          </Grid>
          {/* MAIN */}
          <Grid item xs={12} md={12}>
            <Paper className={classes.paperB} style={{ height: 800 }}>
              <Grid item xs={12} md={12}>
                <Paper className={classes.paper}>
                  <div className={classes.title}>
                    <img className={classes.user} src="user.png" />
                    {isMobile && (
                      <div>{context.addressSigner?.slice(0, 5) + '...' + context.addressSigner?.slice(-5)}
                      <Button
                          style={{ marginLeft: 20, marginRight: 20 }}
                          variant="outlined"
                          color="secondary"
                          startIcon={<FileCopyIcon style={{ marginLeft: 10 }} />}
                          onClick={handleCopyClick}
                        ></Button>
                      </div>
                    )}
                    {!isMobile && (
                      <div style={{marginLeft: 30}}>{context.addressSigner ?? ''}
                        <Button
                          style={{ marginLeft: 20 }}
                          variant="outlined"
                          color="secondary"
                          startIcon={<FileCopyIcon style={{ marginLeft: 10 }} />}
                          onClick={handleCopyClick}
                        ></Button>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className={classes.balance}>
                      <img src="eth.png" style={{ width: 25, height: 25, marginTop: 5, marginRight: 10 }} />
                      0.04 ETH
                    </div>
                  </div>
                </Paper>
              </Grid>
              <Grid container spacing={5} style={{ marginTop: 10 }} className={classes.mobile}>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paperRew}>
                    <div className={classes.title}>REWARDS </div>
                    <div className={classes.balance}>42.364 $TRND</div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper className={classes.paperRew}>
                    <div className={classes.title}>REWARDS </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div className={classes.balance}>
                        <img src="eth.png" style={{ width: 25, height: 25, marginTop: 5, marginRight: 10 }} />
                        0.23 ETH
                      </div>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Paper className={classes.paperRew}>
                    <div className={classes.desc}>YOUR REFERRAL: JFV34ACV4</div>
                    <Button color="secondary">GENERATE REFERRAL</Button>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default WalletUser;
