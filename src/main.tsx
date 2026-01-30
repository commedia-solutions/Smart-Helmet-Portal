// src/main.tsx
import  { StrictMode } from 'react'
import { createRoot }       from 'react-dom/client'
import { ApolloProvider }   from '@apollo/client'
import App                  from './App'
import './index.css'
// import { apolloClient }     from './apolloClient'
import { dashboardClient as apolloClient } from './apolloClient';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
