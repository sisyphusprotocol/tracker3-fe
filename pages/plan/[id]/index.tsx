import { useEffect, useState, memo } from "react";
import style from "./style.module.css";
import Detail from "../../../components/Detail";
import {
  CampaignDetailResult,
  CAMPAIGN_DETAIL,
  UserCampaignResult,
  USER_CAMPAIGN_DETAIL,
} from "../../../utils/graph";

import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Button from "../../../components/button";
import { now, shortenAddress } from "../../../utils/convert";
import { useTokenAllowance } from "../../../hooks/useAllowance";
import { BigNumber } from "ethers";
import { Campaign_ABI, ERC20_ABI } from "../../../contracts/contants";

import { useTraceTransaction } from "../../../hooks/useTraceTransaction";
import { AddressCard } from "../../../components/info";
import { BackSpace } from "../../../components/backspace";

// example Id: 0x90a3c9178fd231b9b9c8928beeb1aa4bdce8b642

// eslint-disable-next-line react/display-name
const Plan = () => {
  const [buttonText, setButtonText] = useState("");
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);

  const { data: balanceData } = useBalance({
    address: address,
    token: "0xA3F2ba60353b9af0A3524eE4a7C206D4335A9784",
  });

  /**
   * status:
   * 0: Don't participate, need to approve, show approve
   * 1: approved, but not signed, show sign up
   * 2: signed, but not admitted, show signed
   * 3: admitted, show admitted
   * 4: didn't sign util the campaign start, show NotParticipate
   * 5: Not admitted util the campaign start, show Refund
   */
  const [status, setStatus] = useState(0);

  const props = useQuery<CampaignDetailResult>(CAMPAIGN_DETAIL, {
    variables: { addr: router.query.id },
  });

  const { data, refetch: refetchUserStatus } = useQuery<UserCampaignResult>(
    USER_CAMPAIGN_DETAIL,
    {
      variables: {
        userCampaign: `${address?.toLowerCase()}-${router.query.id}`,
      },
    }
  );

  const { config: signUpConfig, refetch } = usePrepareContractWrite({
    address: props?.data?.campaign.id,
    abi: Campaign_ABI,
    functionName: "signUp",
    signer: signer,
    args: [],
    // enable when userStatus is undefined, which means the user signUp is not record on chain
    enabled: !!data && !data?.userCampaign?.userStatus,
  });

  // sign up tx
  const { write: signUpWrite, data: signUpTxData } =
    useContractWrite(signUpConfig);
  useTraceTransaction(signUpTxData?.hash, { type: "sign" }, () => {
    refetchUserStatus().then(() => {
      setLoading(false);
    });
  });

  const { config } = usePrepareContractWrite({
    address: props.data?.campaign.targetToken.id,
    abi: ERC20_ABI,
    functionName: "approve",
    signer: signer,
    args: [props.data?.campaign.id, props.data?.campaign.requiredAmount],
    enabled: !!props.data,
  });

  // approve tx
  const { write, data: approveTxData } = useContractWrite(config);
  useTraceTransaction(approveTxData?.hash, { type: "approve" }, () => {
    refetch();
    setLoading(false);
  });

  const currentAllowance = useTokenAllowance(
    config.address,
    address,
    router.query.id as `0x${string}`
  );

  useEffect(() => {
    const map = {
      0: "Approve",
      1: "Sign Up",
      2: "Signed",
      3: "Admitted",
      4: "NotParticipate",
      5: "Refund",
      6: "Go to CheckIn",
      7: "Go to Claim",
    };
    setButtonText(map[status]);
  }, [status]);

  useEffect(() => {
    // TODO: deal with exit
    if (props?.data?.campaign && currentAllowance) {
      // If the campaign has already started
      if (props.data.campaign.startTime <= now()) {
        if (data?.userCampaign?.userStatus == "Admitted") {
          // if campaign end, go to claim
          if (props?.data?.campaign.endTime <= now()) {
            setStatus(7);
          } else {
            // it's time to check in
            setStatus(6);
          }
        } else {
          setStatus(4);
        }
        // If the campaign has not started
      } else {
        if (data?.userCampaign?.userStatus == "Admitted") {
          setStatus(3);
        } else if (data?.userCampaign?.userStatus == "Signed") {
          setStatus(2);
          // If approved token amount is enough
        } else if (currentAllowance.gte(props.data.campaign.requiredAmount)) {
          setStatus(1);
        } else {
          setStatus(0);
        }
      }
    }
  }, [currentAllowance, data, props]);

  // TODO: approved status
  const approve = () => {
    write();
    setLoading(true);
  };

  const handleClick = async () => {
    if (status === 0) {
      // check whether use have enough token
      if (
        balanceData?.value?.gte(
          BigNumber.from(props?.data?.campaign?.requiredAmount)
        )
      ) {
        approve();
      } else {
        alert("You don't have enough token");
      }
    } else if (status === 1) {
      // refetch after the tx confirmed
      signUpWrite();
      setLoading(true);
    } else if (status === 6 || status === 7) {
      router.push(`/plan/${router.query.id}/progress`);
    }
  };

  return (
    <div className={style.bg}>
      <div className="relative flex flex-col items-center w-auto h-auto ">
        <div className="relative flex flex-row  top-1.5  items-center w-auto">
          <div className="relative ">
            <BackSpace />
          </div>
          <div className="ml-7">
            <AddressCard addr={shortenAddress(address)} />{" "}
          </div>
        </div>
        <div className={style.outer}>
          <Detail
            uri={props.data?.campaign.uri}
            id={props.data?.campaign.id}
            startTime={props.data?.campaign.startTime}
            totalTime={props.data?.campaign.totalTime}
            requiredAmount={props.data?.campaign.requiredAmount}
            token={props.data?.campaign.targetToken.id}
            memberCount={props.data?.campaign.memberCount}
          />
          <Button
            onClick={() => {
              handleClick();
            }}
            className={style.mt}
            loading={loading}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Plan);
