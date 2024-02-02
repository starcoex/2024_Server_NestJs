export interface MailgunModuleOptions {
  username: string;
  key: string;
  url?: string;
  public_key?: string;
  timeout?: number;
}

export interface EmailVar {
  key: string;
  value: string;
}
