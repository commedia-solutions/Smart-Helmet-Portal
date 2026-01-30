// src/pages/Iam.tsx
import  { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import MainLayout from '../layout/MainLayout';
import { fetchSmartHelmets, type SmartHelmet } from '../services/helmetService';
import CreateUserModal from '../Components/CreateUserModal';
import UpdateIamModal from '../Components/UpdateIamModal';
import type { IAMRow } from '../Components/UpdateIamModal';

const API = import.meta.env.VITE_API_BASE_URL!;

// shape of what our `/users` endpoint returns
interface RawUser {
  id: number;
  name: string;
  mobile: string;
  helmetId: string | null;
  locationId: number;
  locationName: string;
}
// shape of what our `/locations` endpoint returns
interface RawLocation {
  id: number;
  name: string;
}

export default function Iam() {
  const navigate = useNavigate();

  // ─── Shared Data ──────────────────────────────────────────────────────────
  const [helmets, setHelmets]               = useState<SmartHelmet[]>([]);
  const [rows, setRows]                     = useState<IAMRow[]>([]);
  const [usersList, setUsersList]           = useState<{id:number;name:string}[]>([]);
  const [locationsList, setLocationsList]   = useState<RawLocation[]>([]);

  // ─── Top‐Card State ─────────────────────────────────────────────────────────
  const [selectedHelmet, setSelectedHelmet] = useState<string>('');
  const [selectedUser, setSelectedUser]     = useState<number|''>('');
  const [newLocation, setNewLocation]       = useState('');
  const [createOpen, setCreateOpen]         = useState(false);

  // ─── Update‐Modal State ────────────────────────────────────────────────────
  const [editingRow, setEditingRow] = useState<IAMRow|null>(null);

  // ─── Snackbar ──────────────────────────────────────────────────────────────
  const [snackOpen, setSnackOpen]       = useState(false);
  const [snackMsg, setSnackMsg]         = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success'|'error'>('success');

  // ─── Table Filters & Pagination ───────────────────────────────────────────
  const [searchTerm, setSearchTerm]           = useState('');
  const [filterLocation, setFilterLocation]   = useState<'All'|string>('All');
  const [filterHelmet, setFilterHelmet]       = useState<'All'|string>('All');
  const [page, setPage]                       = useState(0);
  const [rowsPerPage, setRowsPerPage]         = useState(5);

  // ─── Initial Load ──────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      // helmets
      const h = await fetchSmartHelmets();
      if (!mounted) return;
      setHelmets(h);

      // users
      const ures = await fetch(`${API}/users`);
      const rawUsers = (await ures.json()) as RawUser[];
      if (!mounted) return;
      const mappedRows: IAMRow[] = rawUsers.map((u: RawUser) => ({
        id: u.id,
        helmetId: u.helmetId ?? '',
        user: u.name,
        location: u.locationName,
        status: u.helmetId ? 'Active' : 'Inactive',
      }));
      setRows(mappedRows);
      setUsersList(mappedRows.map(r => ({ id: r.id, name: r.user })));

      // locations
      const lres = await fetch(`${API}/locations`);
      const rawLocs = (await lres.json()) as RawLocation[];
      if (!mounted) return;
      setLocationsList(rawLocs);
    }
    loadAll().catch(console.error);
    return () => { mounted = false; };
  }, []);

  // ─── Helper to reload users after mutations ────────────────────────────────
  const reloadUsers = async () => {
    const r = await fetch(`${API}/users`);
    const rawUsers = (await r.json()) as RawUser[];
    const mappedRows: IAMRow[] = rawUsers.map((u: RawUser) => ({
      id: u.id,
      helmetId: u.helmetId ?? '',
      user: u.name,
      location: u.locationName,
      status: u.helmetId ? 'Active' : 'Inactive',
    }));
    setRows(mappedRows);
    setUsersList(mappedRows.map(r => ({ id: r.id, name: r.user })));
  };

  // ─── Top‐Card Actions ─────────────────────────────────────────────────────

  // Add a new location
  const handleAddLocation = async () => {
    if (!newLocation.trim()) return;
    try {
      const res = await fetch(`${API}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLocation.trim() }),
      });
      if (!res.ok) throw await res.json();
      const created = (await res.json()) as RawLocation;
      setSnackSeverity('success');
      setSnackMsg(`Location "${created.name}" added`);
      setNewLocation('');
      // reload list
      const lr = await fetch(`${API}/locations`);
      setLocationsList((await lr.json()) as RawLocation[]);
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.error || err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  // Assign a helmet to a user
  const handleAssign = async () => {
    if (!selectedHelmet || !selectedUser) return;
    try {
      const res = await fetch(`${API}/users/${selectedUser}/helmet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helmetId: selectedHelmet }),
      });
      if (!res.ok) throw await res.json();
      const upd = (await res.json()) as { name:string; helmetId:string };
      setSnackSeverity('success');
      setSnackMsg(`Helmet ${upd.helmetId} → ${upd.name}`);
      await reloadUsers();
      setSelectedHelmet('');
      setSelectedUser('');
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.error || err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  // Create a new user
  const handleCreateUser = async (inp: {
    name: string;
    mobile: string;
    locationId: number;
  }) => {
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inp),
      });
      if (!res.ok) throw await res.json();
      const usr = (await res.json()) as { name:string };
      setSnackSeverity('success');
      setSnackMsg(`User "${usr.name}" created`);
      setCreateOpen(false);
      await reloadUsers();
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.error || err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  // Save updates from the modal
  const handleSaveUpdate = async (f: IAMRow) => {

     // 1) check uniqueness in the current client state
  const conflict = rows.find(
    r => r.helmetId === f.helmetId && r.id !== f.id
  );
  if (conflict) {
    setSnackSeverity('error');
    setSnackMsg(`Helmet ${f.helmetId} is already assigned to ${conflict.user}`);
    setSnackOpen(true);
    return;
  }

    try {
      const loc = locationsList.find(l => l.name === f.location);
      if (!loc) throw new Error('Invalid location');
      // update name + location
      let r1 = await fetch(`${API}/users/${f.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.user, locationId: loc.id }),
      });
      if (!r1.ok) throw await r1.json();
      // update helmet
      let r2 = await fetch(`${API}/users/${f.id}/helmet`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helmetId: f.helmetId }),
      });
      if (!r2.ok) throw await r2.json();

      setSnackSeverity('success');
      setSnackMsg(`User ${f.user} updated`);
      setEditingRow(null);
      await reloadUsers();
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.error || err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  // Delete a user
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSnackSeverity('success');
      setSnackMsg(`User ${id} deleted`);
      setEditingRow(null);
      await reloadUsers();
    } catch (err: any) {
      setSnackSeverity('error');
      setSnackMsg(err.message);
    } finally {
      setSnackOpen(true);
    }
  };

  // ─── Filtering + Pagination ───────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      if (filterLocation !== 'All' && r.location !== filterLocation) return false;
      if (filterHelmet   !== 'All' && r.helmetId !== filterHelmet)     return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        if (![ String(r.id), r.helmetId, r.user, r.location, r.status ]
          .some(v => v.toLowerCase().includes(s)))
          return false;
      }
      return true;
    });
  }, [rows, filterLocation, filterHelmet, searchTerm]);

  // ─── Stats for the pie chart ───────────────────────────────────────────────
  const totalUsers    = rows.length;
  const activeCount   = rows.filter(r => r.status==='Active').length;
  const inactiveCount = totalUsers - activeCount;
  const statsData = [
    { name:'Active',   value:activeCount,   color:'#4CAF50' },
    { name:'Inactive', value:inactiveCount, color:'#F44336' },
  ].filter(d => d.value>0);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <MainLayout>
      <Box sx={{ display:'flex', flexDirection:'column', height:'100vh' }}>

        {/* Top Controls Card */}
        <Box sx={{ px:2, pt:10 }}>
          <Card sx={{
            bgcolor:'rgba(255,255,255,0.05)',
            backdropFilter:'blur(8px)',
            border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:2
          }}>
            <CardContent sx={{ display:'flex', alignItems:'center', gap:2, px:2, py:1.2 }}>

              {/* Assign Users */}
              <Typography variant="h6" sx={{ color:'#fff',fontSize:16, fontWeight:500 }}>Assign Users</Typography>
              <FormControl size="small" sx={{ minWidth:140 }}>
                <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Helmet ID</InputLabel>
                <Select
                  value={selectedHelmet}
                  onChange={e=>setSelectedHelmet(e.target.value)}
                  size="small"
                  sx={{ bgcolor:'#1C1C1E', color:'#fff' }}
                  MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B', color:'#fff' } } }}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {helmets.slice()
                    .sort((a,b)=>+a.deviceId - +b.deviceId)
                    .map(h=>(
                      <MenuItem key={h.deviceId} value={h.deviceId}>
                        {h.deviceId}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth:140 }}>
                <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Select User</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={e=>setSelectedUser(e.target.value as number)}
                  size="small"
                  sx={{ bgcolor:'#1C1C1E', color:'#fff' }}
                  MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B', color:'#fff' } } }}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {usersList.map(u=>(
                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                disabled={!selectedHelmet||!selectedUser}
                onClick={handleAssign}
                sx={{ height:32, fontSize:12, bgcolor:'#4CAF50' }}
              >
                Assign
              </Button>

              <Divider orientation="vertical" flexItem sx={{ mx:2, borderColor:'rgba(255,255,255,0.2)' }}/>

              {/* Add Location */}
              <Typography variant="h6" sx={{ color:'#fff',fontSize:16, fontWeight:500 }}>Add Location</Typography>
              <TextField
                size="small"
                placeholder="Location name"
                value={newLocation}
                onChange={e=>setNewLocation(e.target.value)}
                sx={{
                  width:160,
                  '& .MuiOutlinedInput-root': {
                    bgcolor:'#1C1C1E',
                    '& fieldset':{ borderColor:'#333' }
                  },
                  '& .MuiOutlinedInput-input':{ color:'#fff' }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddLocation}
                sx={{ height:32, fontSize:12, bgcolor:'#FFD600', color:'#000' }}
              >
                Add
              </Button>

               {/* ← Here’s your new View button */}
            <Button
              variant="contained"
              onClick={() => navigate('/locations')}
              sx={{
                height:32,
                fontSize:12,
                bgcolor:'#1976D2',     // Comms blue
                color:'#fff',
                '&:hover': { bgcolor:'#115293' },
                ml:0.6                    // little left margin
              }}
            >
              View
            </Button>

              <Divider orientation="vertical" flexItem sx={{ mx:2, borderColor:'rgba(255,255,255,0.2)' }}/>

              {/* Create User */}
              <Box sx={{ ml:'auto', display:'flex', alignItems:'center', gap:2 }}>
                <Typography variant="h6" sx={{ color:'#fff',fontSize:16, fontWeight:500 }}>Create User</Typography>
                <Button
                  variant="contained"
                  onClick={()=>setCreateOpen(true)}
                  sx={{ height:32, fontSize:12, bgcolor:'#FFD600', color:'#000' }}
                >
                  CREATE
                </Button>
              </Box>

            </CardContent>
          </Card>
        </Box>

        {/* Main Split: Left=Table, Right=Stats/List */}
        <Box sx={{ flex:1, display:'flex', px:2, py:2, gap:2, overflow:'hidden' }}>

          {/* Left Column */}
          <Box sx={{ flex:'0 0 70%', display:'flex', flexDirection:'column', gap:1.5, height:'100%' }}>
            <Card sx={{
              flex:1,
              display:'flex',
              flexDirection:'column',
              minHeight:0,
              bgcolor:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:2,
              overflow:'hidden'
            }}>
              {/* Filters */}
              <Box sx={{
                display:'flex',
                alignItems:'center',
                px:2, py:1,
                borderBottom:'1px solid rgba(255,255,255,0.2)'
              }}>
                <Typography variant="h6" sx={{ flex:1, color:'#fff' }}>Helmet Users</Typography>
                <TextField
                  size="small"
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={e=>{ setSearchTerm(e.target.value); setPage(0); }}
                  sx={{
                    width:200,
                    mr:2,
                    bgcolor:'#1C1C1E',
                    '& .MuiOutlinedInput-input':{ color:'#fff', fontSize:12, p:1 },
                    '& .MuiOutlinedInput-notchedOutline':{ border:'1px solid #333' }
                  }}
                  
                />
                <FormControl size="small" sx={{ minWidth:140, mr:2 }}>
                  <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Location</InputLabel>
                  <Select
                    value={filterLocation}
                    onChange={e=>{ setFilterLocation(e.target.value); setPage(0); }}
                    size="small"
                    sx={{
                       bgcolor:'#1C1C1E', color:'#fff' 
                      }}
                       MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B',color:'#fff'} } }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {locationsList.map(l=>(
                      <MenuItem key={l.id} value={l.name}>{l.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth:140 }}>
                  <InputLabel sx={{ color:'#aaa', fontSize:12 }}>Helmet ID</InputLabel>
                  <Select
                    value={filterHelmet}
                    onChange={e=>{ setFilterHelmet(e.target.value); setPage(0); }}
                    size="small"
                    sx={{ bgcolor:'#1C1C1E', color:'#fff'

                     }}
                      MenuProps={{ PaperProps:{ sx:{ bgcolor:'#28282B',color:'#fff'} } }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {helmets.slice().sort((a,b)=>+a.deviceId-+b.deviceId).map(h=>(
                      <MenuItem key={h.deviceId} value={h.deviceId}>{h.deviceId}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Table */}
              <Box sx={{
                flex:1,
                display:'flex',
                flexDirection:'column',
                px:1, py:1,
                minHeight:0,
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
                        {['Sr No','Helmet ID','User','Location','Status','Update'].map(col=>(
                          <TableCell key={col} sx={{
                            backgroundColor:'rgba(40,40,45,1)',
                            color:'rgba(255,255,255,0.9)',
                            fontSize:'0.75rem', fontWeight:500,
                            padding:'8px 12px',
                            borderBottom:'1px solid rgba(255,255,255,0.2)'
                          }}>{col}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{
                      '& .MuiTableCell-body':{
                        fontSize:'0.75rem', padding:'8px 6px',
                        borderBottom:'1px solid rgba(255,255,255,0.05)'
                      }
                    }}>
                      {/* {filteredRows
                        .slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage)
                        .map(r=>(
                          <TableRow key={r.id} hover>
                            <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.id}</TableCell>
                            <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.helmetId}</TableCell>
                            <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.user}</TableCell>
                            <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.location}</TableCell>
                            <TableCell sx={{ color:r.status==='Active'?'#4CAF50':'#F44336' }}>
                              {r.status}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="outlined"
                                sx={{ color:'#fff', borderColor:'#555', textTransform:'none' }}
                                onClick={()=>setEditingRow(r)}
                              >
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))} */}

                        {filteredRows
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((r, i) => {
      // compute Sr No from current page & index
      const srNo = page * rowsPerPage + i + 1;
      return (
        <TableRow key={r.id} hover>
          <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {srNo}
          </TableCell>
          <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {r.helmetId}
          </TableCell>
          <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {r.user}
          </TableCell>
          <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {r.location}
          </TableCell>
          <TableCell sx={{ color: r.status === 'Active' ? '#4CAF50' : '#F44336' }}>
            {r.status}
          </TableCell>
          <TableCell align="center">
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: '#555',
                textTransform: 'none'
              }}
              onClick={() => setEditingRow(r)}
            >
              Update
            </Button>
          </TableCell>
        </TableRow>
      );
    })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5,10,25]}
                  component="div"
                  count={filteredRows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(_,np)=>setPage(np)}
                  onRowsPerPageChange={e=>{ setRowsPerPage(+e.target.value); setPage(0); }}
                  sx={{
                    color:'#fff',
                    borderTop:'1px solid rgba(255,255,255,0.2)',
                    px:2,
                    '& .MuiTablePagination-selectIcon':{ color:'#fff' },
                    '& .MuiInputBase-root .MuiSvgIcon-root':{ color:'#fff' }
                  }}
                />
              </Box>
            </Card>
          </Box>

          {/* Right Column */}
          <Box sx={{
            flex:'0 0 30%',
            display:'flex',
            flexDirection:'column',
            gap:2,
            height:'100%'
          }}>
            {/* Users Stats */}
            <Card sx={{
              p:2,
              bgcolor:'rgba(255,255,255,0.05)',
              backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:2,
              height:220,
              overflow:'hidden'
            }}>
              <Typography variant="h6" sx={{ color:'#fff', mb:2 }}>Users Stats</Typography>
              <Box sx={{ position:'relative', width:'100%', height:120 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statsData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                    >
                      {statsData.map((entry,i)=><Cell key={i} fill={entry.color}/>)}  
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{
                  position:'absolute', top:'50%', left:'50%',
                  transform:'translate(-50%,-50%)', textAlign:'center'
                }}>
                  <Typography variant="subtitle2" sx={{ color:'#fff' }}>Total</Typography>
                  <Typography variant="h4" sx={{ color:'#fff' }}>{totalUsers}</Typography>
                </Box>
              </Box>
              <Box sx={{ display:'flex', justifyContent:'center', gap:2, mt:1 }}>
                {statsData.map(item=>(
                  <Box key={item.name} sx={{ display:'flex', alignItems:'center', gap:1 }}>
                    <Box sx={{ width:10, height:10, borderRadius:'50%', bgcolor:item.color }}/>
                    <Typography sx={{ color:'#fff', fontSize:12 }}>
                      {item.name} {Math.round(item.value/totalUsers*100)}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Users List */}
            <Card sx={{
              flex:1,
              p:2,
              bgcolor:'rgba(255,255,255,0.05)',
              backdropFilter:'blur(8px)',
              border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:2,
              display:'flex',
              flexDirection:'column',
              overflow:'hidden'
            }}>
              <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <Typography variant="h6" sx={{ color:'#fff' }}>Users List</Typography>
                <Button
                  size="small"
                  sx={{ color:'#1976d2', textTransform:'none' }}
                  onClick={()=>navigate('/users')}
                >
                  View All &gt;
                </Button>
              </Box>
              <Divider sx={{ borderColor:'rgba(255,255,255,0.2)', my:1 }}/>
              <TableContainer sx={{
                flex:1,
                minHeight:0,
                overflowY:'auto',
                '&::-webkit-scrollbar':{ width:'4px' },
                '&::-webkit-scrollbar-thumb':{ background:'#333', borderRadius:'2px' },
                '&::-webkit-scrollbar-track':{ background:'transparent' }
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color:'#fff', fontSize:12, borderBottom:'none' }}>Name</TableCell>
                      <TableCell sx={{ color:'#fff', fontSize:12, borderBottom:'none' }}>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.slice(0,5).map(u=>(
                      <TableRow key={u.id}>
                        <TableCell sx={{ color:'rgba(255,255,255,0.8)', fontSize:12, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                          {u.user}
                        </TableCell>
                        <TableCell sx={{ color:'rgba(255,255,255,0.8)', fontSize:12, borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
                          {u.location}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Box>

        {/* Modals & Snackbar */}
        <CreateUserModal
          open={createOpen}
          onClose={()=>setCreateOpen(false)}
          onCreate={handleCreateUser}
          locations={locationsList}
        />

        {editingRow && (
          <UpdateIamModal
            open
            row={editingRow}
            helmets={helmets.map(h=>h.deviceId).sort((a,b)=>+a-+b)}
            users={usersList.map(u=>u.name)}
            locations={locationsList.map(l=>l.name)}
            onClose={()=>setEditingRow(null)}
            onSave={handleSaveUpdate}
            onDelete={handleDeleteUser}
          />
        )}

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


// src/pages/IAM.tsx
// import React from "react";
// import { Box, Typography, Divider, Chip } from "@mui/material";
// import MainLayout from "../layout/MainLayout";

// export default function IAM() {
//   const cards = [
//     { title: "Users", value: "—", hint: "Coming soon" },
//     { title: "Roles", value: "—", hint: "Coming soon" },
//     { title: "Policies", value: "—", hint: "Coming soon" },
//     { title: "Last Sync", value: "—", hint: "Coming soon" },
//   ];

//   return (
//     <MainLayout>
//       <Box
//         sx={{
//           pt: 10,
//           px: 1.2,
//           height: "calc(100vh - 90px)",
//           overflow: "auto",
//         }}
//       >
//         <Box
//           sx={{
//             bgcolor: "rgba(255,255,255,0.05)",
//             backdropFilter: "blur(8px)",
//             border: "1px solid rgba(255,255,255,0.2)",
//             borderRadius: 2,
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
//             <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
//               IAM
//             </Typography>
//             <Chip
//               size="small"
//               label="Placeholder (No backend)"
//               sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}
//             />
//           </Box>

//           <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

//           <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 13, mb: 2 }}>
//             This page will later manage roles/users/permissions. For now it’s static so the portal stays error-free.
//           </Typography>

//           {/* cards row - Box only */}
//           <Box
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 2,
//             }}
//           >
//             {cards.map((c) => (
//               <Box
//                 key={c.title}
//                 sx={{
//                   flex: "1 1 220px",
//                   minWidth: 220,
//                   bgcolor: "rgba(255,255,255,0.04)",
//                   border: "1px solid rgba(255,255,255,0.12)",
//                   borderRadius: 2,
//                   p: 2,
//                 }}
//               >
//                 <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
//                   {c.title}
//                 </Typography>
//                 <Typography sx={{ color: "#fff", fontSize: 20, fontWeight: 600, mt: 0.5 }}>
//                   {c.value}
//                 </Typography>
//                 <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12, mt: 0.5 }}>
//                   {c.hint}
//                 </Typography>
//               </Box>
//             ))}
//           </Box>

//           <Box
//             sx={{
//               mt: 2,
//               bgcolor: "rgba(0,0,0,0.22)",
//               border: "1px dashed rgba(255,255,255,0.25)",
//               borderRadius: 2,
//               p: 2,
//             }}
//           >
//             <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500 }}>
//               Next steps (later)
//             </Typography>
//             <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12, mt: 0.5 }}>
//               • Add Cognito user listing (admin) <br />
//               • Role mapping + UI permissions <br />
//               • Audit logs / session tracking
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </MainLayout>
//   );
// }
