import { memo } from "react";
import style from "./style.module.css";
import { shortenAddress, timeStampToPeriodLength } from "../../utils/convert";
import { packTokenAmountToFix } from "../../utils/token";
import { TokenMap } from "../../contracts/contants";
import { useCampaignDetails } from "../../hooks/useCampaignRead";
import { dayjs } from "../../utils/dayjs";
import line from "./line.svg";
import Image from "next/image";

export declare type IDetail = {
  id: string;
  uri: string;
  startTime: number;
  totalTime: number;
  token: string;
  requiredAmount: string;
  memberCount: number;
};

const Detail = (props: IDetail) => {
  const { data } = useCampaignDetails(props?.id);

  return (
    <div className="flex flex-col">
      <div className={style.title}>{data?.title || "Loading..."}</div>

      <div className={style.line}>
        <div>Starting Date:</div>
        <div className={style.content}>
          {dayjs.unix(props.startTime).format("MMM Do(ha z)")}
        </div>
      </div>
      <div className={style.line}>
        <div>Total:</div>
        <div className={style.content}>
          {timeStampToPeriodLength(props.totalTime)}
        </div>
      </div>

      <div className={style.line}>
        <div>Stake:</div>
        <div className={style.content}>
          {packTokenAmountToFix(props.requiredAmount)} {TokenMap[props?.token]}
        </div>
      </div>

      <div className={style.line}>
        <div>Address</div>
        <div className={style.content}>
          {props.token && shortenAddress(props.id)}
        </div>
      </div>

      <div className={style.line}>
        <div>Member</div>
        <div className={style.content}>{props.memberCount}</div>
      </div>
      <div className="relative self-center w-11  mt-2 mb-1 h-0">
        <Image sizes="fill" src={line} alt=""></Image>
      </div>
      <div className={style.desctitle}>Description</div>
      <div className={style.desc}>{data?.description || "loading..."}</div>
    </div>
  );
};
export default memo(Detail);
