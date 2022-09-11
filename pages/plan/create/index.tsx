import React, { useEffect, useRef, useState } from "react";
import style from "../style.module.css";
import Form, { FormConfig } from "../../../components/Form";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
  useWaitForTransaction,
} from "wagmi";
import { CampaignFactoryUpgradable } from "../../../contracts/types";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { uploadJson } from "../../../utils/ipfs";
import TxConfirmedModal from "../../../components/modal";
import { shortenTxHash } from "../../../utils/convert";
import { packTokenAmount } from "../../../utils/token";
import moment from "moment";
import {
  CampaignFactory_ABI,
  CAMPAIGN_FACTORY_ADDRESS,
} from "../../../contracts/contants";
import { useTraceTraction } from "../../../hooks/useTraceTranscation";

// eslint-disable-next-line react/display-name
const Create = () => {
  const router = useRouter();
  const { data: signer } = useSigner();

  const [metadata, setMetadata] = useState({
    name: "Writing Campaign",
    desc: "Writing protocol is a 21 day tracker to ...",
    days: 1,
    token: "0xA3F2ba60353b9af0A3524eE4a7C206D4335A9784",
    startDate: moment()
      .add(1, "day")
      .hours(0)
      .minutes(0)
      .format("YYYY-MM-DDTHH:mm"),
    amount: 1,
  });

  // TODO: switch to new if I'm ready
  const { write: createCampaignWrite, data: txData } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: CAMPAIGN_FACTORY_ADDRESS,
    contractInterface: CampaignFactory_ABI,
    functionName: "createCampaign",
  });

  const { modalShow, tx } = useTraceTraction(txData?.hash);

  const handleClick = async (data: {
    title: string;
    token: string;
    amount: number;
    name: string;
    desc: string;
    days: number;
    startDate: Date;
  }) => {
    // TODO: fix order error
    await uploadJson({
      // TODO: all title change to name later
      title: data.name,
      description: data.desc,
    }).then((cid) => {
      createCampaignWrite({
        recklesslySetUnpreparedArgs: [
          metadata.token,
          ethers.utils.parseEther(metadata.amount.toString()).toString(),
          metadata.name,
          "SISY-NFT",
          moment(metadata?.startDate, "YYYY-MM-DDTHH:mm").unix(),
          metadata.days,
          86400,
          `ipfs://${cid}`,
        ],
      });
    });
  };

  const formConfig: FormConfig[] = [
    {
      type: "input",
      name: "name",
      label: "Name",
    },
    {
      type: "textarea",
      name: "desc",
      label: "Description",
    },
    {
      type: "input",
      name: "days",
      label: "Days(everyday)",
    },
    {
      type: "datetime-local",
      name: "startDate",
      label: "When to start",
    },
    {
      type: "select",
      name: "token",
      label: "Token",
    },
    {
      type: "input",
      name: "amount",
      label: "Staking amount",
    },
  ];

  return (
    <div className={style.bg}>
      <div className={style.outer}>
        <Form
          onClick={handleClick}
          config={formConfig}
          data={metadata}
          update={setMetadata}
        />
      </div>
      <TxConfirmedModal
        txHash={tx.hash}
        gasFee={tx.gasFee}
        isShow={modalShow}
        type="create"
        // TODO: use calculate create2 address and redirect
        setShow={() => {
          router.push("/find");
        }}
      />
    </div>
  );
};

export default Create;
