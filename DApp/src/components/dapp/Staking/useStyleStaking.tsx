import { Slider, makeStyles, styled, withStyles } from "@material-ui/core";
import Switch from '@material-ui/core/Switch';

export const GreenSwitch = withStyles({
    switchBase: {
      color: '#8500FF',
      '&$checked': {
        color: '#5ad043',
      },
      '&$checked + $track': {
        backgroundColor: '#5ad043',
      },
    },
    checked: {
      '& + $track': {
        backgroundColor: '#8500FF',
      },
    },
    track: {
      backgroundColor: '#8500FF',
    },
  })(Switch);

export const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    width: '80%',
    position: 'relative',
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 30,
        width: 30,
        marginTop: -12,
        backgroundImage: "url('Android.png')",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 8,
        background: 'unset',
        padding: 0,
        width: 22,
        height: 22,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});

export const useStyleStaking: any = makeStyles((theme) => ({
    root: {
        position: "relative",
        width: "100%",
        height: "140vh",
        overflow: "auto",
        background: 'linear-gradient(135deg, #000000, #0B0230)',

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
            background: 'linear-gradient(135deg, #000000, #0B0230)',
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
        border: "2px solid transparent",
        borderRadius: 30,
        borderImage: 'linear-gradient(to right, #000000, #121111)',
        borderImageSlice: 1,
        textAlign: "center",
        position: "relative",
        borderLeft: 'none',
        borderRight: 'none',
    },
    paperUser: {
        minHeight: 100,
        backgroundColor: "rgba(255, 255, 255, 0)",
        padding: theme.spacing(2),
        border: "2px solid transparent",
        borderRadius: 30,
        borderImage: 'linear-gradient(to right, #000000, #121111)',
        borderImageSlice: 1,
        textAlign: "center",
        position: "relative",
        borderBottom: 'none',
        marginTop: 240
    },
    paperRew: {
        minHeight: 110,
        background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(18, 17, 17, 0.7))",
        padding: theme.spacing(2),
        border: '2px solid #8500FF',
        borderRadius: 30,
        textAlign: "center",
        position: "relative",
    },
    paperRewNoBG: {
        minHeight: 110,
        background: "black",
        padding: theme.spacing(2),
        borderRadius: 30,
        textAlign: "center",
        position: "relative",
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
        minHeight: 950,
        background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(18, 17, 17, 0.7))",
        padding: theme.spacing(2),
        border: '2px solid #8500FF',
        textAlign: "center",
        position: "relative",
        backgroundClip: 'padding-box',
        borderRadius: 25,
        "@media screen and (max-width: 768px)": {
            minHeight: 100,
        },
    },
    vestingOverlay: {
        content: '""',
        position: 'absolute',
        width: '90px',
        height: '90px',
        top: -15,
        left: -15,
        backgroundImage: "url('52.png')",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        borderRadius: '50%',
        zIndex: 1,
        "@media screen and (max-width: 768px)": {
            content: '""',
            position: 'absolute',
            width: '50px',
            height: '50px',
            top: 0,
            left: 1,
            zIndex: 1,
        }
    },
    paperAlert: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        background: 'rgba(0, 0, 0, 1)',
        backdropFilter: 'blur(10px)',
        border: '2px solid transparent',
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        borderBottom: 'none',
        borderImage: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%) 1',
        borderRadiusTopRight: 100,
        borderRadiusTopLeft: 100,
        position: 'fixed',
        zIndex: 9999,
        width: '100%',
        minHeight: 10,
        height: 'auto',
        maxHeight: 'auto',
        top: 55,
    },
    boxGrid: {
        padding: theme.spacing(2),
        background: "url('57.png') no-repeat center",
        backgroundOrigin: 'border-box',
        backgroundPosition: 'center',
        overflow: 'hidden',
        border: '2px solid #8500FF',
        borderRadius: 23,
        position: 'relative',
        boxShadow: "0 -10px 7px rgba(255, 255, 255, 0)",
        textAlign: "center",
        "@media screen and (max-width: 768px)": {
        },
    },
    boxGridInactive: {
        padding: theme.spacing(2),
        backgroundOrigin: 'border-box',
        backgroundSize: '130% 120%',
        backgroundPosition: 'center',
        borderRadius: 30,
        borderBottom: 'none',
        boxShadow: "0 -10px 7px rgba(255, 255, 255, 0)",
        textAlign: "center",
        "@media screen and (max-width: 768px)": {
        },
    },

    title: {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: 900,
        color: "#52af77",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",

        fontSize: '22px'
    },
    titleDash: {
        fontWeight: 900,
        color: "#52af77",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",

        fontSize: '16px'
    },
    desc: {
        position: "absolute",
        top: "70%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#8A00F6",
        textShadow: "3px 3px 2px rgba(0, 0, 0, 0.5)",

        fontWeight: 400,
        fontSize: '18px'
    },
    subtitle: {
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        color: 'white',
        fontSize: '24px',

        fontWeight: 700,
        "@media screen and (max-width: 768px)": {
            top: '40%',
            width: '100%',
        },
    },
    subtitleLeft: {
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        color: '#A4FE66',
        fontSize: '18px',

        fontWeight: 700,
        "@media screen and (max-width: 768px)": {
            top: '10%',
            width: '100%',
        },
    },
    subtitle2: {
        top: "40%",
        color: 'white',
        fontSize: '22px',

        fontWeight: 700,
        "@media screen and (max-width: 768px)": {
            top: '40%',
            width: '100%',
        },
    },
    subtitleDate: {
        position: 'absolute',
        fontStyle: 'italic',
        top: "80%",
        left: '70%',
        color: 'white',
        fontSize: '16px',

        fontWeight: 700,
        "@media screen and (max-width: 768px)": {
            position: 'relative',
            left: '0%',
            top: '90%',
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

        fontWeight: 700,
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    rewards: {
        position: "absolute",
        top: "3%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",

        fontSize: "24px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
        },
    },
    rewardsVesting: {
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        color: "white",
        textShadow: "3px 3px 2px rgba(139, 62, 255, 0.5)",

        fontSize: "20px",
        "@media screen and (max-width: 768px)": {
            width: '100%',
            right: '100%',
            top: "30%",
        },
    },
    claimable: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        background: "url('54.png') no-repeat center",
        backgroundPosition: 'center',
        backgroundClip: 'padding-box',
        padding: theme.spacing(2),
        textAlign: "center",
        height: 'auto',
        width: '93%',
        border: '2px solid #8B3EFF',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        "@media screen and (max-width: 768px)": {
            height: '100px',
        },
        overflow: 'hidden',
    },
    claimableLeft: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        display: 'flex',
        background: "url('54.png') no-repeat center",
        backgroundPosition: 'center',
        backgroundClip: 'padding-box',
        padding: theme.spacing(2),
        textAlign: "center",
        height: 'auto',
        minHeight: 160,
        maxHeight: '200px',
        minWidth: '90%',
        width: '90%%',
        border: '2px solid #8B3EFF',
        borderRadius: 10,
        "@media screen and (max-width: 768px)": {
            height: 300,
            maxHeight: '300px',
        },
        overflow: 'hidden',
    },
    balance: {
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translateX(-50%)",
        color: "white",
        textShadow: "0px 3px 2px rgba(255, 105, 135, 0.5)",

        fontSize: "22px",
        display: 'flex',
        flexDirection: 'row',
        "@media screen and (max-width: 768px)": {
            width: '100%',
            justifyContent: 'center'
        },
    },
    subtitleLil: {
        color: "white",
        fontSize: "16px",

    },
    subtitleLil2: {
        color: "white",
        fontSize: "14px",

    },
    subtitleLil3: {
        color: "white",
        fontSize: "12px",

    },
    icon: {
        position: "absolute",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "#8B3EFF",
        "@media screen and (max-width: 768px)": {
            top: "30px",
            left: "10%",
        },
    },
    iconTimer: {
        position: "absolute",
        top: "25px",
        left: "68%",
        color: " rgba(139, 62, 255, 1)",
        "@media screen and (max-width: 768px)": {
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
    drawerHeader: {
        marginTop: 100,
        background: 'black',
        color: 'white',
        display: "flex",
        alignItems: "center",
        padding: theme.spacing(0, 1),
        // Add other styles as needed
    },
    drawerContent: {
        background: 'black',
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    gradientBox: {
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        maxWidth: '80%',
        maxHeight: '80%',
        borderRadius: '50%',
        border: '2px solid transparent',
    },
    compandcoll: {
        background: "url('52.png') no-repeat center",
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        color: 'white',
        fontSize: 12,
        width: '85px',
        height: '80px'
    },
    border: {
        position: 'absolute',
        width: 'calc(80px - 4px)',
        height: 'calc(80px - 4px)',
        border: '2px solid #A4FE66',
        borderRadius: '50%',
    },
    button: {
        width: '100px',
        height: '100px',
        position: 'relative',
        top: '-15px',
        left: '0px',
        right: '-10px',
        bottom: '-10px',
        borderRight: 'none',
        borderTop: 'none',
        borderRadius: '50%',
        fontSize: 16,
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
    },
    buttonMonths: {
        height: '60px',
        position: 'relative',
        top: '0px',
        left: '0px',
        right: '-10px',
        bottom: '-10px',
        borderRight: 'none',
        borderTop: 'none',
        borderRadius: '50%',
        fontSize: 14,
        backgroundOrigin: 'border-box',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
    },
    pulsButton: {
        animation: '$pulse 2s infinite',
        backgroundColor: 'rgba(0,0,0, 0)', // Colore verde
        color: 'white',
    },
    '@keyframes pulse': {
        '0%': {
            backgroundColor: 'rgba(0,0,0, 0)',
        },
        '50%': {
            backgroundColor: '#4CAF50',
            color: 'white'
        },
        '100%': {
            backgroundColor: 'rgba(0,0,0, 0)',
        },
    },
    scrollingText: {
        width: '100%',
        height: '50px',
        overflow: 'hidden',
        color: "white",
        fontSize: "16px",

        whiteSpace: 'nowrap',
        animation: '$scroll 20s linear infinite',
        textAlign: 'center',
        lineHeight: '50px',
    },
    '@keyframes scroll': {
        '0%': {
            transform: 'translateX(100%)',
        },
        '100%': {
            transform: 'translateX(-100%)',
        },
    },
}));