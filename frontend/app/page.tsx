import { PropertyDashboard } from '@/components/PropertyDashboard'
import { Property } from '@/types/property'

// TODO: Replace with actual API call
const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Parkview Condominium',
    type: 'WEG',
    uniqueNumber: 'PROP-2024-001',
  },
  {
    id: '2',
    name: 'Riverside Apartments',
    type: 'MV',
    uniqueNumber: 'PROP-2024-002',
  },
  {
    id: '3',
    name: 'Downtown Complex',
    type: 'WEG',
    uniqueNumber: 'PROP-2024-003',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <PropertyDashboard properties={mockProperties} />
      </div>
    </main>
  )
}
