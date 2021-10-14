import { Pool } from './pool';

export class User {
  username?: string;
  password?: string;
  token?: string;
  tokenExpiration?: number;
  firstName?: string;
  lastName?: string;
  gatewayAddresses?: string[];
  collections?: Pool[];
  rdpParams: {};
  rdpFileContents?: { fileName: string; mimeType: string; fileData: string };
  deploymentModern: boolean;
  importFrom: string;
}
