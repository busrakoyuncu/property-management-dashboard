import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactRole } from '@prisma/client';

describe('ContactsService', () => {
  let service: ContactsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    contact: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockContact = {
    id: '1',
    companyName: 'Test Company',
    email: 'john@test.com',
    phone: '+1234567890',
    street: 'Test Street',
    houseNumber: '1',
    postalCode: '12345',
    city: 'Test City',
    role: ContactRole.PROPERTY_MANAGER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact successfully', async () => {
      const createContactDto: CreateContactDto = {
        companyName: 'Test Company',
        email: 'john@test.com',
        phone: '+1234567890',
        street: 'Test Street',
        houseNumber: '1',
        postalCode: '12345',
        city: 'Test City',
        role: ContactRole.PROPERTY_MANAGER,
      };

      mockPrismaService.contact.create.mockResolvedValue(mockContact);

      const result = await service.create(createContactDto);

      expect(result).toEqual(mockContact);
    });
  });

  describe('findAll', () => {
    it('should return all contacts', async () => {
      const mockContacts = [mockContact];
      mockPrismaService.contact.findMany.mockResolvedValue(mockContacts);

      const result = await service.findAll();

      expect(result).toEqual(mockContacts);
    });
  });

  describe('findOne', () => {
    it('should return a contact by id', async () => {
      const contactWithRelations = {
        ...mockContact,
        managedProperties: [],
        accountedProperties: [],
      };
      mockPrismaService.contact.findUnique.mockResolvedValue(
        contactWithRelations,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(contactWithRelations);
    });
  });
});
