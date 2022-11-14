import Image from "next/image";
import back from "../../../assets/back.png";

import style from "../index.module.css";

interface ITop {
  title?: string;
}

const Top = (props: ITop) => {
  return (
    <div className={style["top-nav"]}>
      <div className={style["back"]}>
        <Image src={back} alt="" />
      </div>
      <div className={style["title"]}>{props?.title || "Calendar"}</div>
    </div>
  );
};

export default Top;
