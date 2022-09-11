import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useContractRead } from "wagmi";
import { Campaign_ABI } from "../contracts/contants";

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
