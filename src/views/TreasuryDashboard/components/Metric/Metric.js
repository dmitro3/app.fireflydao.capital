import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { formatCurrency, formatNumber } from "../../../../helpers";
import { useAppSelector } from "src/hooks";
import { useTimer } from "../../hooks/useTimer";

export const Metric = props => <Box className={`metric ${props.className}`}>{props.children}</Box>;

Metric.Value = props => <Typography variant="h5">{props.children || <Skeleton type="text" />}</Typography>;

Metric.Title = props => (
  <Typography variant="h6" color="textSecondary">
    {props.children}
  </Typography>
);

export const MarketCap = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketCap = useAppSelector(state => {
    return state.app && state.app.marketCap;
  });
  return (
    <Metric className="market">
      <Metric.Title>Market Cap</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(marketCap, 2)}</Metric.Value>
    </Metric>
  );
};

export const FIREFLYPrice = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = 20;
  return (
    <Metric className="price">
      <Metric.Title>Launch Price</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(marketPrice, 4)}</Metric.Value>
    </Metric>
  );
};

export const NextRebase = () => {
  const nextRebase = useTimer(1800 - (Math.floor(new Date().getTime() / 1000 - 1560) % 1800));
  const isRebaseStarted = useAppSelector(state => {
    return state.app && state.app.rebaseStarted;
  });

  return (
    <Metric className="price">
      <Metric.Title>Next Rebase</Metric.Title>
      <Metric.Value>{isRebaseStarted && nextRebase}</Metric.Value>
    </Metric>
  );
};

export const CircSupply = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const circSupply = useAppSelector(state => {
    return state.app && state.app.circSupply;
  });
  return (
    <Metric className="circ">
      <Metric.Title>Circulating Supply</Metric.Title>
      <Metric.Value>{!isAppLoading && formatNumber(circSupply)}</Metric.Value>
    </Metric>
  );
};

export const BackingPerFIREFLY = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const backingPerFIREFLY = useAppSelector(state => {
    return state.app && state.app.backingPerFIREFLY;
  });

  return (
    <Metric className="circ">
      <Metric.Title>Backed Liquidity</Metric.Title>
      <Metric.Value>{!isAppLoading && formatNumber(backingPerFIREFLY, 2)}%</Metric.Value>
    </Metric>
  );
};

export const AverageFIREFLYHolding = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const averageFIREFLYHolding = useAppSelector(state => {
    return state.app && state.app.averageFIREFLYHolding;
  });
  return (
    <Metric className="bpo">
      <Metric.Title>Average FIREFLY Holding</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(averageFIREFLYHolding, 2)}</Metric.Value>
    </Metric>
  );
};

export const FIREFLYPriceCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  return (
    <Metric className="price">
      <Metric.Title>FIREFLY Price</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(marketPrice, 2)}</Metric.Value>
    </Metric>
  );
};
