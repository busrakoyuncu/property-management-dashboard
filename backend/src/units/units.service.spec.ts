import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UnitsService } from './units.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

describe('UnitsService', () => {
  let service: UnitsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    unit: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    building: {
      findUnique: jest.fn(),
    },
  };

  const mockBuilding = {
    id: 'building-1',
    code: 'B1',
    name: 'Building 1',
  };

  const mockProperty = {
    id: 'property-1',
    name: 'Test Property',
  };

  const mockUnit = {
    id: '1',
    unitNumber: 'A101',
    unitType: 'APARTMENT',
    parkingNumber: 'P1',
    floor: '1',
    entrance: 'A',
    position: 'Front',
    sizeSqm: 75,
    rooms: 3,
    meaShare: 1000,
    constructionYear: 2020,
    description: 'Nice apartment',
    specialUseRights: 'Balcony',
    buildingId: 'building-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UnitsService>(UnitsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a unit successfully', async () => {
      const createUnitDto: CreateUnitDto = {
        unitNumber: 'A101',
        unitType: 'APARTMENT',
        meaShare: 1000,
        buildingId: 'building-1',
        sizeSqm: 75,
        rooms: 3,
      };

      mockPrismaService.building.findUnique.mockResolvedValue(mockBuilding);
      mockPrismaService.unit.create.mockResolvedValue({
        ...mockUnit,
        building: {
          ...mockBuilding,
          property: mockProperty,
        },
      });

      const result = await service.create(createUnitDto);

      expect(result).toBeDefined();
      expect(result.building).toBeDefined();
    });

    it('should throw NotFoundException when building does not exist', async () => {
      const createUnitDto: CreateUnitDto = {
        unitNumber: 'A101',
        unitType: 'APARTMENT',
        meaShare: 1000,
        buildingId: 'building-1',
      };

      mockPrismaService.building.findUnique.mockResolvedValue(null);

      await expect(service.create(createUnitDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all units', async () => {
      const mockUnits = [
        {
          ...mockUnit,
          building: {
            ...mockBuilding,
            property: mockProperty,
          },
        },
      ];
      mockPrismaService.unit.findMany.mockResolvedValue(mockUnits);

      const result = await service.findAll();

      expect(result).toEqual(mockUnits);
    });
  });

  describe('findOne', () => {
    it('should return a unit by id', async () => {
      const unitWithRelations = {
        ...mockUnit,
        building: {
          ...mockBuilding,
          property: mockProperty,
        },
      };
      mockPrismaService.unit.findUnique.mockResolvedValue(unitWithRelations);

      const result = await service.findOne('1');

      expect(result).toEqual(unitWithRelations);
    });

    it('should throw NotFoundException when unit not found', async () => {
      mockPrismaService.unit.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});
