export class NFTLargeStorage {
  constructor(private ipfsClient: any) {

  }
  add =async (data: string) =>{
    // return this.ipfsClient.add(data); 
    return Promise.resolve({hash: "QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V"})
  }
}