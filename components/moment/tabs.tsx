import comment from "../../assets/moments/button-msg.svg";
import like from "../../assets/moments/like.svg";
import challenge from "../../assets/moments/question.svg";
import Image from "next/image";
import style from "./index.module.css";
import { useState } from "react";
import classNames from "classnames";
const Tabs = ({
  tabs,
}: {
  tabs: Record<"Challenge" | "Comments", JSX.Element>;
}) => {
  // 
  const [active, setActive] = useState<"Challenge" | "Comments">("Comments");

  const isActive = title =>
    classNames(style["button"], active === title ? style["active"] : "");

  return (
    <>
      <div className={style["button-list-wrapper"]}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className={isActive("Challenge")}
            onClick={() => setActive("Challenge")}
          >
            <Image src={challenge} alt="" />
            <span>Challenge</span>
          </div>
          <div
            className={isActive("Comments")}
            onClick={() => setActive("Comments")}
            style={{ marginLeft: ".18rem" }}
          >
            <Image src={comment} alt="" />
            <span>Comments</span>
          </div>
        </div>
        <div className={style["button"]}>
          <Image src={like} alt="" />
          <span>Like</span>
        </div>
      </div>
      <div className={style["line"]} />
      {tabs[active]}
    </>
  );
};

export default Tabs;
