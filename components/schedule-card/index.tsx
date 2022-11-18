import styles from "./index.module.css";
import Image from "next/image";
import achievement from "../../assets/createPlane/achievement.png";
import failure from "./images/w.png";
import * as React from "react";
import Progress from "../../components/progress/index";
import Tag from "../tag";
import { useQuery } from "@tanstack/react-query";
import { getCampaignDetail } from "../../utils/campaign";
import moment from "moment";
import { packTokenAmount, packTokenAmountToFix } from "../../utils/token";
import { TokenMap } from "../../contracts/contants";
import { useRouter } from "next/router";

interface IScheduleCard {
  type?: "ongoing" | "notStarted" | "created" | undefined; // type
  notStartText?: string;
  notStartTag?: string;
  scheduleName?: string; // Fitness schedule 
  lastingDays: number; // 14
  lastingDaysTag?: React.ReactNode; //  14 daystag failure
  isFinish: boolean; //  
  // counts?: string; // 20 USDC
  progressCurrent?: number;
  progressSchedule?: number;
  // campaign contract address
  address?: string;
  // ipfs uri,  ipfs 
  uri: string;
  // start timestamp
  startTime?: number;
  // end timestamp
  endTime?: number;
  // token address string
  token?: string;
  // token Amount in hex string
  tokenAmount?: string;

  periodLength?: number;

  userStatus?: "Signed" | "Admitted";
}

function formatPeriodLength(periodLength: number) {
  if (periodLength === 1) {
    return "s";
  } else if (periodLength === 10) {
    return "10s";
  } else if (periodLength === 300) {
    return "5mins";
  } else if (periodLength === 86400) {
    return "days";
  }
  return "days";
}

function ScheduleCard(props: IScheduleCard) {
  const router = useRouter();

  const { data } = useQuery<{ title: string; description: string }>(
    ["metadata", props.uri],
    () => {
      return getCampaignDetail(props.uri);
    },
    { retry: 10, enabled: !!props.uri }
  );

  return (
    <div className={styles.wrapper}>
      <div
        onClick={() => {
          router.push(`/plan/${props.address}`);
        }}
        className={styles["name"]}
      >
        {data?.title || "Loading..."}
      </div>
      <div className={styles["img-icon"]}>
        {props.isFinish ? (
          <Image
            alt=""
            src={achievement}
            className={styles["img-icon"]}
          ></Image>
        ) : (
          <Image alt="" src={failure} className={styles["img-icon"]}></Image>
        )}
      </div>
      <div className={styles["lasting-days"]}>
        {props.lastingDays} {formatPeriodLength(Number(props.periodLength))}{" "}
        {moment.unix(props?.startTime).format("MM.DD")}
        {" - "}
        {moment.unix(props?.endTime).format("MM.DD")}
        {props?.lastingDaysTag}
      </div>

      {(() => {
        switch (props.type) {
          case "ongoing":
            return (
              <div className={styles["progress"]}>
                <Progress
                  now={props.progressCurrent}
                  schedule={props.progressSchedule}
                />
              </div>
            );
          case "notStarted":
            return (
              <div className={styles["notStarted"]}>
                <div className={styles["notStarted-text"]}>
                  Start at {moment.unix(props.startTime).format("MMM DD")}
                </div>
                <div className={styles["notStarted-tag"]}>
                  <Tag type="purple" content={props.userStatus} />
                </div>
              </div>
            );
          case "created":
            return (
              <div className={styles["notStarted"]}>
                <div className={styles["notStarted-text"]}>
                  Start at {moment.unix(props.startTime).format("MMM DD")}
                </div>
                <div
                  onClick={() => {
                    router.push(`plan/${props.address}/select`);
                  }}
                  className={styles["notStarted-tag"]}
                >
                  <Tag type="purple" content={"Select"} />
                </div>
              </div>
            );
          default:
            return (
              <div className={styles["counts"]}>
                {packTokenAmountToFix(props.tokenAmount)}{" "}
                {TokenMap[props.token]}
              </div>
            );
        }
      })()}
    </div>
  );
}

export default ScheduleCard;
