import React, { useContext, useEffect, useState } from "react";
import style from "./style.module.css";
import Form, { FormConfig } from "../../../components/Form";
import { ethers } from "ethers";
import moment from "moment";

import { useCreateCampaign } from "../../../hooks/useCampaignWrite";
import { useUploadCampaignUri } from "../../../hooks/useCampaign";
import { useTraceTransaction } from "../../../hooks/useTraceTransaction";
import { useRouter } from "next/router";
import { BackSpace } from "../../../components/backspace";
import { useAccount } from "wagmi";
import { shortenAddress } from "../../../utils/convert";
import { AddressCard } from "../../../components/info";
import Button from "../../../components/button";

// eslint-disable-next-line react/display-name
const Create = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [metadata, setMetadata] = useState({
    name: "Test Campaign",
    desc: "As you know, it is just a test...",
    days: 1,
    token: "0xA3F2ba60353b9af0A3524eE4a7C206D4335A9784",
    startDate: moment().add(5, "minutes").format("YYYY-MM-DDTHH:mm"),
    amount: 1,
  });

  const [enableUpload, setEnableUpload] = useState(false);
  const [startCreate, setStartCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: cid } = useUploadCampaignUri({
    name: metadata.name,
    description: metadata.desc,
    enable: enableUpload,
  });

  const { write, data } = useCreateCampaign({
    token: metadata.token,
    amount: ethers.utils.parseEther(metadata.amount.toString()).toString(),
    name: metadata.name,
    symbol: "SISY-NFT",
    startTime: moment(metadata?.startDate, "YYYY-MM-DDTHH:mm").unix(),
    totalPeriod: metadata.days,
    // tmp set here
    periodLength: 86400,
    challengeLength: 86400,
    campaignUri: `ipfs://${cid}`,
  });

  useTraceTransaction(
    data?.hash,
    {
      type: "create",
      onClick: () => {
        router.push("/find");
      },
    },
    () => {
      setLoading(false);
    }
  );

  const handleClick = () => {
    setEnableUpload(true);
    setStartCreate(true);
    setLoading(true);
  };

  useEffect(() => {
    if (startCreate && write && cid) {
      write();
      setStartCreate(false);
      setEnableUpload(false);
    }
  }, [startCreate, write, cid]);

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
      <div className="relative flex flex-col items-center w-auto h-auto ">
        <div className="relative flex flex-row  top-1.5  items-center w-auto">
          <div className="relative ">
            <BackSpace />
          </div>
          <div className="ml-7">
            <AddressCard addr={shortenAddress(address)} />{" "}
          </div>{" "}
        </div>
        <div className={style.outer}>
          <Form
            onClick={handleClick}
            config={formConfig}
            data={metadata}
            update={setMetadata}
          />
          <Button onClick={handleClick} loading={loading}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
