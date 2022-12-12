import { useState } from "react";
import { useWaitForTransaction } from "wagmi";
import { shortenTxHash } from "../utils/convert";
import { packTokenAmount } from "../utils/token";

export function useTraceTraction(txHash: `0x${string}`, callback?: any) {
  const [modalShow, setModalShow] = useState<boolean>(false);
  // transaction hash
  const [tx, setTx] = useState({
    hash: null,
    gasFee: null,
  });

  // after the tx confirmed, show modal
  useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
    onSuccess: (data) => {
      setTx({
        hash: shortenTxHash(data.transactionHash),
        gasFee: packTokenAmount(
          data.gasUsed.mul(data.effectiveGasPrice).toString(),
          6
        ),
      });
      setModalShow(true);
      callback && callback();
    },
  });

  return { modalShow, setModalShow, tx };
}
