import { TwDidService } from './TwDidService';

describe('TwDidService', () => {
  it('should work', () => {
    const service = new TwDidService('host');
    expect(service.host).to.eq('host');
  });
});
