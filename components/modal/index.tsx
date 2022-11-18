import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import bg2 from "../../assets/cover.svg";
import Button from "../button";
import styles from "./index.module.css";
import type { ModalProps, ModalType } from "./type";
import Image from "next/image";
import { packTokenAmount, packTokenAmountToFix } from "../../utils/token";
import { BigNumber } from "ethers";
import { useSetState } from "react-use";
import { TokenMap } from "../../contracts/contants";

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
  sign: "You have signed up the campaign successfully!",
  create: "You have created the campaign successfully!",
  check: "Well done!",
  select: "You have selected your members successfully!",
  claim: "Achievement!",
  challenge: "You have started a challenge",
  vote: "You have voted successfully!",
};

export const modalContext =
  createContext<[ModalProps, React.Dispatch<React.SetStateAction<ModalProps>>]>(
    null
  );

// modal provider
export function ModalProvider({ children }) {
  const [modalData, setModalData] = useSetState<ModalProps>({
    isShow: false,
  });

  return (
    <modalContext.Provider value={[modalData, setModalData]}>
      {children}
      <GlobalTxConformModal />
    </modalContext.Provider>
  );
}

//  modal
export function GlobalTxConformModal() {
  const defaultModalProps: ModalProps = {
    isShow: false,
    onClick: null,
    type: null,
    title: null,
    desc: null,
    gasFee: null,
    token: null,
    staked: null,
    userReward: null,
    hostReward: null,
  };
  const [data, setData] = useContext(modalContext);
  const {
    title,
    isShow,
    onClick,
    type,
    txHash,
    token,
    gasFee,
    staked,
    userReward,
    hostReward,
  } = data;

  const desc = descData[type];
  const Gas = `${gasFee}  MATIC`;

  const poolReward =
    userReward &&
    staked &&
    BigNumber.from(userReward).sub(BigNumber.from(staked)).toString();

  return isShow ? (
    <Portal>
      <div
        className={styles.cover}
        onClick={() => {
          setData(defaultModalProps);
          onClick && onClick();
        }}
      >
        <div className={styles.container}>
          <div className={styles.flex}>
            <div className={styles["itemImg"]}>
              <Image quality={100} src={bg2} alt="" />
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
                  <div>
                    {packTokenAmountToFix(staked)} {TokenMap[token]}
                  </div>
                </div>
              )}
              {poolReward && (
                <div className={styles.detailItem}>
                  <div className={styles.label}>PoolReward</div>
                  <div>
                    {packTokenAmount(poolReward, 6)} {TokenMap[token]}
                  </div>
                </div>
              )}
              {hostReward && (
                <div className={styles.detailItem}>
                  <div className={styles.label}>HostReward</div>
                  <div>
                    {packTokenAmount(hostReward, 6)} {TokenMap[token]}
                  </div>
                </div>
              )}
              <div className={styles.detailItem}>
                <div className={styles.label}>Trx</div>
                <div>{txHash}</div>
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
  ) : (
    <div />
  );
}

// export default TxConfirmedModal;
