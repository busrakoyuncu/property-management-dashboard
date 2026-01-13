import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PdfParserService, ParsedPropertyData } from './pdf-parser.service';

// Mock the pdf-extraction module
jest.mock('pdf-extraction', () => {
  return jest.fn();
});

// Mock OpenAI
const mockCreate = jest.fn();
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
  };
});

const pdfExtraction = require('pdf-extraction');

describe('PdfParserService', () => {
  let service: PdfParserService;

  const mockParsedData: ParsedPropertyData = {
    property: {
      name: 'Test Property',
      propertyNumber: 'P001',
      managementType: 'WEG',
      totalAreaSqm: 1000,
      totalMea: 10000,
    },
    buildings: [
      {
        code: 'B1',
        name: 'Building 1',
        street: 'Test Street',
        houseNumber: '1',
        postalCode: '12345',
        city: 'Test City',
        buildingType: 'RESIDENTIAL',
        hasElevator: true,
        isBarrierFree: false,
      },
    ],
    units: [
      {
        unitNumber: 'A101',
        unitType: 'APARTMENT',
        meaShare: 1000,
      },
    ],
  };

  beforeEach(async () => {
    // Set the environment variable before creating the service
    process.env.OPENAI_API_KEY = 'test-api-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfParserService],
    }).compile();

    service = module.get<PdfParserService>(PdfParserService);
    mockCreate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.OPENAI_API_KEY;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error when OPENAI_API_KEY is not set', () => {
    delete process.env.OPENAI_API_KEY;
    expect(() => new PdfParserService()).toThrow(
      'OPENAI_API_KEY is not set in environment variables',
    );
  });

  describe('parsePdf', () => {
    const mockBuffer = Buffer.from('test pdf content');

    it('should successfully parse a PDF and extract property data', async () => {
      const mockPdfText = 'Sample PDF text content';
      pdfExtraction.mockResolvedValue({ text: mockPdfText });

      mockCreate.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockParsedData),
            },
          },
        ],
      } as any);

      const result = await service.parsePdf(mockBuffer);

      expect(result).toEqual(mockParsedData);
    });

    it('should throw BadRequestException when PDF is empty', async () => {
      pdfExtraction.mockResolvedValue({ text: '' });

      await expect(service.parsePdf(mockBuffer)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when PDF extraction fails', async () => {
      pdfExtraction.mockRejectedValue(new Error('Extraction failed'));

      await expect(service.parsePdf(mockBuffer)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

});
