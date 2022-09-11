import { NFTStorage, File } from "nft.storage";

// It doesn't matter as it's a temporary plan
const NFT_STORAGE_KEY = "";

export function parseCid(uri: string): string {
  // TODO: more check
  if (uri.startsWith("ipfs://")) {
    return uri.slice(7);
  }
  return "";
}

export async function getContent(cid: string) {
  const res = await fetch(`https://ipfs.io/ipfs/${cid}`);
  if (res.status == 200) {
    return res.json();
  }
}

export async function uploadJson(json: Object) {
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  return nftstorage.storeBlob(
    new Blob([JSON.stringify(json)], {
      type: "application/json",
    })
  );
}
