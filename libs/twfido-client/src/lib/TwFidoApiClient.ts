import { v4 as uuidv4 } from 'uuid';
import {
  GeneralErrorResponse,
  CommonResponse,
  GetSpTicketUserInputParams,
  RequestAthOrSignPushUserInputParams,
  calculateChecksum,
  generatePayload,
  verifyChecksum,
  CommonAuthResult as AuthResult,
  CommonAuthResponse,
  GetAthOrSignResultResponse,
  GetAthOrSignResult,
  GetResultUserInputParams,
} from '.';
import { HttpException } from '@nestjs/common';

class TwFidoApiError extends Error {
  constructor(code: string, message: string) {
    super(`code: '${code}', message: '${message}'`);
    this.name = 'TwFidoApiError';
  }
}

class ChecksumError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChecksumError';
  }
}

export class TwFidoApiClient {
  constructor(
    private apiUrl: string,
    private apiKey: string,
    private serviceId: string
  ) {}

  async getSpTicket(
    userParams: GetSpTicketUserInputParams
  ): Promise<CommonAuthResponse> {
    const checksumPayload = [
      userParams.id_num,
      userParams.op_code,
      userParams.op_mode,
      userParams.hint,
      userParams.sign_info?.sign_data,
    ];

    const params = await this.prepareParams(userParams, checksumPayload);
    const res = await this.execute<AuthResult>('getSpTicket', params);

    this.validateAuth(res);
    return res;
  }

  async requestAthOrSignPush(
    userParams: RequestAthOrSignPushUserInputParams
  ): Promise<CommonAuthResponse> {
    const checksumPayload = [
      userParams.id_num,
      userParams.device_user_def_desc,
      userParams.op_code,
      userParams.hint,
      userParams.sign_info?.sign_data,
    ];

    const params = await this.prepareParams(userParams, checksumPayload);
    const res = await this.execute<AuthResult>('requestAthOrSignPush', params);

    this.validateAuth(res);
    return res;
  }

  async getAthOrSignResult(userParams: GetResultUserInputParams) {
    const checksumPayload = [userParams.sp_ticket_id];
    const params = await this.prepareParams(userParams, checksumPayload);
    const res = await this.execute<GetAthOrSignResult>(
      'getAthOrSignResult',
      params
    );

    this.validateGetResult(res);
    return res;
  }

  private async prepareParams<T>(
    userInputParams: T,
    checksumPayload: string[]
  ): Promise<Record<string, any>> {
    const transactionId = userInputParams['transaction_id'] || uuidv4();
    const payload = generatePayload(
      transactionId,
      this.serviceId,
      ...checksumPayload
    );
    const checksum = await calculateChecksum(this.apiKey, payload);
    const params = {
      ...userInputParams,
      transaction_id: transactionId,
      sp_service_id: this.serviceId,
      sp_checksum: checksum,
    };
    return params;
  }

  private async validateGetResult(data: GetAthOrSignResultResponse) {
    const payload = generatePayload(
      data.transaction_id,
      data.error_code,
      data.result.hashed_id_num,
      data.result.signed_response
    );

    this.validate(payload, data.result.idp_checksum);
  }

  private async validateAuth(data: CommonAuthResponse) {
    const payload = generatePayload(
      data.transaction_id,
      data.error_code,
      data.result.sp_ticket
    );

    this.validate(payload, data.result.idp_checksum);
  }

  private validate(payload: string, checksum: string) {
    const verified = verifyChecksum(this.apiKey, payload, checksum);

    if (!verified) {
      throw new ChecksumError('idp_checksum is invalid');
    }
  }

  private async execute<T>(
    methodName: string,
    params: Record<string, any>
  ): Promise<CommonResponse<T>> {
    const response = await fetch(`${this.apiUrl}/${methodName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error: GeneralErrorResponse = await response.json();
      throw new HttpException(error, response.status);
    }

    const data: CommonResponse<T> = await response.json();

    if (data.error_code !== '0') {
      throw new TwFidoApiError(data.error_code, data.error_message);
    }

    data.transaction_id = params.transaction_id;
    return data;
  }
}
