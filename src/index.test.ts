import { create as createIpfsClient } from "ipfs";
import { NFTLargeStorage } from "./index";
import { tmpdir } from "os";
import { mkdir, rm, stat } from "fs/promises";
import { randomBytes } from "crypto";

import { promisify } from "util";

const timeout = promisify(setTimeout);
const randomString = (size: number) => {
  return randomBytes(size).toString("hex");
};

const testFile = "./test/data/alpine-standard-3.15.0-x86_64.iso";

describe("NFTLargeFileStorage", () => {
  beforeAll(async () => {
    try {
      await stat(testFile);
    } catch (e) {
      console.error(
        "Alpine image not found. You're gonna want to get it from https://dl-cdn.alpinelinux.org/alpine/v3.15/releases/x86_64/alpine-standard-3.15.0-x86_64.iso"
      );
      console.error(
        "and put i in test/data/. Github won't let me commit it to the repo, so you'll have to do that manually."
      );
      throw e;
    }
    //
  });

  it("should exist", () => {
    expect(NFTLargeStorage).toBeDefined();
  });
  describe("Given an ipfs client", () => {
    let ipfsClient;
    let datadir: string;
    let nftLargeStorage: NFTLargeStorage;

    beforeAll(async () => {
      datadir = `${tmpdir()}/ipfs-nft-large-storage-test/${randomString(
        10
      ).toString()}`;
      await mkdir(datadir, { recursive: true });
    });

    afterAll(async () => {
      await rm(datadir, { recursive: true });
    });

    beforeAll(async () => {
      console.log({ datadir });
      ipfsClient = await createIpfsClient({ repo: datadir, start: false });
      nftLargeStorage = new NFTLargeStorage(ipfsClient);
      await nftLargeStorage.start();
    });
    describe("When a large file is added to ipfs", () => {
      let file;
      beforeAll(async () => {
        file = await nftLargeStorage.add(testFile);
      });
      it("should return the correct CID", () => {
        expect(file.cid.toString()).toEqual(
          "QmeqG4GvhKPvXk52xhZBYnkAi9kPfQuxnx95YruLhmrayn"
        );
      });
      describe("When asking for the CAR files of the correct size for uploading to nft.storage", () => {
        let chunksToUpload
        beforeAll(async () => { 
          chunksToUpload = await nftLargeStorage.getCarsForFile(file.cid);
        })
        it("should return something", () => {
          expect(chunksToUpload).toBeDefined();
        });
      })
    });
  });
});
