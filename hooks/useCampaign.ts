import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";

import { modalContext } from "../components/modal";

import { getRecordDetail, RecordDetail } from "../utils/campaign";
import { CampaignTokenIdResult, CAMPAIGN_TOKEN_ID } from "../utils/graph";
import { useJsonCid, useUploadJson } from "./useJson";

export function useRecordContentList(recordUris: string[]) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {}, [recordUris]);

  return { data: data, isLoading: isLoading, error: isError };
}

export function useRecordContent(recordUri: string) {
  const [data, setData] = useState<RecordDetail>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    getRecordDetail(recordUri)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
      });
  }, [recordUri]);

  return { data: data, isLoading: isLoading, error: isError };
}

// query user's tokenId
export function useCampaignTokenId(
  campaign: string,
  userAddr: string
): { data: string } {
  const { data } = useQuery<CampaignTokenIdResult>(CAMPAIGN_TOKEN_ID, {
    variables: { userCampaign: `${userAddr}-${campaign}` },
    onCompleted(data) {
      console.log(data);
    },
  });

  return { data: data?.userCampaign?.tokenId || "" };
}

export function useCampaignRewardResultOnModal(
  campaign: string,
  userAddr: string
) {
  const [_, setData] = useContext(modalContext);

  const { refetch } = useQuery<CampaignTokenIdResult>(CAMPAIGN_TOKEN_ID, {
    variables: { userCampaign: `${userAddr}-${campaign}` },
    onCompleted(data) {
      setData({
        userReward: data?.userCampaign?.userRewardClaimedAmount,
        hostReward: data?.userCampaign?.hostRewardClaimedAmount,
      });
    },
  });

  return { refetch };
}

// update campaign info to ipfs and return uri
export function useUploadCampaignUri({
  name,
  description,
  enable,
}: {
  name: string;
  description: string;
  enable: boolean;
}) {
  const json = {
    title: name,
    description: description,
  };

  const cid = useJsonCid(json);
  const { data: success } = useUploadJson(json, enable);

  return { data: success && cid };
}

// update campaign info to ipfs and return uri
export function useUploadRecordUri({
  text,
  images,
  timestamp,
  enable,
}: {
  text: string;
  images: string[];
  timestamp: number;
  enable: boolean;
}) {
  const json = {
    text: text,
    images: images,
    timestamp: timestamp,
  };

  const cid = useJsonCid(json);
  const { data: success } = useUploadJson(json, enable);

  return { data: success && cid };
}
