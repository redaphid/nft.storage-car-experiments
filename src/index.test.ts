import { create as createIpfsClient } from "ipfs";
import { NFTLargeStorage } from "./index";
import {tmpdir} from 'os';
import {mkdir,rmdir, stat} from 'fs/promises'
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
      try {
      await stat('./test/data/alpine-standard-3.15.0-x86_64.iso')
      } catch (e) {
        console.error("Alpine image not found. You're gonna want to get it from https://dl-cdn.alpinelinux.org/alpine/v3.15/releases/x86_64/alpine-standard-3.15.0-x86_64.iso")
        console.error("and put it in test/data. github obviously won't let me commit it to the repo, so you'll have to do that manually.")                
        throw e
      }
      // 
    })
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
      const file = await nftLargeStorage.add('')
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
