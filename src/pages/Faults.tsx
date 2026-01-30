// // src/pages/Faults.tsx
// import React, { useState, useEffect ,useRef  } from 'react'
// import {
//   Box,
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
//   Typography,
//   Divider,
// } from '@mui/material'
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
// import MainLayout from '../layout/MainLayout'
// import { fetchSmartHelmets, type SmartHelmet } from '../services/helmetService'

// /**
//  * We extend SmartHelmet with a _lastSeen timestamp so we can
//  * flip status to Inactive if more than 5 minutes have passed.
//  */
// interface FaultHelmet extends SmartHelmet {
//   _lastSeen: number
// }

// export default function Faults() {
//   // ─── Pagination & Filters ───────────────────────────
//   const [page, setPage]               = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const [searchTerm, setSearchTerm]   = useState('')
//   const [statusFilter, setStatusFilter] = useState<'All'|'Active'|'Inactive'>('All')

//   const initializedRef = useRef(false)

//   // ─── Data State ─────────────────────────────────────
//   const [helmets, setHelmets] = useState<FaultHelmet[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError]     = useState<string|null>(null)

//   // ─── 1) Initial fetch & polling ─────────────────────
//   // useEffect(() => {
//   //   let mounted = true
//   //   const load = async () => {
//   //     try {
//   //       const data = await fetchSmartHelmets()
//   //       if (!mounted) return

//   //       // stamp each reading with its timestamp
//   //       const stamped = data.map(h => ({
//   //         ...h,
//   //         _lastSeen: new Date(h.datetime).getTime(),
//   //       }))
//   //       setHelmets(stamped)
//   //     } catch (err: any) {
//   //       if (!mounted) return
//   //       setError(err.message)
//   //     } finally {
//   //       if (mounted) setLoading(false)
//   //     }
//   //   }

//   //   load()                   // first load
//   //   const iv = setInterval(load, 4000)
//   //   return () => {
//   //     mounted = false
//   //     clearInterval(iv)
//   //   }
//   // }, [])


//   useEffect(() => {
//   let mounted = true

//   const loadAndMerge = async () => {
//     try {
//       const data = await fetchSmartHelmets()
//       if (!mounted) return

//       setHelmets(prev => {
//         const prevMap = new Map(prev.map(h => [h.deviceId, h]))

//         return data.map(item => {
//           const ts = new Date(item.datetime).getTime()
//           const prevEntry = prevMap.get(item.deviceId)

//           // — Very first fetch or brand-new device —
//           if (!initializedRef.current || !prevEntry) {
//             return {
//               ...item,
//               _lastSeen:  ts,
//               // trust exactly what the service gave us initially:
//               status:     item.status,
//             }
//           }

//           // — Subsequent fetch —
//           if (item.datetime !== prevEntry.datetime) {
//             // New reading arrived → revive
//             return {
//               ...item,
//               _lastSeen:  ts,
//               status:     'Active',
//             }
//           }

//           // — No change → check staleness —
//           const ageMs = Date.now() - prevEntry._lastSeen
//           return {
//             ...item,
//             _lastSeen:  prevEntry._lastSeen,
//             status:     ageMs <= 4 * 60_000 ? 'Active' : 'Inactive',
//           }
//         })
//       })

//       initializedRef.current = true
//       setLoading(false)

//     } catch (err: any) {
//       if (!mounted) return
//       setError(err.message)
//       setLoading(false)
//     }
//   }

//   loadAndMerge()
//   const iv = setInterval(loadAndMerge, 4000)
//   return () => { mounted = false; clearInterval(iv) }

// }, [])


//   // ─── 2) Every minute, mark stale (>5 min) as Inactive ─
//   useEffect(() => {
//     const iv = setInterval(() => {
//       const now = Date.now()
//       setHelmets(prev =>
//         prev.map(h => ({
//           ...h,
//           status: now - h._lastSeen < 4 * 60_000 ? 'Active' : 'Inactive'
//         }))
//       )
//     }, 60_000)
//     return () => clearInterval(iv)
//   }, [])

//   // ─── Dummy health‑rotation (unchanged) ─────────────
//   const healthLabels = ['Healthy','Moderate','Critical']

//   // ─── Compute filtered + formatted rows ──────────────
//   const filteredRows = helmets
//     .map((h, idx) => ({
//       deviceId:        h.deviceId,
//       date:            new Date(h.datetime).toLocaleDateString('en-GB'),
//       alcohol:         `${h.alcohol} ppm`,
//       heartRate:       h.hrt,
//       carbonMonoxide:  `${h.carbonMonoxide} ppm`,
//       nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
//       volatileGas:     `${h.volatileGas} ppm`,
//       envTemp:         `${h.envTemp}°C`,
//       objectTemp:      `${h.objTemp}°C`,
//       status:          h.status,
//       // userHealth:      healthLabels[idx % healthLabels.length],
//       userHealth:
//         h.status === 'Inactive'
//           ? '—'
//           : healthLabels[idx % healthLabels.length],
//     }))
  

