import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import "../styles/globals.css";
import { rem } from "../utils/rem";
import { useEffect, useLayoutEffect, useState } from "react";
import { WagmiConfig } from "wagmi";

import Nav from "../components/nav";

import WalletAuth from "../components/Auth";
import { ModalProvider } from "../components/modal";
import ReactLoading from "react-loading";
import { wagmiClient } from "../utils/wagmiConfig";

function NextWeb3App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    rem();
    return () => {};
  }, []);

  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/mobile" && window.self === window.top) {
      if (screen.width >= 800 && screen.height >= 540) {
        setTimeout(() => {
          window.location.replace("/mobile/");
        }, 500);
      } else {
        setIsMobile(true);
      }
    } else {
      setVisible(false);
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <WagmiConfig client={wagmiClient}>
          <WalletAuth>
            {visible && !isMobile ? (
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
                <ModalProvider>
                  <Component {...pageProps} />
                  <Nav />
                </ModalProvider>
              </>
            )}
          </WalletAuth>
        </WagmiConfig>
      </ApolloProvider>
    </Web3ReactProvider>
  );
}

export default NextWeb3App;
