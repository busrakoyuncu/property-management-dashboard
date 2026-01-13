import { Test, TestingModule } from '@nestjs/testing';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

describe('UnitsController', () => {
  let controller: UnitsController;
  let service: UnitsService;

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
    building: {
      id: 'building-1',
      code: 'B1',
      name: 'Building 1',
      property: {
        id: 'property-1',
        name: 'Test Property',
      },
    },
  };

  const mockUnitsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitsController],
      providers: [
        {
          provide: UnitsService,
          useValue: mockUnitsService,
        },
      ],
    }).compile();

    controller = module.get<UnitsController>(UnitsController);
    service = module.get<UnitsService>(UnitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a unit', async () => {
      const createUnitDto: CreateUnitDto = {
        unitNumber: 'A101',
        unitType: 'APARTMENT',
        meaShare: 1000,
        buildingId: 'building-1',
        sizeSqm: 75,
        rooms: 3,
      };

      mockUnitsService.create.mockResolvedValue(mockUnit);

      const result = await controller.create(createUnitDto);

      expect(result).toEqual(mockUnit);
    });
  });

  describe('findAll', () => {
    it('should return all units', async () => {
      const mockUnits = [mockUnit];
      mockUnitsService.findAll.mockResolvedValue(mockUnits);

      const result = await controller.findAll();

      expect(result).toEqual(mockUnits);
    });
  });

  describe('findOne', () => {
    it('should return a unit by id', async () => {
      mockUnitsService.findOne.mockResolvedValue(mockUnit);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockUnit);
    });
  });
});
