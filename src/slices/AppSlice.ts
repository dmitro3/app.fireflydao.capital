import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as fireflyAbi } from "../abi/FIREFLYV2.json";

import { setAll, getTokenPrice } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { IERC20 } from "src/typechain";
import axios from "axios";

const firefly_address = "0xe4CF872aDa5077A0fE4eF4210E800a38B7C0C28b";
const DAI_address = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";

const getDAIBalance = async (address: string) => {
  let balance = 0;
  try {
    const res = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/balance?chain=0x89`, {
      headers: {
        accept: "application/json",
        "X-API-Key": "nt7iGNZbNrRtx0VEYMbmzgCPtV1Tve0o6iUP70D5vQB4raJbxpRHTN9ztwazERps",
      },
    });
    balance = parseFloat(ethers.utils.formatEther(res.data.balance));
  } catch (error) {
    console.log("err: ", error);
  }
  return balance;
};

const getBalance = async (contract_address: string, address: string) => {
  let balance = 0;
  const apiKey = "J43NMWFRU4FFDE9IRE2RWE1D7J3ZBYTAIT";
  try {
    const res = await axios.get(
      `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${contract_address}&address=${address}&tag=latest&apikey=${apiKey}`,
    );
    balance = parseFloat(ethers.utils.formatEther(res.data.result));
  } catch (error) {
    console.log("err: ", error);
  }
  return balance;
};

const getHolders = async (address: string) => {
  let holders = 0;
  try {
    const res = await axios.get(
      `https://api.covalenthq.com/v1/137/tokens/${address}/token_holders/?quote-currency=USD&format=JSON&page-size=1000000&key=ckey_0b02a76db9bb4809a54aa41972b`,
    );
    holders = res.data.data.items.length;
  } catch (error) {
    console.log("err: ", error);
  }
  return holders;
};

const getMarketPrice = async (tokenId: string) => {
  let marketPrice = {
    usd: 0,
    usd_24h_change: 0,
  };
  try {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true`,
    );
    marketPrice = res.data[tokenId];
  } catch (error) {
    console.log("err: ", error);
  }
  return marketPrice;
  
};

const getDAIPrice = async () => {
  let price = 0;
  try {
    const res = await axios.get(
      "https://deep-index.moralis.io/api/v2/erc20/0x8f3cf7ad23cd3cadbd9735aff958023239c6a063/price?chain=0x89",
      {
        headers: {
          accept: "application/json",
          "X-API-Key": "nt7iGNZbNrRtx0VEYMbmzgCPtV1Tve0o6iUP70D5vQB4raJbxpRHTN9ztwazERps",
        },
      },
    );
    let usdPrice = res.data.usdPrice;
    let nativePrice = parseFloat(ethers.utils.formatEther(res.data.nativePrice.value));
    price = usdPrice / nativePrice;
  } catch (error) {
    console.log("err: ", error);
  }
  return price;
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(loadMarketPrice()).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    marketPrice= 19.819;
    const { usd_24h_change: price_24hr_change } = await getMarketPrice("titano");

    console.log('Treasury Balance '+price_24hr_change);

    const fireflyContract = new ethers.Contract(
      addresses[networkID].TOKEN_ADDRESS as string,
      fireflyAbi,
      provider,
    ) as IERC20;
    let res = await fireflyContract.totalSupply();

    let rebaseStarted = false;

    console.log('totalSupply Balance '+res);


    let totalSupply = parseFloat(ethers.utils.formatEther(res));
    let circSupply = (totalSupply / 100);

    //circulating supply = totalSupply 
    const marketCap = circSupply * marketPrice;

    console.log('marketCap Balance '+marketCap);


    const daiContract = new ethers.Contract(
      addresses[networkID].DAI_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;


    const daiPrice = await getDAIPrice();
    const { usd: wdaiPrice } = await getMarketPrice("dai");

    console.log('daiPrice Balance '+wdaiPrice);


    const addr_treasury = "0xA7dEF2DF5e70aC66Ab414B958F4dc70Bce49e2bf"; // Treasury
    const addr_rfv = "0x723CAD7fceAD7BfE60ed3e53ff6b2696FdF026A2"; // RFV
    const addr_pair = "0x37e5c39d32306f51c441bab172292b5deb01ff24"; // Pair Contract
    const treasury_bal = await daiContract.balanceOf(addr_treasury);
    let treasury_dai_amount = parseFloat(ethers.utils.formatEther(treasury_bal));

    console.log('treasury_dai_amount Balance '+treasury_dai_amount);


   
    const rfv_dai_amount = await getDAIBalance(addr_rfv);

    console.log('rfv_dai_amount Balance '+rfv_dai_amount);


    const rfv_amount = await getBalance(firefly_address, addr_rfv);

    console.log('rfv_amount Balance '+rfv_amount);


    const pair = await getBalance(DAI_address, addr_pair);

    console.log('pair Balance '+pair);


    const backingPerFIREFLY = (((treasury_dai_amount + rfv_dai_amount) * daiPrice) / (pair * wdaiPrice)) * 100;

    console.log('backingPerFIREFLY Balance '+backingPerFIREFLY);


    const holders = await getHolders(firefly_address);

    console.log('holders '+holders);


    const averageFIREFLYHolding = (circSupply * marketPrice) / (holders - 4);

    console.log('averageFIREFLYHolding '+averageFIREFLYHolding);


    const treasuryRFV = rfv_amount * marketPrice + rfv_dai_amount * daiPrice;
    const totalLiquidity = pair * wdaiPrice;

    console.log('totalLiquidity '+totalLiquidity);


    const treasury_t = await getBalance(firefly_address, addr_treasury);
    const treasuryMarketValue =
      (treasury_t + rfv_amount) * marketPrice + (treasury_dai_amount + rfv_dai_amount) * daiPrice;

      console.log('treasuryMarketValue '+treasuryMarketValue);


    return {
      marketCap,
      marketPrice,
      price_24hr_change,
      circSupply,
      totalSupply,
      treasuryMarketValue,
      backingPerFIREFLY,
      averageFIREFLYHolding,
      treasuryRFV,
      totalLiquidity,
      rebaseStarted
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(loadMarketPrice()).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async () => {
  let marketPrice: number;
  try {
    marketPrice = await getTokenPrice("titano");
  } catch (e) {
    marketPrice = await getTokenPrice("titano");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly rebaseStarted: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly price_24hr_change?: number;
  readonly totalSupply?: number;
  readonly treasuryRFV?: number;
  readonly treasuryMarketValue?: number;
  readonly totalLiquidity?: number;
  readonly backingPerFIREFLY?: number;
  readonly averageFIREFLYHolding?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
  rebaseStarted:false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
