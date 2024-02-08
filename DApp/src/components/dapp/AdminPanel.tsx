/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import {
    TextField,
    Button,
    Grid,
    Paper,
    Typography,
    AppBar,
    Toolbar,
    Divider,
} from '@material-ui/core';
import EtherHelper from '../../ethers/EtherHelper';
import { EtherContext } from '../../ethers/EtherContext';
import { EtherContextRepository } from '../../ethers/EtherContextRepository';
import { IEtherContext } from '../../ethers/IEtherContext';
import { Type } from 'typescript';
import AddressFactory from '../../common/AddressFactory';
import { useStyleStaking } from './Staking/useStyleStaking';
import { Alert, AlertTitle, Collapse } from "@mui/material";

interface adminData {
    autoSwap: boolean;
    buyTax: number;
    sellTax: number;
    founderPerc: number;
    collectedTaxes: string;
    swapThres: string;
    isPaused?: boolean;
    cashWallet: string;
    maxCost: string;
    cost: string;
}

interface AdminAction {
    title: string;
    type: string | null;
    toshowSetter: string | null;
    toshowSetter1?: string | null;
    toshowSetter2?: string | null;
    toshowSetter3?: string | null;
    toshowSetter4?: string | null;
    data?: any;
    setter: React.Dispatch<React.SetStateAction<string | null>>;
    setter1?: React.Dispatch<React.SetStateAction<string | null>>;
    setter2?: React.Dispatch<React.SetStateAction<string | null>>;
    setter3?: React.Dispatch<React.SetStateAction<string | null>>;
    setter4?: React.Dispatch<React.SetStateAction<string | null>>;
    submitFunction: () => Promise<IEtherContext>;
}

