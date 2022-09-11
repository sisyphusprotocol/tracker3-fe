import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount, useConnect, useSigner } from "wagmi";
import { InjectedConnector } from "@wagmi/core";

const WalletAuth = ({ children }) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const router = useRouter();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    if ((signer === null || address === null) && router.pathname !== "/home") {
      connect();
    }
  }, [address, signer, router, connect]);

  return <>{children}</>;
};

export default WalletAuth;
