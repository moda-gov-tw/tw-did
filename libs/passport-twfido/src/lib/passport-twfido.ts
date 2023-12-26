import {
  CommonAuthResponse,
  SPTicket,
  TwFidoApiClient,
  parseSpTicket,
} from '@tw-did/twfido-client';
import { Strategy as PassportStrategy } from 'passport-strategy';
import { inherits } from 'util';
import { delay } from './utils';

interface TwFidoStrategyOptions {
  apiUrl: string;
  apiKey: string;
  serviceId: string;
  enableValidation: boolean;
}

export interface RequestLoginResponse {
  transactionId: string;
  spTicketId: string;
  spTicketPayload: string;
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function Strategy(
  { apiUrl, apiKey, serviceId, enableValidation }: TwFidoStrategyOptions,
  verify
) {
  if (!verify) {
    throw new TypeError('TwFidoStrategy requires a verify callback');
  }

  this.twFidoClient = new TwFidoApiClient(
    apiUrl,
    apiKey,
    serviceId,
    enableValidation
  );

  PassportStrategy.call(this);

  this.name = 'twfido';
  this._verify = verify;
}

inherits(Strategy, PassportStrategy);

Strategy.prototype.requestLogin = async function (
  nationalId: string,
  method: 'QRCODE' | 'NOTIFY'
): Promise<RequestLoginResponse> {
  if (!nationalId) {
    return this.fail({ message: 'Missing nationalId' }, 400);
  }

  let res: CommonAuthResponse;
  if (method == 'NOTIFY') {
    const params = {
      id_num: nationalId,
      op_code: 'ATH',
      hint: '',
    };
    res = await this.twFidoClient.requestAthOrSignPush(params);
  } else if (method === 'QRCODE') {
    const params = {
      op_mode: 'I-SCAN',
      id_num: nationalId,
      op_code: 'ATH',
      hint: '',
    };
    res = await this.twFidoClient.getSpTicket(params);
  } else {
    throw new TypeError(`unsupported method "${method}"`);
  }

  const spTicket = parseSpTicket(res.result.sp_ticket);
  return {
    transactionId: res.transaction_id,
    spTicketId: spTicket.sp_ticket_id,
    spTicketPayload: res.result.sp_ticket,
  };
};

Strategy.prototype.authenticate = async function (req) {
  const { nationalId, transactionId, spTicketId } = req.body;

  if (!nationalId) {
    return this.fail({ message: 'Missing nationalId' }, 400);
  }

  if (!transactionId) {
    return this.fail({ message: 'Missing transactionId' }, 400);
  }

  if (!spTicketId) {
    return this.fail({ message: 'Missing spTicketId' }, 400);
  }

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  async function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  try {
    let result;
    const startTime = Date.now();
    const timeout = 50;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (Date.now() - startTime >= timeout * 1000) {
        return this.fail(
          { message: `Operation timed out after ${timeout} seconds` },
          408
        );
      }

      await delay(4000);

      try {
        result = await this.twFidoClient.getAthOrSignResult({
          transaction_id: transactionId,
          sp_ticket_id: spTicketId,
        });

        if (result.error_code === '0') {
          break;
        }
      } catch (e) {
        // do nothing
      }
    }

    this._verify(nationalId, result, verified);
  } catch (ex) {
    return self.error(ex);
  }
};
