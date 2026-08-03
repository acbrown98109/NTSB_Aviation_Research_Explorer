import HardhatEthers from "@nomicfoundation/hardhat-ethers";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env manually (ESM — no dotenv require)
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const env = readFileSync(resolve(__dirname, ".env"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([^#\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] ||= m[2].trim();
  }
} catch {}

const RPC_URL     = process.env.GETBLOCK_RPC_URL     || "";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

export default {
  plugins: [HardhatEthers],
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    polygonAmoy: {
      type:     "http",
      url:      RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId:  80002,
    },
  },
};
