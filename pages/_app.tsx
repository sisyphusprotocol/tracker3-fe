import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Web3ReactProvider } from "@web3-react/core";
import { publicProvider } from "wagmi/providers/public";

import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import { rem } from "../utils/rem";
import { useEffect, useLayoutEffect, useState } from "react";
import { createClient, WagmiConfig, chain, configureChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import Nav from "../components/nav";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import WalletAuth from "../components/Auth";
import { GlobalTxConformModal } from "../components/modal";
import ReactLoading from "react-loading";

const queryClient = new QueryClient();

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [publicProvider()]
);

const metaMaskConnector = new MetaMaskConnector({
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [metaMaskConnector],
  provider: provider,
  webSocketProvider,
});

function NextWeb3App({ Component, pageProps }: AppProps) {
  useLayoutEffect(() => {
    rem();
    return () => {};
  }, []);

  const [isMobile, setIsModbile] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/mobile" && window.self === window.top) {
      if (screen.width >= 800 && screen.height >= 600) {
        setTimeout(() => {
          window.location.replace("/mobile/");
        }, 500);
      } else {
        setIsModbile(true);
      }
    } else {
      setVisible(false);
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig client={wagmiClient}>
            <WalletAuth>
              {visible ? (
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 300,
                  }}
                >
                  <ReactLoading
                    type={"spin"}
                    color="#d3a2d7"
                    height={100}
                    width={100}
                  />
                </div>
              ) : (
                <>
                  <Component {...pageProps} />
                  {isMobile && <Nav />}
                  <GlobalTxConformModal />
                </>
              )}
            </WalletAuth>
          </WagmiConfig>
        </QueryClientProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
