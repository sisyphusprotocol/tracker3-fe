import { useQuery } from "@apollo/client";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { Calendar } from "../../../../components/calendar";
import ScheduleCard from "../../../../components/schedule-card";
import style from "./style.module.css";
import {
  CampaignDetailResult,
  CampaignTokenIdResult,
  CAMPAIGN_DETAIL,
  CAMPAIGN_TOKEN_ID,
  PersonalPunchResult,
  PERSONAL_PUNCH,
} from "../../../../utils/graph";
import Campaign_ABI from "../../../../contracts/Campaign.json";

import { weekMap } from "../../../../utils/time";
import { now } from "../../../../utils/convert";
import { useCurrentEpoch } from "../../../../hooks/useCampaginRead";
import { useTraceTransaction } from "../../../../hooks/useTraceTransaction";
import { useCampaignRewardResultOnModal } from "../../../../hooks/useCampaign";
const Progress = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const router = useRouter();
  const campaignAddr = router.query.id as string;

  const { data: detail } = useQuery<CampaignDetailResult>(CAMPAIGN_DETAIL, {
    variables: { addr: campaignAddr },
  });

  const currentEpoch = useCurrentEpoch(router.query.id as string);

  const [options, setOptions] = useState([]);
  const [dayLength, setDayLength] = useState(0);
  const [checked, setChecked] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [timeToClaim, setTimeToClaim] = useState(false);

  useEffect(() => {
    if (
      now() >
      Number(detail?.campaign.startTime) + Number(detail?.campaign.totalTime)
    ) {
      setTimeToClaim(true);
    } else {
    }
  }, [detail?.campaign.startTime, detail?.campaign.totalTime]);

  const { loading, data: CheckInHistory } = useQuery<PersonalPunchResult>(
    PERSONAL_PUNCH,
    {
      variables: {
        userCampaign: `${address?.toLowerCase()}-${router.query.id}`,
        userCampaignEpoch: `${address?.toLowerCase()}-${
          router.query.id
        }-${currentEpoch}`,
      },
      onCompleted(data) {
        if (data?.record?.contentUri.length > 0) {
          setChecked(true);
        } else {
          setChecked(false);
        }
      },
    }
  );

  const { data: tokenIdData } = useQuery<CampaignTokenIdResult>(
    CAMPAIGN_TOKEN_ID,
    {
      variables: {
        userCampaign: `${address ? address.toLowerCase() : ""}-${
          router.query.id
        }`,
      },
      onCompleted(data) {
        if (data?.userCampaign?.userRewardClaimed) {
          setClaimed(true);
        } else {
          setClaimed(false);
        }
      },
    }
  );

  // claim tx
  const { config, data } = usePrepareContractWrite({
    address: router.query.id as string,
    abi: Campaign_ABI,
    functionName: "claim",
    signer: signer,
    args: [tokenIdData?.userCampaign?.tokenId],
    enabled:
      !!tokenIdData?.userCampaign?.tokenId && detail?.campaign.endTime < now(),
  });

  const { write: claimWrite, data: claimWriteTxData } =
    useContractWrite(config);

  const { refetch: refetchResult } = useCampaignRewardResultOnModal(
    detail?.campaign.id,
    address?.toLowerCase()
  );

  useTraceTransaction(
    claimWriteTxData?.hash,
    {
      // TODO: success and fail judge
      type: "claim",
      token: detail?.campaign.targetToken.id,
      staked: detail?.campaign.requiredAmount,
    },
    () => {
      setTimeout(() => refetchResult, 5000);
    }
  );

  const onCheckClick = () => {
    // If the campaign started, can punch in
    if (detail?.campaign.startTime <= moment().unix()) {
      router.push(`/plan/${router.query.id}/punch`);
    } else {
      alert("The campaign has not started yet");
    }
  };

  const onClaimClick = () => {
    claimWrite();
  };

  useEffect(() => {
    const options = Array.from({ length: dayLength }, (v, index) => {
      return {
        day: moment.unix(detail?.campaign.startTime).date(),
        text: weekMap[
          moment.unix(detail?.campaign.startTime).add(index, "days").day()
        ],
      };
    });
    setOptions(options);
    setDayLength(
      Math.floor(
        detail?.campaign.totalTime / Number(detail?.campaign?.periodLength)
      )
    );
  }, [detail, dayLength]);

  return (
    <div className={style["bg"]}>
      <Calendar
        nextToDo={detail?.campaign.endTime > now() ? "Check" : "Claim"}
        checkedTimeStamp={CheckInHistory?.userCampaign?.records?.map(
          (record) => {
            return Number(record?.timestamp);
          }
        )}
        onCheckClick={onCheckClick}
        onClaimClick={onClaimClick}
        options={options}
        checked={checked}
        claimed={claimed}
        dayLength={dayLength}
        timeToClaim={timeToClaim}
      >
        <div className="mt-0.5 flex-y items-center mb-1">
          <ScheduleCard
            address={campaignAddr}
            isFinish={false}
            uri={detail?.campaign.uri}
            startTime={detail?.campaign.startTime}
            endTime={detail?.campaign.endTime}
            scheduleName={"Writing Schedule"}
            lastingDays={detail?.campaign.epochCount}
          />
        </div>
      </Calendar>
    </div>
  );
};

export default Progress;
