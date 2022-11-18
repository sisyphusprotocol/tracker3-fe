import styles from "./index.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

import navList from "./constant";
const unShowPath = ["/mobile", "/home", "/moments/"];
function Nav() {
  const router = useRouter();

  const { address } = useAccount();

  const turnTo = (url: string) => {
    router.push(url);
  };

  const show = !unShowPath.some((path) => router.pathname.startsWith(path));
  function isActive(navigate: string) {
    return router.pathname.startsWith(navigate);
  }

  return (
    show && (
      <div className={styles["nav"]}>
        <div className={styles["list"]}>
          {navList.map(({ message, img, navigate, activeImg }) => {
            return (
              <div
                key={message}
                onClick={() => {
                  navigate && turnTo(navigate);
                }}
                className={styles["nav-item"]}
              >
                <div className={styles["item-container"]}>
                  <div
                    className={
                      styles[
                        !isActive(navigate) ? "item-icon" : "active-item-icon"
                      ]
                    }
                  >
                    <Image src={isActive(navigate) ? activeImg : img} alt="" />
                  </div>
                </div>
                <div className={styles["item-text"]}>{message}</div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
export default Nav;
