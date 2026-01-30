// // src/pages/Dashboard.tsx
// import React, { useState, useEffect, useRef  } from 'react'
// import {
//   Box,
  
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
// import { useQuery, useSubscription } from '@apollo/client'
// import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
// import EngineeringIcon from '@mui/icons-material/Engineering'
// import MainLayout from '../layout/MainLayout'
// // import jwt_decode from 'jwt-decode'
// import { jwtDecode } from 'jwt-decode';


// import { LIST_HELMETS }     from '../graphql/queries'
// import { ON_UPDATE_HELMET } from '../graphql/subscriptions'

// type RawGQLHelmet = {
//   Device_ID: string
//   datetime: string
//   ALCOHOL: string
//   CARBON_MONOXIDE: string
//   NITROGEN_DIOXIDE: string
//   VOLATILE_GAS: string
//   Env_temp: string
//   Obj_temp: string
//   Hrt: string
//   Helmet_Status: string
// }

// interface DashboardHelmet {
//   deviceId:        string
//   datetime:        string
//   alcohol:         number
//   carbonMonoxide:  number
//   nitrogenDioxide: number
//   volatileGas:     number
//   envTemp:         number
//   objTemp:         number
//   heartRate:       number
//   status:          'Active' | 'Inactive'
//   _lastSeen:       number
// }

// export default function Dashboard() {
//   // pagination + filters
//   const [page, setPage]           = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const [searchTerm, ]   = useState('')
//   const [statusFilter] = useState<'All'|'Active'|'Inactive'>('All')

//   const initializedRef = useRef(false)

//   // our live state of helmets
//   const [helmets, setHelmets] = useState<DashboardHelmet[]>([])

//   const { data, loading, error } = useQuery<{ listSmartHelmets: { items: RawGQLHelmet[] } }>(
//    LIST_HELMETS,
//    {
//      pollInterval: 4_000,         // re‐run every 4s
//      fetchPolicy: 'network-only'  // always go to the server
//    }
//  )

//   const [userName, setUserName] = useState<string>('')

//   useEffect(() => {
//     const token = localStorage.getItem('idToken')
//     if (!token) return

//     // jwt_decode is now the function itself
//     const payload: any = jwtDecode(token)
//     setUserName(
//       payload.preferred_username   // your custom username
//       || payload.email             // fallback
//       || ''
//     )
//   }, [])

//   // map the query result into our DashboardHelmet[], stamping `_lastSeen`
//   // useEffect(() => {
//   //   if (data?.listSmartHelmets?.items) {
//   //     const mapped = data.listSmartHelmets.items.map<DashboardHelmet>(h => ({
//   //       deviceId:        h.Device_ID,
//   //       datetime:        h.datetime,
//   //       alcohol:         parseFloat(h.ALCOHOL),
//   //       carbonMonoxide:  parseFloat(h.CARBON_MONOXIDE),
//   //       nitrogenDioxide: parseFloat(h.NITROGEN_DIOXIDE),
//   //       volatileGas:     parseFloat(h.VOLATILE_GAS),
//   //       envTemp:         parseFloat(h.Env_temp),
//   //       objTemp:         parseFloat(h.Obj_temp),
//   //       heartRate:       parseInt(h.Hrt,10),
//   //       // status:          h.Helmet_Status === 'Active' ? 'Active' : 'Inactive',
//   //       status:     'Active',   
//   //       _lastSeen:       new Date(h.datetime).getTime(),
//   //     }))
//   //     setHelmets(mapped)
//   //   }
//   // }, [data])

//   useEffect(() => {
//   if (!data?.listSmartHelmets?.items) return

//   setHelmets(prev => {
//     const prevMap = new Map(prev.map(h => [h.deviceId, h]))

//     return data.listSmartHelmets.items.map(item => {
//       // 1) parse the raw fields
//       const ts = new Date(item.datetime).getTime()
//       const parsed: Omit<DashboardHelmet, 'status' | '_lastSeen'> = {
//         deviceId:        item.Device_ID,
//         datetime:        item.datetime,
//         alcohol:         parseFloat(item.ALCOHOL),
//         carbonMonoxide:  parseFloat(item.CARBON_MONOXIDE),
//         nitrogenDioxide: parseFloat(item.NITROGEN_DIOXIDE),
//         volatileGas:     parseFloat(item.VOLATILE_GAS),
//         envTemp:         parseFloat(item.Env_temp),
//         objTemp:         parseFloat(item.Obj_temp),
//         heartRate:       parseInt(item.Hrt, 10),
//       }

