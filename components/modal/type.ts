export type ModalProps = {
  onClick?: () => void;
  isShow?: boolean;
  type?: ModalType;
  title?: string;
  desc?: string;
  txHash?: string;
  gasFee?: string;
  token?: string;
  staked?: string;
  userReward?: string;
  hostReward?: string;
};

export type ModalType =
  | "create"
  | "approve"
  | "sign"
  | "check"
  | "select"
  | "claim"
  | "challenge"
  | "vote";
