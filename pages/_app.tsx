import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Web3ReactProvider } from "@web3-react/core";
import { publicProvider } from "wagmi/providers/public";

import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import { rem } from "../utils/rem";
import { useLayoutEffect } from "react";
import { createClient, WagmiConfig, chain, configureChains } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import WalletAuth from "../components/Auth";
import { MoralisProvider } from "react-moralis";

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
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <MoralisProvider
            appId="N1QNMO76Unle5K2Bmm24k9fCOHqzgUFVefr4L7SD"
            serverUrl="https://jbtrbndncyvu.usemoralis.com:2053/server"
          >
            <WagmiConfig client={wagmiClient}>
              <WalletAuth>
                <Component {...pageProps} />
              </WalletAuth>
            </WagmiConfig>
          </MoralisProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
