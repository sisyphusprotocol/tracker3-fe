import { BigNumber } from "ethers";
import { useMemo } from "react";
import { erc20ABI, useContractRead } from "wagmi";

export function useTokenAllowance(
  token?: string,
  owner?: `0x${string}`,
  spender?: `0x${string}`
): BigNumber | undefined {
  const { data: allowance } = useContractRead({
    address: token || "",
    abi: erc20ABI,
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
