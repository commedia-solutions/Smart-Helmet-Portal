


// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   TablePagination,
//   Divider,
// } from '@mui/material';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// import {
//   fetchSmartHelmets,
//   type SmartHelmet,
//   getDefaultHelmetIds,
//   computeHelmetStatus,
// } from '../services/helmetService';

// type StatusFilter = 'All' | 'Active' | 'Inactive';

// export default function Dashboard() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

//   const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ✅ Tick so Active/Inactive updates smoothly even between refetches
//   const [nowMs, setNowMs] = useState(Date.now());
//   useEffect(() => {
//     const t = setInterval(() => setNowMs(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Which helmet IDs exist (01..300 by default). Change here if needed.
//   const helmetIdsRef = useRef<string[]>(getDefaultHelmetIds(300));

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         const data = await fetchSmartHelmets(helmetIdsRef.current, { concurrency: 12 });
//         if (!mounted) return;
//         setHelmets(data);
//         setError(null);
//         setLoading(false);
//       } catch (e: unknown) {
//         if (!mounted) return;
//         setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
//         setLoading(false);
//       }
//     };

//     load();
//     const iv = setInterval(load, 4000);
//     return () => {
//       mounted = false;
//       clearInterval(iv);
//     };
//   }, []);

//   const healthLabels = ['Healthy', 'Moderate', 'Critical'] as const;

//   const rows = useMemo(() => {
//     return helmets.map((h, idx) => {
//       const status = computeHelmetStatus(h.lastSeenMs, nowMs);

//       return {
//         deviceId: h.deviceId,
//         date: new Date(h.lastSeenMs).toLocaleDateString('en-GB'),
//         alcohol: `${h.alcohol} ppm`,
//         heartRate: h.hrt,
//         carbonMonoxide: `${h.carbonMonoxide} ppm`,
//         nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
//         volatileGas: `${h.volatileGas} ppm`,
//         envTemp: `${h.envTemp}°C`,
//         objectTemp: `${h.objTemp}°C`,
//         status,
//         userHealth: status === 'Inactive' ? '—' : healthLabels[idx % healthLabels.length],
//       };
//     });
//   }, [helmets, nowMs]);

//   const filteredRows = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();

//     return rows
//       .filter((r) => {
//         if (statusFilter !== 'All' && r.status !== statusFilter) return false;
//         if (!q) return true;

//         const fields = [
//           r.deviceId,
//           r.date,
//           r.alcohol,
//           r.heartRate,
//           r.carbonMonoxide,
//           r.nitrogenDioxide,
//           r.volatileGas,
//           r.envTemp,
//           r.objectTemp,
//           r.status,
//           r.userHealth,
//         ];

//         return fields.some((f) => String(f).toLowerCase().includes(q));
//       })
//       .sort((a, b) => Number(a.deviceId) - Number(b.deviceId));
//   }, [rows, searchTerm, statusFilter]);

//   const totals = useMemo(() => {
//     const total = rows.length;
//     const active = rows.filter((r) => r.status === 'Active').length;
//     const inactive = total - active;
//     return { total, active, inactive };
//   }, [rows]);

//   const pieData = useMemo(() => {
//     const counts: Record<string, number> = { Healthy: 0, Moderate: 0, Critical: 0 };

//     for (const r of filteredRows) {
//       if (r.userHealth === '—') continue;
//       counts[r.userHealth] = (counts[r.userHealth] || 0) + 1;
//     }

//     const total = filteredRows.length || 1;

//     const items = [
//       { name: 'Healthy', value: counts.Healthy, percentage: Math.round((counts.Healthy / total) * 100), color: '#4CAF50' },
//       { name: 'Moderate', value: counts.Moderate, percentage: Math.round((counts.Moderate / total) * 100), color: '#FFC107' },
//       { name: 'Critical', value: counts.Critical, percentage: Math.round((counts.Critical / total) * 100), color: '#F44336' },
//     ].filter((x) => x.value > 0);

//     return items.length ? items : [{ name: 'Healthy', value: 1, percentage: 0, color: '#4CAF50' }];
//   }, [filteredRows]);

//   const handleChangePage = (_: unknown, p: number) => setPage(p);
//   const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(Number(e.target.value));
//     setPage(0);
//   };

//   return (
 
//       // <Box
//       //   sx={{
//       //     display: 'flex',
//       //     alignItems: 'flex-start',
//       //     pt: 10,
//       //     px: 1.2,
//       //     gap: 2,
//       //     height: 'calc(100vh - 90px)',
//       //     overflow: 'hidden',
//       //   }}
//       // >
//       <Box
//     sx={{
//       display: 'flex',
//       alignItems: 'stretch',
//       justifyContent: 'flex-start',
//       gap: 2,
//       width: '100%',
//       height: '100%',
//       minHeight: 0,
//       overflow: 'hidden',
//     }}
//   >
//         {/* LEFT */}
//         <Box
//           sx={{
//             flex: '0 0 80%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 1.5,
//           }}
//         >
//           {/* Top summary */}
//           <Box
//             sx={{
//               display: 'flex',
//               gap: 2,
//               bgcolor: 'rgba(255,255,255,0.05)',
//               backdropFilter: 'blur(8px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               borderRadius: 2,
//               p: 1.5,
//             }}
//           >
//             <Box sx={{ flex: 1, textAlign: 'center' }}>
//               <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Active Helmets</Typography>
//               <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>{totals.active}</Typography>
//             </Box>
//             <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
//             <Box sx={{ flex: 1, textAlign: 'center' }}>
//               <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Inactive Helmets</Typography>
//               <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>{totals.inactive}</Typography>
//             </Box>
//             <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
//             <Box sx={{ flex: 1, textAlign: 'center' }}>
//               <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Total Helmets</Typography>
//               <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>{totals.total}</Typography>
//             </Box>
//           </Box>

