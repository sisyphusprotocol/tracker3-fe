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

export declare type NotStartCampaignList = {
  campaigns?: {
    id: string;
    startTime: number;
    endTime: number;
    totalTime: number;
    requiredAmount: string;
    memberCount: string;
    epochCount: string;
    uri: string;
    targetToken: {
      id: string;
    };
  }[];
};

// campaign which is not started yet
export const NOT_START_CAMPAIGN_LIST = gql`
  query ($time: Int!) {
    campaigns(
      where: { startTime_gte: $time }
      orderBy: startTime
      orderDirection: asc
    ) {
      id
      startTime
      totalTime
      endTime
      requiredAmount
      memberCount
      epochCount
      uri
      targetToken {
        id
      }
    }
  }
`;

export declare type OnGoingCampaignList = {
  campaigns?: {
    id: string;
    startTime: number;
    endTime: number;
    totalTime: number;
    periodLength: number;
    requiredAmount: string;
    memberCount: string;
    epochCount: string;
    uri: string;
    targetToken: {
      id: string;
    };
  }[];
};

// campaign which is currently ongoing
export const ON_GOING_CAMPAIGN_LIST = gql`
  query ($time: Int!) {
    campaigns(
      where: { startTime_lte: $time, endTime_gte: $time }
      orderBy: startTime
      orderDirection: asc
    ) {
      id
      startTime
      endTime
      totalTime
      periodLength
      requiredAmount
      memberCount
      epochCount
      uri
      targetToken {
        id
      }
    }
  }
`;

// user are admitted but the campaign not start yet
export declare type JoinNotStartCampaignList = {
  campaigns: {
    id: string;
    startTime: number;
    endTime: number;
    totalTime: number;
    periodLength: number;
    requiredAmount: string;
    memberCount: string;
    epochCount: string;
    uri: string;
    targetToken: {
      id: string;
    };
    users: { user: { id: string }; userStatus: "Admitted" | "Signed" }[];
  }[];
};
export const JOIN_NOT_START_CAMPAIGN_LIST = gql`
  query ($user: String!, $time: Int!) {
    campaigns(
      first: 5
      where: {
        users_: { user: $user, userStatus_in: [Admitted, Signed] }
        startTime_gte: $time
      }
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      startTime
      endTime
      periodLength
      totalTime
      requiredAmount
      memberCount
      targetToken {
        id
      }
      uri
      users(where: { user: $user }) {
        user {
          id
        }
        userStatus
      }
    }
  }
`;

// user joined this campaign and checked in for few days
export declare type JoinOnGoingCampaignList = {
  campaigns: {
    id: string;
    startTime: number;
    endTime: number;
    totalTime: number;
    periodLength: number;
    requiredAmount: string;
    memberCount: string;
    epochCount: string;
    uri: string;
    targetToken: {
      id: string;
    };
  }[];
};
export const JOIN_ON_GOING_CAMPAIGN_LIST = gql`
  query ($user: String!, $time: Int!) {
    campaigns(
      first: 5
      where: {
        users_: { user: $user, userStatus: Admitted }
        startTime_lt: $time
      }
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      startTime
      endTime
      totalTime
      periodLength
      requiredAmount
      memberCount
      epochCount
      uri
      targetToken {
        id
      }
    }
  }
`;

// user join and finished th campaign, result can be success or fail
export declare type JoinFinishedCampaignList = {
  campaigns: {
    id: string;
    startTime: number;
    endTime: number;
    totalTime: number;
    periodLength: number;
    requiredAmount: string;
    memberCount: string;
    epochCount: string;
    uri: string;
    targetToken: {
      id: string;
    };
  }[];
};
export const JOIN_FINISHED_CAMPAIGN_LIST = gql`
  query ($user: String!, $time: Int!) {
    campaigns(
      first: 5
      where: { users_: { user: $user }, endTime_lte: $time }
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      startTime
      endTime
      totalTime
      periodLength
      requiredAmount
      memberCount
      epochCount
      uri
      targetToken {
        id
      }
    }
  }
`;

export declare type CampaignDetailResult = {
  campaign: {
    id: string;
    startTime: number;
    endTime: number;
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
      endTime
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

export declare type UserCampaignResult = {
  userCampaign?: {
    id: string;
    userStatus:
      | "NotParticipate"
      | "Signed"
      | "Admitted"
      | "Refused"
      | "Success"
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

export declare type CreatedCampaignList = {
  campaigns: {
    id: string;
    uri: string;
    startTime: string;
    endTime: string;
    totalTime: string;
    users: { id: string; user: { id: string } }[];
  }[];
};

export const CREATED_CAMPAIGN_LIST = gql`
  query ($user: String!) {
    campaigns(
      where: { users_: { user: $user, isHost: true } }
      orderBy: startTime
      orderDirection: desc
    ) {
      id
      uri
      startTime
      endTime
      totalTime
      endTime
      users {
        id
      }
    }
  }
`;

export const CREATED_NOT_START_CAMPAIGN_LIST = gql`
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

export const CAMPAIGN_TOKEN_ID = gql`
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
  userCampaign: {
    records: {
      id: string;
      contentUri: string;
      timestamp: string;
    }[];
  };
  record: {
    id: string;
    contentUri: string;
    timestamp: string;
  };
};

export const PERSONAL_PUNCH = gql`
  query ($userCampaign: String!, $userCampaignEpoch: String!) {
    userCampaign(id: $userCampaign) {
      records {
        id
        timestamp
      }
    }
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
      isHost: boolean;
      user: { id: string };
    }[];
  };
};

export const CAMPAIGN_SIGNED = gql`
  query ($campaign: String!) {
    campaign(id: $campaign) {
      users(where: { userStatus_not_in: ["NotParticipate"] }) {
        id
        isHost
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

export const CAN_CREATE_CAMPAIGN = gql`
  query ($user: String!) {
    user(id: $user) {
      canBeHost
    }
  }
`;

// global moment list
export declare type MomentList = {
  records: {
    id: string;
    epoch: string;
    timestamp: string;
    contentUri: string;
    userCampaign: {
      user: {
        id: string;
        address: string;
      };
      campaign: {
        id: string;
        address: string;
        uri: string;
        epochCount: string;
      };
    };
  }[];
};

export const MOMENT_LIST = gql`
  {
    records(orderBy: timestamp, orderDirection: desc) {
      id
      epoch
      timestamp
      contentUri
      userCampaign {
        user {
          id
          address
        }
        campaign {
          id
          address
          uri
          epochCount
        }
      }
    }
  }
`;

export declare type MomentDetail = {
  record: {
    id: string;
    epoch: string;
    timestamp: string;
    contentUri: string;
    userCampaign: {
      user: {
        id: string;
        address: string;
      };
      campaign: {
        address: string;
        uri: string;
        epochCount: string;
      };
    };
    challenge?: {
      id: string;
      result: "Voting" | "VoteNotEnough" | "Approved" | "Failed";
      agreeCount: string;
      disagreeCount: string;
      noVoteCount: string;
      deadline: string;
    };
  };
};

export const MOMENT_Detail = gql`
  query ($record: String!) {
    record(id: $record) {
      id
      epoch
      timestamp
      contentUri
      userCampaign {
        user {
          id
          address
        }
        campaign {
          uri
          epochCount
          address
        }
      }
      challenge {
        id
        result
        agreeCount
        disagreeCount
        noVoteCount
        deadline
      }
    }
  }
`;
