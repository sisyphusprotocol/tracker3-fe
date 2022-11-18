import { useQuery } from "@apollo/client";
import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { modalContext } from "../components/modal";
import { Campaign_ABI } from "../contracts/contants";
import { Campaign } from "../contracts/types";
import { getRecordDetail, RecordDetail } from "../utils/campaign";
import { CampaignTokenIdResult, CAMPAIGN_TOKEN_ID } from "../utils/graph";
import { uploadJson } from "../utils/ipfs";

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
  const [cid, setCid] = useState(null);

  useEffect(() => {
    // TODO: clear old
    setCid(null);
    if (enable) {
      uploadJson({
        title: name,
        description: description,
      }).then((cid) => {
        setCid(cid);
      });
    }
  }, [name, description, enable]);

  return { data: cid };
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
  const [cid, setCid] = useState(null);

  useEffect(() => {
    if (enable) {
      // TODO: clear old
      uploadJson({
        text: text,
        images: images,
        timestamp: timestamp,
      }).then((cid) => {
        setCid(cid);
      });
    }
  }, [text, images, enable]);

  return { data: cid };
}
