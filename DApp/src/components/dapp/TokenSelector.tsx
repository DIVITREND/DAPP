import React, { Dispatch, useState, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  Box,
  InputAdornment,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export interface IAsset {
  dex?: string;
  name: string;
  logo: string;
  symbol: string;
  address?: string;
  disabled?: boolean;
}

const TokenSelector: React.FC<{ assets: IAsset[]; disabled: boolean; onChange: Dispatch<IAsset> }> = ({
  assets,
  disabled,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [asset, setAsset] = useState(assets[0]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Aggiungi questo useEffect per aggiornare l'asset selezionato quando cambia la lista di asset
  useEffect(() => {
    setAsset(assets[0]);
  }, [assets]);

  return (
    <>
      <Button
        size="large"
        style={{ width: 120, color: 'white',  border: '2px solid #8B3EFF', background: 'rgba(0,0,0, 0.5)', borderRadius: "20px" }}
        variant="outlined"
        disabled={disabled}
        onClick={handleOpen}
        endIcon={<ArrowDropDownIcon />}
      >
        <img src={asset.logo} alt="" style={{width: 20, height: 20, marginRight: 5}}/>{asset.symbol}
      </Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isOpen}
        onClick={handleClose}
      >
        <Box style={{background: '#8500FF', minWidth: 420, minHeight: 300, overflowY: 'auto', scrollbarWidth: 'thin' ,gap: 20, scrollbarColor: '#8B3EFF transparent', border: '2px solid #A4FE66', borderRadius: 25 }}>
          <Divider />
          <Box>
            <Grid container direction="column" spacing={1}>
              {assets.map((asset, key) => (
                <Button
                  key={asset.address || key}
                  onClick={() => {
                    setAsset(asset);
                    onChange(asset);
                    handleClose();
                  }}
                  disabled={asset.disabled || false}
                  startIcon={<img src={asset.logo} alt={asset.name} width={30} />}
                  style={{ justifyContent: 'flex-start', width: '100%', marginTop: 10 }}
                >
                  <Typography variant="body1" style={{}}>
                    {`${asset.name} - ${asset.symbol}`}
                  </Typography>
                </Button>
              ))}
            </Grid>
          </Box>
        </Box>
      </Backdrop>
    </>
  );
};

export default TokenSelector;