//           {/* Main table card */}
//           <Box
//             sx={{
//               flex: 1,
//               display: 'flex',
//               flexDirection: 'column',
//               bgcolor: 'rgba(255,255,255,0.05)',
//               backdropFilter: 'blur(8px)',
//               border: '1px solid rgba(255,255,255,0.2)',
//               borderRadius: 2,
//               overflow: 'hidden',
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//                 px: 2,
//                 py: 1,
//                 borderBottom: '1px solid rgba(255,255,255,0.2)',
//               }}
//             >
//               <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
//                 Smart Helmets
//               </Typography>

//               <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//                 <TextField
//                   size="small"
//                   placeholder="Search..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setPage(0);
//                   }}
//                   sx={{
//                     width: 200,
//                     '& .MuiOutlinedInput-root': { height: 32 },
//                     '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #333' },
//                     '& .MuiOutlinedInput-input': { color: '#fff', fontSize: 12, py: 0.5 },
//                   }}
//                 />

//                 {/* Project placeholder */}
//                 <FormControl size="small" sx={{ minWidth: 120 }}>
//                   <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Project</InputLabel>
//                   <Select
//                     label="Project"
//                     value="all"
//                     sx={{
//                       bgcolor: '#1C1C1E',
//                       color: '#fff',
//                       border: '1px solid #333',
//                       borderRadius: 1,
//                       height: 32,
//                       fontSize: 12,
//                       '& .MuiSelect-select': { py: 0.5, px: 1 },
//                       '& .MuiSelect-icon': { color: '#888', fontSize: 16 },
//                     }}
//                     MenuProps={{ PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } } }}
//                   >
//                     <MenuItem value="all">All</MenuItem>
//                   </Select>
//                 </FormControl>

//                 {/* Status filter */}
//                 <FormControl size="small" sx={{ minWidth: 120 }}>
//                   <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Status</InputLabel>
//                   <Select
//                     label="Status"
//                     value={statusFilter}
//                     onChange={(e) => {
//                       setStatusFilter(e.target.value as StatusFilter);
//                       setPage(0);
//                     }}
//                     sx={{
//                       bgcolor: '#1C1C1E',
//                       color: '#fff',
//                       border: '1px solid #333',
//                       borderRadius: 1,
//                       height: 32,
//                       fontSize: 12,
//                       '& .MuiSelect-select': { py: 0.5, px: 1 },
//                       '& .MuiSelect-icon': { color: '#888', fontSize: 16 },
//                     }}
//                     MenuProps={{ PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } } }}
//                   >
//                     <MenuItem value="All">All</MenuItem>
//                     <MenuItem value="Active">Active</MenuItem>
//                     <MenuItem value="Inactive">Inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Box>

//             {/* Table area */}
//             <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1.5, py: 1, overflow: 'hidden' }}>
//               {loading && <Typography color="#fff">Loading…</Typography>}
//               {error && <Typography color="error">{error}</Typography>}

//               {!loading && !error && (
//                 <>
//                   <TableContainer
//                     component={Paper}
//                     sx={{
//                       flex: 1,
//                       bgcolor: 'transparent',
//                       boxShadow: 'none',
//                       overflow: 'auto',
//                       '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.1)', textAlign: 'center' },
//                       '&::-webkit-scrollbar': { width: '6px', height: '6px' },
//                       '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
//                       '&::-webkit-scrollbar-track': { background: 'transparent' },
//                     }}
//                   >
//                     <Table stickyHeader sx={{ '& .MuiTableRow-root:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
//                       <TableHead>
//                         <TableRow>
//                           {[
//                             'Device ID',
//                             'Date',
//                             'Alcohol',
//                             'Heart Rate',
//                             'Carbon Monoxide',
//                             'Nitrogen Dioxide',
//                             'Volatile Gas',
//                             'Env. Temp',
//                             'Object Temp',
//                             'Status',
//                             'User Health',
//                           ].map((h) => (
//                             <TableCell
//                               key={h}
//                               sx={{
//                                 backgroundColor: 'rgba(40,40,45,1)',
//                                 color: 'rgba(255,255,255,0.9)',
//                                 fontSize: '0.75rem',
//                                 fontWeight: 500,
//                                 padding: '8px 12px',
//                                 borderBottom: '1px solid rgba(255,255,255,0.2)',
//                                 position: 'sticky',
//                                 top: 0,
//                                 zIndex: 2,
//                               }}
//                             >
//                               {h}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>

//                       <TableBody
//                         sx={{
//                           '& .MuiTableCell-body': {
//                             fontSize: '0.75rem',
//                             padding: '8px 6px',
//                             borderBottom: '1px solid rgba(255,255,255,0.05)',
//                           },
//                         }}
//                       >
//                         {filteredRows
//                           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                           .map((row, idx) => (
//                             <TableRow key={`${row.deviceId}-${idx}`} hover>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.deviceId}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.date}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.alcohol}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.heartRate}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.carbonMonoxide}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.nitrogenDioxide}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.volatileGas}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.envTemp}</TableCell>
//                               <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.objectTemp}</TableCell>
//                               <TableCell
//                                 sx={{
//                                   fontWeight: 500,
//                                   color: row.status === 'Active' ? '#4CAF50' : '#F44336',
//                                 }}
//                               >
//                                 {row.status}
//                               </TableCell>
//                               <TableCell
//                                 sx={{
//                                   fontWeight: 500,
//                                   color:
//                                     row.userHealth === 'Healthy'
//                                       ? '#4CAF50'
//                                       : row.userHealth === 'Moderate'
//                                       ? '#FFC107'
//                                       : row.userHealth === 'Critical'
//                                       ? '#F44336'
//                                       : 'rgba(255,255,255,0.4)',
//                                 }}
//                               >
//                                 {row.userHealth}
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   <TablePagination
//                     rowsPerPageOptions={[5, 10, 25]}
//                     component="div"
//                     count={filteredRows.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     sx={{
//                       color: '#fff',
//                       borderTop: '1px solid rgba(255,255,255,0.2)',
//                       '& .MuiTablePagination-selectIcon': { color: '#fff' },
//                       px: 2,
//                     }}
//                   />
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* RIGHT */}
//         <Box
//           sx={{
//             flex: '0 0 20%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 1.5,
//             overflow: 'hidden',
//           }}
//         >
//           <Box
//             sx={{
//               height: '100%',
//               overflowY: 'auto',
//               pr: 1,
//               '&::-webkit-scrollbar': { width: '6px' },
//               '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
//               '&::-webkit-scrollbar-track': { background: 'transparent' },
//             }}
//           >
//             {/* Helmet Stats */}
//             <Box
//               sx={{
//                 bgcolor: 'rgba(255,255,255,0.05)',
//                 backdropFilter: 'blur(8px)',
//                 border: '1px solid rgba(255,255,255,0.2)',
//                 borderRadius: 2,
//                 p: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 mb: 1.2,
//                 minHeight: 100,
//               }}
//             >
//               <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#fff' }}>
//                 Helmet Stats
//               </Typography>

