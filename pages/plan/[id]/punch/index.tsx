import { useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import Image from "next/image";
import Button from "../../../../components/button";
import Top from "../../../../components/calendar/components/top";
import { useAccount, useContract, useSigner } from "wagmi";
import { useRouter } from "next/router";

import { now } from "../../../../utils/convert";
import _upload from "./images/upload.png";
import _yuyin from "./images/yuyin.png";
import {
  useCampaignTokenId,
  useUploadRecordUri,
} from "../../../../hooks/useCampaign";
import { useCampaignCheckIn } from "../../../../hooks/useCampaignWrite";
import { useTraceTransaction } from "../../../../hooks/useTraceTransaction";
import { useCampaignDetails } from "../../../../hooks/useCampaginRead";

function Punch() {
  const { address } = useAccount();
  const uploadRef = useRef<any>();
  const router = useRouter();
  const campaignAddr = router.query.id as string;

  const { data: tokenId } = useCampaignTokenId(
    campaignAddr,
    address?.toLowerCase()
  );

  const { data: detail } = useCampaignDetails(campaignAddr);

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [record, setRecord] = useState<{
    text: string;
    images: string[];
    timestamp: number;
  }>(undefined);
  const [enableUpload, setEnableUpload] = useState(false);

  const { data: cid } = useUploadRecordUri({
    ...record,
    enable: enableUpload,
  });

  const {
    execute,
    write,
    data: CheckInData,
  } = useCampaignCheckIn({
    campaignAddr: campaignAddr,
    tokenId: tokenId,
    uri: `ipfs://${cid}`,
  });
  useTraceTransaction(CheckInData?.hash, { type: "check" }, () => {
    router.push(`/plan/${campaignAddr}/progress`);
  });

  const handleLoadImages = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      setImages([...images, data]);
    };
  };

  const clickUploadIcon = () => {
    uploadRef.current.click();
  };

  const confirm = () => {
    setRecord({ text, images, timestamp: now() });
    setEnableUpload(true);
  };

  useEffect(() => {
    if (enableUpload && cid && write) {
      execute();
      setEnableUpload(false);
    }
  }, [enableUpload, cid, execute, write]);

  return (
    <div className={style.wrapper}>
      <div className={style.top}>
        <Top title="Clock In" />
      </div>
      <div className={style.rules}>
        <div className={style["rule-title"]}>{detail?.title}</div>
        <div className={style["rule-desc"]}>{detail?.description}</div>
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
          <Image src={_yuyin} alt="" className={style["yuyin-img"]} />
        </div>
      </div>

      {/* upload image */}
      <input
        style={{ display: "none" }}
        type="file"
        ref={uploadRef}
        className={style.upload}
        onChange={handleLoadImages}
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

export default Punch;
