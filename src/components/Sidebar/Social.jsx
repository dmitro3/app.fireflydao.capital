import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";

export default function Social() {
  return (
    <div className="social-row"> 

      <Link href="https://fireflycapital.medium.com/" target="_blank">
        <SvgIcon color="primary" component={Medium} />
      </Link>

      <Link href="https://twitter.com/fireflydaoc" target="_blank">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

      <Link href="https://discord.gg/9nKPFw94" target="_blank">
        <SvgIcon color="primary" component={Discord} />
      </Link>
    </div>
  );
}
