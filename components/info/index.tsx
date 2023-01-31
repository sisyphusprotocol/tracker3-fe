import Image from "next/image";
import style from "./index.module.css";
import _avatar from "./images/avatar.png";

interface InfoProps {
  avatar?: any;
  name?: string;
  id?: string;
  className?: string;
}

function Info(props: InfoProps) {
  return (
    <div className="relative flex flex-row top-1 m-0.5 px-2 items-center w-auto">
      <div className="relative flex shrink-0 h-1.5 w-1.5">
        <Image
          src={props.avatar ? props.avatar : _avatar}
          alt=""
          className="flex"
        ></Image>
      </div>
      <div className={style.name}>{props.name ? props.name : "Jerry"}</div>
      <div className={style.id}>{props.id ? props.id : "0x1111..2222"}</div>
    </div>
  );
}
export default Info;
