import Button from "../../components/button";
import Nav from "../../components/nav";
import styles from "./index.module.css";
import _img from "../../assets/sisyphus.png";
import Image from "next/image";
import Card from "../../components/card";

import { useAccount, useContract, useSigner } from "wagmi";
import { useRouter } from "next/router";
import {
  CampaignListResult,
  CAMPAIGN_LIST,
  CanCreateCampaignResult,
  CAN_CREATE_CAMPAIGN,
} from "../../utils/graph";
import { timeStampToPeriodLength } from "../../utils/convert";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

function Find() {
  const { address } = useAccount();
  const router = useRouter();

  const { data, loading, refetch } = useQuery<CampaignListResult>(
    CAMPAIGN_LIST,
    {
      variables: { time: Math.round(new Date().getTime() / 1000) },
      pollInterval: 10000,
      fetchPolicy: "network-only",
    }
  );

  const { data: CanCreateCampaign } = useQuery<CanCreateCampaignResult>(
    CAN_CREATE_CAMPAIGN,
    {
      variables: { user: address?.toLowerCase() },
    }
  );

  const handleClick = () => {
    router.push("/plan/create");
    // if (CanCreateCampaign?.user?.canBeHost) {
    // } else {
    //   alert("You are not eligible to create campaign, please contact team");
    // }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles["find-img"]}>
        <Image src={_img} alt="" />
      </div>
      <Button onClick={handleClick} className={styles["find-button"]}>
        Create Campaign
      </Button>
      <div className={styles["find-list"]}>
        {data?.campaigns.map((campaign) => (
          <div key={campaign.id}>
            <Card
              periodLength={timeStampToPeriodLength(campaign.totalTime)}
              id={campaign.id}
              uri={campaign.uri}
            />
          </div>
        ))}
      </div>

      <Nav />
    </div>
  );
}

export default Find;