//     .filter(row => {
//   if (statusFilter !== 'All' && row.status !== statusFilter) return false

//   if (searchTerm) {
//     const q = searchTerm.toLowerCase()
//     return [
//       row.deviceId,
//       row.date,
//       row.alcohol,
//       row.heartRate,
//       row.carbonMonoxide,
//       row.nitrogenDioxide,
//       row.volatileGas,
//       row.envTemp,
//       row.objectTemp,
//       row.status,
//       row.userHealth,
//     ].some(f =>
//       // force everything to a string first
//       String(f)
//         .toLowerCase()
//         .includes(q)
//     )
//   }

//   return true
// })
//     .sort((a,b) => parseInt(a.deviceId,10) - parseInt(b.deviceId,10))

//   // ─── Handlers ───────────────────────────────────────
//   const handleChangePage        = (_:unknown, p:number) => setPage(p)
//   const handleChangeRowsPerPage = (e:React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(+e.target.value)
//     setPage(0)
//   }

//   return (
//     <MainLayout>
//       <Box
//         sx={{
//           display:'flex', alignItems:'flex-start',
//           pt:10, px:1.2, gap:2,
//           height:'calc(100vh - 90px)',
//           overflow:'hidden'
//         }}
//       >
        
//            {/* LEFT: 80% width */}
//         <Box
//           sx={{
//             flex: '0 0 80%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 1.5,
//           }}
//         >
        

//           {/* Smart Helmets table */}
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
//             {/* Header: title, search, filters */}
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
//                     setPage(0); // Reset to first page when searching
//                   }}
//                   sx={{
                    
//                       width: 200,
//                   '& .MuiOutlinedInput-root': { height: 32 },
//                   '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #333' },
//                   '& .MuiOutlinedInput-input': { color: '#fff', fontSize: 12, py: 0.5 }
//                   }}
//                 />
//                 <FormControl size="small" sx={{ minWidth: 120 }}>
//                   <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Project</InputLabel>
//                   <Select
//                     label="Project"
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
//                     MenuProps={{
//                       PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } },
//                     }}
//                   >
//                     <MenuItem value="all">All</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <FormControl size="small" sx={{ minWidth: 120 }}>
//                   <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Status</InputLabel>
//                   <Select
//                     label="Status"
//                     value={statusFilter}
//                     onChange={(e) => {
//                       setStatusFilter(e.target.value);
//                       setPage(0); // Reset to first page when filtering
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
//                     MenuProps={{
//                       PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } },
//                     }}
//                   >
//                     <MenuItem value="All">All</MenuItem>
//                     <MenuItem value="Active">Active</MenuItem>
//                     <MenuItem value="Inactive">Inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Box>

//             {/* Table + Pagination Container */}
//             <Box
//               sx={{
//                 flex: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 px: 1.5,
//                 py: 1,
//                 overflow: 'hidden',
//               }}
//             >
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
//                       '& .MuiTableCell-root': { 
//                         borderColor: 'rgba(255,255,255,0.1)',
//                         textAlign: 'center',
//                       },
//                       '&::-webkit-scrollbar': { width: '6px', height: '6px' },
//                       '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
//                       '&::-webkit-scrollbar-track': { background: 'transparent' },
//                     }}
//                   >
//                     <Table
//                       stickyHeader
//                       aria-label="helmets table"
//                       sx={{
//                         '& .MuiTableRow-root:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
//                       }}
//                     >
//                       <TableHead>
//                         <TableRow>
//                           {[
//                             'Device ID', 'Date', 'Alcohol', 'Heart Rate', 'Carbon Monoxide',
//                             'Nitrogen Dioxide', 'Volatile Gas', 'Env. Temp', 'Object Temp',
//                             'Status', 'User Health'
//                           ].map((h) => (
//                             <TableCell
//                               key={h}
//                               align="center"
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
//                             textAlign: 'center',
//                           },
//                           '& .MuiTableCell-body:first-of-type': { textAlign: 'center', paddingLeft: '16px' },
//                           '& .MuiTableCell-body:last-of-type': { textAlign: 'center', paddingRight: '16px' },
//                         }}
//                       >
//                         {filteredRows
//                           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                           .map((row, idx) => (
//                             <TableRow key={`${row.deviceId}-${idx}`} hover>
//                               <TableCell align="center"
//                               sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.deviceId}</TableCell>
//                               <TableCell
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.date}</TableCell>
//                               <TableCell 
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.alcohol}</TableCell>
//                               <TableCell
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.heartRate}</TableCell>
//                               <TableCell
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.carbonMonoxide}</TableCell>
//                               <TableCell sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.nitrogenDioxide}</TableCell>
//                               <TableCell
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.volatileGas}</TableCell>
//                               <TableCell
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.envTemp}</TableCell>
//                               <TableCell
//                                sx={{
//                                color: 'rgba(255,255,255,0.8)', 
//                               }}
//                               >{row.objectTemp}</TableCell>
//                               <TableCell sx={{
//                                 fontWeight: 500,
//                                 color: row.status === 'Active' ? '#4CAF50' : '#F44336'
//                               }}>
//                                 {row.status}
//                               </TableCell>
//                               <TableCell
//                                 align="center"
//                                 sx={{
//                                   fontWeight: 500,
//                                   color: row.userHealth === 'Healthy' ? '#4CAF50' :
//                                     row.userHealth === 'Moderate' ? '#FFC107' : '#F44336'
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

