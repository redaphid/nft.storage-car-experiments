import {urlSource} from 'ipfs'
const URL_TO_ADD = "https://mirror.math.princeton.edu/pub/ubuntu-iso/focal/ubuntu-20.04.3-desktop-amd64.iso"
export class NFTLargeStorage {
  constructor(private ipfsClient: any) {

  }
  add =async (data: string) =>{ 
    return this.ipfsClient.add(urlSource(URL_TO_ADD), {
      progress: (prog: any) => {
        console.log(`received: ${prog.received}`)
      }
    }); 
    // return Promise.resolve({hash: "QmXg9Pp2ytZ14xgmQjYEiHjVjMFXzCVVEcRTWJBmLgR39V"})
  }
}