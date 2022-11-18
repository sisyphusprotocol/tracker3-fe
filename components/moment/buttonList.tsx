import Image from "next/image";
import { useState } from "react";
import comment from "../../assets/moments/button-msg.svg";
import like from "../../assets/moments/like.svg";
import challenge from "../../assets/moments/question.svg";
import style from "./index.module.css";
import { useRouter } from "next/router";
import classNames from "classnames";
// moments button
const ButtonList = ({ challengeCallBack }) => {
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
  const [actIdx, setActIdx] = useState(-1);
  const router = useRouter();
  const showAct = router.pathname.startsWith("/moments");
  const classname = (idx) =>
    classNames(
      style["button"],
      showAct && actIdx === idx ? style["button-active"] : ""
    );
  return (
    <div className={style["button-list-wrapper"]}>
      {list.map(({ title, icon, callback }, idx) => (
        <div
          className={classname(idx)}
          key={title}
          onClick={() => {
            callback();
            setActIdx(idx);
          }}
        >
          <Image src={icon} alt="" />
          <span>{title}</span>
        </div>
      ))}
    </div>
  );
};
export default ButtonList;
