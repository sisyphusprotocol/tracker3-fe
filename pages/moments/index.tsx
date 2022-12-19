import style from "./index.module.css";
import Nav from "../../components/moment/nav";
import List from "../../components/moment/list";
import { ListDate } from "../../components/moment/list";

// TODO:mock
import { useQuery } from "@apollo/client";
import { MomentList, MOMENT_LIST } from "../../utils/graph";
// nav mock
const navMock = { title: "Moments" };

// list mock
export const useList = () => {
  const { data: queryData } = useQuery<MomentList>(MOMENT_LIST);

  const list: ListDate[] = queryData?.records?.map((record) => {
    return {
      id: record.id,
      userAddr: record.userCampaign.user.address,
      campaignAddr: record.userCampaign.campaign.address,
      time: Number(record.timestamp),
      current: Number(record.epoch) + 1,
      total: Number(record.userCampaign.campaign.epochCount),
      content: "content",
      moments: [],
      uri: record.contentUri,
      comments: [
        { id: "0x9D...4825", content: "Great!", time: Date.now() },
        { id: "0x9D...4825", content: "Great!", time: Date.now() },
      ],
    };
  });

  return list;
};

export default function Moments() {
  const list = useList();
  return (
    <div className={style["wrapper"]}>
      <Nav {...navMock} />
      <List dateSource={list} />
    </div>
  );
}
