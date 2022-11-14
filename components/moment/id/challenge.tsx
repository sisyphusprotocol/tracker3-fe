import style from "./index.module.css";
import { useEffect, useState } from "react";
import ProgressBar from "./progressbar";
import moment from "moment";
import { useVoteForChallenge } from "../../../hooks/useCampaign";

export interface IChallenge {
  // campaign address
  // TODO: can use a custom hook
  campaign: string;
  challengeId: string;
  status: "None" | "Voting" | "VoteNotEnough" | "Approved" | "Failed";
  agreeCount: number;
  disagreeCount: number;
  noVoteCount: number;
  deadline: number; // timestamp
}

export default function Challenge(props: IChallenge) {
  const [active, setActive] = useState(0);

  const { write: vote } = useVoteForChallenge({
    campaignAddr: props.campaign,
    challengeId: props.challengeId,
    choice: active === 0,
  });

  // 0 1 2
  const list = ["AGREE", "DISAGREE", "NOT VOTE"];

  const totalCount = props.agreeCount + props.disagreeCount + props.noVoteCount;
  const date = [
    { step: 1, percent: Math.round((100 * props.agreeCount) / totalCount) },
    { step: 1, percent: Math.round((100 * props.disagreeCount) / totalCount) },
    { step: 1, percent: Math.round((100 * props.noVoteCount) / totalCount) },
  ];

  return (
    <div>
      <div className={style["title"]}>Current Vote</div>
      <div className={style["content"]}>
        A challenge has been launched and you can vote for it, so please choose
        carefully!
      </div>
      {(() => {
        switch (props.status) {
          case "Voting":
            return (
              <>
                {list.map((i, idx) => (
                  <div
                    key={idx}
                    style={{ marginBottom: ".19rem" }}
                    onClick={() => setActive(idx)}
                  >
                    <ProgressBar
                      step={date[idx].step as any}
                      title={i}
                      isActive={active == idx}
                      percent={date[idx].percent}
                    />
                  </div>
                ))}
                <div className={style["center"]}>
                  <div className={style["deadline"]}>
                    Deadline:{" "}
                    {moment.unix(props.deadline).format("YYYY.MM.DD HH:SS")}
                  </div>
                  <div
                    onClick={() => {
                      console.log(vote);
                      vote();
                    }}
                    className={style["vote"]}
                  >
                    VOTE
                  </div>
                </div>
              </>
            );
          case "None":
            return (
              <div className={style["center"]}>
                <div className={style["deadline"]}>No Vote Currently</div>
              </div>
            );
          default:
            return (
              <div className={style["center"]}>
                <div className={style["deadline"]}>No Vote Currently</div>
              </div>
            );
        }
      })()}
    </div>
  );
}
