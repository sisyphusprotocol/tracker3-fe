export type ModalProps = {
  setShow?: (value: boolean) => void;
  isShow: boolean;
  type?: ModalType;
  txHash?: string;
  gasFee?: string;
  staked?: string;
  userReward?: string;
  hostReward?: string;
};

export type ModalType = "sign" | "create" | "clock" | "get" | "hoster" | "approve" | "claim";
