import React, { useEffect, useLayoutEffect, useState } from "react";
import ChainAvatar from "./ChainAvatar";
import EtherHelper from "../ethers/EtherHelper";
import { CircularProgress, useMediaQuery } from "@material-ui/core"; // Import CircularProgress
import { EtherContext } from "../ethers/EtherContext";
import { Flex, Text } from "@chakra-ui/react";
import { Button, makeStyles } from "@material-ui/core";
import { EtherContextRepository } from "../ethers/EtherContextRepository";

// @ts-ignore
const { ethereum } = window;

const useStyles = makeStyles({
    button: {
        background: "#111",
        border: "2px solid #8A00F6",
        borderRadius: 3,
        color: "white", //dark purple
        height: 48,
        padding: "0 0px",
        fontWeight: "bold",
        fontFamily: "Roboto",
        "&:hover": {
            background: "#8A00F6",
            color: "white",
        },
    },
});

const Connector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState<string | undefined>();
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { context, saveContext } = React.useContext(EtherContext) as EtherContextRepository;

    useLayoutEffect(() => {
        EtherHelper.connectErrorListener(onError);
        EtherHelper.connectAccountListener(onAccountsChanged);
        EtherHelper.connectChainListener(onChainChanged);

        return () => {
            EtherHelper.disconnectListeners();
        };
    }, [context.connected]);

    const ethlogo = '73.png';
    const divilogo = '77.png';

    useEffect(() => {
        if (context.balance) setBalance(`${context.balance.toFixed(2)}`);
    }, [context.balance, context.chainSymbol]);

    function onError(...args: any[]) {
        console.log("ERROR", args);
    }

    function onChainChanged(chainId: string) {
        if (!context.connected) return;
        window.location.reload();
    }

    function onAccountsChanged(accounts: string[]) {
        if (!context.connected) return;
        window.location.reload();
    }

    function connect() {
        if (!ethereum) return;
        if (context.connected ?? false) return;
        setLoading(true);
        EtherHelper.connect(context).then((ctx: any) => {
            console.log("Connector.EtherHelper.connect: ", ctx);
            saveContext(ctx);
            setLoading(false);
        });
    }

    function disconnect() {
        console.log("Connector.disconnect");
        setBalance(undefined);
        const resetCtx = { ...context, ...EtherHelper.initialAccount(), ...EtherHelper.initialToast() };
        EtherHelper.disconnect(resetCtx).then(saveContext);
    }

    return (
        <Flex alignItems={"center"}>
            {children}
            {isMobile ? '' : (
                balance ? (
                    <Text fontSize={{ base: "2x1" }} fontWeight={"bold"} mr={2} style={{ display: "flex", alignItems: "center", marginRight: 10, marginLeft: -10 }}>
                        <span style={{ marginBottom: -2 }}>0.00037</span>
                        <img src={divilogo} style={{ width: 18, height: 18, marginLeft: 5 }} alt="" />
                    </Text>
                ) : (
                    " "
                )
            )}
            {balance ? <Text fontSize={{ base: "2x1" }} fontWeight={"bold"} style={{ marginRight: 15, minWidth: isMobile ? 60 : 'auto' }}>{balance} <img src={ethlogo} style={{ width: 13, height: 13 }} alt="" /></Text> : " "}
            <Button
                variant="contained"
                disableElevation
                size="small"
                style={{ marginRight: "-20px", minWidth: 100 }}
                className={classes.button}
                onClick={context.connected ? disconnect : connect}
                disabled={loading}
            >
                {loading ? (
                    <CircularProgress size={20} style={{ color: '#8500FF' }} /> // Replaced with CircularProgress
                ) : (
                    <Text>{context.addressSigner !== undefined ? `${context.addressSigner.substring(0, 7)}...` : "CONNECT"}</Text>
                )}
            </Button>
        </Flex>
    );
};

export default Connector;
