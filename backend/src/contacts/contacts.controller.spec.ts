import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactRole } from '@prisma/client';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

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
    managedProperties: [],
    accountedProperties: [],
  };

  const mockContactsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: mockContactsService,
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a contact', async () => {
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

      mockContactsService.create.mockResolvedValue(mockContact);

      const result = await controller.create(createContactDto);

      expect(service.create).toHaveBeenCalledWith(createContactDto);
      expect(result).toEqual(mockContact);
    });
  });

  describe('findAll', () => {
    it('should return all contacts', async () => {
      const mockContacts = [mockContact];
      mockContactsService.findAll.mockResolvedValue(mockContacts);

      const result = await controller.findAll();

      expect(result).toEqual(mockContacts);
    });
  });
});
