import { useCallback } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import {
  CampaignFactory_ABI,
  Campaign_ABI,
  CAMPAIGN_FACTORY_ADDRESS,
} from "../contracts/contants";
import { useCampaignTokenId } from "./useCampaign";

// create a campaign
export function useCreateCampaign({
  token,
  amount,
  name,
  symbol,
  startTime,
  totalPeriod,
  periodLength,
  challengeLength,
  campaignUri,
}: {
  token: string;
  amount: string;
  name: string;
  symbol: string;
  startTime: number;
  totalPeriod: number;
  periodLength: number;
  challengeLength: number;
  campaignUri: string;
}) {
  const { data: signer } = useSigner();
  const { config, refetch, error } = usePrepareContractWrite({
    addressOrName: CAMPAIGN_FACTORY_ADDRESS,
    contractInterface: CampaignFactory_ABI,
    functionName: "createCampaign",
    signer: signer,
    args: [
      token,
      amount,
      name,
      symbol,
      startTime,
      totalPeriod,
      periodLength,
      challengeLength,
      campaignUri,
      "0x",
    ],
    enabled: !!token && !!campaignUri,
  });

  //  tx
  const { write, data } = useContractWrite(config);

  return { write: write, data: data };
}

// admit user
export function useCampaignAdmit({
  campaignAddr,
  tokenIds,
}: {
  campaignAddr: string;
  tokenIds: string[];
}) {
  const { data: signer } = useSigner();
  const { config, refetch, error } = usePrepareContractWrite({
    addressOrName: campaignAddr,
    contractInterface: Campaign_ABI,
    functionName: "admit",
    signer: signer,
    args: [tokenIds],
    enabled: !!campaignAddr,
  });

  // admit tx
  const { write, data } = useContractWrite(config);

  const execute = useCallback(() => {
    if (error) {
      alert(error);
    } else {
      write();
    }
  }, [write, error]);

  return { execute: execute, data: data };
}

// admit user
export function useCampaignCheckIn({
  campaignAddr,
  tokenId,
  uri,
}: {
  campaignAddr: string;
  tokenId: string;
  uri: string;
}) {
  const { data: signer } = useSigner();
  const { config, refetch, error } = usePrepareContractWrite({
    addressOrName: campaignAddr,
    contractInterface: Campaign_ABI,
    functionName: "checkIn",
    signer: signer,
    args: [uri, tokenId],
    enabled: !!campaignAddr,
  });

  // checkIn tx
  const { write, data, error: err } = useContractWrite(config);

  const execute = useCallback(() => {
    if (error) {
      alert(error);
    } else {
      write();
    }
  }, [write, error]);

  return { execute: execute, write: write, data: data };
}

// start a challenge
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
  const { config, refetch, error } = usePrepareContractWrite({
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

  const execute = useCallback(() => {
    if (error) {
      alert(error);
    } else {
      write();
    }
  }, [write, error]);

  return { execute: execute, write: write, data: data };
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

  const { config, refetch, error } = usePrepareContractWrite({
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

  const execute = useCallback(() => {
    if (error) {
      alert(error);
    } else {
      write();
    }
  }, [write, error]);

  return { execute: execute, write: write, data: data };
}
