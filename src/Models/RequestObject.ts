export interface RequestObject {
  path: string;
  method: string;
  params: any;
  query: any;
  body: any;
  headers: any;
  hostname: string;
  ip: string;
  protocol: string;
  cookies: any;
  fresh: boolean;
  stale: boolean;
  secure: boolean;
  xhr: boolean;
  user?: any;
}