//               <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                 <Box sx={{ width: '100%', height: 160 }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </Box>

//                 <Box
//                   sx={{
//                     position: 'absolute',
//                     top: '40%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     textAlign: 'center',
//                     width: '100%',
//                   }}
//                 >
//                   <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.2 }}>Total</Typography>
//                   <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 24, lineHeight: 1.2 }}>
//                     {filteredRows.length}
//                   </Typography>
//                 </Box>

//                 <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1, width: '100%', overflow: 'hidden' }}>
//                   {pieData.map((item) => (
//                     <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
//                         <Typography sx={{ color: '#fff', fontSize: 12, whiteSpace: 'nowrap' }}>{item.name}</Typography>
//                       </Box>
//                       <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>
//                         {item.percentage}%
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>
//             </Box>

//             {/* Threshold Ranges */}
//             <Box
//               sx={{
//                 bgcolor: 'rgba(255,255,255,0.05)',
//                 backdropFilter: 'blur(8px)',
//                 border: '1px solid rgba(255,255,255,0.2)',
//                 borderRadius: 2,
//                 p: 2,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: 193,
//                 overflow: 'hidden',
//               }}
//             >
//               <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
//                 Threshold Ranges
//               </Typography>
//               <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1.5, width: '100%' }} />

//               <Box
//                 sx={{
//                   flex: 1,
//                   overflowY: 'auto',
//                   pr: 1,
//                   '&::-webkit-scrollbar': { width: '6px' },
//                   '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
//                   '&::-webkit-scrollbar-track': { background: 'transparent' },
//                 }}
//               >
//                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
//                   {[
//                     { parameter: 'Alcohol', range: '0.02% - 0.05%' },
//                     { parameter: 'Heart Rate', range: '60 bpm - 90 bpm' },
//                     { parameter: 'Carbon Monoxide', range: '0.8 ppm - 2.0 ppm' },
//                     { parameter: 'Nitrogen Dioxide', range: '0.3 ppm - 0.8 ppm' },
//                     { parameter: 'Volatile Gas', range: '0.1 ppm - 0.4 ppm' },
//                     { parameter: 'Env. Temp', range: '25°C - 32°C' },
//                     { parameter: 'Object Temp', range: '29°C - 35°C' },
//                   ].map((item) => (
//                     <Box key={item.parameter} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Typography sx={{ color: '#fff', fontSize: '0.875rem', flex: 1 }}>{item.parameter}</Typography>
//                       <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
//                         {item.range}
//                       </Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//   );
// }


// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   Box,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   TablePagination,
//   Divider,
// } from '@mui/material';
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// import {
//   fetchSmartHelmets,
//   type SmartHelmet,
//   getDefaultHelmetIds,
//   computeHelmetStatus,
// } from '../services/helmetService';

// type StatusFilter = 'All' | 'Active' | 'Inactive';

// export default function Dashboard() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

//   const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // ✅ Tick so Active/Inactive updates smoothly even between refetches
//   const [nowMs, setNowMs] = useState(Date.now());
//   useEffect(() => {
//     const t = setInterval(() => setNowMs(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   // Which helmet IDs exist (01..300 by default). Change here if needed.
//   const helmetIdsRef = useRef<string[]>(getDefaultHelmetIds(300));

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         const data = await fetchSmartHelmets(helmetIdsRef.current, { concurrency: 12 });
//         if (!mounted) return;
//         setHelmets(data);
//         setError(null);
//         setLoading(false);
//       } catch (e: unknown) {
//         if (!mounted) return;
//         setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
//         setLoading(false);
//       }
//     };

//     load();
//     const iv = setInterval(load, 4000);
//     return () => {
//       mounted = false;
//       clearInterval(iv);
//     };
//   }, []);

//   const healthLabels = ['Healthy', 'Moderate', 'Critical'] as const;

//   const rows = useMemo(() => {
//     return helmets.map((h, idx) => {
//       const status = computeHelmetStatus(h.lastSeenMs, nowMs);

//       return {
//         deviceId: h.deviceId,
//         date: new Date(h.lastSeenMs).toLocaleDateString('en-GB'),
//         alcohol: `${h.alcohol} ppm`,
//         heartRate: h.hrt,
//         carbonMonoxide: `${h.carbonMonoxide} ppm`,
//         nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
//         volatileGas: `${h.volatileGas} ppm`,
//         envTemp: `${h.envTemp}°C`,
//         objectTemp: `${h.objTemp}°C`,
//         status,
//         userHealth: status === 'Inactive' ? '—' : healthLabels[idx % healthLabels.length],
//       };
//     });
//   }, [helmets, nowMs]);

//   const filteredRows = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();

//     return rows
//       .filter((r) => {
//         if (statusFilter !== 'All' && r.status !== statusFilter) return false;
//         if (!q) return true;

//         const fields = [
//           r.deviceId,
//           r.date,
//           r.alcohol,
//           r.heartRate,
//           r.carbonMonoxide,
//           r.nitrogenDioxide,
//           r.volatileGas,
//           r.envTemp,
//           r.objectTemp,
//           r.status,
//           r.userHealth,
//         ];

//         return fields.some((f) => String(f).toLowerCase().includes(q));
//       })
//       .sort((a, b) => Number(a.deviceId) - Number(b.deviceId));
//   }, [rows, searchTerm, statusFilter]);

