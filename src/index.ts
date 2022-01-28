import { open as openFile } from "fs/promises";
export class NFTLargeStorage {
  constructor(private ipfsClient: any) {}
  
  start = async () => {
    await this.ipfsClient.config.profiles.apply("test");
  };

  add = async (filePath: string) => {
    const file = await openFile(filePath, "r");
    const stream = await file.createReadStream();
    const result = await this.ipfsClient.add(
      {
        path: filePath,
        content: stream,
      },
      {
        chunker: "size-100000",
        // progress: console.log,
        wrapWithDirectory: true,
      }
    );
    console.log({ result });
    return result;
    // return Promise.resolve({hash: "QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V"})
  };

}
