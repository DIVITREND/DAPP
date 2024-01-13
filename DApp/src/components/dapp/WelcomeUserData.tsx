/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { EtherContext } from "../../ethers/EtherContext";
import EtherHelper from "../../ethers/EtherHelper";
import { NftStake } from "../../entities/IStaking";
import { EtherContextRepository } from "../../ethers/EtherContextRepository";
import { useTokenAttributeCalculator } from "./Staking/comp_modal/TokenAttributeCalculator";
import { Button, Grid } from "@material-ui/core";
import { useStyleStaking } from "./Staking/useStyleStaking";

interface IUser {
  tokenIdStaked: number[];
}

export const WelcomeUserData: React.FC<{ user?: IUser }> = ({ user }) => {
  const [selectedVesting, setVesting] = useState(3);
  const { context, saveContext } = useContext(EtherContext) as EtherContextRepository;
  const [alreadyStakedToFetch, setAlreadyStaked] = useState([] as number[]);
  const { totalApyBoost } = useTokenAttributeCalculator(alreadyStakedToFetch, context);
  const [userDeposit, setUserDeposit] = useState('0');
  const isMobile = window.innerWidth <= 768;
  const [tokenFactIds, setTokenFactIds] = useState<number[]>();
  const [maxTokenIdStaked, setMaxTokenIdStaked] = useState<number>(0);
  const classes = useStyleStaking();
  const [isLoading, setIsLoading] = useState(false);
  const claimable = context.trnd_to_claim ? Number(Number(context.trnd_to_claim).toFixed(0)).toLocaleString('en-US') : 0;

  const handleClickVesting = (vesting: number) => {
    setIsLoading(true);
    setVesting(vesting);
  };

  const stakingDataRew = async () => {
    try {
      const dataRew = await EtherHelper.STAKING_DATA_REW_TRND(selectedVesting, context);
      if (dataRew && dataRew.user_pending_time && dataRew.user_pending_trnd) {
        setUserDeposit(dataRew.user_pending_trnd.toFixed(2));
      }
    } catch (e) {
      console.log("error on stakingDataRew: ", e);
    }
  };

  const stakingPendingRew = async (vestingN: number) => {
    try {
      const ctx = await EtherHelper.STAKING_PENDING_REW(vestingN, context);
      saveContext(ctx);
    } catch (e) {
      console.log("error on stakingPendingRew: ", e);
    }
  };

  useEffect(() => {
    stakingPendingRew(selectedVesting);
  }, [selectedVesting]);

  const getAlreadyStaked = async () => {
    const alreadyStaked = await EtherHelper.STAKING_NFT_DATA_NOCTX(selectedVesting, context) as NftStake;
    return alreadyStaked;
  };

  useEffect(() => {
    getAlreadyStaked().then(async (alreadyStaked: NftStake) => {
      const staked = alreadyStaked.nft_staked_ids ?? [];
      const uri_staked = alreadyStaked.nft_staked_ids?.map(async (id: number) => {
        const uri = await EtherHelper.getTokenURI(context, id);
        return { uri, id };
      }) as { uri: { image: string, attributes: [{ trait_type: string, value: string }] }; id: number }[] | undefined;

      const promise_uri = await Promise.all(uri_staked ?? []);
      setAlreadyStaked(staked);
      return promise_uri;
    });
  }, [selectedVesting]);

  useEffect(() => {
    const maxTokenIdStaked = getMaxTokenIdStaked();
    setMaxTokenIdStaked(maxTokenIdStaked);
  }, [selectedVesting]);

  const getMaxTokenIdStaked = () => {
    switch (selectedVesting) {
      case 0:
        return 1;
      case 1:
        return 2;
      case 2:
        return 5;
      case 3:
        return 10;
      default:
        return 1;
    }
  };

  const vestingToMonths = [
    { vesting: 0, months: 3 },
    { vesting: 1, months: 6 },
    { vesting: 2, months: 12 },
    { vesting: 3, months: 24 }
  ];

  useEffect(() => {
    if (!context) return;
    if (context.connected === true) {
      handleClickVesting(0)
      setUserDeposit('0');
      stakingDataRew();
    }
  }, [selectedVesting]);

  useEffect(() => {
    if (!context) return;
    const getSignerInfo = async () => {
      if (context.connected === true) {
        const ctx = await EtherHelper.querySignerInfo(context);
        setTokenFactIds(ctx.FactoriesTokenIds ?? []);
      } else {
        setTokenFactIds([]);
      }
    };
    getSignerInfo();
  }, [selectedVesting]);

  const renderVestingButtons = () => {
    return vestingToMonths.map((vesting, index) => (
      <Button
        key={index}
        variant="text"
        style={{
          fontFamily: 'Open Sans',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: selectedVesting === vesting.vesting ? '#A4FE66' : '#8500FF',
        }}
        onClick={() => handleClickVesting(vesting.vesting)}
        className={classes.buttonMonths}
      >
        {vesting.months}
      </Button>
    ));
  };

  const renderStatsButtons = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: isMobile ? 1 : 10, padding: 10 }}>
        <div style={{ alignItems: 'center', color: 'A4FE66', gap: 2, fontSize: "12px" }}>
          <Button
            style={{
              backgroundImage: "url('52.png')",
              color: 'white',
              fontFamily: 'Open Sans',
              height: 10,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {userDeposit ? Number(Number(userDeposit).toFixed(0)).toLocaleString('en-US') : 0} <img src="78.png" alt="" style={{ width: 20, height: 20 }} />
          </Button>
          <p />
          STAKED
        </div>
        <div style={{ alignItems: 'center', color: 'A4FE66', gap: 2, fontSize: "12px" }}>
          <Button
            style={{
              backgroundImage: "url('52.png')",
              color: 'white',
              fontFamily: 'Open Sans',
              height: 10,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{


              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center'
            }}>
              {claimable}
              <img src="78.png" alt="" style={{ width: 20, height: 20 }} />
            </div>
          </Button>
          <p />
          CLAIMABLE
        </div>
        <div style={{ alignItems: 'center', color: 'A4FE66', gap: 2, fontSize: "12px" }}>
          <Button
            style={{
              backgroundImage: "url('52.png')",
              color: 'white',
              fontFamily: 'Open Sans',
              height: 10,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {alreadyStakedToFetch.length}
          </Button>
          <p />
          FACT
        </div>
        <div style={{ alignItems: 'center', color: 'A4FE66', gap: 2, fontSize: "12px" }}>
          <Button
            style={{
              backgroundImage: "url('52.png')",
              color: 'white',
              fontFamily: 'Open Sans',
              height: 10,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {totalApyBoost.toFixed(1)}%
          </Button>
          <p />
          {isMobile ? 'APY' : 'APY BOOST'}
        </div>
        <div style={{ alignItems: 'center', color: 'A4FE66', gap: 2, fontSize: "12px" }}>
          <Button
            style={{
              backgroundImage: "url('52.png')",
              color: 'white',
              fontFamily: 'Open Sans',
              height: 10,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {alreadyStakedToFetch.length > 0 || Number(userDeposit) > 0 ? 'ON' : 'OFF'}
          </Button>
          <p />
          ETH REV
        </div>
      </div>
    );
  };

  return (
    <Grid spacing={1}>
      <Grid item xs={12} sm={6} md={12}>
        <div style={{
          color: '#FFFFFF',
          backgroundPosition: 'center',
          backgroundClip: 'padding-box',
          textAlign: "center",
          padding: '10px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 0 }}>
            {renderVestingButtons()}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <div style={{
          color: '#FFFFFF',
          textAlign: "center",
          //border: '2px solid #8B3EFF',
          padding: isMobile ? 1 : '10px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          maxHeight: '40px',
          marginTop: isMobile ? 0 : -10,
          gap: isMobile ? 10 : 20
        }}>
          {renderStatsButtons()}
        </div>
      </Grid>
    </Grid>
  );
}
