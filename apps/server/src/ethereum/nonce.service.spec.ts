import { Test, TestingModule } from '@nestjs/testing';
import { NonceService } from './nonce.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Nonce } from './nonce.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('NonceService', () => {
  let service: NonceService;
  let mockNonceRepo: Partial<Repository<Nonce>>;

  beforeEach(async () => {
    mockNonceRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn().mockImplementation((nonce) => Promise.resolve(nonce)),
      findOne: jest.fn().mockResolvedValue(new Nonce()),
      remove: jest.fn().mockResolvedValue(new Nonce()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NonceService,
        {
          provide: getRepositoryToken(Nonce),
          useValue: mockNonceRepo,
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
    const verifyingNonce = { value: 'getRandomHex' };
    mockNonceRepo.findOne = jest.fn().mockResolvedValue(verifyingNonce);
    mockNonceRepo.remove = jest.fn().mockResolvedValue({});

    const result = await service.verify(null, verifyingNonce.value);

    expect(result).toBe(true);
    expect(mockNonceRepo.findOne).toHaveBeenCalledWith({
      where: { value: verifyingNonce.value },
    });
    expect(mockNonceRepo.remove).toHaveBeenCalledWith(verifyingNonce);
  });

  it('should throw NotFoundException if nonce is not found', async () => {
    mockNonceRepo.findOne = jest.fn().mockResolvedValue(null);

    await expect(service.verify(null, 'randomString')).rejects.toThrowError(
      NotFoundException
    );

    expect(mockNonceRepo.findOne).toHaveBeenCalledWith({
      where: { value: 'randomString' },
    });
  });
});
