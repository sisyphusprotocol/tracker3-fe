import style from "./index.module.css";
import Image from "next/image";
// moments
const MomentsGrid = ({ images }) => (
  <div className={style["card-moments"]}>
    {images?.map((moment) => (
      <div key={moment} className={style["card-moments-img-wrapper"]}>
        <Image width={"100%"} height={"100%"} src={moment} alt="" />
      </div>
    ))}
  </div>
);

export default MomentsGrid;