//       const prevEntry = prevMap.get(item.Device_ID)

//       // —— FIRST EVER FETCH or brand-new device —— 
//       if (!initializedRef.current || !prevEntry) {
//         return {
//           ...parsed,
//           status:    item.Helmet_Status === 'Active' ? 'Active' : 'Inactive',
//           _lastSeen: ts,
//         }
//       }

//       // —— SUBSEQUENT FETCH —— compare the new datetime stamp
//       if (item.datetime !== prevEntry.datetime) {
//         // “New reading arrived” → revive to Active
//         return {
//           ...parsed,
//           status:    'Active',
//           _lastSeen: ts,
//         }
//       }

//       // —— NO CHANGE —— stale check against _lastSeen
//       const ageMs     = Date.now() - prevEntry._lastSeen
//       const newStatus: DashboardHelmet['status'] =
//         ageMs <= 4 * 60_000  // 4 minutes
//           ? 'Active'
//           : 'Inactive'

//       return {
//         ...parsed,
//         status:    newStatus,
//         _lastSeen: prevEntry._lastSeen,
//       }
//     })
//   })

//   initializedRef.current = true
// }, [data])


//   // 2) subscribe to live updates and splice them into our local state
//   useSubscription<{ onUpdateSmartHelmet: RawGQLHelmet }>(
//     ON_UPDATE_HELMET,
//     {
//       onSubscriptionData: ({ subscriptionData }) => {
//         const h = subscriptionData.data!.onUpdateSmartHelmet
//         const ts = new Date(h.datetime).getTime()
//         setHelmets(prev => {
//           const updated: DashboardHelmet = {
//             deviceId:        h.Device_ID,
//             datetime:        h.datetime,
//             alcohol:         parseFloat(h.ALCOHOL),
//             carbonMonoxide:  parseFloat(h.CARBON_MONOXIDE),
//             nitrogenDioxide: parseFloat(h.NITROGEN_DIOXIDE),
//             volatileGas:     parseFloat(h.VOLATILE_GAS),
//             envTemp:         parseFloat(h.Env_temp),
//             objTemp:         parseFloat(h.Obj_temp),
//             heartRate:       parseInt(h.Hrt,10),
//             status:          'Active',   // an incoming update always revives it
//             _lastSeen:       ts,
//           }
//           const found = prev.find(x => x.deviceId === updated.deviceId)
//           return found
//             ? prev.map(x => x.deviceId === updated.deviceId ? updated : x)
//             : [updated, ...prev]
//         })
//       }
//     }
//   )

//   // 3) every minute, sweep and mark stale (>5 min) helmets Inactive
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

//   // derived stats
//   const activeCount   = helmets.filter(h => h.status === 'Active').length
//   const inactiveCount = helmets.filter(h => h.status === 'Inactive').length
//   const totalUsers    = Array.from(new Set(helmets.map(h => h.deviceId))).length

//   // filter + format for display (exactly your existing code)
//   const healthLabels = ['Healthy','Moderate','Critical']

//   const rows = helmets
//     .map((h,i) => ({
//       deviceId:        h.deviceId,
//       date:            new Date(h.datetime).toLocaleDateString('en-GB'),
//       alcohol:         `${h.alcohol} ppm`,
//       heartRate:       h.heartRate.toString(),
//       carbonMonoxide:  `${h.carbonMonoxide} ppm`,
//       nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
//       volatileGas:     `${h.volatileGas} ppm`,
//       envTemp:         `${h.envTemp}°C`,
//       objectTemp:      `${h.objTemp}°C`,
//       status:          h.status,
//       // userHealth:      healthLabels[i % healthLabels.length],
//       userHealth:
//         h.status === 'Inactive'
//           ? '—'
//           : healthLabels[i % healthLabels.length],
//     }))
//     .filter(r => (
//       (statusFilter === 'All' || r.status === statusFilter) &&
//       (searchTerm === '' || [
//         r.deviceId, r.date, r.alcohol, r.heartRate,
//         r.carbonMonoxide, r.nitrogenDioxide,
//         r.volatileGas, r.envTemp, r.objectTemp,
//         r.status, r.userHealth
//       ].some(f => f.toLowerCase().includes(searchTerm.toLowerCase())))
//     ))
//     .sort((a,b) => parseInt(a.deviceId,10) - parseInt(b.deviceId,10))

//   // pagination handlers
//   const handleChangePage = (_:unknown, p:number) => setPage(p)
//   const handleChangeRows = (e:React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(+e.target.value)
//     setPage(0)
//   }

