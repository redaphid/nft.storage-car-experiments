import { CID, create as createIpfsClient } from "ipfs";
import { NFTLargeStorage } from "./index";

const generateRandomData = (size: number) => {
  const data = new Uint8Array(size);
  crypto.getRandomValues(data);
  return data;
};

describe("NFTLargeFileStorage", () => {
  it("should exist", () => {
    expect(NFTLargeStorage).toBeDefined();
  });
  describe("Given an ipfs client", () => {
    let ipfsClient;
    let nftLargeStorage: NFTLargeStorage;
    beforeAll(async () => {
      ipfsClient = await createIpfsClient();
      await ipfsClient.config.profile.apply("test")
      nftLargeStorage = new NFTLargeStorage(ipfsClient);
    });

    it("should be able to store a file, and retrieve it's dag", async () => {
      const file = await nftLargeStorage.add("Hello World");
      console.log({ file });
      expect(file.cid.toString()).toEqual(
        "QmUXTtySmd7LD4p6RG6rZW6RuUuPZXTtNMmRQ6DSQo3aMw"
      );

      const cid = file.cid;
      const dag = await ipfsClient.get(cid, { localResolve: true });
      for await (const l of dag) {
        console.log({ l });
      }

      expect(dag).toBeDefined();
    });
  });
});
