import { Test, TestingModule } from '@nestjs/testing';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

describe('BuildingsController', () => {
  let controller: BuildingsController;
  let service: BuildingsService;

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
    property: {
      id: 'property-1',
      name: 'Test Property',
    },
    units: [],
  };

  const mockBuildingsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingsController],
      providers: [
        {
          provide: BuildingsService,
          useValue: mockBuildingsService,
        },
      ],
    }).compile();

    controller = module.get<BuildingsController>(BuildingsController);
    service = module.get<BuildingsService>(BuildingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a building', async () => {
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

      mockBuildingsService.create.mockResolvedValue(mockBuilding);

      const result = await controller.create(createBuildingDto);

      expect(service.create).toHaveBeenCalledWith(createBuildingDto);
      expect(result).toEqual(mockBuilding);
    });
  });

  describe('findAll', () => {
    it('should return all buildings', async () => {
      const mockBuildings = [mockBuilding];
      mockBuildingsService.findAll.mockResolvedValue(mockBuildings);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBuildings);
    });
  });

  describe('findOne', () => {
    it('should return a building by id', async () => {
      mockBuildingsService.findOne.mockResolvedValue(mockBuilding);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBuilding);
    });
  });
});
