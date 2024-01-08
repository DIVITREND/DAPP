/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@mui/material/Container";
import { Paper } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import Chip from "@mui/material/Chip";
import { useMediaQuery } from "@material-ui/core";
import { EtherContext } from "../ethers/EtherContext";
import { EtherContextRepository } from "../ethers/EtherContextRepository";
import { Alert, AlertTitle, Skeleton } from "@mui/material";
import EtherHelper from "../ethers/EtherHelper";
import { ethers } from "ethers";
import { Pair } from "../entities/stats/Pair";
import { StatsHelper } from "./stats_helper/StatsHelper";
import AddressFactory from "../common/AddressFactory";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100vh",
    background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(11,2,48,1) 35%)',
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
      height: '140vh'
    },
    "@media screen and (max-width: 667px)": {
      height: "auto",
    },
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    backdropFilter: 'blur(10px)', // Backdrop filter for blurring the background
    zIndex: 0,
  },
  paper: {
    minHeight: 170,
    background: "url('57.png') no-repeat center",
    backgroundPosition: 'center',
    padding: theme.spacing(2),
    border: "2px solid #8A00F6",
    borderRadius: 30,
    boxShadow: "0 3px 15px 2px linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(35,22,88,1) 35%)",
    textAlign: "center",
    position: "relative", // Aggiunto per posizionare l'icona all'interno
    "@media screen and (max-width: 768px)": {
      minHeight: '170px',
    },
    "@media screen and (max-width: 667px)": {
      minHeight: '170px',
      width: '100%',
      marginTop: 20
    },
  },
  paperEnd: {
    minHeight: 170,
    backgroundPosition: 'center',
    background: 'rgba(0,0,0 ,0)',
    padding: theme.spacing(2),
    border: "2px solid #8A00F6",
    borderRadius: 30,
    boxShadow: "0 3px 15px 2px linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(35,22,88,1) 35%)",
    textAlign: "center",
    position: "relative", // Aggiunto per posizionare l'icona all'interno
    "@media screen and (max-width: 768px)": {
      minHeight: '170px',
    },
    "@media screen and (max-width: 667px)": {
      minHeight: '170px',
      width: '100%',
      marginTop: 20
    },
  },
  title: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: 900,
    color: "#A4FE66",
    textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",
    fontFamily: "Open Sans",
    fontSize: '24px'
  },
  desc: {
    position: "absolute",
    top: "70%",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#8A00F6",
    textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontSize: '14px'
  },
  subtitle: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translateX(-50%)",
    color: 'white',
    fontSize: '32px',
    fontFamily: "Open Sans",
    fontWeight: 700,
    "@media screen and (max-width: 768px)": {
      top: '40%',
      width: '100%',
    },
  },
  subtitlePrice: {
    position: "absolute",
    top: "32%",
    left: "50%",
    transform: "translateX(-50%)",
    color: 'white',
    fontSize: '32px',
    fontFamily: "Open Sans",
    fontWeight: 700,
    "@media screen and (max-width: 768px)": {
      width: '100%',
    },
  },
  icon: {
    position: "absolute",
    top: "70%",
    left: "4%",
    transform: "translateX(-50%)",
    fontSize: "20px",
    color: "#52af77",
    width: 40,
    height: 40,
  },
  chip: {
    position: "absolute",
    top: "70%",
    left: "18%",
    transform: "translateX(-50%)",
    margin: theme.spacing(1),
    fontFamily: "Josefin Sans"

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
      marginTop: 0
    },
    "@media screen and (max-width: 667px)": {
      marginTop: 50,
      height: '100%'
    },
  },
  particleBackground: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: -1
  },
  particle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "50%",
    width: "8px",
    height: "8px",
    animation: "$move 5s linear infinite",
  },
  "@keyframes move": {
    "0%": {
      transform: "translate(0, 0)",
    },
    "100%": {
      transform: "translate(100vw, 100vh)", /* La direzione in cui si muovono */
    },
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
}));

