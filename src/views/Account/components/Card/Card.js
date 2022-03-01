import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { formatCurrency, formatNumber } from "../../../../helpers";
import { useTimer } from "../../hooks/useTimer";
import { useAppSelector } from "src/hooks";

export const Card = props => <Box className={`${props.className}`}>{props.children}</Box>;

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

Card.Secondary = props => (
  <Typography variant="h6" color="textSecondary">
    {props.children}
  </Typography>
);

Card.Left = props => (
  <Typography variant="h6" color="textSecondary" className="left">
    {props.children}
  </Typography>
);

Card.Right = props => (
  <Typography variant="h6" color="textSecondary" className="right">
    {props.children}
  </Typography>
);

export const APYCard = () => {
  const value = 222222;
  const roi = 2.0999;

  return (
    <Card className="nested-card">
      <Card.Title>APY</Card.Title>
      <Card.Value>{value && formatNumber(value, 2)}%</Card.Value>
      <Card.Secondary>Daily ROI {formatNumber(roi, 2)}%</Card.Secondary>
    </Card>
  );
};

export const YourBalanceCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  const isAccountLoading = useAppSelector(state => {
    return state.account && state.account.loading;
  });
  const balance = useAppSelector(state => {
    return state.account && state.account.balances.titano;
  });
  return (
    <Card className="nested-card">
      <Card.Title>Your Balance</Card.Title>
      <Card.Value>{!isAppLoading && !isAccountLoading && formatCurrency(balance * marketPrice, 2)}</Card.Value>
      <Card.Secondary>{formatNumber(balance, 2)} FIREFLY</Card.Secondary>
    </Card>
  );
};

export const NextRebaseCard = () => {
  const nextRebase = useTimer(1800 - (Math.floor(new Date().getTime() / 1000 - 1560) % 1800));
  return (
    <Card className="nested-card">
      <Card.Title>Next Rebase:</Card.Title>
      <Card.Value>{nextRebase && nextRebase}</Card.Value>
      <Card.Secondary>Interest Coming In Your Wallet</Card.Secondary>
    </Card>
  );
};

export const YourEarningsCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  const isAccountLoading = useAppSelector(state => {
    return state.account && state.account.loading;
  });
  const balance = useAppSelector(state => {
    return state.account && state.account.balances.titano;
  });
  return (
    <Card className="nested-card green">
      <Card.Title>Your Earnings/Daily</Card.Title>
      <Card.Value>
        {!isAppLoading && !isAccountLoading && formatCurrency(marketPrice * balance * 0.020999, 2)}
      </Card.Value>
      <Card.Secondary>{formatNumber(balance * 0.020999, 2)} FIREFLY</Card.Secondary>
    </Card>
  );
};

export const NextRewardAmountCard = () => {
  const isAccountLoading = useAppSelector(state => {
    return state.account && state.account.loading;
  });
  const balance = useAppSelector(state => {
    return state.account && state.account.balances.titano;
  });

  return (
    <Card className="long-card">
      <Card.Right>{!isAccountLoading && formatNumber(balance * 0.0004148125, 2)} FIREFLY</Card.Right>
      <Card.Left>Next Reward Amount</Card.Left>
    </Card>
  );
};

export const NextRewardAmountUSDCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  const isAccountLoading = useAppSelector(state => {
    return state.account && state.account.loading;
  });
  const balance = useAppSelector(state => {
    return state.account && state.account.balances.titano;
  });

  return (
    <Card className="long-card green">
      <Card.Right>
        {!isAppLoading && !isAccountLoading && formatCurrency(balance * marketPrice * 0.0004148125, 2)} USD
      </Card.Right>
      <Card.Left>Next Reward Amount USD</Card.Left>
    </Card>
  );
};

export const NextRewardYieldCard = () => {
  const value = 0.04148125;

  return (
    <Card className="long-card">
      <Card.Right>{value && formatNumber(value, 5)}%</Card.Right>
      <Card.Left>Next Reward Yield</Card.Left>
    </Card>
  );
};

export const ROICard = () => {
  const value = 11.24421;

  return (
    <Card className="long-card green">
      <Card.Right>{value && formatNumber(value, 2)}%</Card.Right>
      <Card.Left>ROI (5-Day Rate)</Card.Left>
    </Card>
  );
};

export const ROIUSDCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  const isAccountLoading = useAppSelector(state => {
    return state.account && state.account.loading;
  });
  const balance = useAppSelector(state => {
    return state.account && state.account.balances.titano;
  });

  return (
    <Card className="long-card green">
      <Card.Right>
        {!isAppLoading && !isAccountLoading && formatCurrency(balance * marketPrice * 0.020999*5, 2)} USD
      </Card.Right>
      <Card.Left>ROI (5-Day Rate) USD</Card.Left>
    </Card>
  );
};
