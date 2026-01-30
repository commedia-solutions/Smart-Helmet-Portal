// // src/pages/Reports.tsx
// import { useState, useEffect, useMemo, useCallback } from 'react'
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   TablePagination,
// } from '@mui/material'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
  
// } from 'recharts'

// import * as XLSX from 'xlsx'
// import { saveAs } from 'file-saver'

// import MainLayout from '../layout/MainLayout'
// import {
//   fetchSmartHelmets,
//   fetchKPIs,
//   fetchTimeSeries,
//   fetchReportData,
//   type SmartHelmet,
//   type KPIResult,
//   type TimeSeriesPoint,
// } from '../services/helmetService'

// // ─── constants & dummy blocks unchanged ─────────────────
// const METRICS = ['Alcohol','HeartRate','CO','NO2','VOC','EnvTemp','ObjectTemp'] as const
// type Metric = typeof METRICS[number]

// // const DUMMY_BREACHES = METRICS.map((m) => ({
// //   parameter: m,
// //   count: Math.round(Math.random()*20)
// // }))

// const DUMMY_ALERTS = Array.from({ length: 50 }).map((_, i) => {
//   const h = String((i%6+1)).padStart(2,'0')
//   const users = ['Alice','Bob','Carol','Dave','Eve','Frank','Grace','Heidi']
//   const locs = ['Warehouse A','Gate 3','Loading Dock']
//   const dates = ['26/06/2025','25/06/2025','24/06/2025']
//   const times = ['09:15','10:20','11:45']
//   return {
//     id: i+1,
//     helmetId: h,
//     username: users[i % users.length],
//     location: locs[i % locs.length],
//     date: dates[i%dates.length],
//     time: times[i%times.length],
//     status: i%2===0?'Active':'Inactive',
//     alert: i%3===0?'Failed':'Triggered'
//   }
// })

// // ─── map our 7 metrics to the GraphQL KPIResult fields ─────────
// const KPI_FIELD_MAP: Record<
//   Metric,
//   { avg: keyof KPIResult; min: keyof KPIResult; max: keyof KPIResult }
// > = {
//   Alcohol:    { avg:'avg_ALCOHOL',        min:'min_ALCOHOL',        max:'max_ALCOHOL'        },
//   HeartRate:  { avg:'avg_Hrt',            min:'min_Hrt',            max:'max_Hrt'            },
//   CO:         { avg:'avg_CARBON_MONOXIDE',min:'min_CARBON_MONOXIDE',max:'max_CARBON_MONOXIDE'},
//   NO2:        { avg:'avg_NITROGEN_DIOXIDE',min:'min_NITROGEN_DIOXIDE',max:'max_NITROGEN_DIOXIDE'},
//   VOC:        { avg:'avg_VOLATILE_GAS',   min:'min_VOLATILE_GAS',   max:'max_VOLATILE_GAS'   },
//   EnvTemp:    { avg:'avg_Env_temp',       min:'min_Env_temp',       max:'max_Env_temp'       },
//   ObjectTemp: { avg:'avg_Obj_temp',       min:'min_Obj_temp',       max:'max_Obj_temp'       },
// }

// export default function Reports() {
//   // ─── helmet lists ─────────────────────────────────────
//   const [helmets, setHelmets] = useState<SmartHelmet[]>([])
//   useEffect(() => {
//     let alive = true
//     fetchSmartHelmets()
//       .then(data => alive && setHelmets(data))
//       .catch(console.error)
//     return () => { alive = false }
//   }, [])

//   // ─── “Generate Report” toolbar state ──────────────────
//   const [reportHelmet,   setReportHelmet]   = useState('All')
//   const [fromDate,       setFromDate]       = useState('')
//   const [toDate,         setToDate]         = useState('')
//   const [selectedTimeline, setSelectedTimeline] = useState<'1h'|'1d'|'1w'|'1m'|'3m'|'6m'>('1d')
//   const [exporting,      setExporting]      = useState(false)

//   // ─── KPI polling (every 5′) ───────────────────────────
  

//   const [kpis, setKpis] = useState<KPIResult|null>(null)

// // zero‐fill helper for KPIs
// const zeroKPIs: KPIResult = {
//   avg_ALCOHOL:0, min_ALCOHOL:0, max_ALCOHOL:0,
//   avg_Hrt:0,     min_Hrt:0,     max_Hrt:0,
//   avg_CARBON_MONOXIDE:0, min_CARBON_MONOXIDE:0, max_CARBON_MONOXIDE:0,
//   avg_NITROGEN_DIOXIDE:0, min_NITROGEN_DIOXIDE:0, max_NITROGEN_DIOXIDE:0,
//   avg_VOLATILE_GAS:0,     min_VOLATILE_GAS:0,     max_VOLATILE_GAS:0,
//   avg_Env_temp:0, min_Env_temp:0, max_Env_temp:0,
//   avg_Obj_temp:0, min_Obj_temp:0, max_Obj_temp:0,
//   lastUpdated: new Date().toISOString(),
// }

