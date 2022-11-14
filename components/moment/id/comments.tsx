import { IComment } from "../list";
import style from "./index.module.css";
import Avatar from "react-nice-avatar";
import like from "../../../assets/moments/like.svg";
import challenge from "../../../assets/moments/question.svg";
import Image from "next/image";
export default function Comments({ comments }: { comments: IComment[] }) {
  // 
  const parseTime = (date: number | Date) => {
    const d = new Date(date);
    let minutes = d.getMinutes() + "";
    minutes = minutes.length === 1 ? `0${minutes}` : minutes;
    return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${minutes}`;
  };
  return (
    <div className={style["comments-wrapper"]}>
      {comments.map(({ id, content, time }, idx) => (
        <div className={style["comment"]} key={idx}>
          <div className={style["left"]}>
            <Avatar style={{ width: ".35rem", height: ".35rem" }} />
          </div>
          <div className={style["right"]}>
            <div className={style["id"]}>{id}</div>
            <div className={style["content"]}>{content}</div>
            <div className={style["bottom"]}>
              <div className={style["time"]}>{parseTime(time)}</div>
              <div className={style["icon-list"]}>
                <Image src={challenge} alt="" />
                <Image src={like} alt="" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
