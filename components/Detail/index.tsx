import React, { memo } from "react";
import { CampaignDetail, getCampaignDetail } from "../../utils/campaign";
import style from "./style.module.css";
import { shortenAddress, timeStampToPeriodLength } from "../../utils/convert";
import { useQuery } from "@tanstack/react-query";
import { packTokenAmount } from "../../utils/token";

function timeStampToDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

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
  const { data, isLoading } = useQuery<{ title: string; description: string }>(
    ["metadata", props.uri],
    () => {
      return getCampaignDetail(props.uri);
    },
    { retry: 10, enabled: !!props.uri }
  );

  return (
    <>
      <div className={style.title}>{data && data.title}</div>

      <div className={style.line}>
        <div>Starting Date</div>
        <div className={style.content}>
          {timeStampToDate(props.startTime * 1000)}
        </div>
      </div>
      <div className={style.line}>
        <div>Duration</div>
        <div className={style.content}>
          {timeStampToPeriodLength(props.totalTime)}
        </div>
      </div>

      <div className={style.line}>
        <div>Token</div>
        <div className={style.content}>
          {props.token && shortenAddress(props.token)}
        </div>
      </div>

      <div className={style.line}>
        <div>Stake</div>
        <div className={style.content}>
          {packTokenAmount(props.requiredAmount)} TSS
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

      <div className={style.desctitle}>Description</div>
      <div className={style.desc}>{data && data.description}</div>
    </>
  );
};
export default memo(Detail);
