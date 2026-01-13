import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { PdfParserService } from './pdf-parser.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let propertiesService: PropertiesService;
  let pdfParserService: PdfParserService;

  const mockProperty = {
    id: '1',
    name: 'Test Property',
    propertyNumber: 'P001',
    managementType: 'WEG',
    totalAreaSqm: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    propertyManager: {
      id: 'pm-1',
      companyName: 'PM Company',
    },
    accountant: {
      id: 'acc-1',
      companyName: 'Accountant Company',
    },
    buildings: [],
  };

  const mockPropertiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPdfParserService = {
    parsePdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: mockPropertiesService,
        },
        {
          provide: PdfParserService,
          useValue: mockPdfParserService,
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    propertiesService = module.get<PropertiesService>(PropertiesService);
    pdfParserService = module.get<PdfParserService>(PdfParserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a property', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        propertyNumber: 'P001',
        managementType: 'WEG',
        totalAreaSqm: 1000,
      };

      mockPropertiesService.create.mockResolvedValue(mockProperty);

      const result = await controller.create(createPropertyDto);

      expect(result).toEqual(mockProperty);
    });
  });

  describe('parsePdf', () => {
    it('should parse a PDF file successfully', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test pdf content'),
        size: 1024,
        stream: {} as any,
        destination: '',
        filename: '',
        path: '',
      };

      const mockParsedData = {
        property: {
          name: 'Parsed Property',
          propertyNumber: 'P002',
        },
        buildings: [],
        units: [],
      };

      mockPdfParserService.parsePdf.mockResolvedValue(mockParsedData);

      const result = await controller.parsePdf(mockFile);

      expect(result).toEqual(mockParsedData);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      const mockProperties = [mockProperty];
      mockPropertiesService.findAll.mockResolvedValue(mockProperties);

      const result = await controller.findAll();

      expect(result).toEqual(mockProperties);
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      mockPropertiesService.findOne.mockResolvedValue(mockProperty);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockProperty);
    });
  });
});
