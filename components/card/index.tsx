import classNames from "classnames";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import _emoji from "../../assets/defaultCampaign.svg";
import { shortenDes } from "../../utils/convert";
import styles from "./index.module.css";
import Image from "next/image";
import { getCampaignDetail } from "../../utils/campaign";
import {
  useCampaignDetails,
  useCampaignHost,
} from "../../hooks/useCampaignRead";
import useSWR from "swr";

interface ICard {
  children?: React.ReactNode;
  className?: any;
  /**
   * Also the address of the campaign
   */
  id?: string;
  uri?: string;
  name?: string;
  description?: string;
  periodLength?: string;
  progress?: string;
  iconType?: 0;
}

function Card(props: ICard) {
  const router = useRouter();
  const [select, setSelect] = useState(false);
  const { address } = useAccount();
  const { host } = useCampaignHost(props.id.toLowerCase());

  const { data } = useCampaignDetails(props?.id);

  useEffect(() => {
    if (address?.toLowerCase() === host?.toLowerCase() && address) {
      setSelect(true);
    }
  }, [address, host]);

  const classes = classNames(styles["card"], props.className);
  return (
    <div className={classes}>
      <div
        style={{ width: "2rem" }}
        onClick={() => {
          router.push(`/plan/${props.id}`);
        }}
      >
        <div className={styles["card-programName"]}>
          {data?.title || "Loading..."}
        </div>
        <div className={styles["card-dayCount"]}>{props.periodLength}</div>
        <div className={styles["card-progress"]}>
          {shortenDes(data?.description, 36) || "loading"}...
        </div>
      </div>
      {select ? (
        <div>
          <div className={styles["card-icon-with-select"]}>
            <Image src={_emoji} alt="" />
          </div>
          <div
            onClick={() => {
              router.push(`/plan/${props.id}/select`);
            }}
            className={styles["select-button"]}
          >
            <div className={styles["select-text"]}>select</div>
          </div>
        </div>
      ) : (
        <div className={styles["card-icon"]}>
          <Image src={_emoji} alt="" />
        </div>
      )}
      <div className={styles["card-extra"]}>{props.children}</div>
    </div>
  );
}

export default Card;