// const loadKPIs = useCallback(() => {
//   // pick real ID if “All”
//   let idArg = reportHelmet
//   if (idArg === 'All') {
//     if (!helmets.length) return  // no helmets loaded yet
//     idArg = helmets[0].deviceId
//   }

//   fetchKPIs(idArg)
//     .then(response => {
//       // if your resolver returns null, default to zeros
//       setKpis(response ?? zeroKPIs)
//     })
//     .catch(err => {
//       console.error('KPI fetch failed', err)
//       setKpis(null)
//     })
// }, [reportHelmet, helmets])

// useEffect(() => {
//   loadKPIs()
//   const iv = setInterval(loadKPIs, 5 * 60 * 1000)
//   return () => clearInterval(iv)
// }, [loadKPIs])

//   // ─── “Time Series” chart state + polling ───────────────

//   const [tsHelmet, setTsHelmet] = useState('All')
// const [tsData, setTsData]     = useState<TimeSeriesPoint[]>([])

// // always last 24h
// const tsFrom = useMemo(
//   () => new Date(Date.now() - 24*60*60*1000).toISOString(),
//   []
// )

// const loadTS = useCallback(() => {
//   // pick real ID if “All”
//   let idArg = tsHelmet
//   if (idArg === 'All') {
//     if (!helmets.length) return
//     idArg = helmets[0].deviceId
//   }

//   fetchTimeSeries(idArg, tsFrom)
//     .then(arr => setTsData(arr ?? []))
//     .catch(err => {
//       console.error('TimeSeries fetch failed', err)
//       setTsData([])
//     })
// }, [tsHelmet, tsFrom, helmets])

// useEffect(() => {
//   loadTS()
//   const iv = setInterval(loadTS, 30 * 60 * 1000)
//   return () => clearInterval(iv)
// }, [loadTS])

//   // ─── format each bucketTs as “H:MM AM/PM” ───────────────
//   const chartData = useMemo(() => tsData.map(p => ({
//     time: new Date(p.bucketTs).toLocaleTimeString([], {
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true
//     }),
//     Alcohol:      p.ALCOHOL         ?? 0,
//     HeartRate:    p.Hrt             ?? 0,
//     CO:           p.CARBON_MONOXIDE ?? 0,
//     NO2:          p.NITROGEN_DIOXIDE?? 0,
//     VOC:          p.VOLATILE_GAS    ?? 0,
//     EnvTemp:      p.Env_temp        ?? 0,
//     ObjectTemp:   p.Obj_temp        ?? 0,
//   })), [tsData])

//   // ─── export via SheetJS + FileSaver ───────────────────
 

//   const handleExport = async (all = false) => {
//   setExporting(true)
//   try {
//     let fromISO: string, toISO: string
//     if (all) {
//       toISO = new Date().toISOString()
//       const now = Date.now()
//       let delta = 24 * 60 * 60 * 1000
//       if (selectedTimeline === '1h') delta = 60 * 60 * 1000
//       if (selectedTimeline === '1w') delta = 7 * 24 * 60 * 60 * 1000
//       if (selectedTimeline === '1m') delta = 30 * 24 * 60 * 60 * 1000
//       if (selectedTimeline === '3m') delta = 90 * 24 * 60 * 60 * 1000
//       if (selectedTimeline === '6m') delta = 180 * 24 * 60 * 60 * 1000
//       fromISO = new Date(now - delta).toISOString()
//     } else {
//       fromISO = new Date(fromDate).toISOString()
//       toISO   = new Date(toDate).toISOString()
//     }

//     const id   = reportHelmet === 'All' ? undefined : reportHelmet
//     const rows = await fetchReportData(id, fromISO, toISO)
//     if (!rows.length) {
//       alert('No data found in that range.')
//       return
//     }

//     // 1) build a sheet from your JSON rows
//     const ws = XLSX.utils.json_to_sheet(rows)

//     // 2) turn that sheet into a CSV string
//     const csv = XLSX.utils.sheet_to_csv(ws)

//     // 3) wrap it in a Blob of type text/csv
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

//     // 4) fire the download
//     const filename = `report-${reportHelmet}-${fromISO.slice(0,10)}.csv`
//     saveAs(blob, filename)

//   } catch (err: any) {
//     console.error(err)
//     alert('Export failed: ' + err.message)
//   } finally {
//     setExporting(false)
//   }
// }

//   const exportEnabled    = !!(fromDate && toDate && !exporting)
//   const exportAllEnabled = !!(selectedTimeline && !exporting)

