import classNames from "classnames";
import style from "./index.module.css";
export default function ProgressBar({
  step,
  title,
  percent,
  isActive = false,
}: {
  step: 1 | 2 | 3;
  title: string;
  percent: number;
  isActive?: boolean;
}) {
  const className = classNames(
    style["progress-wrapper"],
    isActive ? style["border-active"] : ""
  );
  return (
    <div className={className}>
      <div className={style["title-default"]} style={{ width: `${percent}%` }}>
        {title}
      </div>
      <div className={style["percent"]}>{percent}%</div>
    </div>
  );
}
