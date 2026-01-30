// // src/components/UpdateIamModal.tsx
// import React, { useEffect, useState } from 'react'
// import {
//   Modal,
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   TextField
// } from '@mui/material'

// export interface IAMRow {
//   id: number;
//   helmetId: string;
//   user: string;
//   location: string;
//   status: 'Active' | 'Inactive';
// }

// interface Props {
//   // open: boolean
//   // row: IAMRow
//   // onClose: () => void
//   // onUpdate: (updated: IAMRow) => void
//   // onDelete: (id: number) => void
//   open: boolean
//   row: IAMRow
//   helmets: string[]
//   users: string[]
//   locations: string[]
//   onClose: () => void
//   onSave: (updated: IAMRow) => void
//   onDelete: (id: number) => void
// }

// const modalStyle = {
//   position: 'absolute' as const,
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: 'rgba(28,28,30,1)',
//   border: '1px solid rgba(255,255,255,0.2)',
//   borderRadius: 2,
//   boxShadow: 24,
//   p: 4,
//   width: 380,
//   color: '#fff',
// }

// export default function UpdateIamModal({ open, row, onClose, onSave, onDelete }: Props) {
//   const [form, setForm] = useState<IAMRow>(row)

//   // reset form whenever `row` changes
//   useEffect(() => {
//     setForm(row)
//   }, [row])

//   const handleChange = <K extends keyof IAMRow>(key: K, value: IAMRow[K]) => {
//     setForm(f => ({ ...f, [key]: value }))
//   }

//   return (
//     <Modal open={open} onClose={onClose} disableEnforceFocus>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" gutterBottom>
//           Update User {row.id}
//         </Typography>

//         {/* Helmet ID */}
//         <FormControl fullWidth size="small" sx={{ mt: 2 }}>
//           <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Helmet ID</InputLabel>
//           <Select
//             value={form.helmetId}
//             label="Helmet ID"
//             onChange={e => handleChange('helmetId', e.target.value as string)}
//             sx={{
//               bgcolor: '#1C1C1E',
//               color: '#fff',
//               '& .MuiSelect-select': { py: .5, px: 1 },
//               '& .MuiSelect-icon': { color: '#888' },
//               border: '1px solid #333',
//               borderRadius: 1
//             }}
//             MenuProps={{ PaperProps: { sx:{ bgcolor:'#28282B', color:'#fff' } } }}
//           >
//             {/* You can replace these with your real helmet list */}
//             {Array.from({ length: 6 }).map((_,i) => {
//               const id = String(i+1).padStart(2,'0')
//               return <MenuItem key={id} value={id}>{id}</MenuItem>
//             })}
//           </Select>
//         </FormControl>

//         {/* User */}
//         <FormControl fullWidth size="small" sx={{ mt: 2 }}>
//           <InputLabel sx={{ color:'#aaa', fontSize:12 }}>User</InputLabel>
//           <Select
//             value={form.user}
//             label="User"
//             onChange={e => handleChange('user', e.target.value as string)}
//             sx={{
//               bgcolor: '#1C1C1E',
//               color: '#fff',
//               '& .MuiSelect-select': { py: .5, px: 1 },
//               '& .MuiSelect-icon': { color: '#888' },
//               border: '1px solid #333',
//               borderRadius: 1
//             }}
//             MenuProps={{ PaperProps: { sx:{ bgcolor:'#28282B', color:'#fff' } } }}
//           >
//             {['Alice','Bob','Carol','Dave','Eve','Frank','Grace','Heidi'].map(u => (
//               <MenuItem key={u} value={u}>{u}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Location */}
//         <FormControl fullWidth size="small" sx={{ mt: 2 }}>
//           <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Location</InputLabel>
//           <Select
//             value={form.location}
//             label="Location"
//             onChange={e => handleChange('location', e.target.value as string)}
//             sx={{
//               bgcolor: '#1C1C1E',
//               color: '#fff',
//               '& .MuiSelect-select': { py: .5, px: 1 },
//               '& .MuiSelect-icon': { color: '#888' },
//               border: '1px solid #333',
//               borderRadius: 1
//             }}
//             MenuProps={{ PaperProps: { sx:{ bgcolor:'#28282B', color:'#fff' } } }}
//           >
//             {['Warehouse A','Gate 3','Loading Dock'].map(loc => (
//               <MenuItem key={loc} value={loc}>{loc}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Status */}
//      <TextField
//           fullWidth
//           size="small"
//           label="Status"
//           value={form.status}
//           InputProps={{
//             readOnly: true,
//             sx: {
//               bgcolor: '#1C1C1E',
//               color: '#fff'
//             }
//           }}
//           sx={{ mt: 2 }}
//           InputLabelProps={{ sx: { color: '#aaa', fontSize: 12 } }}
//         />
        