//   // ─── Alerts table (dummy) ───────────────────────────────
//   const [search, setSearch]       = useState('')
//   const [filterLoc, setFilterLoc] = useState<'All'|'Warehouse A'|'Gate 3'|'Loading Dock'>('All')
//   const [filterAlert, setFilterAlert] = useState<'All'|'Triggered'|'Failed'>('All')
//   const [page, setPage]           = useState(0)
//   const [rowsPerPage, setRowsPerPage] = useState(10)
//   const alerts = useMemo(() => DUMMY_ALERTS.filter(r => {
//     if (filterLoc!=='All'   && r.location!==filterLoc) return false
//     if (filterAlert!=='All' && r.alert   !==filterAlert) return false
//     if (search) {
//       const q = search.toLowerCase()
//       return [r.helmetId,r.username,r.location,r.date,r.time,r.status,r.alert]
//         .some(v=>v.toLowerCase().includes(q))
//     }
//     return true
//   }), [search, filterLoc, filterAlert])


//   return (
//     <MainLayout>
//       <Box
//         sx={{
//           pt:10, px:2,
//           color:'#fff',
//           height:'calc(100vh - 90px)',
//           display:'flex',
//           flexDirection:'column'
//         }}
//       >

//         {/* ─── Toolbar: Generate Report ─── */}
//         <Card sx={{
//           bgcolor:'rgba(255,255,255,0.05)',
//           backdropFilter:'blur(8px)',
//           border:'1px solid rgba(255,255,255,0.2)',
//           borderRadius:2,
//           mb:3
//         }}>
//           <CardContent sx={{ display:'flex',alignItems:'center',gap:2 }}>
//             <Typography variant="h6" sx={{ flexGrow:1,color:'#fff' }}>
//               Generate Report
//             </Typography>

//             <FormControl size="small" sx={{ minWidth:140 }}>
//               <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Helmet ID</InputLabel>
//               <Select
//                 value={reportHelmet}
//                 label="Helmet ID"
//                 onChange={e=>setReportHelmet(e.target.value)}
//                 sx={{
//                   bgcolor:'#1C1C1E',color:'#fff',
//                   border:'1px solid #333',borderRadius:1
//                 }}
//                 MenuProps={{
//                   PaperProps:{ sx:{ bgcolor:'#28282B',color:'#fff'} }
//                 }}
//               >
//                 <MenuItem value="All">All</MenuItem>
//                 {helmets.map(h => (
//                   <MenuItem key={h.deviceId} value={h.deviceId}>
//                     {h.deviceId}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <TextField
//               size="small" type="date" label="From"
//               value={fromDate} onChange={e=>setFromDate(e.target.value)}
//               sx={{ width:140 }}
//               InputLabelProps={{ shrink:true, sx:{color:'#aaa',fontSize:12} }}
//               inputProps={{ sx:{color:'#fff',fontSize:12} }}
//             />

//             <TextField
//               size="small" type="date" label="To"
//               value={toDate} onChange={e=>setToDate(e.target.value)}
//               sx={{ width:140 }}
//               InputLabelProps={{ shrink:true, sx:{color:'#aaa',fontSize:12} }}
//               inputProps={{ sx:{color:'#fff',fontSize:12} }}
//             />

//             <FormControl size="small" sx={{ minWidth:140 }}>
//               <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Timeline</InputLabel>
//               <Select
//                 value={selectedTimeline}
//                 label="Timeline"
//                 onChange={e=>setSelectedTimeline(e.target.value as any)}
//                 sx={{
//                   bgcolor:'#1C1C1E',color:'#fff',
//                   border:'1px solid #333',borderRadius:1
//                 }}
//                 MenuProps={{
//                   PaperProps:{ sx:{bgcolor:'#28282B',color:'#fff'} }
//                 }}
//               >
//                 {[
//                   {value:'1h',label:'Last Hour'},
//                   {value:'1d',label:'1 Day'},
//                   {value:'1w',label:'1 Week'},
//                   {value:'1m',label:'1 Month'},
//                   {value:'3m',label:'3 Months'},
//                   {value:'6m',label:'6 Months'},
//                 ].map(o => (
//                   <MenuItem key={o.value} value={o.value}>
//                     {o.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <Box sx={{ ml:'auto',display:'flex',gap:1 }}>
//               <Button
//                 variant="contained"
//                 disabled={!exportEnabled}
//                 onClick={()=>handleExport(false)}
//                 sx={{ bgcolor:'#FFD600',color:'#000','&:hover':{bgcolor:'#FFC107'} }}
//               >
//                 Export
//               </Button>
//               <Button
//                 variant="contained"
//                 disabled={!exportAllEnabled}
//                 onClick={()=>handleExport(true)}
//                 sx={{ bgcolor:'#FFD600',color:'#000','&:hover':{bgcolor:'#FFC107'} }}
//               >
//                 Export All
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>


