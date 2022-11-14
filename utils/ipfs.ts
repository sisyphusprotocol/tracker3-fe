import { NFTStorage, File } from "nft.storage";

// It doesn't matter as it's a temporary plan
const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM2NGFkNjBjZWQwRTUyMDQ5OGRFMzg4RTNmNzNjM0ZkMURmNmRhMkIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MTg4MDA0NzY2OCwibmFtZSI6Ik5veV9zaXN5cGh1c19mcm9udCJ9.ocuEy59INQl0sJCnGnkpuwVUsLzjIRDxqJslRvONjpg";

export function parseCid(uri: string): string {
  // TODO: more check
  if (uri.startsWith("ipfs://")) {
    return uri.slice(7);
  }
  return "";
}

export async function getContent(cid: string) {
  const res = await fetch(`https://nftstorage.link/ipfs/${cid}`);
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
