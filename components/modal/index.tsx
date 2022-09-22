import React, {
  memo,
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import bg from "../../assets/createPlane/achievement.png";
import bg2 from "../../assets/createPlane/illustration.png";
import Button from "../button";
import styles from "./index.module.css";
import type { ModalProps, ModalType } from "./type";
import Image from "next/image";
import { packTokenAmount } from "../../utils/token";
import { BigNumber } from "ethers";

const Portal: React.FC<{ children: ReactElement }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) {
      console.log(containerRef.current);
      containerRef.current = document.createElement("div");
      document.body.appendChild(containerRef.current);
      setMounted(true);
    }
    return function cleanup() {
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
      }
    };
  }, []);

  return mounted && createPortal(children, containerRef.current);
};

const descData: Record<ModalType, string> = {
  approve: "You have approved your token successfully",
  sign: "You have signed up the program successfully!",
  create: "You have created the program successfully!",
  clock: "Well done!",
  get: "You have gained NFT of this achievement!",
  host: "You have selected your members successfully!",
  claim: "Achievement!",
};

// TODO: tx failed
const TxConfirmedModal = (props: ModalProps) => {
  const { isShow, setShow, type } = props;

  const data = {
    title: "Bravo!",
    desc: descData[type],
    staked: props.staked,
    Trx: props.txHash,
    Gas: `${props.gasFee}  MATIC`,
  };

  const poolReward =
    props?.userReward &&
    props?.staked &&
    BigNumber.from(props?.userReward)
      .sub(BigNumber.from(props?.staked))
      .toString();

  const { title, desc, Trx, Gas, staked } = data;
  return isShow ? (
    <Portal>
      <div className={styles.cover} onClick={() => setShow(!isShow)}>
        <div className={styles.container}>
          <div className={styles.flex}>
            <div className={styles["itemImg"]}>
              <Image src={bg2} alt="" />
            </div>

            <div className={styles.desc}>
              <p>{title}</p>
              <p>{desc}</p>
            </div>
            <div className={styles.line} />
            <div className={styles.detail}>
              {staked && (
                <div className={styles.detailItem}>
                  <div className={styles.label}>Staked</div>
                  <div>{packTokenAmount(staked)} TSS</div>
                </div>
              )}
              {poolReward && (
                <div className={styles.detailItem}>
                  <div className={styles.label}>PoolReward</div>
                  <div>{packTokenAmount(poolReward)} TSS</div>
                </div>
              )}
              {props?.hostReward && (
                <div className={styles.detailItem}>
                  <div className={styles.label}>HostReward</div>
                  <div>{packTokenAmount(props?.hostReward)} TSS</div>
                </div>
              )}
              <div className={styles.detailItem}>
                <div className={styles.label}>Trx</div>
                <div>{Trx}</div>
              </div>
              <div className={styles.detailItem}>
                <div className={styles.label}>Gas</div>
                <div>{Gas}</div>
              </div>
            </div>
            <Button className={styles.button}>Yay!</Button>
          </div>
        </div>
      </div>
    </Portal>
  ) : null;
};

export default TxConfirmedModal;
