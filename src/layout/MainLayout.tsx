
import React from 'react'
import { Box } from '@mui/material'
import Navbar from '../Components/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* glass-effect navbar */}
      <Navbar />

      {/* push below the fixed AppBar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pl: 1,
          pr:1,
          bgcolor: 'transparent',
           overflow: 'hidden',
        }}
      >
      

        {/* your page content */}
        {children}
      </Box>
    </Box>
  )
}

