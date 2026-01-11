/**
 * Dummy data for Property Managers and Accountants
 * Used in property creation and management forms
 */

export interface User {
  id: string
  name: string
  email: string
  role: 'property_manager' | 'accountant'
  phone?: string
}

export const users: User[] = [
  // Property Managers
  {
    id: 'pm-001',
    name: 'Sarah Müller',
    email: 'sarah.mueller@buena.com',
    role: 'property_manager',
    phone: '+49 30 12345678',
  },
  {
    id: 'pm-002',
    name: 'Thomas Schneider',
    email: 'thomas.schneider@buena.com',
    role: 'property_manager',
    phone: '+49 30 12345679',
  },
  {
    id: 'pm-003',
    name: 'Anna Weber',
    email: 'anna.weber@buena.com',
    role: 'property_manager',
    phone: '+49 30 12345680',
  },
  {
    id: 'pm-004',
    name: 'Michael Fischer',
    email: 'michael.fischer@buena.com',
    role: 'property_manager',
    phone: '+49 30 12345681',
  },
  {
    id: 'pm-005',
    name: 'Julia Klein',
    email: 'julia.klein@buena.com',
    role: 'property_manager',
    phone: '+49 30 12345682',
  },
  // Accountants
  {
    id: 'acc-001',
    name: 'Robert Hoffmann',
    email: 'robert.hoffmann@buena.com',
    role: 'accountant',
    phone: '+49 30 22345678',
  },
  {
    id: 'acc-002',
    name: 'Lisa Wagner',
    email: 'lisa.wagner@buena.com',
    role: 'accountant',
    phone: '+49 30 22345679',
  },
  {
    id: 'acc-003',
    name: 'David Becker',
    email: 'david.becker@buena.com',
    role: 'accountant',
    phone: '+49 30 22345680',
  },
  {
    id: 'acc-004',
    name: 'Maria Schulz',
    email: 'maria.schulz@buena.com',
    role: 'accountant',
    phone: '+49 30 22345681',
  },
  {
    id: 'acc-005',
    name: 'Christoph Koch',
    email: 'christoph.koch@buena.com',
    role: 'accountant',
    phone: '+49 30 22345682',
  },
]

// Helper functions
export function getPropertyManagers(): User[] {
  return users.filter((user) => user.role === 'property_manager')
}

export function getAccountants(): User[] {
  return users.filter((user) => user.role === 'accountant')
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getUsersByRole(role: 'property_manager' | 'accountant'): User[] {
  return users.filter((user) => user.role === role)
}

// For backward compatibility (if needed)
export const propertyManagers = getPropertyManagers()
export const accountants = getAccountants()
export const allUsers = users
