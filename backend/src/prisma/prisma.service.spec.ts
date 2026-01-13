import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;
  let connectSpy: jest.SpyInstance;
  let disconnectSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);

    // Mock the database connection methods to avoid connecting to PostgreSQL
    connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined);
    disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined);
  });

  afterEach(async () => {
    // Clean up mocks
    jest.clearAllMocks();
    if (connectSpy) connectSpy.mockRestore();
    if (disconnectSpy) disconnectSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extend PrismaClient and have database methods', () => {
    expect(service).toHaveProperty('$connect');
    expect(service).toHaveProperty('$disconnect');
    expect(service).toHaveProperty('property');
    expect(service).toHaveProperty('building');
    expect(service).toHaveProperty('unit');
    expect(service).toHaveProperty('contact');
  });

  describe('lifecycle hooks', () => {
    it('should call $connect on module initialization', async () => {
      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalledTimes(1);
    });

    it('should call $disconnect on module destruction', async () => {
      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
