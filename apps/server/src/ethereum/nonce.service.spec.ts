import { Test, TestingModule } from '@nestjs/testing';
import { NonceService } from './nonce.service';
import { Nonce } from './nonce.schema';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

describe('NonceService', () => {
  let service: NonceService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockNonceModel: any;

  beforeEach(async () => {
    mockNonceModel = function () {
      this.value = 'randomHexString';
      this.save = jest.fn().mockResolvedValue(this);
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NonceService,
        {
          provide: getModelToken(Nonce.name),
          useValue: mockNonceModel,
        },
      ],
    }).compile();

    service = module.get<NonceService>(NonceService);
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
    const result = await service.verify(null, verifingNonce.value);
    expect(result).toBe(true);
  });

  it('should throw NotFoundException if nonce is not found', async () => {
    mockNonceModel.findOneAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.verify(null, 'randomString')).rejects.toThrowError(
      NotFoundException
    );
  });
});
