import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { hardhat } from "@wagmi/cli/plugins";
export default defineConfig({
  out: "generated.ts",

  plugins: [react(), hardhat({ project: "../sisyphus-contracts/" })],
});