//         {/* ─── Scrollable Content ─── */}
//         <Box sx={{
//           flex:1,
//           overflowY:'auto',
//           '&::-webkit-scrollbar':{ width:'6px' },
//           '&::-webkit-scrollbar-thumb':{ background:'#333',borderRadius:'3px' },
//           '&::-webkit-scrollbar-track':{ background:'transparent' },
//         }}>

//           {/* ─── KPI Cards ─── */}
//           <Box sx={{
//             display:'grid',
//             gridAutoFlow:'column',
//             gridAutoColumns:'minmax(160px,1fr)',
//             gap:2,mb:3,px:0.3,
//             overflowX:'auto',
//             '&::-webkit-scrollbar':{ height:'6px' },
//             '&::-webkit-scrollbar-thumb':{ background:'#333',borderRadius:'3px' },
//             '&::-webkit-scrollbar-track':{ background:'transparent' },
//           }}>
//             {METRICS.map((m) => {
//               const F   = KPI_FIELD_MAP[m]
//               const avg = kpis?.[F.avg] ?? 0
//               const min = kpis?.[F.min] ?? 0
//               const max = kpis?.[F.max] ?? 0
//               return (
//                 <Card key={m} sx={{
//                   bgcolor:'rgba(255,255,255,0.05)',
//                   backdropFilter:'blur(8px)',
//                   border:'1px solid rgba(255,255,255,0.2)'
//                 }}>
//                   <CardContent>
//                     <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
//                       Avg {m}
//                     </Typography>
//                     <Typography variant="h6" sx={{ color:'#fff' }}>
//                       {/* {avg.toFixed(2)} */}
//                       {Number(avg).toFixed(2)}
//                     </Typography>
//                     <Box sx={{ display:'flex',justifyContent:'space-between' }}>
//                       <Typography variant="caption" sx={{ color:'#FFD600' }}>
//                         {/* Min {min.toFixed(2)} */}
//                         Min {Number(min).toFixed(2)}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color:'#FFD600' }}>
//                         {/* Max {max.toFixed(2)} */}
//                         Max {Number(max).toFixed(2)}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </Box>


//           {/* ─── Time Series ─── */}
//           <Box sx={{
//             position:'relative',
//             height:300,
//             mb:3,
//             p:2,
//             bgcolor:'rgba(255,255,255,0.05)',
//             border:'1px solid rgba(255,255,255,0.2)',
//             borderRadius:2
//           }}>
//             <Typography variant="h6" mb={1} color="#fff">Time Series</Typography>