//   return (
//     <MainLayout>
//       <Box sx={{
//         display:'flex', alignItems:'flex-start',
//         pt:10, px:1.2, gap:2,
//         height:'calc(100vh - 90px)',
//         overflow:'hidden'
//       }}>
//         {/* ─── LEFT 80% ─── */}
//         <Box sx={{
//           flex:'0 0 80%', height:'100%',
//           display:'flex', flexDirection:'column', gap:1.5
//         }}>
//           {/** your two summary cards (Customer & Active/Inactive) **/}
//           <Box sx={{ display:'flex', gap:1.5 }}>
//             {/* … unchanged … */}
//             <Box sx={{
//               flex:1, height:80, display:'flex', alignItems:'center', px:2,
//               bgcolor:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)',
//               border:'1px solid rgba(255,255,255,0.2)', borderRadius:2
//             }}>
//               <EngineeringIcon sx={{ color:'#fff', fontSize:24 }} />
//               <Box sx={{ ml:2 }}>
               

//                 <Typography variant="body2" sx={{ color:'#fff', fontWeight:500, }}>
//                   Welcome — {userName || '…'}
//                 </Typography>

//                 <Divider sx={{ borderColor:'rgba(255,255,255,0.2)', my:0.5, width:300 }} />
//                 <Typography variant="h6" sx={{ color:'#FFD600', fontSize:16 }}>
//                   Total Helmets — {helmets.length}
//                 </Typography>
//               </Box>
//             </Box>
//             <Box sx={{
//               flex:2, height:80, display:'flex', alignItems:'center',
//               bgcolor:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)',
//               border:'1px solid rgba(255,255,255,0.2)', borderRadius:2
//             }}>
//               {[
//                 { label:'Active Helmets',   value:activeCount   },
//                 { label:'Inactive Helmets', value:inactiveCount },
//                 { label:'Total Users',      value:totalUsers    },
//               ].map((s,i)=>
//                 <Box key={s.label} sx={{
//                   flex:1, textAlign:'center',
//                   ...(i>0 && { borderLeft:'1px solid rgba(255,255,255,0.2)' })
//                 }}>
//                   <Typography variant="body2" sx={{ color:'rgba(255,255,255,0.7)' }}>
//                     {s.label}
//                   </Typography>
//                   <Typography variant="h6" sx={{ color:'#fff' }}>
//                     {s.value}
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//           </Box>

//           {/** your table with filters, search, pagination, etc. **/}
//           <Box sx={{
//             flex:1, display:'flex', flexDirection:'column',
//             bgcolor:'rgba(255,255,255,0.05)', backdropFilter:'blur(8px)',
//             border:'1px solid rgba(255,255,255,0.2)', borderRadius:2,
//             overflow:'hidden'
//           }}>
//             {/* … header, filters … unchanged … */}

//             <Box sx={{ flex:1, display:'flex', flexDirection:'column', px:1.5, py:1, overflow:'hidden' }}>
//               {loading && <Typography color="#fff">Loading…</Typography>}
//               {error   && <Typography color="error">{error.message}</Typography>}
//               {!loading && !error && (
//                 <>
//                   <TableContainer component={Paper} sx={{
//                     flex:1, bgcolor:'transparent', boxShadow:'none', overflow:'auto',
//                     '& .MuiTableCell-root': { borderColor:'rgba(255,255,255,0.1)', textAlign:'center' },
//                     '&::-webkit-scrollbar':{ width:'6px' }, '&::-webkit-scrollbar-thumb':{ background:'#333' }
//                   }}>
//                     <Table stickyHeader>
//                       <TableHead>
//                         <TableRow>
//                           {[
//                             'Device ID','Date','Alcohol','Heart Rate','Carbon Monoxide',
//                             'Nitrogen Dioxide','Volatile Gas','Env. Temp','Object Temp',
//                             'Status','User Health'
//                           ].map(h=>(
//                             <TableCell key={h} align="center" sx={{
//                               backgroundColor:'rgba(40,40,45,1)',
//                               color:'rgba(255,255,255,0.9)',
//                               fontSize:'0.75rem', fontWeight:500,
//                               padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.2)',
//                               position:'sticky', top:0, zIndex:2
//                             }}>
//                               {h}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody sx={{
//                         '& .MuiTableCell-body':{
//                           fontSize:'0.75rem', padding:'8px 6px',
//                           borderBottom:'1px solid rgba(255,255,255,0.05)'
//                         }
//                       }}>
//                         {rows.slice(page*rowsPerPage, page*rowsPerPage+rowsPerPage)
//                           .map((r,i)=>(
//                             <TableRow key={`${r.deviceId}-${i}`} hover>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.deviceId}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.date}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.alcohol}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.heartRate}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.carbonMonoxide}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.nitrogenDioxide}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.volatileGas}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.envTemp}</TableCell>
//                               <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.objectTemp}</TableCell>
//                               <TableCell sx={{ color:r.status==='Active'?'#4CAF50':'#F44336', fontWeight:500 }}>
//                                 {r.status}
//                               </TableCell>
//                               <TableCell sx={{
//                                 color: r.userHealth==='Healthy'  ? '#4CAF50'
//                                       : r.userHealth==='Moderate' ? '#FFC107'
//                                       : '#F44336',
//                                 fontWeight:500
//                               }}>
//                                 {r.userHealth}
//                               </TableCell>
//                             </TableRow>
//                           ))
//                         }
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   <TablePagination
//                     rowsPerPageOptions={[5,10,25]}
//                     component="div"
//                     count={rows.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRows}
//                     sx={{
//                       color:'#fff', borderTop:'1px solid rgba(255,255,255,0.2)', px:2,
//                       '& .MuiTablePagination-selectIcon':{ color:'#fff' }
//                     }}
//                   />
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Box>

