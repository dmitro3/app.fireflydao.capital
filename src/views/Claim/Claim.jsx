import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabPanel from "../../components/TabPanel";
import { changeApproval, changeClaim } from "../../slices/ClaimThunk";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
} from "@material-ui/core";
import { trim } from "../../helpers";
import "./claim.scss";
import { Skeleton } from "@material-ui/lab";
import { error, info } from "../../slices/MessagesSlice";
import { ethers, BigNumber } from "ethers";
import { addresses } from '../../constants';
import { abi as claimsABI } from "../../abi/AirdropClaims.json";

function Claim() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [quantity, setQuantity] = useState("");
  const [statusStr, setStatusStr] = useState(""); 
  const [paused, setPaused] = useState(true);


  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const claimBalance = useSelector(state => {
    return state.account.balances && state.account.balances.pool;
  });
  
  const onSeekApproval = async token => {
     dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };
  const claimAllowance = useSelector(state => {
    return state.account.claim && state.account.claim.claimAllowance;
  });
  
  const onChangeClaim = async action => { 
    console.log(action);
    dispatch(changeClaim({ address, action, value: "", provider, networkID: chainID }));
  };
  const hasAllowance = useCallback(
    token => {
      if (token === "FIREFLYV2") return claimAllowance > 0;
      return 0;
    },
    [claimAllowance],
  );
 

  const isAllowanceDataLoading = claimBalance == null;
 
  return (
    <div className="calculator-view">
      <Paper className={`ohm-card`}>
        <Grid container direction="column" alignItems="center" justifyContent="center" flexDirection="column">
          <Grid item>
            <div className="card-header">
              <Typography variant="h5">Claim</Typography>
            </div>
          </Grid> 
        <Grid item>
          <div className="stake-top-metrics" style={{ marginBottom: "18px" }}>
            {claimBalance && claimBalance.toNumber() ==0?
            <Typography className="presale-items">You do not have anything to Claim.</Typography> :
            <Typography className="presale-items">You can claim  {claimBalance && claimBalance.toNumber()} Airdrop tokens here.</Typography> 
            }
          </div>
        </Grid>
        {claimBalance && claimBalance.toNumber() >0?
         <Grid item >
          <div className="stake-top-metrics" style={{ whiteSpace: "normal" }}>
            <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
              {address && !isAllowanceDataLoading? (
                !hasAllowance("FIREFLYV2") ? (
                  <Box className="help-text">
                    <Typography variant="body1" className="presale-items" color="textSecondary">
                      <>
                        First time use <b>$FIREFLY</b>?
                        <br />
                        Please approve Firefly to allow you to claim $FIREFLY.
                      </>
                    </Typography>
                  </Box>
                ) : (
                  <Box>

                  </Box>
                )
              ) : (
                <Skeleton width="45%" />
              )}

              {isAllowanceDataLoading ? (
                <Skeleton width="45%" />
              ) : address && hasAllowance("FIREFLYV2") ? (
                <Box alignItems="center" justifyContent="center" flexDirection="column" display="flex">
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px" }}
                    disabled={isPendingTxn(pendingTransactions, "claim")}
                    onClick={() => {
                      onChangeClaim("claim");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "claim", "Claim")}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Button
                    className="stake-button"
                    variant="contained"
                    color="primary"
                    disabled={isPendingTxn(pendingTransactions, "approve_claim")}
                    onClick={() => {
                      onSeekApproval("FIREFLYV2");
                    }}
                  >
                    {txnButtonText(pendingTransactions, "approve_claim", "Approve")}
                  </Button>
                </Box>
              )}
            </Box>
          </div>
        </Grid> :
          ''
                  }
        </Grid> 
      </Paper> 
    </div>
    
  );
}

export default Claim;