//   const totals = useMemo(() => {
//     const total = rows.length;
//     const active = rows.filter((r) => r.status === 'Active').length;
//     const inactive = total - active;
//     return { total, active, inactive };
//   }, [rows]);

//   const pieData = useMemo(() => {
//     const counts: Record<string, number> = { Healthy: 0, Moderate: 0, Critical: 0 };

//     for (const r of filteredRows) {
//       if (r.userHealth === '—') continue;
//       counts[r.userHealth] = (counts[r.userHealth] || 0) + 1;
//     }

//     const total = filteredRows.length || 1;

//     const items = [
//       { name: 'Healthy', value: counts.Healthy, percentage: Math.round((counts.Healthy / total) * 100), color: '#4CAF50' },
//       { name: 'Moderate', value: counts.Moderate, percentage: Math.round((counts.Moderate / total) * 100), color: '#FFC107' },
//       { name: 'Critical', value: counts.Critical, percentage: Math.round((counts.Critical / total) * 100), color: '#F44336' },
//     ].filter((x) => x.value > 0);

//     return items.length ? items : [{ name: 'Healthy', value: 1, percentage: 0, color: '#4CAF50' }];
//   }, [filteredRows]);

//   const handleChangePage = (_: unknown, p: number) => setPage(p);
//   const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(Number(e.target.value));
//     setPage(0);
//   };

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         alignItems: 'stretch',
//         gap: 2,
//         width: '100%',
//         height: '100%',
//         minHeight: 0,
//         overflow: 'hidden', // No page scrolling
//       }}
//     >
//       {/* LEFT SECTION - Main Content (78%) */}
//       <Box
//         sx={{
//           flex: '0 0 calc(78% - 8px)', // Accounting for gap
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           minHeight: 0,
//           overflow: 'hidden', // No scrolling
//         }}
//       >
//         {/* Top Summary Cards - Compact */}
//         <Box
//           sx={{
//             display: 'flex',
//             gap: 2,
//             bgcolor: 'rgba(255,255,255,0.05)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 2,
//             p: 2,
//             flexShrink: 0,
//             height: '100px', // Fixed height
//           }}
//         >
//           <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//             <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, mb: 0.5 }}>
//               Active Helmets
//             </Typography>
//             <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 600 }}>
//               {totals.active}
//             </Typography>
//           </Box>
          
//           <Divider 
//             orientation="vertical" 
//             flexItem 
//             sx={{ borderColor: 'rgba(255,255,255,0.15)' }} 
//           />
          
//           <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//             <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, mb: 0.5 }}>
//               Inactive Helmets
//             </Typography>
//             <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 600 }}>
//               {totals.inactive}
//             </Typography>
//           </Box>
          
//           <Divider 
//             orientation="vertical" 
//             flexItem 
//             sx={{ borderColor: 'rgba(255,255,255,0.15)' }} 
//           />
          
//           <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//             <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, mb: 0.5 }}>
//               Total Helmets
//             </Typography>
//             <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 600 }}>
//               {totals.total}
//             </Typography>
//           </Box>
//         </Box>

//         {/* Main Table Card */}
//         <Box
//           sx={{
//             flex: 1,
//             display: 'flex',
//             flexDirection: 'column',
//             bgcolor: 'rgba(255,255,255,0.05)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 2,
//             overflow: 'hidden',
//             minHeight: 0,
//           }}
//         >
//           {/* Header - Compact */}
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               px: 2,
//               py: 1.5,
//               borderBottom: '1px solid rgba(255,255,255,0.12)',
//               flexShrink: 0,
//             }}
//           >
//             <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
//               Smart Helmets
//             </Typography>

//             <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
//               <TextField
//                 size="small"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setPage(0);
//                 }}
//                 sx={{
//                   width: 220,
//                   '& .MuiOutlinedInput-root': { 
//                     height: 36,
//                     bgcolor: 'rgba(255,255,255,0.04)',
//                     borderRadius: 2,
//                   },
//                   '& .MuiOutlinedInput-notchedOutline': { 
//                     borderColor: 'rgba(255,255,255,0.14)' 
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': { 
//                     borderColor: 'rgba(255,255,255,0.22)' 
//                   },
//                   '& .MuiOutlinedInput-input': { 
//                     color: '#fff', 
//                     fontSize: 13,
//                   },
//                 }}
//               />

//               {/* Project Filter */}
//               <FormControl size="small" sx={{ minWidth: 130 }}>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
//                   Project
//                 </InputLabel>
//                 <Select
//                   label="Project"
//                   value="all"
//                   sx={{
//                     bgcolor: 'rgba(255,255,255,0.04)',
//                     color: '#fff',
//                     borderRadius: 2,
//                     height: 36,
//                     fontSize: 13,
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'rgba(255,255,255,0.14)',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'rgba(255,255,255,0.22)',
//                     },
//                     '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
//                   }}
//                   MenuProps={{
//                     PaperProps: {
//                       sx: {
//                         bgcolor: 'rgba(20,20,20,0.98)',
//                         backdropFilter: 'blur(12px)',
//                         border: '1px solid rgba(255,255,255,0.12)',
//                         mt: 0.5,
//                         '& .MuiMenuItem-root': {
//                           color: '#fff',
//                           fontSize: 13,
//                           '&:hover': {
//                             bgcolor: 'rgba(255,255,255,0.08)',
//                           },
//                           '&.Mui-selected': {
//                             bgcolor: 'rgba(255,255,255,0.12)',
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   <MenuItem value="all">All</MenuItem>
//                 </Select>
//               </FormControl>

