import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { segmentUA } from "./helpers/userAnalyticHelpers";
import { shouldTriggerSafetyCheck } from "./helpers";
import { loadAppDetails } from "./slices/AppSlice";
import { loadAccountDetails } from "./slices/AccountSlice";
import { info } from "./slices/MessagesSlice";

import { TreasuryDashboard, Account, Calculator, NFT } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import Messages from "./components/Messages/Messages";
import NotFound from "./views/404/NotFound";
import { dark as darkTheme } from "./themes/dark.js";
import "./style.css";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { initializeNetwork, switchNetwork } from "./slices/NetworkSlice";
import { useAppSelector } from "./hooks";
import LoadingSplash from "./components/Loading/LoadingSplash";
import Claim from "./views/Claim/Claim";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  useSegmentAnalytics();
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const currentPath = location.pathname + location.search + location.hash;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { connect, hasCachedProvider, provider, connected, chainChanged } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);
  const networkId = useAppSelector(state => state.network.networkId);
  const isAppLoading = useAppSelector(state => state.app.loading);

  async function loadDetails(whichDetails: string) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with networkID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to networkID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setnetworkID equal to 4 before testing.
    let loadProvider = provider;

    if (connected) {
      if (whichDetails === "app") {
        loadApp(loadProvider);
      }

      if (whichDetails === "network") {
        initNetwork(loadProvider);
      }

      // don't run unless provider is a Wallet...
      if (whichDetails === "account" && address && connected && networkId != -1) {
        loadAccount(loadProvider);
      }
    }
  }

  const initNetwork = useCallback(
    loadProvider => {
      dispatch(initializeNetwork({ provider: loadProvider }));
    },
    [networkId],
  );

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider }));
    },
    [networkId],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: networkId, address, provider: loadProvider }));
    },
    [networkId],
  );

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true); 
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
      dispatch(info("Connect your wallet."));
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on app.fireflydao.capital!"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      loadDetails("network").then(() => {
        if (networkId !== -1) {
          loadDetails("account");
          loadDetails("app");
        }
      });
    }
  }, [walletChecked, chainChanged, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected) {
      if (networkId != 137) {
        dispatch(switchNetwork({ provider: provider, networkId: 137 }));
      } else {
        loadDetails("account");
      }
    }
  }, [connected]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode = darkTheme;

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      {isAppLoading && <LoadingSplash />}
      <TopBar handleDrawerToggle={handleDrawerToggle} />
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
        <Messages />
        <nav className={classes.drawer}>
          {isSmallerScreen ? (
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          ) : (
            <Sidebar />
          )}
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`} style={{ paddingTop: 64 }}>
          <Switch>
            <Route exact path="/dashboard">
              <TreasuryDashboard />
            </Route>

            <Route exact path="/account">
              <Account />
            </Route> 

            <Route exact path="/calculator">
              <Calculator />
            </Route>

            <Route exact path="/claim">
              <Claim />
            </Route>

            <Route exact path="/">
              <Redirect to="/dashboard" />
            </Route>

            <Route exact path="/nft">
              <NFT />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