//         {/* ─── RIGHT: Sidebar (if you need pie/charts, reuse same pattern) ─ */}
//          <Box
//           sx={{
//             flex: '0 0 20%',
//             height: '100%',
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 1.5,
//             overflow: 'hidden',
//           }}
//         >
//           {/* Scrollable container for cards */}
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
            

//             {/* Helmet Stats Card */}

// <Box
//   sx={{
//     bgcolor: 'rgba(255,255,255,0.05)',
//     backdropFilter: 'blur(8px)',
//     border: '1px solid rgba(255,255,255,0.2)',
//     borderRadius: 2,
//     p: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     mb: 1.2,
//     minHeight: 100,
//   }}
// >
//   <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
//     Helmet Stats
//   </Typography>
  
//   {(() => {
    
//     const healthCounts = filteredRows.reduce((acc, row) => {
//       const h = row.userHealth;
//       if (h === '—') {
//         // don’t count inactive‐helmets’ blank health
//         return acc;
//       }
//       acc[h] = (acc[h] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

    
//     const totalHelmets = filteredRows.length;
//     const healthData = [
//       { 
//         name: "Healthy", 
//         value: healthCounts['Healthy'] || 0, 
//         percentage: totalHelmets ? Math.round((healthCounts['Healthy'] || 0) / totalHelmets * 100) : 0,
//         color: "#4CAF50" 
//       },
//       { 
//         name: "Moderate", 
//         value: healthCounts['Moderate'] || 0, 
//         percentage: totalHelmets ? Math.round((healthCounts['Moderate'] || 0) / totalHelmets * 100) : 0,
//         color: "#FFC107" 
//       },
//       { 
//         name: "Critical", 
//         value: healthCounts['Critical'] || 0, 
//         percentage: totalHelmets ? Math.round((healthCounts['Critical'] || 0) / totalHelmets * 100) : 0,
//         color: "#F44336" 
//       },
//     ].filter(item => item.value > 0);

//     return (
//       <Box sx={{
//         flex: 1,
//         position: 'relative',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
   
