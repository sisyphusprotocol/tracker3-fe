import nav1 from "../../assets/Vectornav1.png";
import nav2 from "../../assets/Vectornav2.png";
import nav3 from "../../assets/Vectornav3.png";
import nav4 from "../../assets/Vectornav4.png";
import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

function Nav() {
  const router = useRouter();
  const { address } = useAccount();

  const turnTo = (url: string) => {
    router.push(url);
  };

  return (
    <div className={styles["nav"]}>
      <div
        onClick={() => {
          turnTo(`/host`);
        }}
        className={styles["nav-item"]}
      >
        <div className={styles["item-icon"]}>
          <Image src={nav1} className={styles["common"]} alt="" />
        </div>
        <div className={styles["item-text"]} style={{marginLeft:'-0.172rem'}}>My Traker</div>
      </div>
      <div
        onClick={() => {
          turnTo("/find");
        }}
        className={styles["nav-item"]}
      >
        <div className={styles["item-icon"]}>
          <Image src={nav2} className={styles["common"]} alt="" />
        </div>
        <div className={styles["item-text"]} style={{ marginLeft: "-0.008rem" }}>
          Find
        </div>
      </div>
      {/* <div onClick={() => {
          turnTo("/calendar");
        }} className={styles["nav-item"]}>
        <div className={styles["item-icon"]}>
          <Image src={nav3} className={styles["common"]} alt="" />
        </div>
        <div className={styles["item-text"]} style={{marginLeft:'-0.13rem'}}>Monment</div>
      </div> */}
      <div className={styles["nav-item"]}>
        <div className={styles["item-icon"]}>
          <Image src={nav4} className={styles["common"]} alt="" />
        </div>
        <div className={styles["item-text"]} style={{marginLeft:'-0.089rem'}}>Account</div>
      </div>
    </div>
  );
}
export default Nav;
