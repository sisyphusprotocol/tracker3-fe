import { getAddress } from "ethers/lib/utils";
import moment from "moment";

export function shortenDes(des: string | undefined, length: number): string {
  return des?.slice(0, length);
}

export function timeStampToPeriodLength(mss: number): string {
  const days = Math.floor(mss / 86400);
  const hours = Math.floor((mss % 86400) / 3600);
  const minutes = Math.floor((mss % 3600) / 60);
  const seconds = (mss % 60).toFixed(0);

  if (days) {
    return `${days} days`;
  } else if (hours) {
    return `${hours} hours`;
  } else if (minutes) {
    return `${minutes} minutes`;
  } else {
    return `${seconds} seconds`;
  }
}

export function now() {
  return moment().unix();
}

export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function shortenTxHash(txHash: string, chars = 6): string {
  return `${txHash.substring(0, chars + 2)}...${txHash.substring(66 - chars)}`;
}
