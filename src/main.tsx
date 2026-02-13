// // src/main.tsx
// import  { StrictMode } from 'react'
// import { createRoot }       from 'react-dom/client'
// import { ApolloProvider }   from '@apollo/client'
// import App                  from './App'
// import './index.css'
// // import { apolloClient }     from './apolloClient'
// import { dashboardClient as apolloClient } from './apolloClient';


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ApolloProvider client={apolloClient}>
//       <App />
//     </ApolloProvider>
//   </StrictMode>,
// )


// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

import { dashboardClient as apolloClient } from "./apolloClient";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily:
      '"Sansation", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>
);
