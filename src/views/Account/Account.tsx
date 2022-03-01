import { memo } from "react";
 import { QueryClient, QueryClientProvider } from "react-query";
import { Grid, Zoom, Container, useMediaQuery } from "@material-ui/core";
import {
  APYCard,
  YourBalanceCard,
  NextRebaseCard,
  YourEarningsCard,
  NextRewardAmountCard,
  NextRewardAmountUSDCard,
  NextRewardYieldCard,
  ROICard,
  ROIUSDCard,
} from "./components/Card/Card";

const Account = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Zoom in={true}>
          <Grid container spacing={6} className="data-grid nesting">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <APYCard />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} className="nested">
              <YourBalanceCard />
            </Grid>
          </Grid>
        </Zoom>
        <Zoom in={true}>
          <Grid container spacing={6} className="data-grid nesting">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <NextRebaseCard />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} className="nested">
              <YourEarningsCard />
            </Grid>
          </Grid>
        </Zoom>
        <Zoom in={true}>
          <Grid container spacing={6} className="data-grid nesting">
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <NextRewardAmountCard />
              <NextRewardAmountUSDCard />
              <NextRewardYieldCard />
              <ROICard />
              <ROIUSDCard />
            </Grid>
          </Grid>
        </Zoom>
      </Container>
    </div>
  );
});

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <Account />
  </QueryClientProvider>
);
