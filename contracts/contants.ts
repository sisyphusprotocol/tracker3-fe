import Campaign_ABI from "../contracts/Campaign.json";
import ERC20_ABI from "../contracts/ERC20.json";
import CampaignFactory_ABI from "../contracts/CampaignFactoryUpgradable.json";

const CAMPAIGN_FACTORY_ADDRESS = "0xE44C3974E7a8659b37fb2959a9Ea91560498Aac3";

const TokenMap = {
  "0xa3f2ba60353b9af0a3524ee4a7c206d4335a9784": "TSS",
};

export {
  CampaignFactory_ABI,
  Campaign_ABI,
  ERC20_ABI,
  CAMPAIGN_FACTORY_ADDRESS,
  TokenMap,
};
