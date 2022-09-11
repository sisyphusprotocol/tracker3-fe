import { DocumentNode, gql, useQuery } from "@apollo/client";

export async function TheGraphData(
  query: DocumentNode,
  variables: any
): Promise<any> {
  const { loading, error, data } = useQuery(query, { variables: variables });

  if (loading) return null;

  if (error) return `Error! ${error}`;

  return data;
}

export declare type CampaignListResult = {
  campaigns?: {
    id: string;
    startTime: number;
    totalTime: number;
    requiredAmount: string;
    memberCount: string;
    uri: string;
  }[];
};

// TODO: set limit
export const CAMPAIGN_LIST = gql`
  query ($time: Int!) {
    campaigns(
      where: { startTime_gte: $time }
      orderBy: startTime
      orderDirection: asc
    ) {
      id
      startTime
      totalTime
      requiredAmount
      memberCount
      uri
    }
  }
`;

export declare type CampaignDetailResult = {
  campaign: {
    id: string;
    startTime: number;
    periodLength: string;
    totalTime: number;
    requiredAmount: string;
    memberCount: number;
    targetToken: {
      id: string;
    };
    uri: string;
  };
};

export const CAMPAIGN_DETAIL = gql`
  query ($addr: String!) {
    campaign(id: $addr) {
      id
      startTime
      periodLength
      totalTime
      requiredAmount
      memberCount
      targetToken {
        id
      }
      uri
    }
  }
`;

export declare type UserCampignResult = {
  userCampaign?: {
    id: string;
    userStatus:
      | "NotParticipate"
      | "Signed"
      | "Admitted"
      | "Refused"
      | "Sucess"
      | "Failure";
  };
};

export const USER_CAMPAIGN_DETAIL = gql`
  query ($userCampaign: String!) {
    userCampaign(id: $userCampaign) {
      id
      userStatus
    }
  }
`;

export declare type CreatedCampaignType = {
  campaigns: {
    id: string;
    uri: string;
    totalTime: number;
    users: { id: string; user: { id: string } }[];
  }[];
};

export const PARTICIPATED_CAMPAIGN = gql`
  query ($user: String!, $time: Int!) {
    campaigns(
      first: 5
      where: { endTime_gte: $time, users_: { user: $user } }
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      uri
      totalTime
      endTime
      users {
        id
      }
    }
  }
`;

export const CREATED_CAMPAIGN = gql`
  query ($user: String!, $time: Int!) {
    campaigns(
      first: 5
      where: { endTime_gte: $time, users_: { user: $user, isHost: true } }
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      uri
      totalTime
      endTime
      users {
        id
      }
    }
  }
`;

export declare type CampaignTokenIdResult = {
  userCampaign: {
    // BigInt string
    tokenId: string;
    userRewardClaimed: boolean;
    hostRewardClaimed: boolean;
    userRewardClaimedAmount: string;
    hostRewardClaimedAmount: string;
  };
};

export const CAMPAIGN_TOKENID = gql`
  query ($userCampaign: String!) {
    userCampaign(id: $userCampaign) {
      tokenId
      userRewardClaimed
      hostRewardClaimed
      userRewardClaimedAmount
      hostRewardClaimedAmount
    }
  }
`;

export declare type PersonalPunchResult = {
  record: {
    id: string;
    contentUri: string;
  };
};

export const PERSONAL_PUNCH = gql`
  query ($userCampaignEpoch: String!) {
    record(id: $userCampaignEpoch) {
      id
      contentUri
    }
  }
`;

export declare type CampaignSignedResult = {
  campaign: {
    users: {
      id: string;
      userStatus: string;
      tokenId: string;
      user: { id: string };
    }[];
  };
};

export const CAMPAIGN_SIGNED = gql`
  query ($campaign: String!) {
    campaign(id: $campaign) {
      users(where: { userStatus_not_in: ["NotParticipate"] }) {
        id
        userStatus
        tokenId
        user {
          id
        }
      }
    }
  }
`;

export declare type CanCreateCampaignResult = {
  user?: {
    canBeHost: boolean;
  };
};

export const CAN_CREATE_CAMPAGIN = gql`
  query ($user: String!) {
    user(id: $user) {
      canBeHost
    }
  }
`;
