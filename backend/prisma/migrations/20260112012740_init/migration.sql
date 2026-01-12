-- CreateEnum
CREATE TYPE "ManagementType" AS ENUM ('WEG', 'MV');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'MIXED');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('APARTMENT', 'OFFICE', 'GARDEN', 'PARKING');

-- CreateEnum
CREATE TYPE "ContactRole" AS ENUM ('PROPERTY_MANAGER', 'ACCOUNTANT');

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "role" "ContactRole" NOT NULL,
    "company_name" TEXT NOT NULL,
    "street" TEXT,
    "house_number" TEXT,
    "postal_code" TEXT,
    "city" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "property_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "management_type" "ManagementType" NOT NULL,
    "land_registry_district" TEXT,
    "land_registry_sheet" TEXT,
    "cadastral_district" TEXT,
    "cadastral_parcel" TEXT,
    "cadastral_plot" TEXT,
    "total_area_sqm" DECIMAL(12,2),
    "total_mea" INTEGER NOT NULL DEFAULT 1000,
    "notary_reference" TEXT,
    "declaration_date" DATE,
    "energy_standard" TEXT,
    "heating_type" TEXT,
    "original_owner" TEXT,
    "property_manager_id" TEXT,
    "accountant_id" TEXT,
    "manager_appointment_years" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "street" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "building_type" "BuildingType" NOT NULL DEFAULT 'RESIDENTIAL',
    "construction_year" INTEGER,
    "floors" INTEGER,
    "has_elevator" BOOLEAN NOT NULL DEFAULT false,
    "is_barrier_free" BOOLEAN NOT NULL DEFAULT false,
    "parking_access" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "building_id" TEXT NOT NULL,
    "unit_number" TEXT NOT NULL,
    "unit_type" "UnitType" NOT NULL,
    "parking_number" TEXT,
    "floor" TEXT,
    "entrance" TEXT,
    "position" TEXT,
    "size_sqm" DECIMAL(10,2),
    "rooms" INTEGER,
    "mea_share" DECIMAL(10,2) NOT NULL,
    "construction_year" INTEGER,
    "description" TEXT,
    "special_use_rights" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contacts_role_idx" ON "contacts"("role");

-- CreateIndex
CREATE UNIQUE INDEX "properties_property_number_key" ON "properties"("property_number");

-- CreateIndex
CREATE INDEX "buildings_property_id_idx" ON "buildings"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "buildings_property_id_code_key" ON "buildings"("property_id", "code");

-- CreateIndex
CREATE INDEX "units_building_id_idx" ON "units"("building_id");

-- CreateIndex
CREATE UNIQUE INDEX "units_building_id_unit_number_key" ON "units"("building_id", "unit_number");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_property_manager_id_fkey" FOREIGN KEY ("property_manager_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_accountant_id_fkey" FOREIGN KEY ("accountant_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
