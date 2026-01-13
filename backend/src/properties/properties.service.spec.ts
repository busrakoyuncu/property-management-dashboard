import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    property: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockProperty = {
    id: '1',
    name: 'Test Property',
    propertyNumber: 'P001',
    managementType: 'WEG',
    totalAreaSqm: 1000,
    totalMea: 10000,
    landRegistryDistrict: 'District 1',
    landRegistrySheet: 'Sheet 1',
    cadastralDistrict: 'Cadastral District',
    cadastralParcel: 'Parcel 1',
    cadastralPlot: 'Plot 1',
    notaryReference: 'Ref 123',
    declarationDate: new Date('2020-01-01'),
    energyStandard: 'A+',
    heatingType: 'Gas',
    originalOwner: 'Original Owner',
    managerAppointmentYears: 3,
    propertyManagerId: 'pm-1',
    accountantId: 'acc-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPropertyManager = {
    id: 'pm-1',
    companyName: 'PM Company',
    firstName: 'Property',
    lastName: 'Manager',
  };

  const mockAccountant = {
    id: 'acc-1',
    companyName: 'Accountant Company',
    firstName: 'Account',
    lastName: 'Ant',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a property successfully', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        propertyNumber: 'P001',
        managementType: 'WEG',
        totalAreaSqm: 1000,
        totalMea: 10000,
        propertyManagerId: 'pm-1',
        accountantId: 'acc-1',
      };

      const propertyWithRelations = {
        ...mockProperty,
        propertyManager: mockPropertyManager,
        accountant: mockAccountant,
        buildings: [],
      };
      mockPrismaService.property.create.mockResolvedValue(
        propertyWithRelations,
      );

      const result = await service.create(createPropertyDto);

      expect(result).toBeDefined();
      expect(result.propertyManager).toEqual(mockPropertyManager);
    });

    it('should create a property with nested buildings and units', async () => {
      const createPropertyDtoWithBuildings: CreatePropertyDto = {
        name: 'Test Property',
        propertyNumber: 'P001',
        managementType: 'WEG',
        buildings: [
          {
            code: 'B1',
            name: 'Building 1',
            street: 'Main St',
            houseNumber: '1',
            postalCode: '12345',
            city: 'Test City',
            buildingType: 'RESIDENTIAL',
            hasElevator: true,
            isBarrierFree: false,
            units: [
              {
                unitNumber: '1',
                unitType: 'APARTMENT',
                meaShare: 1000,
              },
            ],
          },
        ],
      };

      const propertyWithRelations = {
        ...mockProperty,
        propertyManager: mockPropertyManager,
        accountant: mockAccountant,
        buildings: [
          {
            id: 'b1',
            code: 'B1',
            name: 'Building 1',
            units: [
              {
                id: 'u1',
                unitNumber: '1',
                unitType: 'APARTMENT',
                meaShare: 1000,
              },
            ],
          },
        ],
      };

      mockPrismaService.property.create.mockResolvedValue(
        propertyWithRelations,
      );

      const result = await service.create(createPropertyDtoWithBuildings);

      expect(result.buildings).toHaveLength(1);
      expect(result.buildings[0].units).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      const mockProperties = [
        {
          ...mockProperty,
          propertyManager: mockPropertyManager,
          accountant: mockAccountant,
          buildings: [],
        },
      ];
      mockPrismaService.property.findMany.mockResolvedValue(mockProperties);

      const result = await service.findAll();

      expect(result).toEqual(mockProperties);
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      const propertyWithRelations = {
        ...mockProperty,
        propertyManager: mockPropertyManager,
        accountant: mockAccountant,
        buildings: [],
      };
      mockPrismaService.property.findUnique.mockResolvedValue(
        propertyWithRelations,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(propertyWithRelations);
    });

    it('should throw NotFoundException when property not found', async () => {
      mockPrismaService.property.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a property successfully', async () => {
      const updatePropertyDto: UpdatePropertyDto = {
        name: 'Updated Property',
        totalAreaSqm: 1500,
      };
      
      const propertyWithRelations = {
        ...mockProperty,
        propertyManager: mockPropertyManager,
        accountant: mockAccountant,
        buildings: [],
      };
      mockPrismaService.property.findUnique.mockResolvedValue(
        propertyWithRelations,
      );
      mockPrismaService.property.update.mockResolvedValue({
        ...propertyWithRelations,
        ...updatePropertyDto,
      });

      const result = await service.update('1', updatePropertyDto);

      expect(result.name).toBe(updatePropertyDto.name);
    });
  });
});