//         {/* ─── RIGHT 20% sidebar cards … unchanged … ─── */}

//                 <Box
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

//     // const healthCounts = rows.reduce((acc, row) => {
//     //   acc[row.userHealth] = (acc[row.userHealth] || 0) + 1;
//     //   return acc;
//     // }, {} as Record<string, number>);

//      const healthCounts = rows
//     .filter(r => r.userHealth !== '—')
//     .reduce((acc, r) => {
//       acc[r.userHealth] = (acc[r.userHealth]||0) + 1;
//       return acc;
//     }, {} as Record<string,number>);
    
//     const totalHelmets = rows.length;
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


// src/pages/Dashboard.tsx
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
// import MainLayout from '../layout/MainLayout';
// import { fetchSmartHelmets, type SmartHelmet, getDefaultHelmetIds } from '../services/helmetService';

// type StatusFilter = 'All' | 'Active' | 'Inactive';

// export default function Dashboard() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

//   const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

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
//     return helmets.map((h, idx) => ({
//       deviceId: h.deviceId,
//       date: new Date(h.datetime).toLocaleDateString('en-GB'),
//       alcohol: `${h.alcohol} ppm`,
//       heartRate: h.hrt,
//       carbonMonoxide: `${h.carbonMonoxide} ppm`,
//       nitrogenDioxide: `${h.nitrogenDioxide} ppm`,
//       volatileGas: `${h.volatileGas} ppm`,
//       envTemp: `${h.envTemp}°C`,
//       objectTemp: `${h.objTemp}°C`,
//       status: h.status,
//       userHealth: h.status === 'Inactive' ? '—' : healthLabels[idx % healthLabels.length],
//     }));
//   }, [helmets]);

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
//     <MainLayout>
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'flex-start',
//           pt: 10,
//           px: 1.2,
//           gap: 2,
//           height: 'calc(100vh - 90px)',
//           overflow: 'hidden',
//         }}
//       >
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
//           {/* Top summary (optional but matches screenshot vibe) */}
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
//     </MainLayout>
//   );
// }




