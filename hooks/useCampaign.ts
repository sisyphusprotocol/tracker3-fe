import { useQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { Campaign_ABI } from "../contracts/contants";
import { getRecordDetail, RecordDetail } from "../utils/campaign";
import { CampaignTokenIdResult, CAMPAIGN_TOKEN_ID } from "../utils/graph";

export function useTokenOwner(campaign: string, tokenId: string): string {
  const { data } = useContractRead({
    addressOrName: campaign,
    contractInterface: Campaign_ABI,
    functionName: "ownerOf",
    args: [tokenId],
    watch: true,
  });
  return data?.toString() || "";
}

export function useCurrentEpoch(campaign: string): BigNumber | undefined {
  const { data } = useContractRead({
    addressOrName: campaign,
    contractInterface: Campaign_ABI,
    functionName: "currentEpoch",
    args: [],
    watch: true,
  });
  return data ? BigNumber.from(data) : BigNumber.from(0);
}

export function useCampaignHost(campaign: string): { host: string } {
  const { data } = useContractRead({
    addressOrName: campaign,
    contractInterface: Campaign_ABI,
    functionName: "owner",
    args: [],
    enabled: !!campaign,
  });
  return { host: data?.toString() };
}

export function useCampaignStatus(campaign: string): BigNumber | undefined {
  const { data } = useContractRead({
    addressOrName: campaign,
    contractInterface: Campaign_ABI,
    functionName: "status",
    args: [],
    watch: true,
  });
  return data ? BigNumber.from(data) : BigNumber.from(0);
}

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

export function useStartChallenge({
  campaignAddr,
  challengerTokenId,
  cheaterTokenId,
  epoch,
}: {
  campaignAddr: string;
  challengerTokenId: string;
  cheaterTokenId: string;
  epoch: number;
}) {
  const { data: signer } = useSigner();
  const { config, refetch } = usePrepareContractWrite({
    addressOrName: campaignAddr,
    contractInterface: Campaign_ABI,
    functionName: "challenge",
    signer: signer,
    args: [challengerTokenId, cheaterTokenId, epoch],
    enabled:
      challengerTokenId !== undefined &&
      cheaterTokenId !== undefined &&
      epoch !== undefined,
  });

  // challenge tx
  const { write, data } = useContractWrite(config);

  return { write: write, data: data };
}

// user vote
export function useVoteForChallenge({
  campaignAddr,
  challengeId,
  choice,
}: {
  campaignAddr: string;
  challengeId: string;
  choice: boolean;
}) {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { data: tokenId } = useCampaignTokenId(
    campaignAddr,
    address?.toLowerCase()
  );

  const { config, refetch } = usePrepareContractWrite({
    addressOrName: campaignAddr,
    contractInterface: Campaign_ABI,
    functionName: "vote",
    signer: signer,
    args: [tokenId, challengeId, choice],
    enabled:
      tokenId !== undefined &&
      challengeId !== undefined &&
      choice !== undefined,
  });

  // challenge tx
  const { write, data } = useContractWrite(config);

  return { write: write, data: data };
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
