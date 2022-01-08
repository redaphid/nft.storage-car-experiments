export class NFTLargeStorage {
  constructor(private ipfsClient: any) {

  }
  add(data: string): Promise<any> {
    console.log(this.ipfsClient)
    // return this.ipfsClient.add(data); 
  }
}