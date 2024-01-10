import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Tab } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { CombinedTokensIcons } from './comp_modal/CombinedTokensIcons';
import { IEtherContext } from '../../../ethers/IEtherContext';
import RevenueStats from './comp_modal/RevenueStats';
import GlobalStats from './comp_modal/GlobalStats';
import { TrndStats } from './comp_modal/TrndStats';
import CloseIcon from '@mui/icons-material/Close';

const UnselectedDATA = '69.png';
const SelectedDATA = '70.png';

const UnselectedETH = '73.png';
const SelectedETH = '74.png';

const UnselectedFACT = '71.png';
const SelectedFACT = '72.png';

const UnselectedREV = '75.png';
const SelectedREV = '76.png';

const UnselectedDIVI = '77.png';
const SelectedDIVI = '78.png';

const CustomTabs = withStyles({
    indicator: {
        display: 'none', // Nascondi l'indicatore di selezione
    },
})(Tabs);

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0, 0.7)',
    },
    paper: {
        position: 'relative', // Aggiungo position relative al paper
        background: 'linear-gradient(135deg, #000000, #0B0230)',
        border: '2px solid #8500FF',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        width: 900,
        height: '93%',
        "@media screen and (max-width: 768px)": {
            width: '100%',
            border: 'none',
        },
        "@media screen and (max-height: 1180px)": {
            height: '99%',
        },
    },
    title: {
        color: '#A4FE66',
        textAlign: 'center',
        marginBottom: theme.spacing(2),
    },
    slider: {
        width: '80%',
        margin: '0 auto',
    },
    button: {
        backgroundColor: '#8500FF',
        color: '#FFFFFF',
        marginTop: theme.spacing(2),
    },
    tabsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        width: '100%',
        "@media screen and (max-width: 768px)": {
            left: '2%',
        }
    },
    tabLabel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#A4FE66',
    },
}));


const ComponentOne = () => {
    return (
        <div>
            <h2 style={{ color: '#A4FE66' }}>Coming Soon...</h2>
        </div>
    );
};

const ComponentThree = () => {
    return (
        <div>
            <h2>Componente 3</h2>
            <p>Questo è il componente uno.</p>
        </div>
    );
};

const ModalStaking = ({ open, onClose, externalButton, context }: { open: boolean, onClose: () => void, externalButton?: number, context: IEtherContext }) => {
    const [activeTab, setActiveTab] = useState(1);
    const classes = useStyles();

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleExternalButtonClick = (componentNumber: number) => {
        setActiveTab(componentNumber);
    };

    useEffect(() => {
        if (externalButton !== undefined) {
            setActiveTab(externalButton);
        }
    }, [externalButton]);

    const getTabIcon = (tabValue: number) => {
        const imageStyle = {
            width: '35px',
            height: '35px',
        };

        switch (tabValue) {
            case 1:
                return activeTab === 1 ? <img src={SelectedDATA} alt="Selected Tab 1" style={imageStyle} /> : <img src={UnselectedDATA} alt="Unselected Tab 1" style={imageStyle} />;
            case 2:
                return activeTab === 2 ? <img src={SelectedREV} alt="Selected Tab 2" style={imageStyle} /> : <img src={UnselectedREV} alt="Unselected Tab 2" style={imageStyle} />;
            case 3:
                return activeTab === 3 ? <img src={SelectedETH} alt="Selected Tab 3" style={imageStyle} /> : <img src={UnselectedETH} alt="Unselected Tab 3" style={imageStyle} />;
            case 4:
                return activeTab === 4 ? <img src={SelectedFACT} alt="Selected Tab 4" style={imageStyle} /> : <img src={UnselectedFACT} alt="Unselected Tab 4" style={imageStyle} />;
            case 5:
                return activeTab === 5 ? <img src={SelectedDIVI} alt="Selected Tab 5" style={imageStyle} /> : <img src={UnselectedDIVI} alt="Unselected Tab 5" style={imageStyle} />;
            default:
                return "";
        }
    };

    return (
        <Modal open={open} onClose={onClose} className={classes.modal}>
            <div className={classes.paper}>
                <CloseIcon style={{ position: 'absolute', top: 10, right: 10, color: '#A4FE66', cursor: 'pointer' }} onClick={onClose} />

                {activeTab === 1 && <ComponentOne />}
                {activeTab === 2 && <GlobalStats />}
                {activeTab === 3 && <RevenueStats />}
                {activeTab === 4 && <CombinedTokensIcons tokenIdStaked={context.nft_staked_data?.nft_staked_ids ?? []} />}
                {activeTab === 5 && <TrndStats tokenIdStaked={context.nft_staked_data?.nft_staked_ids ?? []} />}

                <div className={classes.tabsContainer}>

                    <CustomTabs value={activeTab} onChange={handleTabChange} >
                        <Tab
                            label=""
                            value={1}
                            icon={getTabIcon(1)}
                            className={classes.tabLabel}
                        />
                        <Tab
                            label=""
                            value={2}
                            icon={getTabIcon(2)}
                            className={classes.tabLabel}
                        />
                        <Tab
                            label=""
                            value={3}
                            icon={getTabIcon(3)}
                            className={classes.tabLabel}
                        />
                        <Tab
                            label=""
                            value={4}
                            icon={getTabIcon(4)}
                            className={classes.tabLabel}
                        />
                        <Tab
                            label=""
                            value={5}
                            icon={getTabIcon(5)}
                            className={classes.tabLabel}
                        />
                    </CustomTabs>
                </div>
            </div>
        </Modal >
    );
};

export default ModalStaking;
