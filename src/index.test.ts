import { CID, create as createIpfsClient } from "ipfs";
import { NFTLargeStorage } from "./index";
describe("NFTLargeFileStorage", () => {
  it("should exist", () => {
    expect(NFTLargeStorage).toBeDefined();
  });
  describe("Given an ipfs client", () => {
    let ipfsClient;
    let nftLargeStorage: NFTLargeStorage;
    beforeAll(async () => {
      ipfsClient = await createIpfsClient();
      nftLargeStorage = new NFTLargeStorage(ipfsClient);
    });

    it("should be able to store and retrieve a file", async () => {
      const file = await nftLargeStorage.add("Hello World");
      console.log({file})
      expect(file.hash).toEqual(
        "QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V"
      );
    });
    it("should be able to store and retrieve the dag of a folder", async () => {
      const { hash } = await nftLargeStorage.add("Hello World");
      const cid = CID.parse(hash);
      const dag = await ipfsClient.dag.get(cid);
      expect(dag).toBeDefined();
    });
  });
});
