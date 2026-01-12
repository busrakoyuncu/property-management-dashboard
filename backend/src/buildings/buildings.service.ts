import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBuildingDto: CreateBuildingDto) {
    // Verify property exists
    const property = await this.prisma.property.findUnique({
      where: { id: createBuildingDto.propertyId },
    });

    if (!property) {
      throw new NotFoundException(
        `Property with ID ${createBuildingDto.propertyId} not found`,
      );
    }

    return this.prisma.building.create({
      data: createBuildingDto,
      include: {
        property: true,
        units: true,
      },
    });
  }

  async findAll(propertyId?: string) {
    return this.prisma.building.findMany({
      where: propertyId ? { propertyId } : undefined,
      include: {
        property: true,
        units: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const building = await this.prisma.building.findUnique({
      where: { id },
      include: {
        property: true,
        units: true,
      },
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    return building;
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto) {
    await this.findOne(id); // Ensure building exists

    return this.prisma.building.update({
      where: { id },
      data: updateBuildingDto,
      include: {
        property: true,
        units: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure building exists

    // Cascade delete is handled by Prisma schema
    return this.prisma.building.delete({
      where: { id },
    });
  }
}