//               {/* Status Filter */}
//               <FormControl size="small" sx={{ minWidth: 130 }}>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
//                   Status
//                 </InputLabel>
//                 <Select
//                   label="Status"
//                   value={statusFilter}
//                   onChange={(e) => {
//                     setStatusFilter(e.target.value as StatusFilter);
//                     setPage(0);
//                   }}
//                   sx={{
//                     bgcolor: 'rgba(255,255,255,0.04)',
//                     color: '#fff',
//                     borderRadius: 2,
//                     height: 36,
//                     fontSize: 13,
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'rgba(255,255,255,0.14)',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                       borderColor: 'rgba(255,255,255,0.22)',
//                     },
//                     '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
//                   }}
//                   MenuProps={{
//                     PaperProps: {
//                       sx: {
//                         bgcolor: 'rgba(20,20,20,0.98)',
//                         backdropFilter: 'blur(12px)',
//                         border: '1px solid rgba(255,255,255,0.12)',
//                         mt: 0.5,
//                         '& .MuiMenuItem-root': {
//                           color: '#fff',
//                           fontSize: 13,
//                           '&:hover': {
//                             bgcolor: 'rgba(255,255,255,0.08)',
//                           },
//                           '&.Mui-selected': {
//                             bgcolor: 'rgba(255,255,255,0.12)',
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   <MenuItem value="All">All</MenuItem>
//                   <MenuItem value="Active">Active</MenuItem>
//                   <MenuItem value="Inactive">Inactive</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>

//           {/* Table Area */}
//           <Box 
//             sx={{ 
//               flex: 1, 
//               display: 'flex', 
//               flexDirection: 'column', 
//               minHeight: 0,
//               overflow: 'hidden',
//             }}
//           >
//             {loading && (
//               <Box sx={{ p: 3 }}>
//                 <Typography sx={{ color: '#fff' }}>Loading…</Typography>
//               </Box>
//             )}
            
//             {error && (
//               <Box sx={{ p: 3 }}>
//                 <Typography sx={{ color: '#f44336' }}>{error}</Typography>
//               </Box>
//             )}

//             {!loading && !error && (
//               <>
//                 <TableContainer
//                   component={Paper}
//                   sx={{
//                     flex: 1,
//                     bgcolor: 'transparent',
//                     boxShadow: 'none',
//                     overflow: 'auto',
//                     '& .MuiTableCell-root': {
//                       borderColor: 'rgba(255,255,255,0.08)',
//                       textAlign: 'center',
//                     },
//                     '&::-webkit-scrollbar': {
//                       width: '8px',
//                       height: '8px',
//                     },
//                     '&::-webkit-scrollbar-thumb': {
//                       background: 'rgba(255,255,255,0.2)',
//                       borderRadius: '4px',
//                       '&:hover': {
//                         background: 'rgba(255,255,255,0.3)',
//                       },
//                     },
//                     '&::-webkit-scrollbar-track': {
//                       background: 'transparent',
//                     },
//                   }}
//                 >
//                   <Table 
//                     stickyHeader 
//                     sx={{ 
//                       '& .MuiTableRow-root:hover': { 
//                         backgroundColor: 'rgba(255,255,255,0.04)' 
//                       } 
//                     }}
//                   >
//                     <TableHead>
//                       <TableRow>
//                         {[
//                           'Device ID',
//                           'Date',
//                           'Alcohol',
//                           'Heart Rate',
//                           'Carbon Monoxide',
//                           'Nitrogen Dioxide',
//                           'Volatile Gas',
//                           'Env. Temp',
//                           'Object Temp',
//                           'Status',
//                           'User Health',
//                         ].map((h) => (
//                           <TableCell
//                             key={h}
//                             sx={{
//                               backgroundColor: 'rgba(20,20,22,0.95)',
//                               color: 'rgba(255,255,255,0.9)',
//                               fontSize: 12,
//                               fontWeight: 600,
//                               padding: '10px 12px',
//                               borderBottom: '1px solid rgba(255,255,255,0.12)',
//                               position: 'sticky',
//                               top: 0,
//                               zIndex: 2,
//                               whiteSpace: 'nowrap',
//                             }}
//                           >
//                             {h}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     </TableHead>