//             {/* separate helmet filter for timeseries */}
//             <FormControl size="small" sx={{
//               position:'absolute',
//               top:8,
//               right:16,
//               minWidth:120,
//               bgcolor:'#1C1C1E',
//               border:'1px solid #333',
//               borderRadius:1,
//               zIndex:2
//             }}>
//               <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Helmet ID</InputLabel>
//               <Select
//                 value={tsHelmet}
//                 label="Helmet ID"
//                 onChange={e=>setTsHelmet(e.target.value)}
//                 sx={{ color:'#fff' }}
//                 MenuProps={{ PaperProps:{ sx:{bgcolor:'#28282B',color:'#fff'} } }}
//               >
//                 <MenuItem value="All">All</MenuItem>
//                 {helmets.map(h => (
//                   <MenuItem key={h.deviceId} value={h.deviceId}>
//                     {h.deviceId}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             <ResponsiveContainer width="100%" height="85%">
//               <LineChart data={chartData}>
//                 <XAxis dataKey="time" stroke="#888" />
//                 <YAxis stroke="#888" />
//                 <Tooltip
//                   contentStyle={{ backgroundColor:'#222',border:'none',fontSize:12 }}
//                   labelStyle={{ color:'#fff' }}
//                 />
//                 <Legend wrapperStyle={{ color:'#fff',fontSize:12 }}/>
//                 <Line type="monotone" dataKey="Alcohol" stroke="#4CAF50" dot={false}/>
//                 <Line type="monotone" dataKey="HeartRate" stroke="#FFC107" dot={false}/>
//                 <Line type="monotone" dataKey="CO" stroke="#F44336" dot={false}/>
//                 <Line type="monotone" dataKey="NO2" stroke="#2196F3" dot={false}/>
//                 <Line type="monotone" dataKey="VOC" stroke="#9C27B0" dot={false}/>
//                 <Line type="monotone" dataKey="EnvTemp" stroke="#FF9800" dot={false}/>
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>

          
//           {/* ─── Alerts & Faults (dummy) ─── */}
//           <Box
//             sx={{
//               display:'flex',
//               flexDirection:'column',
//               height:400,
//               p:1,
//               bgcolor:'rgba(255,255,255,0.05)',
//               border:'1px solid rgba(255,255,255,0.2)',
//               borderRadius:2,
//               overflow:'hidden'
//             }}
//           >
//             {/* header + filters */}
//             <Box sx={{ display:'flex', alignItems:'center', px:2, py:1, borderBottom:'1px solid rgba(255,255,255,0.2)' }}>
//               <Typography variant="h6" sx={{ flex:1 }}>Alerts & Faults History</Typography>
//               <TextField
//                 size="small" placeholder="Search…"
//                 value={search}
//                 onChange={e=>{ setSearch(e.target.value); setPage(0) }}
//                 sx={{
//                   width:200, mr:2,
//                   bgcolor:'#1C1C1E',
//                   '& .MuiOutlinedInput-root':{ height:32 },
//                   '& .MuiOutlinedInput-input':{ color:'#fff',fontSize:12,p:1 },
//                   '& .MuiOutlinedInput-notchedOutline':{ border:'1px solid #333' },
//                 }}
//               />
//               <FormControl size="small" sx={{ minWidth:140, mr:2 }}>
//                 <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Location</InputLabel>
//                 <Select
//                   value={filterLoc}
//                   onChange={e=>{ setFilterLoc(e.target.value as any); setPage(0) }}
//                   sx={{
//                     bgcolor:'#1C1C1E',color:'#fff',
//                     border:'1px solid #333',borderRadius:1,
//                     height:32,fontSize:12,
//                     '& .MuiSelect-select':{py:0.5,px:1},
//                     '& .MuiSelect-icon':{color:'#888'}
//                   }}
//                   MenuProps={{ PaperProps:{sx:{bgcolor:'#28282B',color:'#fff'}}}}
//                 >
//                   <MenuItem value="All">All</MenuItem>
//                   <MenuItem value="Warehouse A">Warehouse A</MenuItem>
//                   <MenuItem value="Gate 3">Gate 3</MenuItem>
//                   <MenuItem value="Loading Dock">Loading Dock</MenuItem>
//                 </Select>
//               </FormControl>
//               <FormControl size="small" sx={{ minWidth:140 }}>
//                 <InputLabel sx={{ color:'#aaa',fontSize:12 }}>Alert Status</InputLabel>
//                 <Select
//                   value={filterAlert}
//                   onChange={e=>{ setFilterAlert(e.target.value as any); setPage(0) }}
//                   sx={{
//                     bgcolor:'#1C1C1E',color:'#fff',
//                     border:'1px solid #333',borderRadius:1,
//                     height:32,fontSize:12,
//                     '& .MuiSelect-select':{py:0.5,px:1},
//                     '& .MuiSelect-icon':{color:'#888'}
//                   }}
//                   MenuProps={{ PaperProps:{sx:{bgcolor:'#28282B',color:'#fff'}}}}
//                 >
//                   <MenuItem value="All">All</MenuItem>
//                   <MenuItem value="Triggered">Triggered</MenuItem>
//                   <MenuItem value="Failed">Failed</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>

//             {/* scrollable table */}
//             <Box sx={{ flex:1, display:'flex', flexDirection:'column', px:1, py:1, overflow:'hidden' }}>
//               <TableContainer
//                 component={Paper}
//                 sx={{
//                   flex:1,
//                   bgcolor:'transparent',
//                   boxShadow:'none',
//                   overflowY:'auto',
//                   '& .MuiTableCell-root':{ borderColor:'rgba(255,255,255,0.1)', textAlign:'center' },
//                   '&::-webkit-scrollbar':{ width:'6px' },
//                   '&::-webkit-scrollbar-thumb':{ background:'#333', borderRadius:'3px' },
//                   '&::-webkit-scrollbar-track':{ background:'transparent' },
//                 }}
//               >
//                 <Table stickyHeader>
//                   <TableHead>
//                     <TableRow>
//                       {['#','Helmet','User','Location','Date','Time','Status','Alert'].map(col=>(
//                         <TableCell
//                           key={col}
//                           sx={{
//                             backgroundColor:'rgba(40,40,45,1)',
//                             color:'rgba(255,255,255,0.9)',
//                             fontSize:'0.75rem',fontWeight:500,
//                             padding:'8px 12px',
//                             borderBottom:'1px solid rgba(255,255,255,0.2)'
//                           }}
//                         >
//                           {col}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody sx={{
//                     '& .MuiTableCell-body':{
//                       fontSize:'0.75rem',padding:'8px 6px',
//                       borderBottom:'1px solid rgba(255,255,255,0.05)'
//                     }
//                   }}>
//                     {alerts.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage)
//                       .map(r=>(
//                         <TableRow key={r.id} hover>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.id}</TableCell>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.helmetId}</TableCell>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.username}</TableCell>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.location}</TableCell>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.date}</TableCell>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>{r.time}</TableCell>
//                           <TableCell sx={{ color:r.status==='Active'?'#4CAF50':'#F44336' }}>{r.status}</TableCell>
//                           <TableCell sx={{ color:r.alert==='Triggered'?'#FFC107':'#F44336' }}>{r.alert}</TableCell>
//                         </TableRow>
//                       ))
//                     }
//                   </TableBody>
//                 </Table>
//               </TableContainer>

