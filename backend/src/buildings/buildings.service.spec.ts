import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

describe('BuildingsService', () => {
  let service: BuildingsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    building: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    property: {
      findUnique: jest.fn(),
    },
  };

  const mockBuilding = {
    id: '1',
    code: 'B1',
    name: 'Building 1',
    street: 'Main Street',
    houseNumber: '123',
    postalCode: '12345',
    city: 'Test City',
    buildingType: 'RESIDENTIAL',
    constructionYear: 2020,
    floors: 5,
    hasElevator: true,
    isBarrierFree: true,
    parkingAccess: 'Underground',
    description: 'Test building',
    propertyId: 'property-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProperty = {
    id: 'property-1',
    name: 'Test Property',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BuildingsService>(BuildingsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBuildingDto: CreateBuildingDto = {
      code: 'B1',
      name: 'Building 1',
      street: 'Main Street',
      houseNumber: '123',
      postalCode: '12345',
      city: 'Test City',
      buildingType: 'RESIDENTIAL',
      propertyId: 'property-1',
      constructionYear: 2020,
      floors: 5,
      hasElevator: true,
      isBarrierFree: true,
    };

    it('should create a building successfully', async () => {
      mockPrismaService.property.findUnique.mockResolvedValue(mockProperty);
      mockPrismaService.building.create.mockResolvedValue({
        ...mockBuilding,
        property: mockProperty,
        units: [],
      });

      const result = await service.create(createBuildingDto);

      expect(prismaService.property.findUnique).toHaveBeenCalledWith({
        where: { id: createBuildingDto.propertyId },
      });
      expect(prismaService.building.create).toHaveBeenCalledWith({
        data: createBuildingDto,
        include: {
          property: true,
          units: true,
        },
      });
      expect(result).toBeDefined();
      expect(result.property).toEqual(mockProperty);
    });

    it('should throw NotFoundException when property does not exist', async () => {
      mockPrismaService.property.findUnique.mockResolvedValue(null);

      await expect(service.create(createBuildingDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all buildings', async () => {
      const mockBuildings = [
        { ...mockBuilding, property: mockProperty, units: [] },
      ];
      mockPrismaService.building.findMany.mockResolvedValue(mockBuildings);

      const result = await service.findAll();

      expect(prismaService.building.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockBuildings);
    });
  });

  describe('findOne', () => {
    it('should return a building by id', async () => {
      const buildingWithRelations = {
        ...mockBuilding,
        property: mockProperty,
        units: [],
      };
      mockPrismaService.building.findUnique.mockResolvedValue(
        buildingWithRelations,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(buildingWithRelations);
    });

    it('should throw NotFoundException when building not found', async () => {
      mockPrismaService.building.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});
