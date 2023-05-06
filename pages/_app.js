import "@/styles/globals.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygon, optimism, arbitrum, goerli, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import "@rainbow-me/rainbowkit/styles.css";
import { VotingSystemProvider } from "@/Hooks/client";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, sepolia],
  [publicProvider(), alchemyProvider({ apiKey: process.env.ALCHEMY_ID })]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const client = createClient({
  autoConnect: false,
  provider,
  webSocketProvider,
  connectors,
});

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <VotingSystemProvider>
          <Component {...pageProps} />
        </VotingSystemProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
