import Nav from "../../../components/moment/nav";
import style from "../index.module.css";
import Tabs from "../../../components/moment/tabs";
import { useList } from "..";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import CardTop from "../../../components/moment/info";
import MomentsGrid from "../../../components/moment/momentsGrid";
import Challenge, { IChallenge } from "../../../components/moment/id/challenge";
import Comments from "../../../components/moment/id/comments";
import { useRecordContent } from "../../../hooks/useCampaign";
import { useQuery } from "@apollo/client";
import { MomentDetail, MOMENT_Detail } from "../../../utils/graph";

interface IMomentDetailPart {
  id: string;
  userAddr: string;
  timestamp: number;
  current: number;
  total: number;
  uri: string;
  challenge?: IChallenge;
}

export function MomentDetailPart(props: IMomentDetailPart) {
  const { data: detail } = useRecordContent(props.uri);

  useEffect(() => console.log(props), [props]);

  return (
    <>
      <CardTop
        userAddr={props.userAddr}
        timestamp={props.timestamp}
        current={props.current}
        total={props.total}
      />
      <div className={style["card-content"]}>{detail?.text}</div>
      <MomentsGrid images={detail?.imgs} />
      <div className={style["line"]} />
      <div style={{ marginTop: ".36rem" }}>
        <Tabs
          tabs={{
            Challenge: <Challenge {...props.challenge} />,
            Comments: <Comments comments={[]} />,
          }}
        />
      </div>
    </>
  );
}

function useMomentDetail() {
  const router = useRouter();

  const { data } = useQuery<MomentDetail>(MOMENT_Detail, {
    variables: { record: router.query.id as string },
  });

  const challengeData: IChallenge = {
    campaign: data?.record?.userCampaign.campaign.address,
    challengeId: data?.record?.challenge.id,
    status: data?.record?.challenge?.result || "None",
    agreeCount: Number(data?.record?.challenge?.agreeCount),
    disagreeCount: Number(data?.record?.challenge?.disagreeCount),
    noVoteCount: Number(data?.record?.challenge?.noVoteCount),
    deadline: Number(data?.record.challenge.deadline),
  };

  return { data: data, challengeData: challengeData };
}

export default function Detail() {
  const router = useRouter();

  const { data, challengeData } = useMomentDetail();

  if (!router.query.id) return null;

  // 
  return (
    <div className={style["wrapper"]}>
      <Nav title="Moment" showBack={true} />
      <div className={style["card-wrapper"]} style={{ margin: "0 .08rem" }}>
        <MomentDetailPart
          id={data?.record.id}
          timestamp={Number(data?.record.timestamp)}
          userAddr={data?.record.userCampaign.user.address}
          current={Number(data?.record.epoch) + 1}
          total={Number(data?.record.userCampaign.campaign.epochCount)}
          uri={data?.record.contentUri}
          challenge={challengeData}
        />
      </div>
    </div>
  );
}