//                     <TableBody
//                       sx={{
//                         '& .MuiTableCell-body': {
//                           fontSize: 12,
//                           padding: '10px 12px',
//                           borderBottom: '1px solid rgba(255,255,255,0.06)',
//                         },
//                       }}
//                     >
//                       {filteredRows
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((row, idx) => (
//                           <TableRow key={`${row.deviceId}-${idx}`} hover>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
//                               {row.deviceId}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.date}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.alcohol}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.heartRate}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.carbonMonoxide}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.nitrogenDioxide}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.volatileGas}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.envTemp}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {row.objectTemp}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 color: row.status === 'Active' ? '#4CAF50' : '#F44336',
//                               }}
//                             >
//                               {row.status}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 color:
//                                   row.userHealth === 'Healthy'
//                                     ? '#4CAF50'
//                                     : row.userHealth === 'Moderate'
//                                     ? '#FFC107'
//                                     : row.userHealth === 'Critical'
//                                     ? '#F44336'
//                                     : 'rgba(255,255,255,0.4)',
//                               }}
//                             >
//                               {row.userHealth}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   component="div"
//                   count={filteredRows.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   sx={{
//                     color: 'rgba(255,255,255,0.85)',
//                     borderTop: '1px solid rgba(255,255,255,0.12)',
//                     '& .MuiTablePagination-selectLabel': {
//                       fontSize: 12,
//                     },
//                     '& .MuiTablePagination-displayedRows': {
//                       fontSize: 12,
//                     },
//                     '& .MuiTablePagination-selectIcon': { 
//                       color: 'rgba(255,255,255,0.6)' 
//                     },
//                     '& .MuiTablePagination-select': {
//                       color: '#fff',
//                       fontSize: 12,
//                     },
//                     '& .MuiIconButton-root': {
//                       color: 'rgba(255,255,255,0.6)',
//                       padding: '6px',
//                       '&:hover': {
//                         bgcolor: 'rgba(255,255,255,0.08)',
//                       },
//                       '&.Mui-disabled': {
//                         color: 'rgba(255,255,255,0.3)',
//                       },
//                     },
//                     px: 2,
//                     py: 1,
//                     minHeight: '52px',
//                     flexShrink: 0,
//                   }}
//                 />
//               </>
//             )}
//           </Box>
//         </Box>
//       </Box>

//       {/* RIGHT SECTION - Stats (22%) - NO SCROLLING */}
//       <Box
//         sx={{
//           flex: '0 0 calc(22% - 8px)', // Accounting for gap
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           minHeight: 0,
//           overflow: 'hidden', // No scrolling
//         }}
//       >
//         {/* Helmet Stats - Fixed Height */}
//         <Box
//           sx={{
//             bgcolor: 'rgba(255,255,255,0.05)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 2,
//             p: 2,
//             display: 'flex',
//             flexDirection: 'column',
//             flexShrink: 0,
//             height: 'calc(50% - 4px)', // Take half the space minus gap
//             overflow: 'hidden',
//           }}
//         >
//           <Typography 
//             variant="h6" 
//             sx={{ 
//               fontWeight: 600, 
//               mb: 1.5, 
//               color: '#fff',
//               fontSize: 16,
//               flexShrink: 0,
//             }}
//           >
//             Helmet Stats
//           </Typography>

//           <Box 
//             sx={{ 
//               flex: 1,
//               display: 'flex', 
//               flexDirection: 'column', 
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 1.5,
//               minHeight: 0,
//             }}
//           >
//             <Box sx={{ width: '100%', height: '140px', position: 'relative', flexShrink: 0 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie 
//                     data={pieData} 
//                     cx="50%" 
//                     cy="50%" 
//                     innerRadius={50} 
//                     outerRadius={65} 
//                     paddingAngle={3} 
//                     dataKey="value"
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>

//               {/* Center text */}
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   textAlign: 'center',
//                 }}
//               >
//                 <Typography 
//                   sx={{ 
//                     color: 'rgba(255,255,255,0.7)', 
//                     fontWeight: 500, 
//                     fontSize: 11,
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   Total
//                 </Typography>
//                 <Typography 
//                   sx={{ 
//                     color: '#fff', 
//                     fontWeight: 700, 
//                     fontSize: 28,
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   {filteredRows.length}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Legend - Compact */}
//             <Box 
//               sx={{ 
//                 display: 'flex', 
//                 justifyContent: 'center', 
//                 gap: 2, 
//                 width: '100%',
//                 flexWrap: 'wrap',
//                 flexShrink: 0,
//               }}
//             >
//               {pieData.map((item) => (
//                 <Box 
//                   key={item.name} 
//                   sx={{ 
//                     display: 'flex', 
//                     flexDirection: 'column', 
//                     alignItems: 'center',
//                     gap: 0.3,
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
//                     <Box 
//                       sx={{ 
//                         width: 10, 
//                         height: 10, 
//                         borderRadius: '50%', 
//                         bgcolor: item.color,
//                       }} 
//                     />
//                     <Typography 
//                       sx={{ 
//                         color: 'rgba(255,255,255,0.85)', 
//                         fontSize: 11,
//                         fontWeight: 500,
//                       }}
//                     >
//                       {item.name}
//                     </Typography>
//                   </Box>
//                   <Typography 
//                     sx={{ 
//                       color: '#fff', 
//                       fontWeight: 600, 
//                       fontSize: 12,
//                     }}
//                   >
//                     {item.percentage}%
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </Box>

//         {/* Threshold Ranges - Takes remaining space with internal scroll only */}
//         <Box
//           sx={{
//             flex: 1,
//             bgcolor: 'rgba(255,255,255,0.05)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 2,
//             p: 2,
//             display: 'flex',
//             flexDirection: 'column',
//             minHeight: 0,
//             overflow: 'hidden',
//           }}
//         >
//           <Typography 
//             variant="h6" 
//             sx={{ 
//               color: '#fff', 
//               fontWeight: 600, 
//               fontSize: 16,
//               mb: 1,
//               flexShrink: 0,
//             }}
//           >
//             Threshold Ranges
//           </Typography>
          
//           <Divider 
//             sx={{ 
//               borderColor: 'rgba(255,255,255,0.12)', 
//               mb: 1.5,
//               flexShrink: 0,
//             }} 
//           />

//           <Box
//             sx={{
//               flex: 1,
//               overflowY: 'auto',
//               overflowX: 'hidden',
//               pr: 0.5,
//               minHeight: 0,
//               '&::-webkit-scrollbar': {
//                 width: '5px',
//               },
//               '&::-webkit-scrollbar-thumb': {
//                 background: 'rgba(255,255,255,0.2)',
//                 borderRadius: '3px',
//                 '&:hover': {
//                   background: 'rgba(255,255,255,0.3)',
//                 },
//               },
//               '&::-webkit-scrollbar-track': {
//                 background: 'transparent',
//               },
//             }}
//           >
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//               {[
//                 { parameter: 'Alcohol', range: '0.02% - 0.05%' },
//                 { parameter: 'Heart Rate', range: '60 bpm - 90 bpm' },
//                 { parameter: 'Carbon Monoxide', range: '0.8 ppm - 2.0 ppm' },
//                 { parameter: 'Nitrogen Dioxide', range: '0.3 ppm - 0.8 ppm' },
//                 { parameter: 'Volatile Gas', range: '0.1 ppm - 0.4 ppm' },
//                 { parameter: 'Env. Temp', range: '25°C - 32°C' },
//                 { parameter: 'Object Temp', range: '29°C - 35°C' },
//               ].map((item) => (
//                 <Box 
//                   key={item.parameter} 
//                   sx={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'center',
//                     gap: 1.5,
//                   }}
//                 >
//                   <Typography 
//                     sx={{ 
//                       color: 'rgba(255,255,255,0.85)', 
//                       fontSize: 12,
//                       fontWeight: 500,
//                       flex: 1,
//                     }}
//                   >
//                     {item.parameter}
//                   </Typography>
//                   <Typography 
//                     sx={{ 
//                       color: 'rgba(255,255,255,0.65)', 
//                       fontSize: 12,
//                       fontWeight: 500,
//                       textAlign: 'right',
//                       whiteSpace: 'nowrap',
//                     }}
//                   >
//                     {item.range}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Divider,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import {
  fetchSmartHelmets,
  type SmartHelmet,
  getDefaultHelmetIds,
  computeHelmetStatus,
} from '../services/helmetService';

type StatusFilter = 'All' | 'Active' | 'Inactive';

