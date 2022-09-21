import React, { useEffect, useState } from "react";
import style from "../style.module.css";
import Detail from "../../../components/Detail";
import {
  CampaignDetailResult,
  CAMPAIGN_DETAIL,
  UserCampaignResult,
  USER_CAMPAIGN_DETAIL,
} from "../../../utils/graph";

import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Button from "../../../components/button";
import { now } from "../../../utils/convert";
import { useTokenAllowance } from "../../../hooks/useAllowance";
import { BigNumber } from "ethers";
import { Campaign_ABI, ERC20_ABI } from "../../../contracts/contants";
import { useTraceTraction } from "../../../hooks/useTraceTranscation";
import TxConfirmedModal from "../../../components/modal";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";

// example Id: 0x90a3c9178fd231b9b9c8928beeb1aa4bdce8b642

// eslint-disable-next-line react/display-name
const Plan = () => {
  const [buttonText, setButtonText] = useState("");
  const router = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const Web3Api = useMoralisWeb3Api();
  const { data: balances } = useMoralisWeb3ApiCall(
    Web3Api.account.getTokenBalances,
    {
      chain: "mumbai",
      address: address,
      token_addresses: ["0xA3F2ba60353b9af0A3524eE4a7C206D4335A9784"],
    },
    { autoFetch: true }
  );
  console.log("balance: ", balances);

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

  const {
    loading,
    error,
    data,
    refetch: refetchUserStatus,
  } = useQuery<UserCampaignResult>(USER_CAMPAIGN_DETAIL, {
    variables: {
      userCampaign: `${address?.toLowerCase()}-${router.query.id}`,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    pollInterval: 5000,
  });

  const { config: signUpConfig, refetch } = usePrepareContractWrite({
    addressOrName: props.data?.campaign.id,
    contractInterface: Campaign_ABI,
    functionName: "signUp",
    signer: signer,
    args: [],
    enabled: true,
  });

  // sign up tx
  const { write: signUpWrite, data: signUpTxData } =
    useContractWrite(signUpConfig);
  const {
    tx: signUpTx,
    modalShow: signUpModalShow,
    setModalShow: setSignUpModalShow,
  } = useTraceTraction(signUpTxData?.hash);

  const { config } = usePrepareContractWrite({
    addressOrName: props.data?.campaign.targetToken.id,
    contractInterface: ERC20_ABI,
    functionName: "approve",
    signer: signer,
    args: [props.data?.campaign.id, props.data?.campaign.requiredAmount],
    enabled: !!props.data,
  });

  // approve tx
  const { write, data: approveTxData } = useContractWrite(config);
  const {
    tx: approveTx,
    modalShow: approveModalShow,
    setModalShow: setApproveModalShow,
  } = useTraceTraction(approveTxData?.hash, () => {
    refetch();
  });

  const currentAllowance = useTokenAllowance(
    config.addressOrName,
    address,
    router.query.id as string
  );

  useEffect(() => {
    const map = {
      0: "Approve",
      1: "Sign Up",
      2: "Signed",
      3: "Admitted",
      4: "NotParticipate",
      5: "Refund",
    };
    setButtonText(map[status]);
  }, [status]);

  useEffect(() => {
    // TODO: deal with exit
    if (props?.data?.campaign && currentAllowance) {
      // If the campaign has already started
      if (props.data.campaign.startTime <= now()) {
        if (data?.userCampaign?.userStatus == "Admitted") {
          setStatus(3);
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

  useEffect(() => {
    console.log("write", write, "singUp", signUpWrite);
  }, [write, signUpWrite]);

  // TODO: approved status
  const approve = () => {
    write();
  };

  const handleClick = async () => {
    if (status === 0) {
      // check whether use have enough token
      if (
        balances.length &&
        BigNumber.from(balances[0].balance).gte(
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
    } else if (status === 3) {
      router.push(`/plan/${router.query.id}/progress`);
    }
  };

  return (
    <div className={style.bg}>
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
        >
          {buttonText}
        </Button>
        <TxConfirmedModal
          txHash={approveTx.hash}
          gasFee={approveTx.gasFee}
          isShow={approveModalShow}
          type="approve"
          setShow={() => {
            setApproveModalShow(false);
          }}
        />
        <TxConfirmedModal
          txHash={signUpTx.hash}
          gasFee={signUpTx.gasFee}
          isShow={signUpModalShow}
          type="sign"
          setShow={() => {
            setSignUpModalShow(false);
          }}
        />
      </div>
    </div>
  );
};

export default Plan;