//               <TablePagination
//                 rowsPerPageOptions={[5,10,25]}
//                 component="div"
//                 count={alerts.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={(_,np)=>setPage(np)}
//                 onRowsPerPageChange={e=>{ setRowsPerPage(+e.target.value); setPage(0) }}
//                 sx={{
//                   color:'#fff',
//                   borderTop:'1px solid rgba(255,255,255,0.2)',
//                   px:2,
//                   '& .MuiTablePagination-selectIcon':{ color:'#fff' },
//                   '& .MuiInputBase-root .MuiSvgIcon-root':{ color:'#fff' }
//                 }}
//               />
//             </Box>
//           </Box>

//         </Box>
//       </Box>
//     </MainLayout>
//   )
// }



// src/pages/Reports.tsx
import { useState, useMemo } from "react";
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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import MainLayout from "../layout/MainLayout";

// ─── constants ─────────────────────────────────────────────
const METRICS = ["Alcohol", "HeartRate", "CO", "NO2", "VOC", "EnvTemp", "ObjectTemp"] as const;
type Metric = typeof METRICS[number];

type KPIResult = {
  avg: number;
  min: number;
  max: number;
};

const DUMMY_HELMETS = ["1001", "1002", "1003", "1004", "1005"];

const DUMMY_ALERTS = Array.from({ length: 50 }).map((_, i) => {
  const users = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Heidi"];
  const locs = ["Warehouse A", "Gate 3", "Loading Dock"];
  const dates = ["26/06/2025", "25/06/2025", "24/06/2025"];
  const times = ["09:15", "10:20", "11:45"];
  const helmetId = DUMMY_HELMETS[i % DUMMY_HELMETS.length];

  return {
    id: i + 1,
    helmetId,
    username: users[i % users.length],
    location: locs[i % locs.length],
    date: dates[i % dates.length],
    time: times[i % times.length],
    status: i % 2 === 0 ? "Active" : "Inactive",
    alert: i % 3 === 0 ? "Failed" : "Triggered",
  };
});

// simple helper to generate stable-ish KPI values per helmet
function buildDummyKPIs(helmetId: string): Record<Metric, KPIResult> {
  const seed = Number(helmetId) || 1000;
  const base = (n: number) => (Math.sin(seed + n) + 1) * 10;

  return {
    Alcohol: { avg: base(1) / 10, min: base(2) / 20, max: base(3) / 8 },
    HeartRate: { avg: 70 + base(4), min: 55 + base(5), max: 95 + base(6) },
    CO: { avg: base(7), min: base(8) / 2, max: base(9) * 1.2 },
    NO2: { avg: base(10) / 2, min: base(11) / 3, max: base(12) / 1.2 },
    VOC: { avg: base(13) / 3, min: base(14) / 4, max: base(15) / 2.2 },
    EnvTemp: { avg: 28 + base(16) / 3, min: 24 + base(17) / 4, max: 33 + base(18) / 5 },
    ObjectTemp: { avg: 31 + base(19) / 3, min: 27 + base(20) / 4, max: 36 + base(21) / 5 },
  };
}

// dummy time series (24 points)
function buildDummyTimeSeries(helmetId: string) {
  const seed = Number(helmetId) || 1000;
  return Array.from({ length: 24 }).map((_, i) => {
    const t = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
    const wave = (k: number) => Math.round((Math.sin((seed + i) / k) + 1) * 10);

    return {
      time: t.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }),
      Alcohol: Number(((wave(4) / 100) + 0.02).toFixed(2)),
      HeartRate: 60 + wave(2),
      CO: wave(3),
      NO2: Number((wave(5) / 10).toFixed(1)),
      VOC: Number((wave(6) / 10).toFixed(1)),
      EnvTemp: 25 + Number((wave(7) / 3).toFixed(1)),
      ObjectTemp: 29 + Number((wave(8) / 3).toFixed(1)),
    };
  });
}

