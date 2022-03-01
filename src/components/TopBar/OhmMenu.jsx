import { useState } from "react";
import { addresses } from "../../constants";
import { NavLink } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
 import titanoImg from "src/assets/logo.png";
 import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath = titanoImg;
    let tokenDecimals = 18;
    const imageURL = `${host}/${tokenPath}`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);

  // const OHM_ADDRESS = addresses[networkId] && addresses[networkId].OHM_ADDRESS;
  const TOKEN_ADDRESS = addresses[networkId] && addresses[networkId].TOKEN_ADDRESS;
 
  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  return (
    <Grid
      container
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="secondary"
        title="FIREFLY"
        aria-describedby={id}
      >
        <SvgIcon component={InfoIcon} color="primary" />
        <Typography className="ohm-menu-button-text">FIREFLY</Typography>
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box component="div" className="buy-tokens">
                  <Link
                    href={`https://app.uniswap.org/#/swap?chain=polygon`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Buy on Uniswap V3
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>

                  <Link
                    href={`https://www.dextools.io/app/polygon/pair-explorer/0x37e5c39d32306f51c441bab172292b5deb01ff24`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="large" variant="contained" color="secondary" fullWidth>
                      <Typography align="left">
                        Chart
                        <SvgIcon component={ArrowUpIcon} htmlColor="#A3A3A3" />
                      </Typography>
                    </Button>
                  </Link>
                </Box>

                {isEthereumAPIAvailable ? (
                  <Box className="add-tokens">
                    <Divider color="secondary" />
                    <p>ADD TOKEN TO WALLET</p>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      {TOKEN_ADDRESS && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={addTokenToWallet("FIREFLY", TOKEN_ADDRESS, address)}
                        >

                    <img src={titanoImg} alt="" style={{ width: "32px" }} />
                           
                          <Typography variant="body1">FIREFLY</Typography>
                        </Button>
                      )}
                    </Box>
                  </Box>
                ) : null}
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </Grid>
  );
}

export default OhmMenu;
