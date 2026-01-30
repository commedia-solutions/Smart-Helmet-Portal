// // src/components/UpdateUserModal.tsx
// import React, { useState, useEffect } from 'react';
// import {
//   Modal,
//   Box,
//   Typography,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   TextField,
//   Button
// } from '@mui/material';

// export interface UserRow {
//   id: number;
//   helmetId: string;
//   user: string;
//   mobile: string;
//   location: string;
//   status: 'Active' | 'Inactive';
// }

// interface Props {
//   open: boolean;
//   row: UserRow;
//   helmets: string[];
//   users: string[];
//   locations: string[];
//   onClose: () => void;
//   onSave: (updated: UserRow) => void;
//   onDelete: (id: number) => void;
// }

// export default function UpdateUserModal({
//   open,
//   row,
//   helmets,
//   users,
//   locations,
//   onClose,
//   onSave,
//   onDelete
// }: Props) {
//   const [form, setForm] = useState<UserRow>(row);

//   // whenever a new row is passed in, reset form
//   useEffect(() => {
//     setForm(row);
//   }, [row]);

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: 'absolute' as const,
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 360,
//           bgcolor: 'rgba(28,28,30,1)',
//           border: '1px solid rgba(255,255,255,0.2)',
//           borderRadius: 2,
//           boxShadow: 24,
//           p: 4,
//           color: '#fff',
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Update User {row.id}
//         </Typography>

//         {/* Helmet ID */}
//                 <TextField
//           fullWidth
//           size="small"
//           label="Helmet ID"
//           value={form.helmetId}
//           InputProps={{
//             readOnly: true,
//             sx: {
//               bgcolor: '#1C1C1E',
//               color: '#fff'
//             }
//           }}
//           sx={{ mb: 2 }}
//           InputLabelProps={{ sx: { color: '#aaa', fontSize: 12 } }}
//         />
 

//         {/* User */}
//      <TextField
//           fullWidth
//           size="small"
//           label="User"
//           value={form.user}
//           onChange={e => setForm({ ...form, user: e.target.value })}
//           sx={{
//             mb: 2,
//             '& .MuiOutlinedInput-root': {
//               bgcolor: '#1C1C1E',
//               '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
//             },
//             '& .MuiOutlinedInput-input': { color: '#fff', fontSize: 12, p: 1 }
//           }}
//           InputLabelProps={{ sx: { color: '#aaa', fontSize: 12 } }}
//         />

//         {/* Mobile */}
//         <TextField
//           fullWidth
//           size="small"
//           label="Mobile"
//           value={form.mobile}
//           onChange={e => setForm({ ...form, mobile: e.target.value })}
//           sx={{
//             mb: 2,
//             '& .MuiOutlinedInput-root': {
//               bgcolor: '#1C1C1E',
//               '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
//             },
//             '& .MuiOutlinedInput-input': { color: '#fff', fontSize: 12, p: 1 }
//           }}
//           InputLabelProps={{ sx: { color: '#aaa', fontSize: 12 } }}
//         />

//         {/* Location */}
//         <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//           <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Location</InputLabel>
//           <Select
//             value={form.location}
//             label="Location"
//             onChange={e => setForm({ ...form, location: e.target.value })}
//             sx={{
//               bgcolor: '#1C1C1E',
//               color: '#fff',
//               '& .MuiSelect-select': { py: 0.5, px: 1 },
//               '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
//             }}
//             MenuProps={{ PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } } }}
//           >
//             {locations.map(l => (
//               <MenuItem key={l} value={l}>
//                 {l}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         {/* Status */}
//       <TextField
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
//           sx={{ mb: 3 }}
//           InputLabelProps={{ sx: { color: '#aaa', fontSize: 12 } }}
//         />