const Welcome = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:960px)');
  const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;
  const [wethPrice, setWethPrice] = useState<number | undefined>(undefined);
  const [usdtPrice, setUsdtPrice] = useState<number | undefined>(undefined);
  const [reserveWETH, setWETHReserve] = useState<number>(0);

  useEffect(() => {
    if (!context) return context
    const res_weth = Number(context.reserve0)
    setWETHReserve(res_weth)
  }, [context])
  useEffect(() => {
    StatsHelper.getPriceOfToken('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2') // Indirizzo di WETH
      .then(price => setWethPrice(price));

    StatsHelper.getPriceOfToken('0xdAC17F958D2ee523a2206206994597C13D831ec7') // Indirizzo di USDT
      .then(price => setUsdtPrice(price));
  }, []);

  console.log([wethPrice])


  useEffect(() => {
    async function getInitDataPool() {
      const data_ctx = await EtherHelper.initialInfoPool(context);
      saveContext(data_ctx)
      console.log(data_ctx)
    }
    getInitDataPool()
  }, [])

  const isConnected = context.connected ?? false;

  return (
    <div className={classes.root}>
      <div className={classes.overlay}></div>
      <Container maxWidth="xl">
        {!isMobile && (
          <Grid container spacing={5} className={classes.mobile}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <div className={classes.title}>
                  $TRND:
                </div>
                <div className={classes.subtitle}>
                  {context.reserve0 && context.reserve1 && (
                    <>
                      {(() => {
                        const res_0 = Number(parseFloat(context.reserve0));
                        const res_1 = Number(parseFloat(context.reserve1));
                        const price = res_0 / res_1;
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '14px', color: 'lightgray', fontStyle: 'italic' }}>{(price * ((Number(ethers.utils.formatEther(context.reserve0))) * (wethPrice ?? 0))).toFixed(7)} $</div>
                            {price.toFixed(7)}
                          </div>
                        );
                      })()}
                    </>
                  )}
                  {!context.reserve0 && context.reserve1 && (
                    <Skeleton animation="wave" />
                  )}
                </div>
                <Chip
                  label="+5.2% 1d"
                  className={classes.chip}
                  color="success"
                  size="small"
                />
                <Chip
                  label="+22.1% 1w"
                  className={classes.chip2}
                  color="success"
                  size="small"
                />
                <Chip
                  label="+38.1% 1M"
                  className={classes.chip3}
                  color="success"
                  size="small"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  LP $TRND:
                </div>
                <div className={classes.subtitle}>
                  {wethPrice && (
                    <>$ {(wethPrice * Number(ethers.utils.formatEther(context.reserve0 ?? 0))).toLocaleString('en-US', { maximumFractionDigits: 2 })}</>
                  )}
                </div>
                {context.reserve0 && context.reserve1 && (
                  <div className={classes.desc}>
                    {ethers.utils.formatEther(context.reserve0)} WETH / {Number(ethers.utils.formatEther(context.reserve1)).toFixed(2)} TRND
                  </div>
                )}
                {!context.reserve0 && context.reserve1 && (
                  <Skeleton animation="wave" />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  MARKET CAP:
                </div>
                <div className={classes.subtitle}>
                  {context.reserve0 && context.reserve1 && (
                    <>
                      {(() => {
                        const res_0 = Number(parseFloat(context.reserve0));
                        const res_1 = Number(parseFloat(context.reserve1));
                        const price = res_0 / res_1;
                        return (
                          <>
                            ${((price * 1e6) * (wethPrice ?? 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </>
                        );
                      })()}
                    </>
                  )}
                  {!context.reserve0 && context.reserve1 && (
                    <Skeleton animation="wave" />
                  )}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  BURNED:
                </div>
                <div className={classes.subtitle}>
                  0 $TRND
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paperEnd}>
                {isMobile && (
                  <img src={"11.png"} alt="" className={classes.icon} />
                )}

                <div className={classes.title}>
                  STAKED CAPITAL:
                </div>
                <div className={classes.subtitle}>
                  $ 0
                </div>
              </Paper>
            </Grid>
          </Grid>
        )}
        {isMobile && (
          <Grid spacing={5} className={classes.mobile} style={{ height: '100%' }}>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  $TRND:
                </div>
                <div className={classes.subtitlePrice}>
                  {context.reserve0 && context.reserve1 && (
                    <>
                      {(() => {
                        const res_0 = Number(parseFloat(context.reserve0));
                        const res_1 = Number(parseFloat(context.reserve1));
                        const price = res_0 / res_1;
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: '14px', color: 'lightgray', fontStyle: 'italic' }}>{(price * ((Number(ethers.utils.formatEther(context.reserve0))) * (wethPrice ?? 0))).toFixed(7)} $</div>
                            {price.toFixed(7)}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
                <Chip
                  label="+5.2% 1d"
                  className={classes.chip}
                  color="success"
                  size="small"
                />
                <Chip
                  label="+22.1% 1w"
                  className={classes.chip2}
                  color="success"
                  size="small"
                />
                <Chip
                  label="+38.1% 1M"
                  className={classes.chip3}
                  color="success"
                  size="small"
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  LP $TRND:
                </div>
                <div className={classes.subtitle}>
                  {wethPrice && (
                    <>$ {(wethPrice * Number(ethers.utils.formatEther(context.reserve0 ?? 0))).toLocaleString('en-US', { maximumFractionDigits: 2 })}</>
                  )}
                </div>
                {context.reserve0 && context.reserve1 && (
                  <div className={classes.desc}>
                    {ethers.utils.formatEther(context.reserve0)} WETH / {Number(ethers.utils.formatEther(context.reserve1)).toFixed(2)} TRND
                  </div>
                )}
                {!context.reserve0 && context.reserve1 && (
                  <Skeleton animation="wave" />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  MARKET CAP:
                </div>
                <div className={classes.subtitle}>
                  {context.reserve0 && context.reserve1 && (
                    <>
                      {(() => {
                        const res_0 = Number(parseFloat(context.reserve0));
                        const res_1 = Number(parseFloat(context.reserve1));
                        const price = res_0 / res_1;
                        return (
                          <>
                            ${((price * 1e6) * (wethPrice ?? 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </>
                        );
                      })()}
                    </>
                  )}
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                
                <div className={classes.title}>
                  BURNED:
                </div>
                <div className={classes.subtitle}>
                  0 $TRND
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paperEnd}>
                
                <div className={classes.title}>
                  CAPITAL:
                </div>
                <div className={classes.subtitle}>
                  $ 0
                </div>
              </Paper>
            </Grid>
            <div style={{ height: '50px' }}></div>
          </Grid>
        )}

      </Container>
    </div >
  );
};

export default Welcome;
