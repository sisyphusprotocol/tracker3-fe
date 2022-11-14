import classNames from "classnames";
import styles from "./device/index.module.css";

export default function Iphone13() {
  return (
    <div className={classNames(styles.container)}>
      <div className={classNames(styles.device, styles["device-iphone-13"])}>
        <div className={styles["device-frame"]}>
          <div className={styles["device-content"]}>
            <div style={{ width: "100%", height: 28 }}></div>
            <iframe
              width="100%"
              height="100%"
              className={styles["device-iframes-13"]}
              src="/"
            ></iframe>
          </div>
        </div>
        <div className={styles["device-stripe"]}></div>
        <div className={styles["device-header"]}></div>
        <div className={styles["device-sensors"]}></div>
        <div className={styles["device-btns"]}></div>
        <div className={styles["device-power"]}></div>
      </div>
    </div>
  );
}
