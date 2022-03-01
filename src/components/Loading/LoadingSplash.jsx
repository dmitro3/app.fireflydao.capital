import { Backdrop, Container  } from "@material-ui/core";
 import LogoImg from '../../assets/logo.png'
import {  Typography } from "@material-ui/core";


function LoadingSplash() {
  return (
    <Backdrop open={true} className="loading-splash" style={{ zIndex: 33, backdropFilter: "blur(33px)" }}>
      <Container justify="center" align="center">
          <img src={LogoImg} alt="" style={{ width: "250px" }} />
          <Typography variant="h3">
                 
                  LOADING ......
                </Typography>
      </Container>
    </Backdrop>
  );
}

export default LoadingSplash;
