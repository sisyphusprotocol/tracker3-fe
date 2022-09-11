import * as React from "react";
import style from "./style.module.css";
import Image from "next/image";
import Button from "../../../../components/button";
import { useAccount, useContract, useSigner } from "wagmi";
import { Campaign } from "../../../../contracts/types";
import { useRouter } from "next/router";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "@apollo/client";
import {
  CampaignTokenIdResult,
  CAMPAIGN_TOKENID,
} from "../../../../utils/graph";
import { uploadJson } from "../../../../utils/ipfs";
import { now } from "../../../../utils/convert";
import { Campaign_ABI } from "../../../../contracts/contants";

function Sign() {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const router = useRouter();
  const campaign = useContract<Campaign>({
    addressOrName: router.query.id
      ? (router.query.id as string)
      : ethers.constants.AddressZero,
    contractInterface: Campaign_ABI,
    signerOrProvider: signer,
  });

  const { loading, data } = useQuery<CampaignTokenIdResult>(CAMPAIGN_TOKENID, {
    variables: {
      userCampaign: `${address ? address.toLowerCase() : ""}-${
        campaign.address
      }`,
    },
    onError(error) {
      console.error(error);
    },
    onCompleted(data) {
      console.log(data);
    },
    pollInterval: 1000,
  });

  const [text, setText] = React.useState("");
  const [imgs, setImgs] = React.useState([]);

  if (!signer && address) return null;

  const handleUpload = (e) => {
    const file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      setImgs([...imgs, data]);
    };
  };

  const confirm = () => {
    if (!loading) {
      uploadJson({ text: text, imgs: imgs, timestapm: now() }).then((cid) => {
        campaign
          .checkIn(`ipfs://${cid}`, BigNumber.from(data.userCampaign.tokenId))
          .then(() => {
            router.push(`/plan/${router.query.id}/progress`);
          });
      });
    } else {
      console.log("loading");
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Record Today</div>
      {/* test input */}
      <div className={style.input}>
        <textarea
          className={style.input}
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </div>

      {/* upload image */}
      <input
        type="file"
        className={style.upload}
        onChange={handleUpload}
      ></input>

      {/* preview */}
      <div className={style.preview}>
        {imgs.map((src, index) => {
          return (
            <div className={style.previewItem} key={index}>
              <Image width="160" height="120" src={src} alt=""></Image>
            </div>
          );
        })}
      </div>

      <Button onClick={confirm} className={style.button}>
        Done
      </Button>
    </div>
  );
}

export default Sign;