//         <Box sx={{ width: '100%', height: 160 }}>
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={healthData}
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={55} 
//                 outerRadius={75}  
//                 paddingAngle={2}
//                 dataKey="value"
//               >
//                 {healthData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>
//         </Box>

  
//         <Box sx={{
//           position: 'absolute',
//           top: '40%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           textAlign: 'center',
//           width: '100%' 
//         }}>
//           <Typography variant="h6" sx={{ 
//             color: '#fff', 
//             fontWeight: 500,
//             fontSize: '0.875rem',
//             lineHeight: 1.2
//           }}>
//             Total
//           </Typography>
//           <Typography variant="h4" sx={{ 
//             color: '#fff', 
//             fontWeight: 500, 
//             fontSize: 24,
//             lineHeight: 1.2
//           }}>
//             {totalHelmets}
//           </Typography>
//         </Box>

     
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           gap: 3,
//           mt: 1,
//           width: '100%',
//           overflow: 'hidden'
//         }}>
//           {healthData.map((item) => (
//             <Box key={item.name} sx={{ 
//               display: 'flex', 
//               flexDirection: 'column', 
//               alignItems: 'center',
//               flexShrink: 0 
//             }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Box sx={{ 
//                   width: 10, 
//                   height: 10, 
//                   borderRadius: '50%', 
//                   bgcolor: item.color 
//                 }} />
//                 <Typography variant="body2" sx={{ 
//                   color: '#fff',
//                    fontSize:12,
//                   whiteSpace: 'nowrap'
//                 }}>
//                   {item.name}
//                 </Typography>
//               </Box>
//               <Typography variant="body1" sx={{ 
//                 color: '#fff', 
//                 fontWeight: 500,
//                 fontSize:12,
//                 whiteSpace: 'nowrap' 
//               }}>
//                 {item.percentage}%
//               </Typography>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//     );
//   })()}
// </Box> 

          
//             {/* Threshold Ranges Card */}
// <Box
//   sx={{
//     bgcolor: 'rgba(255,255,255,0.05)',
//     backdropFilter: 'blur(8px)',
//     border: '1px solid rgba(255,255,255,0.2)',
//     borderRadius: 2,
//     p: 2,
//     display: 'flex',
//     flexDirection: 'column',
//     height: 193, // Fixed height
//     overflow: 'hidden', // Hide overflow
//   }}
// >
//   <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
//     Threshold Ranges
//   </Typography>
//   <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1.5, width: '100%' }} />
//   <Box 
//     sx={{ 
//       flex: 1,
//       overflowY: 'auto',
//       pr: 1,
//       '&::-webkit-scrollbar': { width: '6px' },
//       '&::-webkit-scrollbar-thumb': { 
//         background: '#333', 
//         borderRadius: '3px' 
//       },
//       '&::-webkit-scrollbar-track': { 
//         background: 'transparent' 
//       },
//     }}
//   >
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
//       {[
//         { parameter: 'Alcohol', range: '0.02% - 0.05%' },
//         { parameter: 'Heart Rate', range: '60 bpm - 90 bpm' },
//         { parameter: 'Carbon Monoxide', range: '0.8 ppm - 2.0 ppm' },
//         { parameter: 'Nitrogen Dioxide', range: '0.3 ppm - 0.8 ppm' },
//         { parameter: 'Volatile Gas', range: '0.1 ppm - 0.4 ppm' },
//         { parameter: 'Env. Temp', range: '25°C - 32°C' },
//         { parameter: 'Object Temp', range: '29°C - 35°C' },
//       ].map((item) => (
//         <Box key={item.parameter} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.875rem', flex: 1 }}>
//             {item.parameter}
//           </Typography>
//           <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
//             {item.range}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   </Box>
// </Box>
//           </Box>
//         </Box>
//       </Box>
//     </MainLayout>
//   )
// }


//today  pp//
// src/pages/Faults.tsx
// import React, { useMemo, useState } from "react";
// import {
//   Box,
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
//   Typography,
//   Divider,
//   Chip,
// } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import MainLayout from "../layout/MainLayout";

// type Row = {
//   deviceId: string;
//   date: string;
//   alcohol: string;
//   heartRate: string;
//   carbonMonoxide: string;
//   nitrogenDioxide: string;
//   volatileGas: string;
//   envTemp: string;
//   objectTemp: string;
//   status: "Active" | "Inactive";
//   userHealth: "Healthy" | "Moderate" | "Critical" | "—";
// };

// const dummyRows: Row[] = [
//   {
//     deviceId: "1001",
//     date: "31/12/2025",
//     alcohol: "0.03 ppm",
//     heartRate: "78",
//     carbonMonoxide: "1.2 ppm",
//     nitrogenDioxide: "0.6 ppm",
//     volatileGas: "0.2 ppm",
//     envTemp: "29°C",
//     objectTemp: "33°C",
//     status: "Active",
//     userHealth: "Healthy",
//   },
//   {
//     deviceId: "1002",
//     date: "31/12/2025",
//     alcohol: "0.05 ppm",
//     heartRate: "92",
//     carbonMonoxide: "2.4 ppm",
//     nitrogenDioxide: "0.9 ppm",
//     volatileGas: "0.5 ppm",
//     envTemp: "34°C",
//     objectTemp: "37°C",
//     status: "Active",
//     userHealth: "Critical",
//   },
//   {
//     deviceId: "1003",
//     date: "31/12/2025",
//     alcohol: "0.00 ppm",
//     heartRate: "—",
//     carbonMonoxide: "—",
//     nitrogenDioxide: "—",
//     volatileGas: "—",
//     envTemp: "—",
//     objectTemp: "—",
//     status: "Inactive",
//     userHealth: "—",
//   },
// ];

// export default function Faults() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");

//   const rows = useMemo(() => {
//     return dummyRows
//       .filter((r) => (statusFilter === "All" ? true : r.status === statusFilter))
//       .filter((r) => {
//         if (!searchTerm) return true;
//         const q = searchTerm.toLowerCase();
//         return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
//       })
//       .sort((a, b) => parseInt(a.deviceId, 10) - parseInt(b.deviceId, 10));
//   }, [searchTerm, statusFilter]);

//   const healthCounts = useMemo(() => {
//     return rows.reduce((acc, r) => {
//       if (r.userHealth === "—") return acc;
//       acc[r.userHealth] = (acc[r.userHealth] || 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);
//   }, [rows]);

