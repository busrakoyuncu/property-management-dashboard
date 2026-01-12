import { Injectable, BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';

const pdfExtraction = require('pdf-extraction');

export interface ParsedPropertyData {
  property: {
    name?: string;
    propertyNumber?: string;
    managementType?: 'WEG' | 'MV';
    totalAreaSqm?: number;
    totalMea?: number;
    landRegistryDistrict?: string;
    landRegistrySheet?: string;
    cadastralDistrict?: string;
    cadastralParcel?: string;
    cadastralPlot?: string;
    notaryReference?: string;
    declarationDate?: string;
    energyStandard?: string;
    heatingType?: string;
    originalOwner?: string;
    managerAppointmentYears?: number;
    // Contact information (names/company names from PDF)
    propertyManagerName?: string; // Company name or name of property manager
    propertyManagerEmail?: string;
    propertyManagerPhone?: string;
    propertyManagerStreet?: string;
    propertyManagerHouseNumber?: string;
    propertyManagerPostalCode?: string;
    propertyManagerCity?: string;
    accountantName?: string; // Company name or name of accountant
    accountantEmail?: string;
    accountantPhone?: string;
    accountantStreet?: string;
    accountantHouseNumber?: string;
    accountantPostalCode?: string;
    accountantCity?: string;
  };
  buildings: Array<{
    code?: string;
    name?: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    constructionYear?: number;
    floors?: number;
    hasElevator: boolean;
    isBarrierFree: boolean;
    buildingType: 'RESIDENTIAL' | 'COMMERCIAL' | 'MIXED';
    parkingAccess?: string;
    description?: string;
  }>;
  units: Array<{
    unitNumber: string;
    unitType: 'APARTMENT' | 'OFFICE' | 'GARDEN' | 'PARKING';
    parkingNumber?: string;
    buildingCode?: string;
    floor?: string;
    entrance?: string;
    position?: string;
    sizeSqm?: number;
    rooms?: number;
    meaShare: number;
    constructionYear?: number;
    description?: string;
    specialUseRights?: string;
  }>;
}

@Injectable()
export class PdfParserService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async parsePdf(fileBuffer: Buffer): Promise<ParsedPropertyData> {
    try {
      const pdfText = await this.extractTextFromPdf(fileBuffer);
      console.log('pdfText', pdfText);

      if (!pdfText || pdfText.trim().length === 0) {
        throw new BadRequestException('PDF file appears to be empty or unreadable');
      }

      // Use OpenAI to parse the text
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o', // We could use mini model but just to be safe
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting property, building, and unit information from German real estate documents (Teilungserklärung/Declaration of Division).

            Extract all available information and return it as a JSON object with the following structure:
            {
            "property": {
                "name": string (property name),
                "propertyNumber": string (object/property number),
                "managementType": "WEG" or "MV" (WEG for Wohnungseigentumsgesetz/Condominium, MV for Mietverwaltung/Rental),
                "totalAreaSqm": number (total area in square meters),
                "totalMea": number (total MEA/Miteigentumsanteil),
                "landRegistryDistrict": string (Grundbuchbezirk),
                "landRegistrySheet": string (Grundbuchblatt),
                "cadastralDistrict": string (Katastralgemeinde),
                "cadastralParcel": string (Grundstücksnummer),
                "cadastralPlot": string (Parzelle/Bauplatz/Flur - look for "Flur" followed by a number, e.g., "Flur 12"),
                "notaryReference": string (Notariatsaktenzeichen/Urkundenrolle - look for "URKUNDENROLLE", "Urkundenrolle", "Notariatsaktenzeichen", or similar patterns like "NR. 2024/05-B" or "2024/05-B"),
                "declarationDate": string (Date in YYYY-MM-DD format),
                "energyStandard": string,
                "heatingType": string,
                "originalOwner": string (original owner/developer),
                "managerAppointmentYears": number (years of manager appointment),
                "propertyManagerName": string (company name or name of property manager/Hausverwaltung),
                "propertyManagerEmail": string (email of property manager),
                "propertyManagerPhone": string (phone of property manager),
                "propertyManagerStreet": string (street address of property manager),
                "propertyManagerHouseNumber": string (house number of property manager),
                "propertyManagerPostalCode": string (postal code of property manager),
                "propertyManagerCity": string (city of property manager),
                "accountantName": string (company name or name of accountant/Buchhalter),
                "accountantEmail": string (email of accountant),
                "accountantPhone": string (phone of accountant),
                "accountantStreet": string (street address of accountant),
                "accountantHouseNumber": string (house number of accountant),
                "accountantPostalCode": string (postal code of accountant),
                "accountantCity": string (city of accountant)
            },
            "buildings": [{
                "code": string (building code/identifier),
                "name": string (building name),
                "street": string,
                "houseNumber": string,
                "postalCode": string,
                "city": string,
                "constructionYear": number,
                "floors": number,
                "hasElevator": boolean,
                "isBarrierFree": boolean (barrierefrei),
                "buildingType": "RESIDENTIAL" or "COMMERCIAL" or "MIXED",
                "parkingAccess": string,
                "description": string
            }],
            "units": [{
                "unitNumber": string (unit/apartment number),
                "unitType": "APARTMENT" or "OFFICE" or "GARDEN" or "PARKING",
                "parkingNumber": string (if applicable),
                "buildingCode": string (reference to building),
                "floor": string (e.g., "Erdgeschoss", "1. Obergeschoss"),
                "entrance": string,
                "position": string,
                "sizeSqm": number (size in square meters),
                "rooms": number,
                "meaShare": number (MEA share/Miteigentumsanteil),
                "constructionYear": number,
                "description": string,
                "specialUseRights": string (Sondernutzungsrechte)
            }]
            }

            Important notes:
            - Extract as much information as possible from the document
            - If a field is not available in the document, omit it from the response
            - Be accurate with numbers and dates
            - For German terms, extract the exact values
            - If managementType is unclear, try to infer from document type (Teilungserklärung usually means WEG)
            - Ensure all required fields (street, houseNumber, postalCode, city, unitNumber, meaShare) are present
            - Look for property manager information under terms like: "Hausverwaltung", "Verwaltung", "Hausmeister", "Property Manager", "Verwalter"
            - Look for accountant information under terms like: "Buchhalter", "Steuerberater", "Accountant", "Wirtschaftsprüfer", "Rechnungsprüfer"
            - Extract contact details (name, email, phone, address) for both property manager and accountant if available
            - For cadastralPlot: Look for "Flur" followed by a number (e.g., "Flur 12", "Flur 5"). Extract the full value including "Flur" and the number.
            - For notaryReference: Look for patterns like "URKUNDENROLLE NR. 2024/05-B", "Urkundenrolle", "Notariatsaktenzeichen", or any reference number format (e.g., "2024/05-B", "NR. 2024/05-B"). Extract the complete reference including any prefixes.
            - Pay special attention to these fields as they may appear in different formats or locations in the document
            - Return ONLY valid JSON, no additional text`,
          },
          {
            role: 'user',
            content: `Please extract property, building, and unit information from this document:\n\n${pdfText.substring(0, 15000)}`, // Limit to avoid token limits
          },
        ],
        temperature: 0.1, // Low temperature for consistent extraction
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new BadRequestException('Failed to parse PDF content');
      }

      const parsedData: ParsedPropertyData = JSON.parse(responseContent);

      // Validate that we have at least some data
      if (!parsedData.property && (!parsedData.buildings || parsedData.buildings.length === 0)) {
        throw new BadRequestException('Could not extract meaningful property data from PDF');
      }

      return parsedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error parsing PDF:', error);
      throw new BadRequestException(`Failed to parse PDF: ${error.message}`);
    }
  }

  private async extractTextFromPdf(fileBuffer: Buffer): Promise<string> {
    try {
      const result = await pdfExtraction(fileBuffer);
      return result.text || '';
    } catch (error) {
      throw new BadRequestException(`Failed to extract text from PDF: ${error.message}`);
    }
  }
}
