import { useContext } from "react";
import { useWaitForTransaction } from "wagmi";
import { modalContext } from "../components/modal";
import { ModalProps } from "../components/modal/type";
import { shortenTxHash } from "../utils/convert";
import { packTokenAmount } from "../utils/token";

export function useTraceTransaction(
  txHash: string,
  modalData: Partial<ModalProps>,
  callback?: Function
) {
  const [_, setData] = useContext(modalContext);

  // after the tx confirmed, show modal
  // TODO: handle transaction confirmed but fail
  useWaitForTransaction({
    hash: txHash,
    enabled: !!txHash,
    onSuccess: (data) => {
      setData({
        isShow: true,
        txHash: shortenTxHash(data.transactionHash),
        gasFee: packTokenAmount(
          data.gasUsed.mul(data.effectiveGasPrice).toString(),
          6
        ),
        ...modalData,
      });
      // run callback
      callback && callback();
    },
  });
}
