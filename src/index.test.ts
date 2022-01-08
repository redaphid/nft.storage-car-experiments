import { NFTLargeStorage } from "./index";
describe("NFTLargeFileStorage", () => {
  it("should exist", () => {
    expect(NFTLargeStorage).toBeDefined();
  });
  describe("Given an ipfs client", () => {
    let ipfsClient;
    let nftLargeStorage: NFTLargeStorage;
    beforeEach(() => {
      ipfsClient = {
        add: jest.fn(() =>
          Promise.resolve({
            hash: "QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V",
          })
        ),
        cat: jest.fn(() => Promise.resolve("Hello World")),
      };
      nftLargeStorage = new NFTLargeStorage(ipfsClient);
    });

    it("should be able to store and retrieve a file", async () => {
      const file = await nftLargeStorage.add("Hello World");
      expect(file.hash).toEqual("QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V");
    });
  });
});
