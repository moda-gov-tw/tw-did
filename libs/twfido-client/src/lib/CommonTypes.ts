export interface CommonParams {
  transaction_id: string;
  sp_service_id: string;
  sp_checksum: string;
}

export interface CommonAuthParams extends CommonParams {
  id_num: string;
  op_code: 'ATH' | 'SIGN';
  hint: string;
  time_limit?: number;
  sign_info?: SignInfo;
}

export interface GetSpTicketParams extends CommonAuthParams {
  op_mode: 'I-SCAN' | 'APP2APP' | 'MWEB2APP';
}

export type GetSpTicketUserInputParams = Omit<
  GetSpTicketParams,
  'transaction_id' | 'sp_service_id' | 'sp_checksum'
>;

export interface GetResultParams extends CommonParams {
  sp_ticket_id: string;
}

export type GetResultUserInputParams = Omit<
  GetResultParams,
  'sp_service_id' | 'sp_checksum'
>;

export class CommonResponse<T> {
  transaction_id?: string;
  result?: T;
  error_message: string;
  error_code: string;
}

export type CommonAuthResponse = CommonResponse<CommonAuthResult>;

export interface CommonAuthResult {
  sp_ticket: string;
  idp_checksum: string;
}

export interface SignInfo {
  sign_data: string;
  sign_type: 'PKCS#1' | 'PKCS#7' | 'RAW';
  tbs_encoding: 'NONE' | 'base64';
  hash_algorithm: 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512';
}

export interface SPTicket {
  transaction_id: string;
  op_code: string;
  op_mode: string;
  sp_service_id: string;
  sp_ticket_id: string;
  sp_name: string;
  hint: string;
  expiration_time: string;
  hashed_id_num: string;
  version: string;
}

export class GeneralErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

export interface GetAthOrSignResultParams extends CommonParams {
  sp_ticket_id: string;
}

export interface GetAthOrSignResult {
  hashed_id_num: string;
  idp_checksum: string;
  signed_response?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signed_response_set?: any[];
  cert?: string;
}

export type GetAthOrSignResultResponse = CommonResponse<GetAthOrSignResult>;

export interface RequestAthOrSignPushParams extends CommonAuthParams {
  device_user_def_desc?: string;
}

export type RequestAthOrSignPushUserInputParams = Omit<
  RequestAthOrSignPushParams,
  'transaction_id' | 'sp_service_id' | 'sp_checksum'
>;
