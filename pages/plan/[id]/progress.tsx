import { useQuery } from "@apollo/client";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { Calendar } from "../../../components/calendar";
import ScheduleCard from "../../../components/schedule-card";
import {
  CampaignDetailResult,
  CampaignTokenIdResult,
  CAMPAIGN_DETAIL,
  CAMPAIGN_TOKEN_ID,
  PersonalPunchResult,
  PERSONAL_PUNCH,
} from "../../../utils/graph";
import Campaign_ABI from "../../../contracts/Campaign.json";

import { weekMap } from "../../../utils/time";
import { useCurrentEpoch } from "../../../hooks/useCampaign";
import { now } from "../../../utils/convert";
import { useTraceTraction } from "../../../hooks/useTraceTransaction";
import TxConfirmedModal from "../../../components/modal";
const Progress = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const router = useRouter();

  const { data: detail } = useQuery<CampaignDetailResult>(CAMPAIGN_DETAIL, {
    variables: { addr: router.query.id },
    onCompleted(data) {
      console.log(data.campaign.endTime);
    },
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
      pollInterval: 10000,
      fetchPolicy: "network-only",
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
  const { config } = usePrepareContractWrite({
    addressOrName: router.query.id as string,
    contractInterface: Campaign_ABI,
    functionName: "claim",
    signer: signer,
    args: [tokenIdData?.userCampaign?.tokenId],
    enabled:
      !!tokenIdData?.userCampaign?.tokenId && detail?.campaign.endTime < now(),
  });

  const { write: claimWrite, data: claimWriteTxData } =
    useContractWrite(config);

  const { modalShow, setModalShow, tx } = useTraceTraction(
    claimWriteTxData?.hash
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
    <div>
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
      />
      <TxConfirmedModal
        txHash={tx.hash}
        gasFee={tx.gasFee}
        isShow={modalShow}
        type="claim"
        staked={detail?.campaign?.requiredAmount}
        userReward={tokenIdData?.userCampaign?.userRewardClaimedAmount}
        hostReward={tokenIdData?.userCampaign?.hostRewardClaimedAmount}
        setShow={() => {
          setModalShow(false);
        }}
      />
      <div
        style={{ position: "fixed", bottom: "0.8451rem", left: "0.1927rem" }}
      >
        <ScheduleCard
          isFinish={false}
          uri={detail?.campaign.uri}
          scheduleName={"Writing Schedule"}
          lastingDays={"Achievement!"}
        />
      </div>
    </div>
  );
};

export default Progress;
