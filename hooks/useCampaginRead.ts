import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { Campaign_ABI } from "../contracts/contants";
import { getCampaignDetail } from "../utils/campaign";

export function useTokenOwner(campaign: string, tokenId: string): string {
  const { data } = useContractRead({
    address: campaign,
    abi: Campaign_ABI,
    functionName: "ownerOf",
    args: [tokenId],
    watch: true,
  });
  return data?.toString() || "";
}

export function useCurrentEpoch(campaign: string): BigNumber | undefined {
  const { data } = useContractRead({
    address: campaign,
    abi: Campaign_ABI,
    functionName: "currentEpoch",
    args: [],
    watch: true,
  });
  return data ? BigNumber.from(data) : BigNumber.from(0);
}

export function useCampaignHost(campaign: string): { host: string } {
  const { data } = useContractRead({
    address: campaign,
    abi: Campaign_ABI,
    functionName: "owner",
    args: [],
    enabled: !!campaign,
  });
  return { host: data?.toString() };
}

export function useCampaignStatus(campaign: string): BigNumber | undefined {
  const { data } = useContractRead({
    address: campaign,
    abi: Campaign_ABI,
    functionName: "status",
    args: [],
    watch: true,
  });
  return data ? BigNumber.from(data) : BigNumber.from(0);
}

export function useCampaignDetails(campaign: string) {
  const { data: uri } = useContractRead({
    address: campaign,
    abi: Campaign_ABI,
    functionName: "campaignUri",
    args: [],
    scopeKey: campaign,
    cacheTime: 100_000,
    suspense: true,
  });

  const { data, isLoading } = useQuery<{ title: string; description: string }>(
    ["metadata", uri],
    () => {
      return getCampaignDetail(uri.toString());
    },
    { retry: 10, enabled: !!uri }
  );

  return { data, isLoading };
}
