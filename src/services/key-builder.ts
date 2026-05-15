import { randomUUID } from "crypto";

export interface VlessKeyParams {
  uuid: string;
  address: string;
  port: number;
  security: string;
  publicKey: string;
  fingerprint: string;
  serverName: string;
  shortId: string;
  spiderX: string;
  remark: string;
  flow?: string;
}

export function generateVlessLink(params: VlessKeyParams): string {
  const {
    uuid,
    address,
    port,
    security,
    publicKey,
    fingerprint,
    serverName,
    shortId,
    spiderX,
    remark,
  } = params;

  const query = new URLSearchParams({
    type: "tcp",
    encryption:
      "mlkem768x25519plus.native.0rtt.pjFNbDMnPFICEBRRfvuLoEfS7IIL5kndGqBXSJlJQmQ",
    security,
    pbk: publicKey,
    fp: fingerprint,
    sni: serverName,
    sid: shortId,
    spx: spiderX,
  });

  return `vless://${uuid}@${address}:${port}?${query.toString()}#${encodeURIComponent(remark)}`;
}

export function generateUUID(): string {
  return randomUUID();
}
