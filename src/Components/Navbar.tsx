// src/components/Navbar.tsx
import  { useState } from 'react'
import {
  Box,
  Link,
  IconButton,
  Popover,
  Card
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import PersonAddIcon           from '@mui/icons-material/PersonAdd'
import ComLogo                 from '../assets/Com_logo.png'
import UserIcon                from '../assets/helmeticon.png'

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Faults',    path: '/faults'    },
  { label: 'Alerts',    path: '/alerts'    },
  { label: 'Reports',   path: '/reports'   },
  { label: 'IAM',       path: '/iam'       },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  // anchor elements for the two popovers
  const [notifAnchor, setNotifAnchor]     = useState<HTMLElement | null>(null)
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      {/* — Logo on the far left — */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 32,
          display: 'flex',
          alignItems: 'center',
          zIndex: 1300,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/dashboard')}
      >
        <Box
          component="img"
          src={ComLogo}
          alt="Company Logo"
          sx={{ height: 40, width: 140 }}
        />
      </Box>

      {/* — Centered pill‐style nav links — */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          bgcolor: '#1e1e1e',
          backdropFilter: 'blur(8px)',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.2)',
          px: 1,
          py: 0.5,
          zIndex: 1290,
        }}
      >
        {navItems.map(({ label, path }) => {
          const active = location.pathname === path
          return (
            <Link
              key={path}
              onClick={() => navigate(path)}
              underline="none"
              sx={{
                mx: 0.5,
                px: 2,
                py: '6px',
                borderRadius: '999px',
                fontWeight: 500,
                fontSize: '0.95rem',
                color: '#fff',
                bgcolor: active
                  ? 'rgba(255,255,255,0.15)'
                  : 'transparent',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: active
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.1)',
                  color: '#FFD54F',
                  cursor: 'pointer',
                },
              }}
            >
              {label}
            </Link>
          )
        })}
      </Box>

      {/* — Right‐aligned circle icons: Create User, Notifications, Avatar — */}
      <Box
        sx={{
          position: 'fixed',
          top: 12,
          right: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          zIndex: 1300,
        }}
      >
        {/* Create User */}
        <Box sx={circleStyle}>
             
       <IconButton
          size="large"
          sx={iconButtonStyle}
          
        //   onClick={() =>
        //   navigate('/admin/users/new', {
        //     state: { mode: 'signup' },
            
        //   })
        // }
         onClick={() => navigate('/admin/users/new')}
        >

              <PersonAddIcon />
            </IconButton> 
            
        </Box>

        {/* Notification bell */}
        <Box sx={circleStyle}>
          <IconButton
            size="large"
            sx={iconButtonStyle}
            onClick={e => setNotifAnchor(e.currentTarget)}
          >
            <NotificationsNoneIcon />
          </IconButton>
        </Box>

        {/* User avatar */}
        <Box sx={circleStyle}>
          <IconButton
            size="large"
            sx={iconButtonStyle}
            onClick={e => setProfileAnchor(e.currentTarget)}
          >
            <Box
              component="img"
              src={UserIcon}
              alt="User"
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                '&:hover': { opacity: 0.8 },
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* — Notifications Popover — */}
      <Popover
        open={Boolean(notifAnchor)}
        anchorEl={notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top',    horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 300,
            maxHeight: 400,
            bgcolor: 'rgba(28,28,30,1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            p: 1,
          }
        }}
      >
        <Box
          sx={{
            overflowY: 'auto',
            maxHeight: 360,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <Card
              key={i}
              sx={{
                mb: 1,
                p: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: 1,
                height: 60,
              }}
            >
              {/* you can drop real content here */}
            </Card>
          ))}
        </Box>
      </Popover>

      {/* — Profile Popover (you can add actual menu items here) — */}
      <Popover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top',    horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 200,
            bgcolor: 'rgba(28,28,30,1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            p: 1,
          }
        }}
      >
<Box>
       

        <Link
          underline="none"
         
          onClick={() => {
            setProfileAnchor(null)
            localStorage.removeItem('idToken')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            navigate('/login')
          }}
          
          sx={{
            display: 'block',
            py: 1,
            color: '#FFD600',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.05)',
              textDecoration: 'none',
              cursor: 'pointer'
            }
          }}
        >
          Logout
        </Link>
      </Box>
      </Popover>
    </>
  )
}

// Utility styles
const circleStyle = {
  bgcolor: 'rgba(30,30,30,0.6)',
  backdropFilter: 'blur(8px)',
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.2)',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const iconButtonStyle = {
  color: '#fff',
  p: 1,
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#FFD54F',
  },
}
