const MAX_DATA_SIZE = 100000;
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
        chunker: `size-${MAX_DATA_SIZE}`,
        // progress: console.log,
        wrapWithDirectory: true,
      }
    );
    return result;
  };

  getCarsForFile = async (cid) => {
    /*
    Dag looks like:
    {
      Data: <something>,
      Links: [{
        Hash: <CID>,
        Name: <filename>,
        Tsize: <size of link>
      }]

    }
    */
    // console.log({ cid });
    const dag = await this.ipfsClient.object.get(cid, { localResolve: true });
    if(dag.Links.length === 0) 
    {
      return [dag]
    }    

    if(dag.Links.length) printDag(dag);

    const linkPromises = dag.Links.map(link => {
      return this.getCarsForFile(link.Hash);         
    });  

    let results: any[] =  []
    const linkResults = await Promise.all(linkPromises)
    
    linkResults.forEach(linkResult => {
      results = [...results, ...linkResult];
    })
    
    return results;
  }

}
function printDag(dag: any) {
  const printableDag = {
    links: dag.Links.map((link) => ({
      cid: link.Hash.toString(), 
      name: link.Name,
      size: link.Tsize, 
    })),
  }
  console.table(printableDag.links);
}

