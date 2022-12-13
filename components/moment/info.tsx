import Avatar from "react-nice-avatar";
import { now, shortenAddress } from "../../utils/convert";
import style from "./index.module.css";

function timeToNowString(timestamp: number): string {
  const diff = now() - timestamp;
  if (diff < 0) {
    return "";
  } else if (diff < 60) {
    return diff.toString() + " seconds ago";
  } else if (diff < 3600) {
    return Math.floor(diff / 60).toString() + " minutes ago";
  } else if (diff < 86400) {
    return Math.floor(diff / 3600).toString() + " hours ago";
  } else {
    return Math.floor(diff / 86400).toString() + " days ago";
  }
}

// Info
const CardTop = ({
  title,
  userAddr,
  current,
  total,
  timestamp,
  onClick = () => {},
}) => {
  return (
    <div className={style["card-top"]} onClick={onClick}>
      <Avatar style={{ width: ".35rem", height: ".35rem" }} />
      <div className={style["card-info"]}>
        <div className={style["card-info-id"]}>{shortenAddress(userAddr)}</div>
        <div className={style["card-info-other"]}>
          {title} ({current}/{total}) {timeToNowString(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default CardTop;
