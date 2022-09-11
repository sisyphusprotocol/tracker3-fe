import Button from "../../components/button";
import Nav from "../../components/nav";
import Card from "../../components/card";
import styles from "./index.module.css";
import _img from "../../assets/sisyphus.png";
import Image from "next/image";
import {  useAccount } from "wagmi";

import {  now,  timeStampToPeriodLength } from "../../utils/convert";
import {  useQuery } from "@apollo/client";
import {
   CreatedCampaignType,
   CREATED_CAMPAIGN,
   PARTICIPATED_CAMPAIGN,
} from "../../utils/graph";

function Host() {
  const { address } = useAccount();
  const { data: createdCampaignList } = useQuery<CreatedCampaignType>(
    CREATED_CAMPAIGN,
    {
      variables: { user: address?.toLowerCase(), time: now() },
    }
  );

  const { data: participatedCampigns } = useQuery<CreatedCampaignType>(
    PARTICIPATED_CAMPAIGN,
    {
      variables: { user: address?.toLowerCase(), time: now() },
    }
  );

  if (!address) return null;

  return (
    <div className={styles.container}>
      <Button className={styles["host-button"]}>My Tracker</Button>
      <div className={styles["host-img"]}>
        <Image src={_img} className={styles["host-img"]} alt="" />
      </div>
      <div className={styles["host-yellow"]}>
        <div className={styles["yellow-title"]}>Hi, Jerry!</div>
        <div className={styles["yellow-desc"]}>
          I fell in love with you at first sight! ❤️❤️❤️
        </div>
      </div>
      <div className={styles["campaign-list"]}>
        {participatedCampigns?.campaigns?.map((campaign, key) => {
          return (
            <Card
              id={campaign.id}
              periodLength={timeStampToPeriodLength(campaign.totalTime)}
              uri={campaign.uri}
              key={key}
            />
          );
        })}
      </div>
     {!createdCampaignList?.campaigns?.length ?<div className={styles["host-title"]}>No more campaigns</div>:
      <div>
        <div className={styles["host-title"]}>Created program</div>
        <div className={styles["host-divide"]}></div>
        <div className={styles["campaign-list"]}>
          {createdCampaignList?.campaigns?.map((campaign) => {
            return (
              <Card
                id={campaign.id}
                periodLength={timeStampToPeriodLength(campaign.totalTime)}
                uri={campaign.uri}
                key={campaign.id}
              />
            );
          })}
        </div>
      </div>}
      <Nav />
    </div>
  );
}

export default Host;
