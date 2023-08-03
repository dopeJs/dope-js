import { IncomingMessage, Server, ServerResponse } from 'http';
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2';

export interface CredentialsInfo {
  cert: string | Buffer;
  key: string | Buffer;
}

export type ServerSecureType = boolean | { certFile: string; keyFile: string };

export interface CommonServerOption {
  workRoot: string;
  port?: number;
  host?: string;
  secure?: ServerSecureType;
}

export type CommonServer = Server | Http2SecureServer;
export type CommonServerRequest = IncomingMessage | Http2ServerRequest;
export type CommonServerResponse = ServerResponse | Http2ServerResponse;
