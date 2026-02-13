
// import React from 'react'
// import { Box } from '@mui/material'
// import Navbar from '../Components/Navbar'

// export default function MainLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
//       {/* glass-effect navbar */}
//       <Navbar />

//       {/* push below the fixed AppBar */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           pl: 1,
//           pr:1,
//           bgcolor: 'transparent',
//            overflow: 'hidden',
//         }}
//       >
      

//         {/* your page content */}
//         {children}
//       </Box>
//     </Box>
//   )
// }




// import React from "react";
// import { Box } from "@mui/material";
// import { Outlet } from "react-router-dom";
// import SidebarShell from "../Components/SidebarShell";
// import TopbarShell from "../Components/TopbarShell";

// export default function MainLayout() {
//   return (
//     <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", bgcolor: "#0b0b0b" }}>
//       <SidebarShell />

//       <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, height: "100vh" }}>
//         <TopbarShell />

//         {/* <Box component="main" sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", p: 2 }}> */}
//          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
//           <Outlet />
//         </Box>
//       </Box>
//     </Box>
//   );
// }



import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SidebarShell from "../Components/SidebarShell";
import TopbarShell from "../Components/TopbarShell";

export default function MainLayout() {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        width: "100vw", 
        height: "100vh", 
        overflow: "hidden", 
        bgcolor: "#0b0b0b" 
      }}
    >
      <SidebarShell />

      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          flex: 1, 
          minWidth: 0, 
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <TopbarShell />

        {/* Content area with proper padding - NO SCROLLING */}
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            minHeight: 0, 
            overflow: "hidden", // No scrolling
            p: 2.5, // Padding around all content
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}