import style from "./index.module.css";
import back from "../../assets/moments/back.svg";
import message from "../../assets/moments/message.svg";
import Image from "next/image";
import { useRouter } from "next/router";
export default function Nav({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) {
  const router = useRouter()
  return (
    <div className={style["nav-wrapper"]} onClick={()=>router.back()}>
      {showBack ? <Image src={back} alt="" /> : <div className={style['w-27']}/>}
      <div>{title}</div>
      <Image src={message} alt="" />
    </div>
  );
}
