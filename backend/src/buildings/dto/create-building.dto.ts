import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUUID,
} from 'class-validator';
// Import from generated Prisma client (workaround for monorepo module resolution)
import type { BuildingType } from '../../../../node_modules/.prisma/client';
// Re-export for runtime
const { BuildingType: BuildingTypeEnum } = require('@prisma/client');

export class CreateBuildingDto {
  @IsUUID()
  propertyId: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  street: string;

  @IsString()
  houseNumber: string;

  @IsString()
  postalCode: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsEnum(BuildingTypeEnum)
  buildingType?: BuildingType;

  @IsOptional()
  @IsInt()
  constructionYear?: number;

  @IsOptional()
  @IsInt()
  floors?: number;

  @IsOptional()
  @IsBoolean()
  hasElevator?: boolean;

  @IsOptional()
  @IsBoolean()
  isBarrierFree?: boolean;

  @IsOptional()
  @IsString()
  parkingAccess?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
