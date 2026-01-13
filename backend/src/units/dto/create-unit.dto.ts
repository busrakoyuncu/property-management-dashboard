import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsUUID,
} from 'class-validator';
// Import from generated Prisma client (workaround for monorepo module resolution)
import type { UnitType } from '../../../../node_modules/.prisma/client';
// Re-export for runtime
const { UnitType: UnitTypeEnum } = require('@prisma/client');

export class CreateUnitDto {
  @IsUUID()
  buildingId: string;

  @IsString()
  unitNumber: string;

  @IsEnum(UnitTypeEnum)
  unitType: UnitType;

  @IsOptional()
  @IsString()
  parkingNumber?: string;

  @IsOptional()
  @IsString()
  floor?: string;

  @IsOptional()
  @IsString()
  entrance?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  sizeSqm?: number;

  @IsOptional()
  @IsInt()
  rooms?: number;

  @IsNumber()
  meaShare: number;

  @IsOptional()
  @IsInt()
  constructionYear?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  specialUseRights?: string;
}
