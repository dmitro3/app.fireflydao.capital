import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { formatCurrency, formatNumber } from "../../../../helpers";
import { useAppSelector } from "src/hooks";

export const Card = props => <Box className={`card ${props.className}`}>{props.children}</Box>;

Card.Value = props => <Typography variant="h3">{props.children || <Skeleton type="text" />}</Typography>;

Card.Title = props => (
  <Typography variant="h6" color="textSecondary">
    {props.children}
  </Typography>
);

Card.Percent = props => (
  <Typography variant="h6" color="textSecondary" className={`percent ${props.children < 0 ? "negative" : ""}`}>
    {props.children < 0 ? "" : "+"}
    {formatNumber(props.children, 2)}%
  </Typography>
);

export const FIREFLYPriceCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  const marketPrice_24hr_change = useAppSelector(state => {
    return state.app && state.app.price_24hr_change;
  });
  return (
    <Card className="card">
      <Card.Percent>{!isAppLoading && marketPrice_24hr_change}</Card.Percent>
      <Card.Title>FIREFLY Price</Card.Title>
      <Card.Value>{!isAppLoading && formatCurrency(marketPrice, 4)}</Card.Value>
    </Card>
  );
};

export const RFVOfTreasuryAssetsCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const rfv = useAppSelector(state => {
    return state.app && state.app.treasuryRFV;
  });
  const pastRFV = 499301.62;
  return (
    <Card className="card">
      <Card.Percent>{!isAppLoading && (rfv - pastRFV) / pastRFV}</Card.Percent>
      <Card.Title>Risk Free Value Market Value</Card.Title>
      <Card.Value>{!isAppLoading && formatCurrency(rfv, 2)}</Card.Value>
    </Card>
  );
};

export const TotalLiquidityCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const totalLiquidity = useAppSelector(state => {
    return state.app && state.app.totalLiquidity;
  });
  const pastValue = 2397215.48;

  return (
    <Card className="card">
      <Card.Percent>{!isAppLoading && (totalLiquidity - pastValue) / pastValue}</Card.Percent>
      <Card.Title>DAI Liquidity Value</Card.Title>
      <Card.Value>{!isAppLoading && formatCurrency(totalLiquidity, 2)}</Card.Value>
    </Card>
  );
};

export const MarketValueCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const treasuryMarketValue = useAppSelector(state => {
    return state.app && state.app.treasuryMarketValue;
  });
  const pastValue = 728135.06;
  return (
    <Card className="card">
      <Card.Percent>{!isAppLoading && (treasuryMarketValue - pastValue) / pastValue}</Card.Percent>
      <Card.Title>Market Value Of Treasury Assets</Card.Title>
      <Card.Value>${!isAppLoading && formatNumber(treasuryMarketValue, 2)}</Card.Value>
    </Card>
  );
};
