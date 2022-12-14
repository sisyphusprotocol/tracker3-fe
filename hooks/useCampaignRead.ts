import { BigNumber } from "ethers";
import useSWR from "swr";
import { useContractRead } from "wagmi";
import { Campaign_ABI } from "../contracts/contants";
import { getCampaignDetail } from "../utils/campaign";

export function useTokenOwner(campaign: string, tokenId: string): string {
  const { data } = useContractRead({
    address: campaign,
    abi: Campaign_ABI,
    functionName: "ownerOf",
    args: [tokenId],
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
  });

  const { data, isLoading } = useSWR<{ title: string; description: string }>(
    uri,
    (uri) => {
      return getCampaignDetail(uri);
    }
  );

  return { data, isLoading };
}
