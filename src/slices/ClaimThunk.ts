import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
 
import { abi as tokenABI } from "../abi/FIREFLYV2.json";
import { abi as claimsABI } from "../abi/AirdropClaims.json";

import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
 
interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, claimAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "FIREFLYV2") {
    applicableAllowance = claimAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "claim/changeApproval",
  async ({ address, token, provider, networkID  }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const id: number = await provider.getNetwork().then(network => network.chainId);

    console.log(id)
    console.log(tokenABI)

    const signer = provider.getSigner();
    const pillContract = new ethers.Contract(addresses[id].TOKEN_ADDRESS, tokenABI, signer);

    console.log(pillContract)


    let approveTx;
    let claimAllowance = await pillContract.allowance(address, addresses[id].CLAIMS_ADDRESS);
   
    console.log(claimAllowance);


    // return early if approval has already happened
    if (alreadyApprovedToken(token, claimAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          claim: {
            claimAllowance: +claimAllowance,
          },
        }),
      );
    }

     try {
      if (token === "FIREFLYV2") {
        // won't run if stakeAllowance > 0
        approveTx = await pillContract.approve(
          addresses[id].CLAIMS_ADDRESS,
          "100000000000000000000000000000000",
        );
      }
      console.log(approveTx);
      
      const text = "Approve FIREFLY";
      const pendingTxnType = "approve_claim";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    claimAllowance = await pillContract.allowance(address, addresses[networkID].CLAIMS_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        claim: {
          claimAllowance: +claimAllowance,
        },
      }),
    );
  },
);

export const changeClaim = createAsyncThunk(
  "claim/changeClaim",
  async ({ address, action, value, provider, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const id: number = await provider.getNetwork().then(network => network.chainId);

    console.log(action);

    const signer = provider.getSigner();

    console.log(addresses[id]);

    const claimsContract = new ethers.Contract(addresses[id].CLAIMS_ADDRESS, claimsABI, signer);

    console.log(claimsContract);

    let claimTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      uaData.type = "claim";
      console.log("claiming......");
       console.log(address);
      claimTx = await claimsContract.claim();
      const pendingTxnType = "claiming";
      uaData.txHash = claimTx.hash;
      dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text: "Claiming...", type: pendingTxnType }));
      await claimTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to claim more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (claimTx) {
        // segmentUA(uaData);

        dispatch(clearPendingTxn(claimTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
