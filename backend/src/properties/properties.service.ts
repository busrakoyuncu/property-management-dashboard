import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(createPropertyDto: CreatePropertyDto) {
    const { buildings, declarationDate, ...propertyData } = createPropertyDto;

    return this.prisma.property.create({
      data: {
        ...propertyData,
        declarationDate: declarationDate ? new Date(declarationDate) : null,
        buildings: buildings
          ? {
              create: buildings.map((building) => ({
                code: building.code,
                name: building.name,
                street: building.street,
                houseNumber: building.houseNumber,
                postalCode: building.postalCode,
                city: building.city,
                buildingType: building.buildingType,
                constructionYear: building.constructionYear,
                floors: building.floors,
                hasElevator: building.hasElevator,
                isBarrierFree: building.isBarrierFree,
                parkingAccess: building.parkingAccess,
                description: building.description,
                units: building.units
                  ? {
                      create: building.units.map((unit) => ({
                        unitNumber: unit.unitNumber,
                        unitType: unit.unitType,
                        parkingNumber: unit.parkingNumber,
                        floor: unit.floor,
                        entrance: unit.entrance,
                        position: unit.position,
                        sizeSqm: unit.sizeSqm,
                        rooms: unit.rooms,
                        meaShare: unit.meaShare,
                        constructionYear: unit.constructionYear,
                        description: unit.description,
                        specialUseRights: unit.specialUseRights,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        propertyManager: true,
        accountant: true,
        buildings: {
          include: {
            units: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.property.findMany({
      include: {
        propertyManager: true,
        accountant: true,
        buildings: {
          include: {
            units: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        propertyManager: true,
        accountant: true,
        buildings: {
          include: {
            units: true,
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    await this.findOne(id); // Ensure property exists

    const updateData = updatePropertyDto as Record<string, unknown>;
    const { declarationDate, ...rest } = updateData;

    const data: Prisma.PropertyUpdateInput = {
      ...rest,
    };

    if (declarationDate !== undefined) {
      data.declarationDate = declarationDate
        ? new Date(declarationDate as string)
        : null;
    }

    return this.prisma.property.update({
      where: { id },
      data,
      include: {
        propertyManager: true,
        accountant: true,
        buildings: {
          include: {
            units: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure property exists

    // Cascade delete is handled by Prisma schema
    return this.prisma.property.delete({
      where: { id },
    });
  }
}
