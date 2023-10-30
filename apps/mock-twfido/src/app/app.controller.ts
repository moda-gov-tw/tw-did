import { Controller, Get, Post } from '@nestjs/common';

import {
  CommonAuthResponse,
  CommonResponse,
  GetAthOrSignResult,
  SPTicket,
} from '@tw-did/twfido-client';

const mockSpTicket: SPTicket = {
  transaction_id: '',
  op_code: '',
  op_mode: '',
  sp_service_id: '',
  sp_ticket_id: 'sp_ticket_id',
  sp_name: '',
  hint: '',
  expiration_time: '',
  hashed_id_num: '',
  version: '',
};

const mockResponse: CommonAuthResponse = {
  transaction_id: '',
  result: {
    sp_ticket: Buffer.from(JSON.stringify(mockSpTicket)).toString('base64'),
    idp_checksum: '',
  },
  error_code: '0',
  error_message: '',
};

@Controller()
export class AppController {
  @Post('getSpTicket')
  getSpTicket(): Promise<CommonAuthResponse> {
    return Promise.resolve(mockResponse);
  }

  @Post('requestAthOrSignPush')
  requestAthOrSignPush(): Promise<CommonAuthResponse> {
    return Promise.resolve(mockResponse);
  }

  @Post('getAthOrSignResult')
  getAthOrSignResult() {
    const response: CommonResponse<GetAthOrSignResult> = {
      transaction_id: '',
      result: {
        hashed_id_num: '',
        idp_checksum: '',
      },
      error_code: '0',
      error_message: '',
    };
    return Promise.resolve(response);
  }
}
