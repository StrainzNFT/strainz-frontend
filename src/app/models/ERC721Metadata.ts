export interface ERC721Metadata {
  name: string;
  description: string;
  properties: {
    [key: string]: string;
  };
  image: string;
}
