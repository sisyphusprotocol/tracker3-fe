import classNames from "classnames";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useCampaignHost } from "../../hooks/useCampaign";
import _emoji from "../../assets/defaultCampaign.svg";
import { shortenDes } from "../../utils/convert";
import styles from "./index.module.css";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getCampaignDetail } from "../../utils/campaign";

interface ICard {
  children?: React.ReactNode;
  className?: any;
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

  const { data, isLoading } = useQuery<{ title: string; description: string }>(
    ["metadata", props.uri],
    () => {
      return getCampaignDetail(props.uri);
    },
    { retry: 10, enabled: !!props.uri }
  );

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