//   const total = rows.length;
//   const healthData = [
//     { name: "Healthy", value: healthCounts["Healthy"] || 0, color: "#4CAF50" },
//     { name: "Moderate", value: healthCounts["Moderate"] || 0, color: "#FFC107" },
//     { name: "Critical", value: healthCounts["Critical"] || 0, color: "#F44336" },
//   ].filter((x) => x.value > 0);

//   return (
//     <MainLayout>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "flex-start",
//           pt: 10,
//           px: 1.2,
//           gap: 2,
//           height: "calc(100vh - 90px)",
//           overflow: "hidden",
//         }}
//       >
//         {/* LEFT */}
//         <Box sx={{ flex: "0 0 80%", height: "100%", display: "flex", flexDirection: "column", gap: 1.5 }}>
//           <Box
//             sx={{
//               flex: 1,
//               display: "flex",
//               flexDirection: "column",
//               bgcolor: "rgba(255,255,255,0.05)",
//               backdropFilter: "blur(8px)",
//               border: "1px solid rgba(255,255,255,0.2)",
//               borderRadius: 2,
//               overflow: "hidden",
//             }}
//           >
//             {/* Header */}
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 px: 2,
//                 py: 1,
//                 borderBottom: "1px solid rgba(255,255,255,0.2)",
//                 gap: 2,
//                 flexWrap: "wrap",
//               }}
//             >
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
//                   Faults
//                 </Typography>
//                 <Chip
//                   size="small"
//                   label="Placeholder (No live data)"
//                   sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}
//                 />
//               </Box>

//               <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
//                     "& .MuiOutlinedInput-root": { height: 32 },
//                     "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #333" },
//                     "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 12, py: 0.5 },
//                   }}
//                 />

//                 <FormControl size="small" sx={{ minWidth: 120 }}>
//                   <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Status</InputLabel>
//                   <Select
//                     label="Status"
//                     value={statusFilter}
//                     onChange={(e) => {
//                       setStatusFilter(e.target.value as any);
//                       setPage(0);
//                     }}
//                     sx={{
//                       bgcolor: "#1C1C1E",
//                       color: "#fff",
//                       border: "1px solid #333",
//                       borderRadius: 1,
//                       height: 32,
//                       fontSize: 12,
//                       "& .MuiSelect-select": { py: 0.5, px: 1 },
//                       "& .MuiSelect-icon": { color: "#888", fontSize: 16 },
//                     }}
//                     MenuProps={{
//                       PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } },
//                     }}
//                   >
//                     <MenuItem value="All">All</MenuItem>
//                     <MenuItem value="Active">Active</MenuItem>
//                     <MenuItem value="Inactive">Inactive</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Box>
//             </Box>

//             {/* Table */}
//             <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1.5, py: 1, overflow: "hidden" }}>
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   flex: 1,
//                   bgcolor: "transparent",
//                   boxShadow: "none",
//                   overflow: "auto",
//                   "& .MuiTableCell-root": { borderColor: "rgba(255,255,255,0.1)", textAlign: "center" },
//                   "&::-webkit-scrollbar": { width: "6px", height: "6px" },
//                   "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
//                   "&::-webkit-scrollbar-track": { background: "transparent" },
//                 }}
//               >
//                 <Table stickyHeader aria-label="faults-table">
//                   <TableHead>
//                     <TableRow>
//                       {[
//                         "Device ID",
//                         "Date",
//                         "Alcohol",
//                         "Heart Rate",
//                         "Carbon Monoxide",
//                         "Nitrogen Dioxide",
//                         "Volatile Gas",
//                         "Env. Temp",
//                         "Object Temp",
//                         "Status",
//                         "User Health",
//                       ].map((h) => (
//                         <TableCell
//                           key={h}
//                           align="center"
//                           sx={{
//                             backgroundColor: "rgba(40,40,45,1)",
//                             color: "rgba(255,255,255,0.9)",
//                             fontSize: "0.75rem",
//                             fontWeight: 500,
//                             padding: "8px 12px",
//                             borderBottom: "1px solid rgba(255,255,255,0.2)",
//                             position: "sticky",
//                             top: 0,
//                             zIndex: 2,
//                           }}
//                         >
//                           {h}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>

//                   <TableBody
//                     sx={{
//                       "& .MuiTableCell-body": {
//                         fontSize: "0.75rem",
//                         padding: "8px 6px",
//                         borderBottom: "1px solid rgba(255,255,255,0.05)",
//                       },
//                     }}
//                   >
//                     {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, i) => (
//                       <TableRow key={`${r.deviceId}-${i}`} hover>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.deviceId}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.date}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.alcohol}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.heartRate}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.carbonMonoxide}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.nitrogenDioxide}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.volatileGas}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.envTemp}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.objectTemp}</TableCell>

