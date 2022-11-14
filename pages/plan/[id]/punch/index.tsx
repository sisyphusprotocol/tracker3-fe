import * as React from "react";
import style from "./style.module.css";
import Image from "next/image";
import Button from "../../../../components/button";
import Top from "../../../../components/calendar/components/top";
import { useAccount, useContract, useSigner } from "wagmi";
import { Campaign } from "../../../../contracts/types";
import { useRouter } from "next/router";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "@apollo/client";
import {
  CampaignTokenIdResult,
  CAMPAIGN_TOKEN_ID,
} from "../../../../utils/graph";
import { uploadJson } from "../../../../utils/ipfs";
import { now } from "../../../../utils/convert";
import _upload from "./images/upload.png";
import _yuyin from "./images/yuyin.png";
import { Campaign_ABI } from "../../../../contracts/contants";

function Sign() {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const uploadRef = React.useRef<any>();
  const router = useRouter();
  const campaign = useContract<Campaign>({
    addressOrName: router.query.id
      ? (router.query.id as string)
      : ethers.constants.AddressZero,
    contractInterface: Campaign_ABI,
    signerOrProvider: signer,
  });

  const { loading, data } = useQuery<CampaignTokenIdResult>(CAMPAIGN_TOKEN_ID, {
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
  const [images, setImages] = React.useState([]);

  // if (!signer && address) return null;

  const handleUpload = (e) => {
    const file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      setImages([...images, data]);
    };
  };

  const confirm = () => {
    if (!loading) {
      uploadJson({ text: text, images: images, timestamp: now() }).then(
        (cid) => {
          campaign
            .checkIn(`ipfs://${cid}`, BigNumber.from(data.userCampaign.tokenId))
            .then(() => {
              router.push(`/plan/${router.query.id}/progress`);
            });
        }
      );
    } else {
      console.log("loading");
    }
  };

  const clickUploadIcon = () => {
    uploadRef.current.click();
  };

  return (
    <div className={style.wrapper}>
      <div className={style.top}>
        <Top title="Content" />
      </div>
      <div className={style.rules}>
        <div className={style["rule-title"]}>Writing protocol</div>
        <div className={style["rule-desc"]}>
          Some notes on the requirements for this...
        </div>
      </div>
      {/* test input */}
      <div className={style.input}>
        <textarea
          className={style.textarea}
          onChange={(e) => setText(e.target.value)}
          placeholder="    Enter text"
          value={text}
        />
        <div className={style.divide}></div>
        <div className={style["upload-img"]}>
          {" "}
          <Image
            src={_upload}
            alt=""
            className={style["upload-img"]}
            onClick={clickUploadIcon}
          />
        </div>
        <div className={style["yuyin-img"]}>
          {" "}
          <Image
            src={_yuyin}
            alt=""
            className={style["yuyin-img"]}
          />
        </div>
      </div>

      {/* upload image */}
      <input
        style={{ display: "none" }}
        type="file"
        ref={uploadRef}
        className={style.upload}
        onChange={handleUpload}
      ></input>
      {/* preview */}
      <div className={style.preview}>
        {images.map((src, index) => {
          return (
            <div className={style.previewItem} key={index}>
              <Image width="160" height="120" src={src} alt=""></Image>
            </div>
          );
        })}
      </div>

      <Button onClick={confirm} className={style.btn}>
        Done
      </Button>
    </div>
  );
}

export default Sign;
