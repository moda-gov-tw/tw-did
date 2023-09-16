import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { Nonce } from './nonce.schema';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockNonceModel: any;

  beforeEach(async () => {
    mockNonceModel = function () {
      this.value = 'randomHexString';
      this.save = jest.fn().mockResolvedValue(this);
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Nonce.name),
          useValue: mockNonceModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate and save a nonce', async () => {
    const nonce = await service.challenge();

    expect(typeof nonce.value).toBe('string');
    expect(nonce.value).toHaveLength(32);
    expect(/^[0-9a-fA-F]{32}$/.test(nonce.value)).toBeTruthy();
  });

  it('should verify a nonce and return true', async () => {
    const verifingNonce = { value: 'getRandomHex' };
    mockNonceModel.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(verifingNonce),
    });
    const result = await service.verify(verifingNonce);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if nonce is not found', async () => {
    mockNonceModel.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.verify({ value: 'randomString' })
    ).rejects.toThrowError('Nonce not found');
  });
});
