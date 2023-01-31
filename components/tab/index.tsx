import styles from "./index.module.css";
import { useState } from "react";

type TabItem = {
  label: string;
  activeCb: any;
};

interface ITabProps {
  tabItems: Array<TabItem>;
}

function Tab(props: ITabProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const switchActiveTab = (index: number, cb: () => any) => {
    setActiveTab(index);
    cb && cb();
  };

  return (
    <div className={styles["tabs"]}>
      {props.tabItems.map((item, index) => {
        return (
          <div
            className={
              index === activeTab
                ? styles["tab-item-selected"]
                : styles["tab-item"]
            }
            key={item.label}
            onClick={() => switchActiveTab(index, item.activeCb)}
          >
            <div
              className={
                index === activeTab
                  ? styles["tab-item-text-selected"]
                  : styles["tab-item-text"]
              }
              key={item.label}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Tab;
