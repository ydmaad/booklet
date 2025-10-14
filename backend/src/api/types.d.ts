declare module "@vercel/node" {
  import { IncomingMessage, ServerResponse } from "http";

  export interface VercelRequest extends IncomingMessage {
    query: { [key: string]: string | string[] | undefined };
    body?: any;
  }

  export interface VercelResponse extends ServerResponse {
    status: (code: number) => VercelResponse;
    json: (body: any) => VercelResponse;
    send: (body: any) => VercelResponse;
  }
}
