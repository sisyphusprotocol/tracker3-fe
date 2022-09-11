import { useState } from "react";
import style from "./index.module.css";

export declare type ICalendar = {
  children?: React.ReactNode;
  className?: any;
  options?: { day: number; text: string }[];
  dayLength?: number;
  checked?: boolean;
  claimed?: boolean;
  timeToClaim?: boolean;
  onCheckClick?: () => void;
  onClaimClick?: () => void;
};

export const Calendar = (props: ICalendar) => {
  const [isActive, setIsActive] = useState(
    new Array(props.options.length).fill(false)
  );
  const toggle = (index) => {
    const arr = [...isActive];
    arr[index] = !arr[index];
    setIsActive(arr);
  };

  return (
    <div className={style["bg"]}>
      <div className={style["wrapper-flex"]}>
        <div className={style["top-nav"]}>
          <div className={style["top-nav-left"]}>Frequency</div>
          <div className={style["top-nav-right"]}>everyday</div>
        </div>
        <div className={style["title"]}>LeaderBoard</div>
        <div className={style["cycle"]}>
          <div className={style["day"]}>{props.dayLength || 0}</div>
          <div className={style["day-label"]}>DAYS</div>
        </div>
        <div className={style["calendar"]}>
          {props.options.map((item, index) => (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  key={index}
                  className={style["choose-day"]}
                  style={
                    isActive[index]
                      ? { height: ".49rem", background: "#9E6DFB" }
                      : { height: ".3rem", background: "#7F8187" }
                  }
                  onClick={() => toggle(index)}
                >
                  {item.day}
                  <div className={style["choost-info"]}>{item.text}</div>
                </div>
              </div>
            </>
          ))}
        </div>
        <div className={style["info-card"]}>
          {props.checked ? (
            <div className={style["check-yes"]} />
          ) : (
            <div className={style["check-no"]} />
          )}
          <div onClick={props.onCheckClick} className={style["check-info"]}>
            Check
          </div>
        </div>
        <div
          className={style["info-card"]}
          style={props.timeToClaim ? {} : { display: "none" }}
        >
          {props.claimed ? (
            <div className={style["check-yes"]} />
          ) : (
            <div className={style["check-no"]} />
          )}
          <div onClick={props.onClaimClick} className={style["check-info"]}>
            Claim
          </div>
        </div>
      </div>
    </div>
  );
};
