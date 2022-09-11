import { BigNumber, ethers } from "ethers";

// by default the decimal is 18
export function packTokenAmount(str: string, precision: number = 18): string {
  if (!str) {
    return str;
  } else {
    const balance = BigNumber.from(str);
    const reminder = balance.mod(
      BigNumber.from(10).pow(BigNumber.from(18 - precision))
    );
    return ethers.utils.formatEther(balance.sub(reminder));
  }
}
