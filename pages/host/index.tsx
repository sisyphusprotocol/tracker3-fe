import Info from "../../components/info";
import styles from "./index.module.css";
import _img from "../../assets/sisyphus.svg";
import Image from "next/image";
import Tab from "../../components/tab";
import ScheduleCard from "../../components/schedule-card";
import { useAccount, useContract, useSigner } from "wagmi";
import {
  CREATED_CAMPAIGN_LIST,
  CreatedCampaignList,
  JoinNotStartCampaignList,
  JOIN_NOT_START_CAMPAIGN_LIST,
  JoinOnGoingCampaignList,
  JOIN_ON_GOING_CAMPAIGN_LIST,
  JoinFinishedCampaignList,
  JOIN_FINISHED_CAMPAIGN_LIST,
} from "../../utils/graph";
import { now, shortenAddress } from "../../utils/convert";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import moment from "moment";

function CreatedCampaigns() {
  const { address } = useAccount();

  const { data: campaignList } = useQuery<CreatedCampaignList>(
    CREATED_CAMPAIGN_LIST,
    {
      variables: { user: address?.toLowerCase() },
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <div className={styles["schedule-list"]}>
      {campaignList?.campaigns.map((campaign) => {
        return (
          <div key={campaign.id}>
            <ScheduleCard
              uri={campaign.uri}
              address={campaign.id}
              isFinish={true}
              type="created"
              startTime={campaign.startTime}
              endTime={campaign.endTime}
              token={"111"}
              tokenAmount={"1"}
              lastingDays={campaign.epochCount}
              progressCurrent={Math.floor(
                (moment().unix() - campaign.startTime) / campaign.periodLength
              )}
              progressSchedule={1}
            />
          </div>
        );
      })}
    </div>
  );
}

function OnGoingCampaigns() {
  const { address } = useAccount();
  const time = moment().unix();

  const { data: campaignList } = useQuery<JoinOnGoingCampaignList>(
    JOIN_ON_GOING_CAMPAIGN_LIST,
    {
      variables: { user: address?.toLowerCase(), time: time },
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <div className={styles["schedule-list"]}>
      {campaignList?.campaigns.map((campaign) => {
        return (
          <div key={campaign.id}>
            <ScheduleCard
              uri={campaign.uri}
              address={campaign.id}
              isFinish={true}
              type={"ongoing"}
              startTime={campaign.startTime}
              endTime={campaign.endTime}
              token={campaign.targetToken.id}
              tokenAmount={campaign.requiredAmount}
              lastingDays={campaign.epochCount}
              progressCurrent={Math.min(
                Math.floor(
                  (now() - campaign.startTime) / campaign.periodLength
                ),
                campaign.epochCount
              )}
              progressSchedule={campaign.epochCount}
            />
          </div>
        );
      })}
    </div>
  );
}

function NotStartCampaigns() {
  const { address } = useAccount();
  const time = moment().unix();

  const { data: campaignList } = useQuery<JoinNotStartCampaignList>(
    JOIN_NOT_START_CAMPAIGN_LIST,

    {
      variables: { user: address?.toLowerCase(), time: time },
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <div className={styles["schedule-list"]}>
      {campaignList?.campaigns.map((campaign) => {
        return (
          <div key={campaign.id}>
            <ScheduleCard
              uri={campaign.uri}
              address={campaign.id}
              isFinish={true}
              type={"notStarted"}
              userStatus={campaign.users[0].userStatus}
              startTime={campaign.startTime}
              endTime={campaign.endTime}
              token={campaign.targetToken.id}
              tokenAmount={campaign.requiredAmount}
              lastingDays={campaign.epochCount}
              progressCurrent={Math.floor(
                (moment().unix() - campaign.startTime) / campaign.periodLength
              )}
              progressSchedule={campaign.epochCount}
            />
          </div>
        );
      })}
    </div>
  );
}

function FinishedCampaigns() {
  const { address } = useAccount();
  const time = moment().unix();

  const { data: campaignList } = useQuery<JoinFinishedCampaignList>(
    JOIN_FINISHED_CAMPAIGN_LIST,

    {
      variables: { user: address?.toLowerCase(), time: time },
      onCompleted: (data) => {},
    }
  );

  return (
    <div className={styles["schedule-list"]}>
      {campaignList?.campaigns.map((campaign) => {
        return (
          <div key={campaign.id}>
            <ScheduleCard
              uri={campaign.uri}
              address={campaign.id}
              isFinish={true}
              type={"ongoing"}
              startTime={campaign.startTime}
              endTime={campaign.endTime}
              token={campaign.targetToken.id}
              periodLength={campaign.periodLength}
              tokenAmount={campaign.requiredAmount}
              lastingDays={campaign.epochCount}
              progressCurrent={Math.min(
                Math.floor(
                  (moment().unix() - campaign.startTime) / campaign.periodLength
                ),
                campaign.epochCount
              )}
              progressSchedule={Number(campaign.epochCount)}
            />
          </div>
        );
      })}
    </div>
  );
}

type TabType = "OnGoing" | "NotStart" | "Finished" | "Created";

function Find() {
  const { address } = useAccount();

  const [currentTab, setCurrentTab] = useState<TabType>("OnGoing");

  const tabItems = [
    {
      label: "OnGoing",
      activeCb: () => setCurrentTab("OnGoing"), //
    },
    {
      label: "Not Started",
      activeCb: () => setCurrentTab("NotStart"),
    },
    {
      label: "Finished",
      activeCb: () => setCurrentTab("Finished"),
    },
    {
      label: "Created",
      activeCb: () => setCurrentTab("Created"),
    },
  ];

  return (
    <div className={styles.container}>
      <div className="relative flex flex-col h-screen items-center w-auto">
        <Info id={shortenAddress(address)} />
        <div className={styles["find-img"]}>
          <Image src={_img} alt="" />
        </div>
        <div className={styles["host-yellow"]}>
          <div className={styles["yellow-title"]}>Hi, Jerry!</div>
          <div className={styles["yellow-desc"]}>
            {"It always seems impossible until it's done."}
          </div>
        </div>
        <Tab tabItems={tabItems} />
        {(() => {
          switch (currentTab) {
            case "Created":
              return <CreatedCampaigns />;
            case "NotStart":
              return <NotStartCampaigns />;
            case "OnGoing":
              return <OnGoingCampaigns />;
            case "Finished":
              return <FinishedCampaigns />;
            default:
              return <div></div>;
          }
        })()}
      </div>
    </div>
  );
}

export default Find;
