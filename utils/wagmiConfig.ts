import { chain, configureChains, createClient } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: "https://smart-alpha-dust.matic-testnet.discover.quiknode.pro/47e1ee3e91888d8580ca224bee4de15293583fba/",
        webSocket:
          "wss://smart-alpha-dust.matic-testnet.discover.quiknode.pro/47e1ee3e91888d8580ca224bee4de15293583fba/",
      }),
    }),
  ]
);

const connector = new InjectedConnector({
  chains: chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [connector],
  provider: provider,
  webSocketProvider: webSocketProvider,
});

export { chains, wagmiClient };
