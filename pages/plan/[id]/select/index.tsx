import React, { useEffect, useState } from "react";
import Avatar, { genConfig, AvatarFullConfig } from "react-nice-avatar";
import style from "./style.module.css";
import Button from "../../../../components/button";
import Top from "../../../../components/calendar/components/top";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { CampaignSignedResult, CAMPAIGN_SIGNED } from "../../../../utils/graph";
import { shortenAddress } from "../../../../utils/convert";
import { useCampaignAdmit } from "../../../../hooks/useCampaignWrite";
import { useTraceTransaction } from "../../../../hooks/useTraceTransaction";
import { useCampaignDetails } from "../../../../hooks/useCampaignRead";

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
  const [allowList, setAllowList] = useState([]);

  const campaignAddr = router?.query?.id as string;

  const { execute, data } = useCampaignAdmit({
    campaignAddr: campaignAddr,
    tokenIds: allowList,
  });
  useTraceTransaction(data?.hash, { type: "select" }, () => {
    router.push(`/plan/${campaignAddr}`);
  });

  const { refetch } = useQuery<CampaignSignedResult>(CAMPAIGN_SIGNED, {
    variables: { campaign: router.query.id },
    onCompleted(data) {
      console.log(data);
      setList(
        data?.campaign?.users.map((userCampaign) => ({
          id: shortenAddress(userCampaign.user.id),
          config: genConfig(),
          isSelect:
            ["Admitted", "Success", "Failure"].indexOf(
              userCampaign.userStatus
            ) !== -1,
          tokenId: userCampaign.tokenId,
        }))
      );
    },
  });

  const { data: detail } = useCampaignDetails(router.query.id as string);

  const changeListItem = (index) => {
    const res = [...list];
    res[index].isSelect = !res[index].isSelect;
    setList(res);
  };

  const handleSubmit = () => {
    execute();
  };

  useEffect(() => {
    setAllowList(list.filter((i) => i.isSelect).map((i) => i.tokenId));
    console.log(allowList);
  }, [list]);

  return (
    <div className={style["bg"]}>
      <Top title="Selection" />
      <div className={style["outer"]}>
        <div className={style["label"]}>{detail?.title}</div>
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
                  style={{
                    width: ".45rem",
                    height: ".50rem",
                    marginLeft: "0.19rem",
                  }}
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
