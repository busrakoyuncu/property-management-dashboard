'use client'

import { PropertyType } from '@/types/property'
import { StepComponentProps } from '@/types/propertyForm'
import { propertyManagers, accountants } from '@/lib/data/users'

export function Step1GeneralInfo({ formData, onUpdate }: StepComponentProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold mb-3 block text-foreground">
          Management Type <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onUpdate({ managementType: 'WEG' })}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              formData.managementType === 'WEG'
                ? 'border-buena-green bg-buena-green/5 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="font-semibold text-base mb-1">Condominium (WEG)</div>
            <div className="text-sm text-muted-foreground">
              Communities of owners who share responsibility for common areas
            </div>
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ managementType: 'MV' })}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              formData.managementType === 'MV'
                ? 'border-buena-green bg-buena-green/5 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
          >
            <div className="font-semibold text-base mb-1">Rental (MV)</div>
            <div className="text-sm text-muted-foreground">
              Rental properties managed for landlords
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Property Name <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={formData.propertyName}
          onChange={(e) => onUpdate({ propertyName: e.target.value })}
          className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
          placeholder="Enter property name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Property Number
          </label>
          <input
            type="text"
            value={formData.propertyNumber || ''}
            onChange={(e) => onUpdate({ propertyNumber: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 10.557PRB"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Total Size (m²)
          </label>
          <input
            type="text"
            value={formData.totalSize || ''}
            onChange={(e) => onUpdate({ totalSize: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 2,450"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block text-foreground">
            Total Co-ownership Shares
          </label>
          <input
            type="text"
            value={formData.totalCoOwnershipShares || ''}
            onChange={(e) => onUpdate({ totalCoOwnershipShares: e.target.value })}
            className="w-full h-11 px-4 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm"
            placeholder="e.g., 1000"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Property Manager <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.propertyManagerId}
          onChange={(e) => onUpdate({ propertyManagerId: e.target.value })}
          className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          }}
        >
          <option value="">Select property manager</option>
          {propertyManagers.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Accountant <span className="text-destructive">*</span>
        </label>
        <select
          value={formData.accountantId}
          onChange={(e) => onUpdate({ accountantId: e.target.value })}
          className="w-full h-11 pl-4 pr-10 border border-input bg-background rounded-lg focus:outline-none focus:border-gray-400 text-sm appearance-none bg-no-repeat bg-[length:16px_16px] bg-[right_12px_center]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          }}
        >
          <option value="">Select accountant</option>
          {accountants.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block text-foreground">
          Declaration of Division (Teilungserklärung)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Drag and drop file here or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              PDF files only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
