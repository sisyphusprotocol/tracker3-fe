import style from "./index.module.css";
import Image from "next/image";
import comment from "../../assets/moments/button-msg.svg";
import like from "../../assets/moments/like.svg";
import challenge from "../../assets/moments/question.svg";
import MomentsGrid from "./momentsGrid";
import CardTop from "./info";
import { useRouter } from "next/router";
import {
  useCampaignTokenId,
  useRecordContent,
  useStartChallenge,
} from "../../hooks/useCampaign";
import { useAccount } from "wagmi";
import { Campaign_ABI } from "../../contracts/contants";
import { useTraceTraction } from "../../hooks/useTraceTransaction";
import { useCallback } from "react";
import { useGlobalTxConfirmModal } from "../modal";

// moments button
export const ButtonList = ({ challengeCallBack }) => {
  const list = [
    {
      title: "Challenge",
      icon: challenge,
      callback: challengeCallBack,
    },
    {
      title: "Comments",
      icon: comment,
      callback: () => console.log("Comments"),
    },
    { title: "Like", icon: like, callback: () => console.log("Like") },
  ];

  return (
    <div className={style["button-list-wrapper"]}>
      {list.map(({ title, icon, callback }) => (
        <div className={style["button"]} key={title} onClick={callback}>
          <Image src={icon} alt="" />
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
};

interface IMomentPart {
  id: string;
  campaignAddr: string;
  userAddr: string;
  timestamp: number;
  current: number;
  total: number;
  uri: string;
}

function MomentPart(props: IMomentPart) {
  const router = useRouter();
  const { address } = useAccount();
  const { data: detail } = useRecordContent(props.uri);
  const { data: challengerId } = useCampaignTokenId(
    props.campaignAddr,
    address.toLowerCase()
  );
  const { data: cheaterId } = useCampaignTokenId(
    props.campaignAddr,
    props.userAddr
  );

  const { write: startChallenge, data } = useStartChallenge({
    campaignAddr: props.campaignAddr,
    challengerTokenId: challengerId,
    cheaterTokenId: cheaterId,
    epoch: props.current - 1,
  });

  const challengeCallBack = useCallback(() => {
    if (challengerId === cheaterId) {
      alert("Cannot Challenge yourself");
    } else if (!challengerId) {
      alert("You cannot challenge due to not participation");
    } else {
      startChallenge();
    }
  }, [challengerId, cheaterId, startChallenge]);

  return (
    <>
      <CardTop
        userAddr={props.userAddr}
        timestamp={props.timestamp}
        current={props.current}
        total={props.total}
        onClick={() => router.push(`/moments/${props.id}`)}
      />
      <div className={style["card-content"]}>{detail?.text}</div>
      <MomentsGrid images={detail?.imgs} />
      <div className={style["line"]} />
      <ButtonList challengeCallBack={challengeCallBack} />
    </>
  );
}

export default function List({ dateSource }: { dateSource: ListDate[] }) {
  return (
    <div className={style["list-wrapper"]}>
      {dateSource?.map(
        ({
          id,
          time,
          userAddr,
          current,
          total,
          campaignAddr,
          moments,
          uri,
        }) => (
          <div key={id} className={style["card-wrapper"]}>
            <MomentPart
              id={id}
              campaignAddr={campaignAddr}
              timestamp={time}
              userAddr={userAddr}
              current={current}
              total={total}
              uri={uri}
            />
          </div>
        )
      )}
    </div>
  );
}

export type ListDate = {
  id: string; // moment id
  userAddr: string; // user id
  campaignAddr: string; // campaign contract address
  time: number; //  
  content: string; //
  moments: any[]; // list TODO: mockstring[]urlstring

  current: number; // 
  total: number; // 
  comments: IComment[];

  uri?: string; // ipfs uri get content and moments
};

export type IComment = { id: string; content: string; time: number | Date };
