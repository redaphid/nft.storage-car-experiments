import { create as createIpfsClient } from "ipfs";
import { NFTLargeStorage } from "./index";
import {tmpdir} from 'os';
import {mkdir,rmdir} from 'fs/promises'
import {randomBytes} from 'crypto';
import {promisify} from 'util'

const timeout = promisify(setTimeout)
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
      await mkdir(datadir, {recursive: true});
    })

    beforeAll(async () => {      
      ipfsClient = await createIpfsClient({"path":datadir});      
      nftLargeStorage = new NFTLargeStorage(ipfsClient);      
      await nftLargeStorage.start()
    });

    it("should be able to store a file, and retrieve it's dag", async () => {
      const filePath = process.env.FILE_TO_UPLOAD_PATH
      if(!filePath) throw new Error("FILE_TO_UPLOAD_PATH env variable is not set")

      const file = await nftLargeStorage.add(filePath);
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
      await timeout(1000)
      await rmdir(datadir, {recursive: true});
    })
  });
});
