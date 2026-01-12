import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateBuildingDto } from './create-building.dto';

// Exclude propertyId from updates - building can not change its property
export class UpdateBuildingDto extends PartialType(
  OmitType(CreateBuildingDto, ['propertyId'] as const),
) {}