export default function Dashboard() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Tick so Active/Inactive updates smoothly even between refetches
  const [nowMs, setNowMs] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Which helmet IDs exist (01..300 by default). Change here if needed.
  const helmetIdsRef = useRef<string[]>(getDefaultHelmetIds(300));

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchSmartHelmets(helmetIdsRef.current, { concurrency: 12 });
        if (!mounted) return;
        setHelmets(data);
        setError(null);
        setLoading(false);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    load();
    const iv = setInterval(load, 4000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  const healthLabels = ['Healthy', 'Moderate', 'Critical'] as const;

  const rows = useMemo(() => {
    return helmets.map((h, idx) => {
      const status = computeHelmetStatus(h.lastSeenMs, nowMs);

      return {
        deviceId: h.deviceId,
        date: new Date(h.lastSeenMs).toLocaleDateString('en-GB'),
        alcohol: `${h.alcohol} ppm`,
        heartRate: h.hrt,
        carbonMonoxide: `${h.carbonMonoxide} ppm`,
        nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
        volatileGas: `${h.volatileGas} ppm`,
        envTemp: `${h.envTemp}°C`,
        objectTemp: `${h.objTemp}°C`,
        status,
        userHealth: status === 'Inactive' ? '—' : healthLabels[idx % healthLabels.length],
      };
    });
  }, [helmets, nowMs]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return rows
      .filter((r) => {
        if (statusFilter !== 'All' && r.status !== statusFilter) return false;
        if (!q) return true;

        const fields = [
          r.deviceId,
          r.date,
          r.alcohol,
          r.heartRate,
          r.carbonMonoxide,
          r.nitrogenDioxide,
          r.volatileGas,
          r.envTemp,
          r.objectTemp,
          r.status,
          r.userHealth,
        ];

        return fields.some((f) => String(f).toLowerCase().includes(q));
      })
      .sort((a, b) => Number(a.deviceId) - Number(b.deviceId));
  }, [rows, searchTerm, statusFilter]);

  const totals = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === 'Active').length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [rows]);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = { Healthy: 0, Moderate: 0, Critical: 0 };

    for (const r of filteredRows) {
      if (r.userHealth === '—') continue;
      counts[r.userHealth] = (counts[r.userHealth] || 0) + 1;
    }

    const total = filteredRows.length || 1;

    const items = [
      { name: 'Healthy', value: counts.Healthy, percentage: Math.round((counts.Healthy / total) * 100), color: '#4CAF50' },
      { name: 'Moderate', value: counts.Moderate, percentage: Math.round((counts.Moderate / total) * 100), color: '#FFC107' },
      { name: 'Critical', value: counts.Critical, percentage: Math.round((counts.Critical / total) * 100), color: '#F44336' },
    ].filter((x) => x.value > 0);

    return items.length ? items : [{ name: 'Healthy', value: 1, percentage: 0, color: '#4CAF50' }];
  }, [filteredRows]);

  const handleChangePage = (_: unknown, p: number) => setPage(p);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };


  // ✅ Always show all 3 labels in legend (even if 0%)
const HEALTH_LEGEND = [
  { name: "Healthy", color: "#4CAF50" },
  { name: "Moderate", color: "#FFC107" },
  { name: "Critical", color: "#F44336" },
] as const;

