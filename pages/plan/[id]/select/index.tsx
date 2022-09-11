import React, { useState } from "react";
import Avatar, { genConfig, AvatarFullConfig } from "react-nice-avatar";
import style from "./style.module.css";
import Button from "../../../../components/button";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { CampaignSignedResult, CAMPAIGN_SIGNED } from "../../../../utils/graph";
import { shortenAddress } from "../../../../utils/convert";
import { useAccount, useContract, useSigner } from "wagmi";
import { ethers } from "ethers";
import { Campaign } from "../../../../contracts/types";
import { Campaign_ABI } from "../../../../contracts/contants";

type Info = {
  id: string;
  tokenId: string;
  isSelect: boolean;
  config: Required<AvatarFullConfig>;
};

// TODO: should
const Selects = () => {
  const router = useRouter();
  const [list, setList] = useState<Info[]>([]);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const campaign = useContract<Campaign>({
    addressOrName: router.query.id
      ? (router.query.id as string)
      : ethers.constants.AddressZero,
    contractInterface: Campaign_ABI,
    signerOrProvider: signer,
  });

  const { data, refetch } = useQuery<CampaignSignedResult>(CAMPAIGN_SIGNED, {
    variables: { campaign: router.query.id },
    onCompleted(data) {
      console.log(data);
      setList(
        data.campaign.users.map((userCampaign) => ({
          id: shortenAddress(userCampaign.user.id),
          config: genConfig(),
          isSelect:
            ["Admitted", "Sucess", "Failure"].indexOf(
              userCampaign.userStatus
            ) !== -1,
          tokenId: userCampaign.tokenId,
        }))
      );
    },
    fetchPolicy: "network-only",
  });

  const changeListItem = (index) => {
    const res = [...list];
    res[index].isSelect = !res[index].isSelect;
    setList(res);
  };

  const handleSubmit = () => {
    const res = list.filter((i) => i.isSelect);
    campaign.admit(res.map((r) => r.tokenId)).then(() => {
      setTimeout(() => {
        refetch();
      }, 5000);
    });
  };

  return (
    <div className={style["bg"]}>
      <div className={style["outer"]}>
        <div className={style["title"]}>Selection</div>
        <div className={style["label"]}>Writing protocol</div>
        <div className={style["list-container"]}>
          {list.map((item, index) => {
            return (
              <div
                key={item.id}
                className={style["list-item"]}
                onClick={() => changeListItem(index)}
              >
                <Avatar
                  {...item.config}
                  style={{ width: ".45rem", height: ".50rem" }}
                />
                <div className={style["list-item-info"]}>{item.id}</div>
                <div className={style[item.isSelect ? "selected" : "circle"]} />
              </div>
            );
          })}
        </div>

        <Button className={style["mt74"]} onClick={() => handleSubmit()}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Selects;
