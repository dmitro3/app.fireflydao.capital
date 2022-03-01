import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import titanoABI from "../abi/FIREFLYV2.json";
import claimsABI from "../abi/AirdropClaims.json";

import { setAll } from "../helpers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk } from "./interfaces";
import { IERC20 } from "src/typechain";

interface IUserBalances {
  balances: {
    titano: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let titanoBalance = BigNumber.from("0");
    let poolBalance = BigNumber.from("0");

    if (address) {
      try {
        const titanoContract = new ethers.Contract(
          addresses[networkID].TITANO_ADDRESS as string,
          titanoABI.abi,
          provider,
        ) as IERC20;
        titanoBalance = await titanoContract.balanceOf(address);


        const claimsContract = new ethers.Contract(
          addresses[networkID].CLAIMS_ADDRESS as string,
          claimsABI.abi,
          provider,
        ) ;
        poolBalance = await claimsContract.claims(address);


       
      } catch (e) {
        console.warn("caught error in getBalances", e);
      }
    }

    return {
      balances: {
        titano: ethers.utils.formatEther(titanoBalance),
        pool: poolBalance,
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let poolAllowance = BigNumber.from("0");
    if (address) {
      try {
        const titanoContract = new ethers.Contract(addresses[networkID].TITANO_ADDRESS as string, titanoABI.abi, provider);
        poolAllowance = await titanoContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      } catch (e) {
        console.warn("failed contract calls in slice", e);
      }
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      pooling: {
        titanoPool: +poolAllowance,
      },
    };
  },
);

interface IAccountSlice extends IUserBalances {
  balances: {
    titano: string;
    pool: string;
  };
  loading: boolean;
  pooling: {
    titanoPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: true,
  balances: {
    titano: "",
    pool: "",
  },
  pooling: { titanoPool: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
