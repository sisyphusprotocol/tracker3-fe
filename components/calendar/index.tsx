import style from "./index.module.css";
import Cal from "./components/baseCalendar";
import Top from "./components/top";
import Info from "./components/info";
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
  nextToDo: "Claim" | "Check";
  checkedTimeStamp: number[];
};

export const Calendar = (props: ICalendar) => {
  return (
    <div className={style["wrapper-flex"]}>
      <Top />
      <Cal checkedTimeStamp={props.checkedTimeStamp} />
      {props.nextToDo === "Check" ? (
        <Info
          buttonContent={props.checked ? "" : "Go To Check"}
          onClick={props.onCheckClick}
        />
      ) : (
        <Info
          buttonContent={props.claimed ? "   Claimed" : "Claim"}
          onClick={props.onClaimClick}
        />
      )}
      {props.children}
    </div>
  );
};