//
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
import MainLayout from '../layout/MainLayout';
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

  return (
    <MainLayout>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          pt: 10,
          px: 1.2,
          gap: 2,
          height: 'calc(100vh - 90px)',
          overflow: 'hidden',
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            flex: '0 0 80%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          {/* Top summary */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              bgcolor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Active Helmets</Typography>
              <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>{totals.active}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Inactive Helmets</Typography>
              <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>{totals.inactive}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Total Helmets</Typography>
              <Typography sx={{ color: '#fff', fontSize: 24, fontWeight: 500 }}>{totals.total}</Typography>
            </Box>
          </Box>

          {/* Main table card */}
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
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                borderBottom: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
                Smart Helmets
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                    '& .MuiOutlinedInput-root': { height: 32 },
                    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #333' },
                    '& .MuiOutlinedInput-input': { color: '#fff', fontSize: 12, py: 0.5 },
                  }}
                />

                {/* Project placeholder */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Project</InputLabel>
                  <Select
                    label="Project"
                    value="all"
                    sx={{
                      bgcolor: '#1C1C1E',
                      color: '#fff',
                      border: '1px solid #333',
                      borderRadius: 1,
                      height: 32,
                      fontSize: 12,
                      '& .MuiSelect-select': { py: 0.5, px: 1 },
                      '& .MuiSelect-icon': { color: '#888', fontSize: 16 },
                    }}
                    MenuProps={{ PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } } }}
                  >
                    <MenuItem value="all">All</MenuItem>
                  </Select>
                </FormControl>

                {/* Status filter */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ color: '#aaa', fontSize: 12 }}>Status</InputLabel>
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
                      height: 32,
                      fontSize: 12,
                      '& .MuiSelect-select': { py: 0.5, px: 1 },
                      '& .MuiSelect-icon': { color: '#888', fontSize: 16 },
                    }}
                    MenuProps={{ PaperProps: { sx: { bgcolor: '#28282B', color: '#fff' } } }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Table area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 1.5, py: 1, overflow: 'hidden' }}>
              {loading && <Typography color="#fff">Loading…</Typography>}
              {error && <Typography color="error">{error}</Typography>}

              {!loading && !error && (
                <>
                  <TableContainer
                    component={Paper}
                    sx={{
                      flex: 1,
                      bgcolor: 'transparent',
                      boxShadow: 'none',
                      overflow: 'auto',
                      '& .MuiTableCell-root': { borderColor: 'rgba(255,255,255,0.1)', textAlign: 'center' },
                      '&::-webkit-scrollbar': { width: '6px', height: '6px' },
                      '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
                      '&::-webkit-scrollbar-track': { background: 'transparent' },
                    }}
                  >
                    <Table stickyHeader sx={{ '& .MuiTableRow-root:hover': { backgroundColor: 'rgba(255,255,255,0.03)' } }}>
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
                                backgroundColor: 'rgba(40,40,45,1)',
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                padding: '8px 12px',
                                borderBottom: '1px solid rgba(255,255,255,0.2)',
                                position: 'sticky',
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
                          '& .MuiTableCell-body': {
                            fontSize: '0.75rem',
                            padding: '8px 6px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                          },
                        }}
                      >
                        {filteredRows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, idx) => (
                            <TableRow key={`${row.deviceId}-${idx}`} hover>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.deviceId}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.date}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.alcohol}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.heartRate}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.carbonMonoxide}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.nitrogenDioxide}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.volatileGas}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.envTemp}</TableCell>
                              <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{row.objectTemp}</TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 500,
                                  color: row.status === 'Active' ? '#4CAF50' : '#F44336',
                                }}
                              >
                                {row.status}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: 500,
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
                    rowsPerPageOptions={[5, 10, 25]}
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
                      px: 2,
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
            flex: '0 0 20%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              overflowY: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
            }}
          >
            {/* Helmet Stats */}
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2,
                p: 1,
                display: 'flex',
                flexDirection: 'column',
                mb: 1.2,
                minHeight: 100,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#fff' }}>
                Helmet Stats
              </Typography>

              <Box sx={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.2 }}>Total</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 24, lineHeight: 1.2 }}>
                    {filteredRows.length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1, width: '100%', overflow: 'hidden' }}>
                  {pieData.map((item) => (
                    <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                        <Typography sx={{ color: '#fff', fontSize: 12, whiteSpace: 'nowrap' }}>{item.name}</Typography>
                      </Box>
                      <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {item.percentage}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Threshold Ranges */}
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 193,
                overflow: 'hidden',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500, fontSize: '1rem' }}>
                Threshold Ranges
              </Typography>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1.5, width: '100%' }} />

              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': { background: '#333', borderRadius: '3px' },
                  '&::-webkit-scrollbar-track': { background: 'transparent' },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {[
                    { parameter: 'Alcohol', range: '0.02% - 0.05%' },
                    { parameter: 'Heart Rate', range: '60 bpm - 90 bpm' },
                    { parameter: 'Carbon Monoxide', range: '0.8 ppm - 2.0 ppm' },
                    { parameter: 'Nitrogen Dioxide', range: '0.3 ppm - 0.8 ppm' },
                    { parameter: 'Volatile Gas', range: '0.1 ppm - 0.4 ppm' },
                    { parameter: 'Env. Temp', range: '25°C - 32°C' },
                    { parameter: 'Object Temp', range: '29°C - 35°C' },
                  ].map((item) => (
                    <Box key={item.parameter} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: '#fff', fontSize: '0.875rem', flex: 1 }}>{item.parameter}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 500 }}>
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