//                         <TableCell sx={{ color: r.status === "Active" ? "#4CAF50" : "#F44336", fontWeight: 500 }}>
//                           {r.status}
//                         </TableCell>

//                         <TableCell
//                           sx={{
//                             color:
//                               r.userHealth === "Healthy"
//                                 ? "#4CAF50"
//                                 : r.userHealth === "Moderate"
//                                 ? "#FFC107"
//                                 : r.userHealth === "Critical"
//                                 ? "#F44336"
//                                 : "rgba(255,255,255,0.5)",
//                             fontWeight: 500,
//                           }}
//                         >
//                           {r.userHealth}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <TablePagination
//                 rowsPerPageOptions={[5, 10, 25]}
//                 component="div"
//                 count={rows.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={(_, p) => setPage(p)}
//                 onRowsPerPageChange={(e) => {
//                   setRowsPerPage(+e.target.value);
//                   setPage(0);
//                 }}
//                 sx={{
//                   color: "#fff",
//                   borderTop: "1px solid rgba(255,255,255,0.2)",
//                   px: 2,
//                   "& .MuiTablePagination-selectIcon": { color: "#fff" },
//                 }}
//               />
//             </Box>
//           </Box>
//         </Box>

//         {/* RIGHT */}
//         <Box sx={{ flex: "0 0 20%", height: "100%", display: "flex", flexDirection: "column", gap: 1.5, overflow: "hidden" }}>
//           <Box
//             sx={{
//               height: "100%",
//               overflowY: "auto",
//               pr: 1,
//               "&::-webkit-scrollbar": { width: "6px" },
//               "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
//               "&::-webkit-scrollbar-track": { background: "transparent" },
//             }}
//           >
//             {/* Helmet Stats */}
//             <Box
//               sx={{
//                 bgcolor: "rgba(255,255,255,0.05)",
//                 backdropFilter: "blur(8px)",
//                 border: "1px solid rgba(255,255,255,0.2)",
//                 borderRadius: 2,
//                 p: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 mb: 1.2,
//                 minHeight: 100,
//               }}
//             >
//               <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: "#fff" }}>
//                 Helmet Stats
//               </Typography>