const AdminPanel: React.FC = () => {
    const [enableBL, setEnableBL] = useState<null | string>('write one addy per time');
    const [unpause, setUnpause] = useState<null | string>('Set boolean: true or false');
    const [pause, setPause] = useState<null | string>('Set boolean: true or false');
    const [disableBL, setDisableBL] = useState<null | string>('write one addy per time');
    const [tax, setBuyTax] = useState<null | string>('0');
    const [sell_tax, setSellTax] = useState<null | string>('0');
    const [swapTresh, setSwapTresh] = useState<null | string>('0');
    const [autoSwap, setAutoSwap] = useState<null | string>('Set boolean: true or false');
    const [esclude, setEsclude] = useState<null | string>('write one addy per time');
    const [rmv_esclude, setRmvEsclude] = useState<null | string>('write one addy per time');
    const [ms_l, setMSandL] = useState<null | string>('No input needed');
    const [cashWallet, setCashWallet] = useState<null | string>('Write Cash Wallet addy');
    const [maxSell, setMaxSell] = useState<null | string>('Write NFT max sell');
    const [receiver, setReceiver] = useState<null | string>('Write Addy receiver');
    const [amountToReceiver, setAmountToReceiver] = useState<null | string>('Write amount to receiver');
    const [maxCost, setMaxCost] = useState<null | string>('Write NFT max cost');
    const [cost, setCost] = useState<null | string>('Write NFT cost');
    const [stakingPause, setStakingPause] = useState<null | string>('Set boolean: true or false');
    const [staking_data_option, setStaking_data_option] = useState<null | string>('Set number vault: from 0 to max 3');
    const [vesting_data_unix, setVesting_data_unix] = useState<null | string>('Set number vesting time in unix');
    const [staking_apy_value, setStaking_apy_value] = useState<null | string>('Set number staking apy value');
    const [maxNft, setMaxNft] = useState<null | string>('Set number max nft');
    const [allData, setAllData] = useState<adminData>();
    const classes = useStyleStaking()
    const [alertInfo, setAlertInfo] = useState<{ severity: "success" | "error", message: string } | null>(null);
    const { context, saveContext } = useContext(EtherContext) as EtherContextRepository;
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        const getTax = async () => {
            const data = (await EtherHelper.Adm_get_data(context)) as adminData;
            setAllData(data);
        };
        getTax();
    }, [context]);

    function convertBool(value: any): boolean {
        const newValue = value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : false;

        return newValue
    }

    const handleFunctionChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        setter: React.Dispatch<SetStateAction<string | null>>,
        setter1?: React.Dispatch<SetStateAction<string | null>>,
        setter2?: React.Dispatch<SetStateAction<string | null>>,
        setter3?: React.Dispatch<SetStateAction<string | null>>,
        type?: any
    ) => {
        const newValue = event.target.value;
        console.log(`New value for setter: ${newValue}, type: ${type}`);
        setter(newValue);
        if (setter1) {
            setter1(newValue);
        }
        if (setter2) {
            setter2(newValue);
        }
        if (setter3) {
            setter3(newValue);
        }
    };

    interface IValue {
        value: string | number | boolean | null;
        value1?: string | number | boolean | null;
        value2?: string | number | boolean | null;
        value3?: string | number | boolean | null;
    }

    const handleSubmitWithContextAndValue = (title: string, submitFunction: () => Promise<IEtherContext>, value: IValue) => async () => {
        try {
            console.log(`Submitting ${title}: ${value}`);
            const updatedContext = await submitFunction();
            saveContext(updatedContext);
            if (updatedContext.toastStatus === 'success') {
                setAlertInfo({ severity: 'success', message: updatedContext.toastDescription ?? '' });
            } else {
                setAlertInfo({ severity: 'error', message: updatedContext.toastDescription ?? '' });
            }
            console.log(`${title} submitted successfully`);
        } catch (error: any) {
            console.error(`Error submitting for ${title}:`, error);
            setAlertInfo({ severity: 'error', message: JSON.stringify(error) });
        } finally {
            console.log(`Exiting handleSubmitWithContextAndValue for ${title}`);
        }
    };


    console.log("allData: ", allData);

    const adminActions: AdminAction[] = [
        { title: 'Unpause TRND', type: 'boolean', data: allData?.isPaused === false ? false : true, setter: setUnpause, toshowSetter: unpause, submitFunction: () => EtherHelper.Adm_Unpause_Token(context) },
        { title: 'Pause TRND', type: 'boolean', data: allData?.isPaused === true ? true : false, setter: setPause, toshowSetter: pause, submitFunction: () => EtherHelper.Adm_Pause_Token(context) },
        { title: 'Enable Blacklist', type: 'boolean', data: 'No GET data for this func', setter: setEnableBL, toshowSetter: enableBL, submitFunction: () => EtherHelper.Adm_Enable_Blacklist(enableBL?.toLocaleLowerCase() ?? '', context) },
        { title: 'Disable Blacklist', type: 'boolean', data: 'No GET data for this func', setter: setDisableBL, toshowSetter: disableBL, submitFunction: () => EtherHelper.Adm_Disable_Blacklist(disableBL?.toLocaleLowerCase() ?? '', context) },
        { title: 'Buy Tax', type: 'number', data: allData?.buyTax, setter: setBuyTax, toshowSetter: tax, submitFunction: () => EtherHelper.Adm_setBuy_TAX(Number(tax), context) },
        { title: 'Sell Tax', type: 'number', data: allData?.sellTax, setter: setSellTax, toshowSetter: sell_tax, submitFunction: () => EtherHelper.Adm_setSell_TAX(Number(sell_tax), context) },
        { title: 'Swap Treshold', type: 'number', data: allData?.swapThres, setter: setSwapTresh, toshowSetter: swapTresh, submitFunction: () => EtherHelper.Adm_setSwapTreshold(Number(swapTresh), context) },
        { title: 'Auto Swap', type: 'boolean', data: allData?.autoSwap, setter: setAutoSwap, toshowSetter: autoSwap, submitFunction: () => EtherHelper.Adm_autoSwap(convertBool(autoSwap), context) },
        { title: 'Manual Swap & Liquify', type: null, data: allData?.autoSwap === true ? 'false' : 'true', setter: setMSandL, toshowSetter: ms_l, submitFunction: () => EtherHelper.Adm_manualSwapAndLiquify(context) },
        { title: 'Esclude', type: 'string', data: 'No GET data for this func', setter: setEsclude, toshowSetter: esclude, submitFunction: () => EtherHelper.Adm_esclude(esclude ?? '', context) },
        { title: 'Remove Esclude', type: 'string', data: 'No GET data for this func', setter: setRmvEsclude, toshowSetter: rmv_esclude, submitFunction: () => EtherHelper.Adm_rmv_esclude(rmv_esclude ?? '', context) },
        { title: 'Staking Pause', type: 'boolean', data: allData?.isPaused, setter: setStakingPause, toshowSetter: stakingPause, submitFunction: () => EtherHelper.Adm_setStakingPause(stakingPause ?? 'false', context) },
        { title: 'FACT Cash Wallet', type: 'string', data: allData?.cashWallet, setter: setCashWallet, toshowSetter: cashWallet, submitFunction: () => EtherHelper.Adm_fact_setCashWallet(cashWallet ?? '', context) },
        { title: 'FACT Max Cost', type: 'number', data: allData?.maxCost, setter: setMaxCost, toshowSetter: maxCost, submitFunction: () => EtherHelper.Adm_fact_setMaxCost(maxCost ?? '', context) },
        { title: 'FACT Cost', type: 'number', data: allData?.cost, setter: setCost, toshowSetter: cost, submitFunction: () => EtherHelper.Adm_fact_setCost(cost ?? '', context) },
        { title: 'FACT Admin Mint', type: 'string', data: 'No GET data for this func', setter: setReceiver, setter1: setAmountToReceiver, toshowSetter: receiver, toshowSetter1: amountToReceiver, submitFunction: () => EtherHelper.Adm_fact_adminMint(amountToReceiver ?? '', receiver ?? '', context) },
        { title: 'Staking Option Data', type: 'number', data: 'No GET data for this func', setter: setStaking_data_option, setter1: setVesting_data_unix, setter2: setStaking_apy_value, setter3: setMaxNft, toshowSetter: staking_data_option, toshowSetter1: vesting_data_unix, toshowSetter2: staking_apy_value, toshowSetter3: maxNft, submitFunction: () => EtherHelper.Adm_setStakingOptionData(staking_data_option ?? '0', vesting_data_unix ?? '0', Number(staking_apy_value) ?? '', Number(maxNft) ?? '', context) },
    ];

    return (
        <div style={{ alignItems: 'center', marginBottom: 50, height: '100%' }}>
            <div>
                {context.addressSigner !== AddressFactory.getDeployerAddress(42161).toLocaleLowerCase() && context.addressSigner !== AddressFactory.getDeployerAddress(11155111).toLocaleLowerCase() && (
                    <Paper style={{ width: '100%' }} className={classes.paperAlert}>
                        <Alert
                            variant="outlined"
                            severity={"error"}
                        >
                            <AlertTitle>{"NO ENTRY — YOU ARE NOT PART OF THE DIVITREND TEAM AND IT IS NOT A RECOGNIZED WALLET "}</AlertTitle>
                        </Alert>
                    </Paper>
                )}
                <Collapse in={alertInfo !== null}>
                    <Paper style={{ width: '100%' }} className={classes.paperAlert}>
                        <Alert
                            onClose={() => {
                                setAlertInfo(null);
                                setShowOverlay(false);
                            }}
                            variant="outlined"
                            severity={alertInfo?.severity}
                        >
                            <AlertTitle>{alertInfo?.severity === "error" ? "Error" : "Success"}</AlertTitle>
                            {alertInfo?.message}
                        </Alert>
                    </Paper>
                </Collapse>
            </div>
            {/* Overlay */}
            {context.addressSigner !== AddressFactory.getDeployerAddress(context.chainId ?? 11155111).toLocaleLowerCase() && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        zIndex: 999,
                    }}
                />
            )}
            <AppBar color='transparent' position="sticky" style={{ marginTop: 50 }}>
                <Toolbar>
                    <Typography variant="h4" style={{ color: '#8500FF' }}>ADMIN PANEL</Typography>
                </Toolbar>
            </AppBar>


            <Grid container style={{ padding: 20 }} spacing={2} justify="center">
                {adminActions.map(({ title, setter, setter1, setter2, setter3, submitFunction, data, type, toshowSetter, toshowSetter1, toshowSetter2, toshowSetter3 }, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                        <Paper elevation={3} className={classes.paperAdmin} style={{ padding: '2rem', marginTop: '1rem' }}>
                            <form>
                                <div key={index} style={{ gap: 20 }}>
                                    <Typography style={{ color: '#A4FE66' }} variant="subtitle1">{title}</Typography>
                                    <Typography style={{ color: '#8500FF' }} variant="body2">Data: {String(data)}</Typography>
                                    <TextField
                                        label={
                                            <div style={{ fontSize: '18px', color: '#8B3EFF' }}>
                                                Enter {title}
                                            </div>
                                        }
                                        type="text"
                                        className={classes.customTextField}
                                        focused
                                        value={toshowSetter ?? ''}
                                        onChange={(event) => handleFunctionChange(event, setter)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    {setter1 && (
                                        <TextField
                                            label={<div style={{ fontSize: '18px', color: '#8B3EFF' }}>Enter data for {title}</div>}
                                            type="text"
                                            className={classes.customTextField}
                                            focused
                                            value={toshowSetter1 ?? ''}
                                            onChange={(event) => handleFunctionChange(event, setter1)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                    {setter2 && (
                                        <TextField
                                            label={<div style={{ fontSize: '18px', color: '#8B3EFF' }}>Enter data for {title}</div>}
                                            type="text"
                                            className={classes.customTextField}
                                            focused
                                            value={toshowSetter2 ?? ''}
                                            onChange={(event) => handleFunctionChange(event, setter2)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                    {setter3 && (
                                        <TextField
                                            label={<div style={{ fontSize: '18px', color: '#8B3EFF' }}>Enter data for {title}</div>}
                                            type="text"
                                            className={classes.customTextField}
                                            focused
                                            value={toshowSetter3 ?? ''}
                                            onChange={(event) => handleFunctionChange(event, setter3)}
                                            fullWidth
                                            margin="normal"
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        style={{ marginTop: '1rem' }}
                                        onClick={() => {
                                            const callbackFunction = handleSubmitWithContextAndValue(title, submitFunction, { value: toshowSetter ?? '', value1: toshowSetter1 ?? '', value2: toshowSetter2 ?? '', value3: toshowSetter3 ?? '' });
                                            callbackFunction();
                                        }}
                                    >
                                        Submit {title}
                                    </Button>
                                    <Divider style={{ marginBottom: '1rem', marginTop: '2rem', backgroundColor: "#A4FE66" }} />

                                </div>
                            </form>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default AdminPanel;
