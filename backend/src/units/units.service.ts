import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async create(createUnitDto: CreateUnitDto) {
    // Verify building exists
    const building = await this.prisma.building.findUnique({
      where: { id: createUnitDto.buildingId },
    });

    if (!building) {
      throw new NotFoundException(
        `Building with ID ${createUnitDto.buildingId} not found`,
      );
    }

    return this.prisma.unit.create({
      data: createUnitDto,
      include: {
        building: {
          include: {
            property: true,
          },
        },
      },
    });
  }

  async findAll(buildingId?: string) {
    return this.prisma.unit.findMany({
      where: buildingId ? { buildingId } : undefined,
      include: {
        building: {
          include: {
            property: true,
          },
        },
      },
      orderBy: { unitNumber: 'asc' },
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        building: {
          include: {
            property: true,
          },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  async update(id: string, updateUnitDto: UpdateUnitDto) {
    await this.findOne(id); // Ensure unit exists

    return this.prisma.unit.update({
      where: { id },
      data: updateUnitDto,
      include: {
        building: {
          include: {
            property: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure unit exists

    return this.prisma.unit.delete({
      where: { id },
    });
  }
}
