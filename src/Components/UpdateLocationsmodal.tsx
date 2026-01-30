import  { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button
} from '@mui/material';

export interface LocationRow {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  row: LocationRow;
  onClose: () => void;
  onSave: (updated: LocationRow) => void;
  onDelete: (id: number) => void;
}

export default function UpdateLocationModal({
  open, row, onClose, onSave, onDelete
}: Props) {
  const [form, setForm] = useState<LocationRow>(row);

  useEffect(() => {
    setForm(row);
  }, [row]);

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <Box sx={{
        position: 'absolute' as const,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'rgba(28,28,30,1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        width: 360,
        color: '#fff'
      }}>
        <Typography variant="h6" gutterBottom>
          Update Location {row.id}
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Location Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              bgcolor: '#1C1C1E',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' }
            },
            '& .MuiOutlinedInput-input': { color:'#fff', fontSize:12, p:1 }
          }}
          InputLabelProps={{ sx:{ color:'#aaa', fontSize:12 } }}
        />

        <Box sx={{ display:'flex', justifyContent:'space-between' }}>
          <Button
            color="error"
            onClick={() => onDelete(row.id)}
            sx={{ textTransform:'none' }}
          >
            DELETE
          </Button>
          <Box>
            <Button onClick={onClose} sx={{ color:'#fff', mr:2, textTransform:'none' }}>
              CANCEL
            </Button>
            <Button
              variant="contained"
              onClick={() => onSave(form)}
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