const pctFor = (name: (typeof HEALTH_LEGEND)[number]["name"]) =>
  pieData.find((p) => p.name === name)?.percentage ?? 0;


  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        gap: 2, 
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        pt: 0.5,
        px: 0.3,
        pb: 0.1,
      }}
    >
      {/* LEFT SECTION - Main Content (78%) */}
      <Box
        sx={{
          flex: '0 0 calc(78% - 6px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Top Header Cards - Two Cards in Row */}
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          {/* Greeting Card */}
          <Box
            sx={{
              flex: '0 0 auto',
              minWidth: 280,
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 2,
              p: 1.2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>
              {getGreeting()}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)', height: 24 }} />
            <Typography sx={{ color: '#FFD600', fontSize: 14, fontWeight: 500 }}>
              Ryan Crawford
            </Typography>
          </Box>

          {/* Helmet Count Card - Centered and Equally Spaced */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 2,
              p: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>
                Total Helmets
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#fff', lineHeight: 1 }}>
                {totals.total}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)', height: 28 }} />

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>
                Active
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#4CAF50', lineHeight: 1 }}>
                {totals.active}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)', height: 28 }} />

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>
                Inactive
              </Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 500, color: '#F44336', lineHeight: 1 }}>
                {totals.inactive}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Table Card */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* Header - Compact */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 1.5,
              py: 1.2,
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 22, lineHeight: 1.1 }}>

              Smart Helmets
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                sx={{
                  width: 220,
                  '& .MuiOutlinedInput-root': { 
                    height: 34,
                    bgcolor: '#1C1C1E',
                    border: '1px solid #333',
                    borderRadius: 1,
                    '& fieldset': { border: 'none' },
                  },
                  '& .MuiOutlinedInput-input': { 
                    color: '#fff', 
                    fontSize: 12,
                    py: 0.6,
                  },
                }}
              />

              {/* Project Filter */}
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>
                  Project
                </InputLabel>
                <Select
                  label="Project"
                  value="all"
                  sx={{
                    bgcolor: '#1C1C1E',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: 1,
                    height: 34,
                    fontSize: 12,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { py: 0.6, px: 1.25 },
                    '& .MuiSelect-icon': { color: '#888' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#28282B',
                        color: '#fff',
                        '& .MuiMenuItem-root': {
                          color: '#fff',
                          fontSize: 12,
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.08)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(255,255,255,0.12)',
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                </Select>
              </FormControl>

              {/* Status Filter */}
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>
                  Status
                </InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as StatusFilter);
                    setPage(0);
                  }}
                  sx={{
                    bgcolor: '#1C1C1E',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: 1,
                    height: 34,
                    fontSize: 12,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { py: 0.6, px: 1.25 },
                    '& .MuiSelect-icon': { color: '#888' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#28282B',
                        color: '#fff',
                        '& .MuiMenuItem-root': {
                          color: '#fff',
                          fontSize: 12,
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.08)',
                          },
                          '&.Mui-selected': {
                            bgcolor: 'rgba(255,255,255,0.12)',
                          },
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Table Area */}
          <Box 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            {loading && (
              <Box sx={{ p: 3 }}>
                <Typography sx={{ color: '#fff' }}>Loading…</Typography>
              </Box>
            )}
            
            {error && (
              <Box sx={{ p: 3 }}>
                <Typography sx={{ color: '#f44336' }}>{error}</Typography>
              </Box>
            )}

            {!loading && !error && (
              <>
                <TableContainer
                  component={Paper}
                  sx={{
                    flex: 1,
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'auto',
                    '& .MuiTableCell-root': {
                      borderColor: 'rgba(255,255,255,0.1)',
                      textAlign: 'center',
                    },
                    '&::-webkit-scrollbar': {
                      width: '6px',
                      height: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#333',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                  }}
                >
                  <Table 
                    stickyHeader 
                    sx={{ 
                      '& .MuiTableRow-root:hover': { 
                        backgroundColor: 'rgba(255,255,255,0.03)' 
                      } 
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {[
                          'Device ID',
                          'Date',
                          'Alcohol',
                          'Heart Rate',
                          'Carbon Monoxide',
                          'Nitrogen Dioxide',
                          'Volatile Gas',
                          'Env. Temp',
                          'Object Temp',
                          'Status',
                          'User Health',
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.05)",
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              padding: '10px 12px',
                              borderBottom: '1px solid rgba(255,255,255,0.2)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody
                      sx={{
                        '& .MuiTableCell-body': {
                          fontSize: '0.75rem',
                          padding: '10px 8px',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          color: '#fff',
                        },
                      }}
                    >
                      {filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, idx) => (
                          <TableRow key={`${row.deviceId}-${idx}`} hover>
                            <TableCell sx={{ color: '#fff', fontWeight: 500 }}>
                              {row.deviceId}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.date}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.alcohol}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.heartRate}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.carbonMonoxide}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.nitrogenDioxide}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.volatileGas}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.envTemp}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>
                              {row.objectTemp}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color: row.status === 'Active' ? '#4CAF50' : '#F44336',
                              }}
                            >
                              {row.status}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color:
                                  row.userHealth === 'Healthy'
                                    ? '#4CAF50'
                                    : row.userHealth === 'Moderate'
                                    ? '#FFC107'
                                    : row.userHealth === 'Critical'
                                    ? '#F44336'
                                    : 'rgba(255,255,255,0.4)',
                              }}
                            >
                              {row.userHealth}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredRows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: '#fff',
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    '& .MuiTablePagination-selectIcon': { color: '#fff' },
                    '& .MuiTablePagination-displayedRows': { color: '#fff' },
                    '& .MuiTablePagination-select': { color: '#fff' },
                    '& .MuiIconButton-root': {
                      color: '#fff',
                      '&.Mui-disabled': {
                        color: 'rgba(255,255,255,0.3)',
                      },
                    },
                    px: 1.5,
                    py: 0.8,
                    flexShrink: 0,
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* RIGHT SECTION - Stats (22%) */}
      <Box
        sx={{
          flex: '0 0 calc(22% - 8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Helmet Stats - Much Smaller (20% of right sidebar) */}
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            height: '200px',
            overflow: 'hidden',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500, 
              mb: 1, 
              color: '#fff',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            Helmet Stats
          </Typography>

          <Box 
            sx={{ 
              flex: 1,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.8,
              minHeight: 0,
            }}
          >
            <Box sx={{ width: "100%", height: "125px", position: "relative", flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
  data={pieData}
  cx="50%"
  cy="50%"
  innerRadius={44}
  outerRadius={60}
  paddingAngle={2}
  dataKey="value"
>

                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center text */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography 
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontWeight: 400, 
                    fontSize: 9,
                    lineHeight: 1.2,
                  }}
                >
                  Total
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 600, 
                    fontSize: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {filteredRows.length}
                </Typography>
              </Box>
            </Box>

            {/* Legend - Compact */}
            <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "nowrap",     // ✅ single row
    gap: 1,
    px: 0.5,
    flexShrink: 0,
  }}
>
  {HEALTH_LEGEND.map((it) => (
    <Box
      key={it.name}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.6,
        minWidth: 0,
      }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: it.color }} />
      <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 10, whiteSpace: "nowrap" }}>
        {it.name}
      </Typography>
      <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 10, whiteSpace: "nowrap" }}>
        {pctFor(it.name)}%
      </Typography>
    </Box>
  ))}
</Box>

          </Box>
        </Box>

        {/* Threshold Ranges - Takes most of the space (80% of right sidebar) */}
        <Box
          sx={{
            flex: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#fff', 
              fontWeight: 500, 
              fontSize: 14,
              mb: 1,
              flexShrink: 0,
            }}
          >
            Threshold Ranges
          </Typography>
          
          <Divider 
            sx={{ 
              borderColor: 'rgba(255,255,255,0.2)', 
              mb: 1.5,
              flexShrink: 0,
            }} 
          />

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: 0.5,
              minHeight: 0,
              '&::-webkit-scrollbar': {
                width: '5px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '3px',
                '&:hover': {
                  background: 'rgba(255,255,255,0.3)',
                },
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { parameter: 'Alcohol', range: '0.02% - 0.05%' },
                { parameter: 'Heart Rate', range: '60 bpm - 90 bpm' },
                { parameter: 'Carbon Monoxide', range: '0.8 ppm - 2.0 ppm' },
                { parameter: 'Nitrogen Dioxide', range: '0.3 ppm - 0.8 ppm' },
                { parameter: 'Volatile Gas', range: '0.1 ppm - 0.4 ppm' },
                { parameter: 'Env. Temp', range: '25°C - 32°C' },
                { parameter: 'Object Temp', range: '29°C - 35°C' },
              ].map((item) => (
                <Box 
                  key={item.parameter} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,0.85)', 
                      fontSize: 12,
                      fontWeight: 400,
                      flex: 1,
                    }}
                  >
                    {item.parameter}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,0.65)', 
                      fontSize: 12,
                      fontWeight: 400,
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.range}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}