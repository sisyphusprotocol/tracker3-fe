import styles from "./index.module.css";
import Tag from "../tag";
type ProgressProps = {
  now: number; // 19
  schedule: number; // 21
  isFinished?: boolean;
};

function Progress(props: ProgressProps) {
  return props.now !== props.schedule ? (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div
          className={styles.progress}
          style={{ width: `${(props.now / props.schedule) * 100}%` }}
        ></div>
      </div>
      <div className={styles.text}>
        {props.now}/{props.schedule}
      </div>
    </div>
  ) : (
    <div className={styles.done}>
      <div>Well done!!!</div>
      <div className={styles.tag}>
        <Tag type="yellow" content="Great" />
      </div>
    </div>
  );
}

export default Progress;
