import styles from "./tag.module.css";

type TagProps = {
  type: string;
  content: string;
};

function Tag(props: TagProps) {
  return (
    <div
      className={`${styles.wrapper} ${
        props.type === "purple" ? styles.purple : styles.yellow
      }`}
    >
      <div className={styles["tag-name"]}>{props.content}</div>
    </div>
  );
}

export default Tag;
