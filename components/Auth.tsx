import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount, useConnect, useSigner } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

const WalletAuth = ({ children }) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const router = useRouter();
  const { connect, pendingConnector } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if ((signer === null || address === null) && !pendingConnector) {
      connect();
    }
  }, [address, signer, router, connect, pendingConnector]);

  return <>{children}</>;
};

export default WalletAuth;
