import { Module } from '@nestjs/common';
import { ContactsModule } from './contacts/contacts.module';
import { PropertiesModule } from './properties/properties.module';
import { BuildingsModule } from './buildings/buildings.module';
import { UnitsModule } from './units/units.module';

@Module({
  imports: [
    ContactsModule,
    PropertiesModule,
    BuildingsModule,
    UnitsModule,
  ],
})
export class AppModule {}
