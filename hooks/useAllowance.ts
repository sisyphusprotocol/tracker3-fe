import { BigNumber } from "ethers";
import { useMemo } from "react";
import { erc20ABI, useContractRead } from "wagmi";

export function useTokenAllowance(
  token?: string,
  owner?: string,
  spender?: string
): BigNumber | undefined {
  const { data: allowance } = useContractRead({
    addressOrName: token || "",
    contractInterface: erc20ABI,
    functionName: "allowance",
    args: [owner, spender],
    enabled: !!token && !!owner && !!spender,
    watch: true,
  });
  return useMemo(
    () =>
      token && allowance ? BigNumber.from(allowance.toString()) : undefined,
    [token, allowance]
  );
}
