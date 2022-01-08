import { NFTLargeStorage } from "./index";
describe("NFTLargeFileStorage", () => {
  it("should exist", () => {
    expect(NFTLargeStorage).toBeDefined();
  });
  describe('When given an ipfs client', () => {
    beforeEach(() => {
      
    });
    it('should be able to store and retrieve a file', async () => {
      const ipfsClient = {
        add: jest.fn(() => Promise.resolve({ hash: 'QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V' })),
        cat: jest.fn(() => Promise.resolve('Hello World')),
      };
      const nftLargeStorage = new NFTLargeStorage(ipfsClient);
      const file = await nftLargeStorage.store('Hello World');
      expect(file).toEqual('QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V');
    }
  });
});
