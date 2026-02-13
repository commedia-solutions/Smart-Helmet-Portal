
// // src/components/CreateUserModal.tsx
// import React, { useState } from 'react'
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button
// } from '@mui/material'

// interface Props {
//   open: boolean
//   onClose: () => void
// }

// export default function CreateUserModal({ open, onClose }: Props) {
//   const [fullName, setFullName] = useState('')
//   const [mobile, setMobile] = useState('')
//   const [location, setLocation] = useState<'Warehouse A'|'Gate 3'|'Loading Dock'>('Warehouse A')

//   const handleCreate = () => {
//     // For now just log the values; later you can wire this up to your API
//     console.log({ fullName, mobile, location })
//     onClose()
//   }

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute' as const,
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           bgcolor: 'rgba(28,28,30,1)',
//           border: '1px solid rgba(255,255,255,0.2)',
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//           width: 360,
//           color: '#fff',
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Create User
//         </Typography>

//         <Box
//           component="form"
//           noValidate
//           autoComplete="off"
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 2,
//             mt: 1
//           }}
//         >
//           <TextField
//             label="Full Name"
//             size="small"
//             value={fullName}
//             onChange={e => setFullName(e.target.value)}
//             InputLabelProps={{ sx: { color: '#aaa' } }}
//             inputProps={{ sx: { color: '#fff' } }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 bgcolor: '#1C1C1E',
//                 borderColor: '#333',
//                 '& fieldset': { borderColor: '#333' }
//               }
//             }}
//           />

//           <TextField
//             label="Mobile Number"
//             size="small"
//             value={mobile}
//             onChange={e => setMobile(e.target.value)}
//             InputLabelProps={{ sx: { color: '#aaa' } }}
//             inputProps={{ sx: { color: '#fff' } }}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 bgcolor: '#1C1C1E',
//                 borderColor: '#333',
//                 '& fieldset': { borderColor: '#333' }
//               }
//             }}
//           />

//           <FormControl size="small">
//             <InputLabel sx={{ color: '#aaa' }}>Location</InputLabel>
//             <Select
//               value={location}
//               label="Location"
//               onChange={e => setLocation(e.target.value as any)}
//               sx={{
//                 bgcolor: '#1C1C1E',
//                 color: '#fff',
//                 borderColor: '#333',
//                 '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
//               }}
//               MenuProps={{
//                 PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } }
//               }}
//             >
//               <MenuItem value="Warehouse A">Warehouse A</MenuItem>
//               <MenuItem value="Gate 3">Gate 3</MenuItem>
//               <MenuItem value="Loading Dock">Loading Dock</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//           <Button onClick={onClose} sx={{ mr: 2, color: '#fff' }}>
//             CANCEL
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleCreate}
//             sx={{
//               bgcolor: '#FFD600',
//               color: '#000',
//               '&:hover': { bgcolor: '#FFC107' }
//             }}
//           >
//             CREATE
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   )
// }

import  { useState } from 'react';
import {
  Modal, Box, Typography,
  TextField, FormControl, InputLabel,
  Select, MenuItem, Button
} from '@mui/material';

// Raw location type
export interface ILocation {
  id: number;
  name: string;
}

export interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (inp: {
    name: string;
    mobile: string;
    locationId: number;
  }) => Promise<void>;
  locations: ILocation[];
}

const style = {
  position: 'absolute' as const,
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(28,28,30,1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 2,
  boxShadow: 24,
  p: 4, width: 360,
  color: '#fff'
};

export default function CreateUserModal({
  open, onClose, onCreate, locations
}: CreateUserModalProps) {
  const [fullName, setFullName]     = useState('');
  const [mobile, setMobile]         = useState('');
  const [locationId, setLocationId] = useState<number>(locations[0]?.id || 0);

  const handleSubmit = async () => {
    if (!fullName || !mobile || !locationId) return;
    await onCreate({ name: fullName, mobile, locationId });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Create User
        </Typography>

        <Box sx={{ display:'flex', flexDirection:'column', gap:2, mt:1 }}>
          <TextField
            label="Full Name"
            size="small"
            value={fullName}
            onChange={e=>setFullName(e.target.value)}
            InputLabelProps={{ sx:{ color:'#aaa' } }}
            inputProps={{ sx:{ color:'#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root':{
                bgcolor:'#1C1C1E',
                '& fieldset':{ borderColor:'#333' }
              }
            }}
          />

          <TextField
            label="Mobile Number"
            size="small"
            value={mobile}
            onChange={e=>setMobile(e.target.value)}
            InputLabelProps={{ sx:{ color:'#aaa' } }}
            inputProps={{ sx:{ color:'#fff' } }}
            sx={{
              '& .MuiOutlinedInput-root':{
                bgcolor:'#1C1C1E',
                '& fieldset':{ borderColor:'#333' }
              }
            }}
          />

          <FormControl size="small">
            <InputLabel sx={{ color:'#aaa' }}>Location</InputLabel>
            <Select
              value={locationId}
              label="Location"
              onChange={e=>setLocationId(e.target.value as number)}
              sx={{
                bgcolor:'#1C1C1E',
                color:'#fff',
                '& fieldset':{ borderColor:'#333' }
              }}
              MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B',color:'#fff' } } }}
            >
              {locations.map(loc=>(
                <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display:'flex', justifyContent:'flex-end', mt:3 }}>
          <Button onClick={onClose} sx={{ color:'#fff', mr:2 }}>
            CANCEL
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ bgcolor:'#FFD600', color:'#000', '&:hover':{bgcolor:'#FFC107'} }}
          >
            CREATE
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

