import { useContract } from "wagmi";
import { getContent, parseCid } from "./ipfs";

export declare type CampaignDetail = {
  id?: string;
  uri?: string;
  title: string;
  description: string;
  startTime?: number;
  totalTime?: number;
  token?: string;
  requiredAmount?: string;
  memberCount?: number;
};

export declare type RecordDetail = {
  text: string;
  images: string[];
  timestamp: number;
};

export async function getCampaignDetail(uri: string) {
  const data = await getContent(parseCid(uri));

  const detail: { title: string; description: string } = JSON.parse(
    JSON.stringify(data)
  );

  return detail;
}

export async function getRecordDetail(uri: string): Promise<RecordDetail> {
  const data = await getContent(parseCid(uri));

  const detail: RecordDetail = JSON.parse(JSON.stringify(data));

  return detail;
}
