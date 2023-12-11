import React, { ReactNode, useEffect } from "react";
import EtherHelper from "./EtherHelper";
import { EtherContext } from "./EtherContext";
import { IEtherContext } from "./IEtherContext";
import { Typography, Link, Box } from "@mui/material";
import { useToast, Text } from '@chakra-ui/react'

const EtherProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const toast = useToast();
    const [context, setContext] = React.useState<IEtherContext>({loaded: false, reload: true});

    const saveContext = (context: IEtherContext) => {
      setContext(context);
    };

    useEffect(() => {
      // bind listeners
      EtherHelper.connectErrorListener(onError);//TODO move to toast

      //init first time
      EtherHelper.queryProviderInfo(context).then(c => saveContext({...c, loaded: true, connected: false}));

      return () => {// unmount
        EtherHelper.disconnectListeners();
      }
    }, []);

    function onError(e:string){
      console.log("EtherProvider.error: ", e)
    }

    function getToastDescription():ReactNode{
      return (
        <>
          <Text>{context.toastDescription}</Text>
          {/* {
            context.toastLink
              ?
                <Link gap={2} href={context.toastLink.url} isExternal={true}>
                  {context.toastLink.name} <ExternalLinkIcon mx={2} mb={1} />
                </Link>
              : <></>
          } */}
        </>
      );
    }

    useEffect(()=>{
      if (context.toastId && !toast.isActive(context.toastId)){ // && context.showToast) {
        toast({
          id: context.toastId,
          title: context.toastTitle ?? '',
          description: getToastDescription() ?? <></>,
          status: context.toastStatus ?? 'success',
          duration: 9000,
          isClosable: true,
        })
      }

    }, [context.toastId]);

    return <EtherContext.Provider value={{context, saveContext}}>{children}</EtherContext.Provider>;
  };

  export default EtherProvider;