//         {/* Buttons */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Button
//             onClick={() => onDelete(row.id)}
//             sx={{ color: '#F44336', textTransform: 'none' }}
//           >
//             DELETE
//           </Button>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button onClick={onClose} sx={{ color: '#fff', textTransform: 'none' }}>
//               CANCEL
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => onSave(form)}
//               sx={{ bgcolor: '#1976D2', textTransform: 'none' }}
//             >
//               UPDATE
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// src/components/UpdateUserModal.tsx
import  { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';

export interface UserRow {
  id: number;
  helmetId: string;
  user: string;
  mobile: string;
  location: string;
  status: 'Active' | 'Inactive';
}

interface Props {
  open: boolean;
  row: UserRow;
  helmets: string[];
  users: string[];
  locations: string[];
  onClose: () => void;
  onSave: (updated: UserRow) => void;
  onDelete: (id: number) => void;
}

export default function UpdateUserModal({
  open, row, locations,
  onClose, onSave, onDelete
}: Props) {
  const [form, setForm] = useState<UserRow>(row);

  useEffect(() => {
    setForm(row);
  }, [row]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute' as const,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 360,
        bgcolor: 'rgba(28,28,30,1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        color: '#fff',
      }}>
        <Typography variant="h6" gutterBottom>
          Update User {row.id}
        </Typography>

        {/* Helmet ID (read‑only) */}
        <TextField
          fullWidth size="small" label="Helmet ID"
          value={form.helmetId}
          InputProps={{
            readOnly: true,
            sx: { bgcolor:'#1C1C1E', color:'#fff' }
          }}
          sx={{ mb:2 }}
          InputLabelProps={{ sx:{ color:'#aaa', fontSize:12 } }}
        />

        {/* Name */}
        <TextField
          fullWidth size="small" label="User"
          value={form.user}
          onChange={e=>setForm({...form, user:e.target.value})}
          sx={{
            mb:2,
            '& .MuiOutlinedInput-root':{
              bgcolor:'#1C1C1E',
              '& .MuiOutlinedInput-notchedOutline':{ borderColor:'#333' }
            },
            '& .MuiOutlinedInput-input':{ color:'#fff',fontSize:12,p:1 }
          }}
          InputLabelProps={{ sx:{ color:'#aaa', fontSize:12 } }}
        />

        {/* Mobile */}
        <TextField
          fullWidth size="small" label="Mobile"
          value={form.mobile}
          onChange={e=>setForm({...form, mobile:e.target.value})}
          sx={{
            mb:2,
            '& .MuiOutlinedInput-root':{
              bgcolor:'#1C1C1E',
              '& .MuiOutlinedInput-notchedOutline':{ borderColor:'#333' }
            },
            '& .MuiOutlinedInput-input':{ color:'#fff',fontSize:12,p:1 }
          }}
          InputLabelProps={{ sx:{ color:'#aaa', fontSize:12 } }}
        />

        {/* Location */}
        <FormControl fullWidth size="small" sx={{ mb:2 }}>
          <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Location</InputLabel>
          <Select
            value={form.location}
            onChange={e=>setForm({...form, location:e.target.value})}
            sx={{
              bgcolor:'#1C1C1E', color:'#fff',
              '& .MuiSelect-select':{py:0.5,px:1},
              '& .MuiOutlinedInput-notchedOutline':{ borderColor:'#333' }
            }}
            MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B', color:'#fff' } } }}
          >
            {locations.map(l=>(
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status (read‑only) */}
        <TextField
          fullWidth size="small" label="Status"
          value={form.status}
          InputProps={{
            readOnly: true,
            sx:{ bgcolor:'#1C1C1E', color:'#fff' }
          }}
          sx={{ mb:3 }}
          InputLabelProps={{ sx:{ color:'#aaa', fontSize:12 } }}
        />

        {/* Actions */}
        <Box sx={{ display:'flex', justifyContent:'space-between' }}>
          <Button
            onClick={()=>onDelete(row.id)}
            sx={{ color:'#F44336', textTransform:'none' }}
          >
            DELETE
          </Button>
          <Box sx={{ display:'flex', gap:2 }}>
            <Button onClick={onClose} sx={{ color:'#fff', textTransform:'none' }}>
              CANCEL
            </Button>
            <Button
              variant="contained"
              onClick={()=>onSave(form)}
              sx={{ bgcolor:'#1976D2', textTransform:'none' }}
            >
              UPDATE
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
