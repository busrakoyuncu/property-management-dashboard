import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/lib/store/api'

// Create a test store
export function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  })
}

interface AllTheProvidersProps {
  children: React.ReactNode
  store?: ReturnType<typeof createTestStore>
}

function AllTheProviders({ children, store }: AllTheProvidersProps) {
  const testStore = store || createTestStore()
  
  return (
    <Provider store={testStore}>
      {children}
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { store?: ReturnType<typeof createTestStore> }
) => {
  const { store, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders store={store}>{children}</AllTheProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }
