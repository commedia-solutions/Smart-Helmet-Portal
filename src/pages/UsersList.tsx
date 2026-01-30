import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';

import MainLayout from '../layout/MainLayout';
// import UpdateUserModal, { UserRow } from '../Components/UpdateUserModal';
// at the top of src/pages/UsersList.tsx
import UpdateUserModal, { type UserRow } from '../Components/UpdateUserModal';


const API = import.meta.env.VITE_API_BASE_URL!;

interface RawUser {
  id: number;
  name: string;
  mobile: string;
  helmetId: string | null;
  locationId: number;
  locationName: string;
}
interface RawLocation {
  id: number;
  name: string;
}

export default function UsersList() {
  // ─── State ──────────────────────────────────────────────
  const [rows, setRows]               = useState<UserRow[]>([]);
  const [locations, setLocations]     = useState<RawLocation[]>([]);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const [searchTerm, setSearchTerm]         = useState('');
  const [filterLocation, setFilterLocation] = useState<'All'|string>('All');
  const [filterHelmet, setFilterHelmet]     = useState<'All'|string>('All');
  const [page, setPage]                     = useState(0);
  const [rowsPerPage, setRowsPerPage]       = useState(10);

  const [snackOpen, setSnackOpen]         = useState(false);
  const [snackMsg, setSnackMsg]           = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success'|'error'>('success');

  // ─── Load users + locations on mount ──────────────────
  useEffect(() => {
    let mounted = true;

    async function load() {
      // users
      const uRes = await fetch(`${API}/users`);
      const rawUsers = (await uRes.json()) as RawUser[];
      if (!mounted) return;
      // const mapped = rawUsers.map(u => ({
      //   id: u.id,
      //   helmetId: u.helmetId ?? '',
      //   user: u.name,
      //   mobile: u.mobile,
      //   location: u.locationName,
      //   status: u.helmetId ? 'Active' : 'Inactive',
      // }));
      // setRows(mapped);
      const mapped: UserRow[] = rawUsers.map(u => ({
  id:       u.id,
  helmetId: u.helmetId ?? '',
  user:     u.name,
  mobile:   u.mobile,
  location: u.locationName,
  status:   u.helmetId ? 'Active' : 'Inactive',
}));
setRows(mapped);


      // locations
      const lRes = await fetch(`${API}/locations`);
      const rawLocs = (await lRes.json()) as RawLocation[];
      if (!mounted) return;
      setLocations(rawLocs);
    }

    load().catch(console.error);
    return () => { mounted = false; };
  }, []);

  // helper to refresh users after mutation
  const reloadUsers = async () => {
    const r = await fetch(`${API}/users`);
    const raw = (await r.json()) as RawUser[];
    setRows(raw.map(u => ({
      id: u.id,
      helmetId: u.helmetId ?? '',
      user: u.name,
      mobile: u.mobile,
      location: u.locationName,
      status: u.helmetId ? 'Active' : 'Inactive',
    })));
  };

  // ─── Handlers ─────────────────────────────────────────
  const handleSave = async (upd: UserRow) => {
    try {
      // find the locationId
      const loc = locations.find(l => l.name === upd.location);
      if (!loc) throw new Error('Invalid location');

      const res = await fetch(`${API}/users/${upd.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: upd.user,
          mobile: upd.mobile,
          locationId: loc.id,
        })
      });
      if (!res.ok) throw await res.json();
      setSnackSeverity('success');
      setSnackMsg(`User "${upd.user}" updated`);
      setEditingUser(null);
      await reloadUsers();
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.error || err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSnackSeverity('success');
      setSnackMsg(`User deleted Successfully`);
      setEditingUser(null);
      await reloadUsers();
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  // ─── Filters & pagination ─────────────────────────────
  const helmetIds = useMemo(() =>
    Array.from(new Set(rows.map(r => r.helmetId)))
      .sort((a,b) => parseInt(a,10) - parseInt(b,10)),
  [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      if (filterLocation!=='All' && r.location!==filterLocation) return false;
      if (filterHelmet!=='All' && r.helmetId!==filterHelmet)       return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (![
          r.id.toString(),
          r.helmetId,
          r.user,
          r.mobile,
          r.location,
          r.status,
        ].some(val => val.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [rows, filterLocation, filterHelmet, searchTerm]);

  // ─── Render ────────────────────────────────────────────
  return (
    <MainLayout>
      <Box
        sx={{
          flex:1,
          display:'flex',
          flexDirection:'column',
          pt:10,
          px:2,
          gap:2,
          height:'calc(100vh - 90px)',
          overflow:'hidden'
        }}
      >
        {/* Users List Card */}
        <Box sx={{
          flex:1,
          display:'flex',
          flexDirection:'column',
          bgcolor:'rgba(255,255,255,0.05)',
          backdropFilter:'blur(8px)',
          border:'1px solid rgba(255,255,255,0.2)',
          borderRadius:2,
          overflow:'hidden'
        }}>
          {/* Header */}
          <Box sx={{
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            px:2,py:1,
            borderBottom:'1px solid rgba(255,255,255,0.2)'
          }}>
            <Typography variant="h6" sx={{ color:'#fff', fontWeight:500 }}>
              Users List
            </Typography>

            <Box sx={{ display:'flex',alignItems:'center',gap:2,flexWrap:'wrap' }}>
              <TextField
                size="small"
                placeholder="Search…"
                value={searchTerm}
                onChange={e=>{ setSearchTerm(e.target.value); setPage(0); }}
                sx={{
                  width:200,
                  bgcolor:'#1C1C1E',
                  '& .MuiOutlinedInput-input':{ color:'#fff', fontSize:12, p:1 },
                  '& .MuiOutlinedInput-notchedOutline':{ border:'1px solid #333' }
                }}
              />
              <FormControl size="small" sx={{ minWidth:140 }}>
                <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Location</InputLabel>
                <Select
                  value={filterLocation}
                  onChange={e=>{ setFilterLocation(e.target.value); setPage(0); }}
                  sx={{
                    bgcolor:'#1C1C1E', color:'#fff',
                    border:'1px solid #333',borderRadius:1,
                    '& .MuiSelect-select':{py:0.5,px:1},
                    '& .MuiSelect-icon':{color:'#888'}
                  }}
                  MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B',color:'#fff'} } }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {locations.map(l=>(
                    <MenuItem key={l.id} value={l.name}>{l.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth:140 }}>
                <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Helmet ID</InputLabel>
                <Select
                  value={filterHelmet}
                  onChange={e=>{ setFilterHelmet(e.target.value); setPage(0); }}
                  sx={{
                    bgcolor:'#1C1C1E', color:'#fff',
                    border:'1px solid #333',borderRadius:1,
                    '& .MuiSelect-select':{py:0.5,px:1},
                    '& .MuiSelect-icon':{color:'#888'}
                  }}
                  MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B',color:'#fff'} } }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {helmetIds.map(id=>(
                    <MenuItem key={id} value={id}>{id}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{
            flex:1,
            display:'flex',
            flexDirection:'column',
            px:1,py:1,
            overflow:'hidden'
          }}>
            <TableContainer component={Paper} sx={{
              flex:1,
              bgcolor:'transparent',
              boxShadow:'none',
              overflowY:'auto',
              '& .MuiTableCell-root':{ borderColor:'rgba(255,255,255,0.1)', textAlign:'center' }
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Sr No','Helmet ID','User','Mobile','Location','Status','Update']
                      .map(col=>(
                        <TableCell key={col} sx={{
                          backgroundColor:'rgba(40,40,45,1)',
                          color:'rgba(255,255,255,0.9)',
                          fontSize:'0.75rem',
                          fontWeight:500,
                          padding:'8px 12px',
                          borderBottom:'1px solid rgba(255,255,255,0.2)'
                        }}>
                          {col}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>

                <TableBody sx={{
                  '& .MuiTableCell-body':{
                    fontSize:'0.75rem',padding:'8px 6px',
                    borderBottom:'1px solid rgba(255,255,255,0.05)'
                  }
                }}>
                  {filteredRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((r,i) => {
                      const srNo = page * rowsPerPage + i + 1;
                      return (
                        <TableRow key={r.id} hover>
                          <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
                            {srNo}
                          </TableCell>
                          <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
                            {r.helmetId}
                          </TableCell>
                          <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
                            {r.user}
                          </TableCell>
                          <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
                            {r.mobile}
                          </TableCell>
                          <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
                            {r.location}
                          </TableCell>
                          <TableCell sx={{ color: r.status==='Active'?'#4CAF50':'#F44336' }}>
                            {r.status}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ color:'#fff', borderColor:'#555', textTransform:'none' }}
                              onClick={()=>setEditingUser(r)}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5,10,25]}
              component="div"
              count={filteredRows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_,newPage)=>setPage(newPage)}
              onRowsPerPageChange={e=>{ setRowsPerPage(+e.target.value); setPage(0); }}
              sx={{
                color:'#fff',
                borderTop:'1px solid rgba(255,255,255,0.2)',
                px:2,
                '& .MuiTablePagination-selectIcon':{ color:'#fff' }
              }}
            />
          </Box>
        </Box>

        {/* Update Modal */}
        {editingUser && (
          <UpdateUserModal
            open={true}
            row={editingUser}
            helmets={helmetIds}
            users={rows.map(r=>r.user)}         // not used
            locations={locations.map(l=>l.name)}
            onClose={()=>setEditingUser(null)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}

        {/* Snackbar */}
        <Snackbar
          anchorOrigin={{ vertical:'top', horizontal:'right' }}
          open={snackOpen}
          autoHideDuration={3000}
          onClose={()=>setSnackOpen(false)}
        >
          <Alert
            severity={snackSeverity}
            onClose={()=>setSnackOpen(false)}
            sx={{ width:'100%' }}
          >
            {snackMsg}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
}
