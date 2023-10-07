import { TwFidoApiClient, parseSpTicket } from '@tw-did/twfido-client';
import { Strategy as PassportStrategy } from 'passport-strategy';
import { inherits } from 'util';
import { delay } from './utils';

interface TwFidoStrategyOptions {
  apiUrl: string;
  apiKey: string;
  serviceId: string;
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function Strategy(
  { apiUrl, apiKey, serviceId }: TwFidoStrategyOptions,
  verify
) {
  if (!verify) {
    throw new TypeError('TwFidoStrategy requires a verify callback');
  }

  this.twFidoClient = new TwFidoApiClient(apiUrl, apiKey, serviceId);
  this._nationalIdField = 'nationalId';

  PassportStrategy.call(this);

  this.name = 'twfido';
  this._verify = verify;
}

inherits(Strategy, PassportStrategy);

Strategy.prototype.authenticate = async function (req) {
  const nationalId = req.body[this._nationalIdField];

  if (!nationalId) {
    return this.fail({ message: 'Missing nationalId' }, 400);
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

  const notifyParams = {
    id_num: nationalId,
    op_code: 'ATH',
    hint: '',
  };

  const initAuth = await this.twFidoClient.requestAthOrSignPush(notifyParams);
  const spTicket = parseSpTicket(initAuth.result.sp_ticket);

  try {
    let result;
    const startTime = Date.now();
    const timeout = 180000; // 3 minutes

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (Date.now() - startTime >= timeout) {
        throw new TimeoutError('Operation timed out after 3 minutes');
      }

      await delay(4000);

      try {
        result = await this.twFidoClient.getAthOrSignResult({
          transaction_id: initAuth.transaction_id,
          sp_ticket_id: spTicket.sp_ticket_id,
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
