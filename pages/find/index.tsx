import Search from "../../components/search";
import Card from "../../components/card";
import Info from "../../components/info";
import Tab from "../../components/tab";
import ScheduleCard from "../../components/schedule-card";
import styles from "./index.module.css";
import _img from "../../assets/sisyphus_2.svg";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import {
  now,
  shortenAddress,
  timeStampToPeriodLength,
} from "../../utils/convert";
import { useQuery } from "@apollo/client";
import {
  NotStartCampaignList,
  NOT_START_CAMPAIGN_LIST,
  ON_GOING_CAMPAIGN_LIST,
  OnGoingCampaignList,
} from "../../utils/graph";
import { useState } from "react";
import moment from "moment";

function OnGoingCampaigns() {
  const time = moment().unix();

  const { data: campaignList } = useQuery<OnGoingCampaignList>(
    ON_GOING_CAMPAIGN_LIST,
    {
      variables: { time: time },
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
              type="ongoing"
              startTime={campaign.startTime}
              endTime={campaign.endTime}
              token={campaign.targetToken.id}
              tokenAmount={campaign.requiredAmount}
              lastingDays={campaign.epochCount}
              progressCurrent={Math.floor(
                (moment().unix() - campaign.startTime) / campaign.periodLength
              )}
              progressSchedule={Number(campaign.epochCount)}
            />
          </div>
        );
      })}
    </div>
  );
}

function NotStartedCampaigns() {
  const time = moment().unix();

  const { data: campaignList } = useQuery<NotStartCampaignList>(
    NOT_START_CAMPAIGN_LIST,
    {
      variables: { time: time },
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
              isFinish={false}
              address={campaign.id}
              startTime={campaign.startTime}
              endTime={campaign.endTime}
              token={campaign.targetToken.id}
              tokenAmount={campaign.requiredAmount}
              lastingDays={campaign.epochCount}
            />
          </div>
        );
      })}
    </div>
  );
}

function Find() {
  const { address } = useAccount();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<"OnGoing" | "NotStart">(
    "NotStart"
  );

  if (!address) return null;

  // 
  const onSearch = (ref: any) => console.log(ref.current.value);

  const handleClick = () => {
    router.push("/plan/create");
  };

  const tabItems = [
    {
      label: "Not Started",
      activeCb: () => setCurrentTab("NotStart"),
    },
    {
      label: "OnGoing",
      activeCb: () => setCurrentTab("OnGoing"), // 
    },
  ];

  return (
    <div className={styles.container}>
      <Info id={shortenAddress(address, 2)} className={styles.info} />
      <Search onSearch={onSearch} className={styles.search} />
      <div className={styles["host-img"]}>
        <Image src={_img} className={styles["host-img"]} alt="" />
      </div>
      <div onClick={handleClick} className={styles["host-button-wrapper"]}>
        <div>
          <div className={styles["host-button-title"]}>Create Protocol</div>
          <div className={styles["host-button-desc"]}>
            You can create a new protocol of your own!
          </div>
        </div>
      </div>

      {/* tab */}
      <div className={styles["campaign-tabs"]}>
        <Tab tabItems={tabItems} />
      </div>
      {currentTab === "OnGoing" ? (
        <OnGoingCampaigns />
      ) : (
        <NotStartedCampaigns />
      )}
    </div>
  );
}

export default Find;