export default function Reports() {
  // ─── toolbar state ─────────────────────────────────────
  const [reportHelmet, setReportHelmet] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState<"1h" | "1d" | "1w" | "1m" | "3m" | "6m">("1d");
  const [exporting, setExporting] = useState(false);

  // ─── KPI state (dummy derived) ─────────────────────────
  const kpisByMetric = useMemo(() => {
    const id = reportHelmet === "All" ? DUMMY_HELMETS[0] : reportHelmet;
    return buildDummyKPIs(id);
  }, [reportHelmet]);

  // ─── time series state (dummy derived) ─────────────────
  const [tsHelmet, setTsHelmet] = useState("All");

  const chartData = useMemo(() => {
    const id = tsHelmet === "All" ? DUMMY_HELMETS[0] : tsHelmet;
    return buildDummyTimeSeries(id);
  }, [tsHelmet]);

  // ─── export dummy CSV ──────────────────────────────────
  const handleExport = async (all = false) => {
    setExporting(true);
    try {
      // create dummy "report rows"
      const id = reportHelmet === "All" ? "All" : reportHelmet;

      const rows = Array.from({ length: all ? 200 : 50 }).map((_, i) => ({
        helmetId: id === "All" ? DUMMY_HELMETS[i % DUMMY_HELMETS.length] : id,
        datetime: new Date(Date.now() - i * 60_000).toISOString(),
        alcohol: Number((0.02 + (i % 10) * 0.01).toFixed(2)),
        heartRate: 60 + (i % 40),
        co: i % 15,
        no2: Number(((i % 8) * 0.1).toFixed(1)),
        voc: Number(((i % 10) * 0.1).toFixed(1)),
        envTemp: 25 + (i % 8),
        objTemp: 29 + (i % 8),
        status: i % 7 === 0 ? "Inactive" : "Active",
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      const filename = `report-${id}-${new Date().toISOString().slice(0, 10)}.csv`;
      saveAs(blob, filename);
    } catch (err: any) {
      console.error(err);
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const exportEnabled = !!(fromDate && toDate && !exporting);
  const exportAllEnabled = !!(selectedTimeline && !exporting);

  // ─── alerts & faults history (dummy) ───────────────────
  const [search, setSearch] = useState("");
  const [filterLoc, setFilterLoc] = useState<"All" | "Warehouse A" | "Gate 3" | "Loading Dock">("All");
  const [filterAlert, setFilterAlert] = useState<"All" | "Triggered" | "Failed">("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const alerts = useMemo(() => {
    return DUMMY_ALERTS.filter((r) => {
      if (filterLoc !== "All" && r.location !== filterLoc) return false;
      if (filterAlert !== "All" && r.alert !== filterAlert) return false;
      if (search) {
        const q = search.toLowerCase();
        return [r.helmetId, r.username, r.location, r.date, r.time, r.status, r.alert].some((v) =>
          v.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, filterLoc, filterAlert]);

  return (
    <MainLayout>
      <Box
        sx={{
          pt: 10,
          px: 2,
          color: "#fff",
          height: "calc(100vh - 90px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ─── Toolbar: Generate Report ─── */}
        <Card
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
              Generate Report (Dummy)
            </Typography>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
              <Select
                value={reportHelmet}
                label="Helmet ID"
                onChange={(e) => setReportHelmet(e.target.value)}
                sx={{
                  bgcolor: "#1C1C1E",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 1,
                }}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="All">All</MenuItem>
                {DUMMY_HELMETS.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="date"
              label="From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ width: 140 }}
              InputLabelProps={{ shrink: true, sx: { color: "#aaa", fontSize: 12 } }}
              inputProps={{ sx: { color: "#fff", fontSize: 12 } }}
            />

            <TextField
              size="small"
              type="date"
              label="To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sx={{ width: 140 }}
              InputLabelProps={{ shrink: true, sx: { color: "#aaa", fontSize: 12 } }}
              inputProps={{ sx: { color: "#fff", fontSize: 12 } }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Timeline</InputLabel>
              <Select
                value={selectedTimeline}
                label="Timeline"
                onChange={(e) => setSelectedTimeline(e.target.value as any)}
                sx={{
                  bgcolor: "#1C1C1E",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 1,
                }}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                {[
                  { value: "1h", label: "Last Hour" },
                  { value: "1d", label: "1 Day" },
                  { value: "1w", label: "1 Week" },
                  { value: "1m", label: "1 Month" },
                  { value: "3m", label: "3 Months" },
                  { value: "6m", label: "6 Months" },
                ].map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                disabled={!exportEnabled}
                onClick={() => handleExport(false)}
                sx={{ bgcolor: "#FFD600", color: "#000", "&:hover": { bgcolor: "#FFC107" } }}
              >
                Export
              </Button>

              <Button
                variant="contained"
                disabled={!exportAllEnabled}
                onClick={() => handleExport(true)}
                sx={{ bgcolor: "#FFD600", color: "#000", "&:hover": { bgcolor: "#FFC107" } }}
              >
                Export All
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ─── Scrollable content ─── */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
          }}
        >
          {/* ─── KPI Cards ─── */}
          <Box
            sx={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "minmax(160px,1fr)",
              gap: 2,
              mb: 3,
              px: 0.3,
              overflowX: "auto",
              "&::-webkit-scrollbar": { height: "6px" },
              "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
            }}
          >
            {METRICS.map((m) => {
              const avg = kpisByMetric[m].avg;
              const min = kpisByMetric[m].min;
              const max = kpisByMetric[m].max;

              return (
                <Card
                  key={m}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
                      Avg {m}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#fff" }}>
                      {Number(avg).toFixed(2)}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ color: "#FFD600" }}>
                        Min {Number(min).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#FFD600" }}>
                        Max {Number(max).toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* ─── Time Series ─── */}
          <Box
            sx={{
              position: "relative",
              height: 300,
              mb: 3,
              p: 2,
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" mb={1} color="#fff">
              Time Series (Dummy)
            </Typography>

            <FormControl
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 16,
                minWidth: 120,
                bgcolor: "#1C1C1E",
                border: "1px solid #333",
                borderRadius: 1,
                zIndex: 2,
              }}
            >
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
              <Select
                value={tsHelmet}
                label="Helmet ID"
                onChange={(e) => setTsHelmet(e.target.value)}
                sx={{ color: "#fff" }}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="All">All</MenuItem>
                {DUMMY_HELMETS.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#222", border: "none", fontSize: 12 }} labelStyle={{ color: "#fff" }} />
                <Legend wrapperStyle={{ color: "#fff", fontSize: 12 }} />
                <Line type="monotone" dataKey="Alcohol" stroke="#4CAF50" dot={false} />
                <Line type="monotone" dataKey="HeartRate" stroke="#FFC107" dot={false} />
                <Line type="monotone" dataKey="CO" stroke="#F44336" dot={false} />
                <Line type="monotone" dataKey="NO2" stroke="#2196F3" dot={false} />
                <Line type="monotone" dataKey="VOC" stroke="#9C27B0" dot={false} />
                <Line type="monotone" dataKey="EnvTemp" stroke="#FF9800" dot={false} />
                <Line type="monotone" dataKey="ObjectTemp" stroke="#00BCD4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* ─── Alerts & Faults (dummy) ─── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 400,
              p: 1,
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ flex: 1 }}>
                Alerts & Faults History
              </Typography>

              <TextField
                size="small"
                placeholder="Search…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                sx={{
                  width: 200,
                  bgcolor: "#1C1C1E",
                  "& .MuiOutlinedInput-root": { height: 32 },
                  "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 12, p: 1 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #333" },
                }}
              />

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
                <Select
                  value={filterLoc}
                  onChange={(e) => {
                    setFilterLoc(e.target.value as any);
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
                    "& .MuiSelect-icon": { color: "#888" },
                  }}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Warehouse A">Warehouse A</MenuItem>
                  <MenuItem value="Gate 3">Gate 3</MenuItem>
                  <MenuItem value="Loading Dock">Loading Dock</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Alert Status</InputLabel>
                <Select
                  value={filterAlert}
                  onChange={(e) => {
                    setFilterAlert(e.target.value as any);
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
                    "& .MuiSelect-icon": { color: "#888" },
                  }}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Triggered">Triggered</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1, py: 1, overflow: "hidden" }}>
              <TableContainer
                component={Paper}
                sx={{
                  flex: 1,
                  bgcolor: "transparent",
                  boxShadow: "none",
                  overflowY: "auto",
                  "& .MuiTableCell-root": { borderColor: "rgba(255,255,255,0.1)", textAlign: "center" },
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["#", "Helmet", "User", "Location", "Date", "Time", "Status", "Alert"].map((col) => (
                        <TableCell
                          key={col}
                          sx={{
                            backgroundColor: "rgba(40,40,45,1)",
                            color: "rgba(255,255,255,0.9)",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            padding: "8px 12px",
                            borderBottom: "1px solid rgba(255,255,255,0.2)",
                          }}
                        >
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody
                    sx={{
                      "& .MuiTableCell-body": {
                        fontSize: "0.75rem",
                        padding: "8px 6px",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    {alerts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.id}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.helmetId}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.username}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.location}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.date}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.time}</TableCell>
                        <TableCell sx={{ color: r.status === "Active" ? "#4CAF50" : "#F44336", fontWeight: 500 }}>
                          {r.status}
                        </TableCell>
                        <TableCell sx={{ color: r.alert === "Triggered" ? "#FFC107" : "#F44336", fontWeight: 500 }}>
                          {r.alert}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={alerts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, np) => setPage(np)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(+e.target.value);
                  setPage(0);
                }}
                sx={{
                  color: "#fff",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  px: 2,
                  "& .MuiTablePagination-selectIcon": { color: "#fff" },
                  "& .MuiInputBase-root .MuiSvgIcon-root": { color: "#fff" },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