//         {/* Actions */}
//         <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mt:4 }}>
//           <Button
//             color="error"
//             onClick={() => onDelete(row.id)}
//             sx={{ fontWeight:500 }}
//           >
//             DELETE
//           </Button>
//           <Box>
//             <Button onClick={onClose} sx={{ color:'#fff', mr:2 }}>
//               CANCEL
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => onSave(form)}
//             >
//               UPDATE
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   )
// }

import  { useEffect, useState } from 'react';
import {
  Modal, Box, Typography,
  FormControl, InputLabel, Select, MenuItem,
  Button, TextField
} from '@mui/material';

// Export your IAMRow here so both Iam.tsx and this file share the same type
export interface IAMRow {
  id: number;
  helmetId: string;
  user: string;
  location: string;
  status: 'Active' | 'Inactive';
}

interface Props {
  open: boolean;
  row: IAMRow;
  helmets: string[];
  users: string[];
  locations: string[];
  onClose: () => void;
  onSave: (updated: IAMRow) => void;
  onDelete: (id: number) => void;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(28,28,30,1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 2,
  boxShadow: 24,
  p: 4, width: 380,
  color: '#fff'
};

export default function UpdateIamModal({
  open, row,
  helmets, users, locations,
  onClose, onSave, onDelete
}: Props) {
  const [form, setForm] = useState<IAMRow>(row);

  useEffect(() => {
    setForm(row);
  }, [row]);

  const handleChange = <K extends keyof IAMRow>(key: K, value: IAMRow[K]) => {
    setForm((f: IAMRow) => ({ ...f, [key]: value }));
  };

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Update User {row.id}
        </Typography>

        {/* Helmet */}
        <FormControl fullWidth size="small" sx={{ mt:2 }}>
          <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Helmet ID</InputLabel>
          <Select
            value={form.helmetId}
            label="Helmet ID"
            onChange={e => handleChange('helmetId', e.target.value as string)}
            sx={{
              bgcolor:'#1C1C1E', color:'#fff',
              border:'1px solid #333', borderRadius:1,
              '& .MuiSelect-select':{py:0.5,px:1},
              '& .MuiSelect-icon':{color:'#888'}
            }}
            MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B', color:'#fff' } } }}
          >
            {helmets.map(id=>(
              <MenuItem key={id} value={id}>{id}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* User */}
        <FormControl fullWidth size="small" sx={{ mt:2 }}>
          <InputLabel sx={{ color:'#aaa', fontSize:12 }}>User</InputLabel>
          <Select
            value={form.user}
            label="User"
            onChange={e => handleChange('user', e.target.value as string)}
            sx={{
              bgcolor:'#1C1C1E', color:'#fff',
              border:'1px solid #333', borderRadius:1,
              '& .MuiSelect-select':{py:0.5,px:1},
              '& .MuiSelect-icon':{color:'#888'}
            }}
            MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B', color:'#fff' } } }}
          >
            {users.map(u=>(
              <MenuItem key={u} value={u}>{u}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Location */}
        <FormControl fullWidth size="small" sx={{ mt:2 }}>
          <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Location</InputLabel>
          <Select
            value={form.location}
            label="Location"
            onChange={e => handleChange('location', e.target.value as string)}
            sx={{
              bgcolor:'#1C1C1E', color:'#fff',
              border:'1px solid #333', borderRadius:1,
              '& .MuiSelect-select':{py:0.5,px:1},
              '& .MuiSelect-icon':{color:'#888'}
            }}
            MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B', color:'#fff' } } }}
          >
            {locations.map(loc=>(
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status */}
        <TextField
          fullWidth size="small" label="Status"
          value={form.status}
          InputProps={{
            readOnly: true,
            sx:{ bgcolor:'#1C1C1E', color:'#fff' }
          }}
          sx={{ mt:2 }}
          InputLabelProps={{ sx:{ color:'#aaa', fontSize:12 } }}
        />

        {/* Actions */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mt:4 }}>
          <Button
            color="error"
            onClick={() => onDelete(row.id)}
          >
            DELETE
          </Button>
          <Box>
            <Button onClick={onClose} sx={{ color:'#fff', mr:2 }}>
              CANCEL
            </Button>
            <Button variant="contained" onClick={() => onSave(form)}>
              UPDATE
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
