export class NFTLargeStorage {
  constructor(private ipfsClient: any) {

  }
  add(data: string): Promise<any> {
    return this.ipfsClient.add(data); 
  }
}