import classNames from "classnames";
import { days, months } from "../constant";
import useDate from "../hooks/useDate";
import left from "../../../assets/arrow/left.svg";
import right from "../../../assets/arrow/right.svg";
import style from "../index.module.css";
import Image from "next/image";

interface ICal {
  checkedTimeStamp: number[]; // [11.07,11.08]  [1667750400, 1667836800]
}

const Cal = (props: ICal) => {
  const { month, inc, desc, date } = useDate();

  // 
  const activeMockDate = props.checkedTimeStamp?.map((day: number) => {
    const date = new Date(day * 1000);
    return {
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  });

  // 
  const dayCellClass = (month, day) => {
    const today = new Date().getDate();
    const monthNow = new Date().getMonth() + 1;
    return classNames([
      style.day,
      today === day && monthNow === month ? style.current : "",
      activeMockDate?.some((date) => date.day === day && date.month === month) // 
        ? style.active
        : "",
    ]);
  };
  return (
    <div className={style["calendar-wrapper"]}>
      <div className={style["top"]}>
        <div className={style["month"]}>{months[month - 1]}</div>
        <div className={style["actions"]}>
          <div className={style["left"]} onClick={desc}>
            <Image src={left} alt="" />
          </div>
          <div onClick={inc}>
            <Image src={right} alt="" />
          </div>
        </div>
      </div>
      <div className={style["days"]}>
        {days.map((day, idx) => (
          <div className={style["day"]} key={idx}>
            {day}
          </div>
        ))}
      </div>
      <div className={style["day-container"]}>
        {date.map((weeks, idx) => (
          <div className={style["line"]} key={idx}>
            {weeks.map((day, idx2) => (
              <div className={dayCellClass(month, day)} key={idx2}>
                {day}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cal;
