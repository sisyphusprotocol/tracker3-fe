import style from "../index.module.css";
import { days } from "../constant";

interface IInfo {
  buttonContent?: string;
  onClick?: () => void;
}
const Info = (props: IInfo) => {
  const date = new Date();
  const weekday = date.getDay();
  const day = date.getDate();
  return (
    <>
      <div className={style["info-wrapper"]}>
        <div className={style["left-date"]}>
          <div className={style["info-weekday"]}>{day}</div>
          <div className={style["info-day"]}>{days[weekday - 1]}</div>
        </div>
        <div className={style["right-info"]}>
          <p>You have a plan today!</p>
          <p className={style["info"]}>
            Please arrange your time reasonably and do not forget
          </p>
        </div>
      </div>
      <div onClick={props.onClick} className={style["button"]}>
        {props.buttonContent}
      </div>
    </>
  );
};
export default Info;
