import { useEffect, useState } from "react";
import { calculateJsonCid } from "../utils/ipfs";

export function useJsonCid(json: Object): string {
  const [cid, setCid] = useState(undefined);

  useEffect(() => {
    calculateJsonCid(json).then((cid: string) => {
      setCid(cid);
    });
  }, [json]);

  return cid;
}

export function useUploadJson(json: Object, enabled: boolean) {
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (enabled) {
      fetch("https://api.tracker3.io/api/v1/ipfs", { method: "POST", body: JSON.stringify(json) }).then(
        (res) => {
          if (res.status === 200) {
            setSuccess(true);
          }
        }
      );
    }
  }, [json.toString(), enabled]);

  return { data: success };
}