//               <Box sx={{ position: "relative" }}>
//                 <Box sx={{ width: "100%", height: 160 }}>
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie data={healthData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
//                         {healthData.map((entry, idx) => (
//                           <Cell key={idx} fill={entry.color} />
//                         ))}
//                       </Pie>
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </Box>

//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: "40%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     textAlign: "center",
//                     width: "100%",
//                   }}
//                 >
//                   <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500, fontSize: "0.875rem" }}>
//                     Total
//                   </Typography>
//                   <Typography variant="h4" sx={{ color: "#fff", fontWeight: 500, fontSize: 24 }}>
//                     {total}
//                   </Typography>
//                 </Box>

//                 <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 1, width: "100%" }}>
//                   {healthData.map((item) => {
//                     const pct = total ? Math.round((item.value / total) * 100) : 0;
//                     return (
//                       <Box key={item.name} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                           <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
//                           <Typography variant="body2" sx={{ color: "#fff", fontSize: 12, whiteSpace: "nowrap" }}>
//                             {item.name}
//                           </Typography>
//                         </Box>
//                         <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500, fontSize: 12 }}>
//                           {pct}%
//                         </Typography>
//                       </Box>
//                     );
//                   })}
//                 </Box>
//               </Box>
//             </Box>

//             {/* Threshold Ranges */}
//             <Box
//               sx={{
//                 bgcolor: "rgba(255,255,255,0.05)",
//                 backdropFilter: "blur(8px)",
//                 border: "1px solid rgba(255,255,255,0.2)",
//                 borderRadius: 2,
//                 p: 2,
//                 display: "flex",
//                 flexDirection: "column",
//                 height: 193,
//                 overflow: "hidden",
//               }}
//             >
//               <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 500, fontSize: "1rem" }}>
//                 Threshold Ranges
//               </Typography>
//               <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1.5, width: "100%" }} />
//               <Box
//                 sx={{
//                   flex: 1,
//                   overflowY: "auto",
//                   pr: 1,
//                   "&::-webkit-scrollbar": { width: "6px" },
//                   "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
//                   "&::-webkit-scrollbar-track": { background: "transparent" },
//                 }}
//               >
//                 <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
//                   {[
//                     { parameter: "Alcohol", range: "0.02% - 0.05%" },
//                     { parameter: "Heart Rate", range: "60 bpm - 90 bpm" },
//                     { parameter: "Carbon Monoxide", range: "0.8 ppm - 2.0 ppm" },
//                     { parameter: "Nitrogen Dioxide", range: "0.3 ppm - 0.8 ppm" },
//                     { parameter: "Volatile Gas", range: "0.1 ppm - 0.4 ppm" },
//                     { parameter: "Env. Temp", range: "25°C - 32°C" },
//                     { parameter: "Object Temp", range: "29°C - 35°C" },
//                   ].map((item) => (
//                     <Box key={item.parameter} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <Typography variant="body2" sx={{ color: "#fff", fontSize: "0.875rem", flex: 1 }}>
//                         {item.parameter}
//                       </Typography>
//                       <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", fontWeight: 500 }}>
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
//     </MainLayout>
//   );
// }


import  { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
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
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import MainLayout from "../layout/MainLayout";
import {
  fetchSmartHelmets,
  getDefaultHelmetIds,
  type SmartHelmet,
} from "../services/helmetService";

type StatusFilter = "All" | "Active" | "Inactive";

type Row = {
  deviceId: string;
  date: string;
  alcohol: string;
  heartRate: string | number;
  carbonMonoxide: string;
  nitrogenDioxide: string;
  volatileGas: string;
  envTemp: string;
  objectTemp: string;
  status: "Active" | "Inactive";
  userHealth: "Healthy" | "—";
};

export default function Faults() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Same source of truth as Dashboard (01..300 by default)
  const helmetIdsRef = useRef<string[]>(getDefaultHelmetIds(300));

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchSmartHelmets(helmetIdsRef.current, {
          concurrency: 12,
        });
        if (!mounted) return;
        setHelmets(data);
        setError(null);
        setLoading(false);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : "Failed to load faults data"
        );
        setLoading(false);
      }
    };

    load();
    const iv = setInterval(load, 4000); // keep in sync with your dashboard refresh
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  const rows: Row[] = useMemo(() => {
    return helmets.map((h) => {
      const d = h.datetime ? new Date(h.datetime) : new Date();
      const dateStr = isNaN(d.getTime())
        ? "—"
        : d.toLocaleDateString("en-GB");

      return {
        deviceId: h.deviceId,
        date: dateStr,
        alcohol: `${h.alcohol} ppm`,
        heartRate: h.hrt ?? "—",
        carbonMonoxide: `${h.carbonMonoxide} ppm`,
        nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
        volatileGas: `${h.volatileGas} ppm`,
        envTemp: `${h.envTemp}°C`,
        objectTemp: `${h.objTemp}°C`,
        status: h.status,
        // ✅ As you asked: always Healthy for live rows (only if Active)
        userHealth: h.status === "Active" ? "Healthy" : "—",
      };
    });
  }, [helmets]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return rows
      .filter((r) => {
        if (statusFilter !== "All" && r.status !== statusFilter) return false;
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

  const healthCounts = useMemo(() => {
    return filteredRows.reduce((acc, r) => {
      if (r.userHealth === "—") return acc;
      acc[r.userHealth] = (acc[r.userHealth] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredRows]);

  const total = filteredRows.length;

  const healthData = useMemo(() => {
    const healthy = healthCounts["Healthy"] || 0;

    const items = [{ name: "Healthy", value: healthy, color: "#4CAF50" }].filter(
      (x) => x.value > 0
    );

    // If nothing is "Healthy", still show a ring so chart doesn't disappear
    return items.length
      ? items
      : [{ name: "Healthy", value: 1, color: "#4CAF50" }];
  }, [healthCounts]);

  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          pt: 10,
          px: 1.2,
          gap: 2,
          height: "calc(100vh - 90px)",
          overflow: "hidden",
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            flex: "0 0 80%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              bgcolor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
                  Faults
                </Typography>

                <Chip
                  size="small"
                  label={loading ? "Loading…" : error ? "Error" : "Live data"}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  sx={{
                    width: 200,
                    "& .MuiOutlinedInput-root": { height: 32 },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #333",
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "#fff",
                      fontSize: 12,
                      py: 0.5,
                    },
                  }}
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>
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
                      bgcolor: "#1C1C1E",
                      color: "#fff",
                      border: "1px solid #333",
                      borderRadius: 1,
                      height: 32,
                      fontSize: 12,
                      "& .MuiSelect-select": { py: 0.5, px: 1 },
                      "& .MuiSelect-icon": { color: "#888", fontSize: 16 },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: "#28282B", color: "#fff" },
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

            {/* Table */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                px: 1.5,
                py: 1,
                overflow: "hidden",
              }}
            >
              {loading && (
                <Typography sx={{ color: "#fff", px: 1 }}>
                  Loading…
                </Typography>
              )}
              {error && (
                <Typography sx={{ color: "#F44336", px: 1 }}>
                  {error}
                </Typography>
              )}

              {!loading && !error && (
                <>
                  <TableContainer
                    component={Paper}
                    sx={{
                      flex: 1,
                      bgcolor: "transparent",
                      boxShadow: "none",
                      overflow: "auto",
                      "& .MuiTableCell-root": {
                        borderColor: "rgba(255,255,255,0.1)",
                        textAlign: "center",
                      },
                      "&::-webkit-scrollbar": { width: "6px", height: "6px" },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#333",
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-track": { background: "transparent" },
                    }}
                  >
                    <Table stickyHeader aria-label="faults-table">
                      <TableHead>
                        <TableRow>
                          {[
                            "Device ID",
                            "Date",
                            "Alcohol",
                            "Heart Rate",
                            "Carbon Monoxide",
                            "Nitrogen Dioxide",
                            "Volatile Gas",
                            "Env. Temp",
                            "Object Temp",
                            "Status",
                            "User Health",
                          ].map((h) => (
                            <TableCell
                              key={h}
                              align="center"
                              sx={{
                                backgroundColor: "rgba(40,40,45,1)",
                                color: "rgba(255,255,255,0.9)",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                padding: "8px 12px",
                                borderBottom:
                                  "1px solid rgba(255,255,255,0.2)",
                                position: "sticky",
                                top: 0,
                                zIndex: 2,
                              }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      <TableBody
                        sx={{
                          "& .MuiTableCell-body": {
                            fontSize: "0.75rem",
                            padding: "8px 6px",
                            borderBottom:
                              "1px solid rgba(255,255,255,0.05)",
                          },
                        }}
                      >
                        {filteredRows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((r, i) => (
                            <TableRow key={`${r.deviceId}-${i}`} hover>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.deviceId}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.date}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.alcohol}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.heartRate}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.carbonMonoxide}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.nitrogenDioxide}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.volatileGas}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.envTemp}
                              </TableCell>
                              <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>
                                {r.objectTemp}
                              </TableCell>

                              <TableCell
                                sx={{
                                  color:
                                    r.status === "Active" ? "#4CAF50" : "#F44336",
                                  fontWeight: 500,
                                }}
                              >
                                {r.status}
                              </TableCell>

                              <TableCell
                                sx={{
                                  color:
                                    r.userHealth === "Healthy"
                                      ? "#4CAF50"
                                      : "rgba(255,255,255,0.5)",
                                  fontWeight: 500,
                                }}
                              >
                                {r.userHealth}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(+e.target.value);
                      setPage(0);
                    }}
                    sx={{
                      color: "#fff",
                      borderTop: "1px solid rgba(255,255,255,0.2)",
                      px: 2,
                      "& .MuiTablePagination-selectIcon": { color: "#fff" },
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            flex: "0 0 20%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
            }}
          >
            {/* Helmet Stats */}
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 2,
                p: 1,
                display: "flex",
                flexDirection: "column",
                mb: 1.2,
                minHeight: 100,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: "#fff" }}>
                Helmet Stats
              </Typography>

              <Box sx={{ position: "relative" }}>
                <Box sx={{ width: "100%", height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={healthData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {healthData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: "0.875rem" }}>
                    Total
                  </Typography>
                  <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 24 }}>
                    {total}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 1, width: "100%" }}>
                  {healthData.map((item) => {
                    const pct = total ? Math.round((item.value / total) * 100) : 0;
                    return (
                      <Box key={item.name} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
                          <Typography sx={{ color: "#fff", fontSize: 12, whiteSpace: "nowrap" }}>
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 12 }}>
                          {pct}%
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Threshold Ranges (unchanged) */}
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 193,
                overflow: "hidden",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: "1rem" }}>
                Threshold Ranges
              </Typography>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 1.5, width: "100%" }} />

              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {[
                    { parameter: "Alcohol", range: "0.02% - 0.05%" },
                    { parameter: "Heart Rate", range: "60 bpm - 90 bpm" },
                    { parameter: "Carbon Monoxide", range: "0.8 ppm - 2.0 ppm" },
                    { parameter: "Nitrogen Dioxide", range: "0.3 ppm - 0.8 ppm" },
                    { parameter: "Volatile Gas", range: "0.1 ppm - 0.4 ppm" },
                    { parameter: "Env. Temp", range: "25°C - 32°C" },
                    { parameter: "Object Temp", range: "29°C - 35°C" },
                  ].map((item) => (
                    <Box
                      key={item.parameter}
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                      <Typography sx={{ color: "#fff", fontSize: "0.875rem", flex: 1 }}>
                        {item.parameter}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", fontWeight: 500 }}>
                        {item.range}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
