import { CID, create as createIpfsClient } from "ipfs";
import { NFTLargeStorage } from "./index";
import {tmpdir} from 'os';
import {rmdirSync} from 'fs'
import {randomBytes} from 'crypto';

const randomString = (size: number) => {  
  return randomBytes(size).toString('hex');
  
};

describe("NFTLargeFileStorage", () => {
  let datadir: string;
  it("should exist", () => {
    expect(NFTLargeStorage).toBeDefined();
  });
  describe("Given an ipfs client", () => {    
    let ipfsClient;
    let nftLargeStorage: NFTLargeStorage;    
    beforeAll(async () => {
      datadir = `${tmpdir()}/ipfs-nft-large-storage-test/${randomString(10).toString()}`;
      console.log({datadir})
      ipfsClient = await createIpfsClient({"path":datadir});
      const diff = await ipfsClient.config.profiles.apply("test")
      nftLargeStorage = new NFTLargeStorage(ipfsClient);
      console.log(JSON.stringify(diff, null, 2));
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
    afterAll(async () => {
      await ipfsClient.stop();
      rmdirSync(datadir);
    })
  });
});
