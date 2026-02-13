// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   Divider,
//   TablePagination,
//   Chip,
// } from "@mui/material";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import { fetchLatestForHelmet, type SmartHelmet } from "../services/helmetService";

// /** Dynamo/AppSync sends datetime like "2026-01-09 11:40:15"
//  *  JS Date parsing can be inconsistent for that format,
//  *  so we normalize to "2026-01-09T11:40:15"
//  */
// function parseHelmetDatetime(dt?: string | null): Date {
//   if (!dt) return new Date();
//   const normalized = dt.includes("T") ? dt : dt.replace(" ", "T");
//   const d = new Date(normalized);
//   return isNaN(d.getTime()) ? new Date() : d;
// }

// function fmtDDMMYYYY(d: Date): string {
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const yyyy = d.getFullYear();
//   return `${dd}/${mm}/${yyyy}`;
// }

// function fmtHHMM(d: Date): string {
//   const hh = String(d.getHours()).padStart(2, "0");
//   const mm = String(d.getMinutes()).padStart(2, "0");
//   return `${hh}:${mm}`;
// }

// type AlertRow = {
//   sr: number;
//   helmetId: string;
//   username: string;
//   location: string;
//   date: string;
//   time: string;
//   alert: "Triggered" | "Failed";
// };

// export default function Alerts() {
//   // --- pagination + table state ---
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [locFilter, setLocFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");

//   // --- top-card dropdowns ---
//   const helmetIds = ["All", "01"];
//   const [selectedHelmet, setSelectedHelmet] = useState("All");
//   const [selectedLocation, setSelectedLocation] = useState("All");

//   const locations = ["All", "Warehouse A", "Gate 3", "Loading Dock"];
//   const alertStatuses = ["All", "Triggered", "Failed"];

//   // enable logic for top buttons
//   const single = selectedHelmet !== "All";
//   const byLoc = selectedHelmet === "All" && selectedLocation !== "All";
//   const allSel = selectedHelmet === "All" && selectedLocation === "All";

//   // --- live fetch (helmet 01 latest) ---
//   const [latest01, setLatest01] = useState<SmartHelmet | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;

//     const load = async () => {
//       try {
//         const data = await fetchLatestForHelmet("01");
//         if (!mounted) return;
//         setLatest01(data);
//         setError(null);
//         setLoading(false);
//       } catch (e: unknown) {
//         if (!mounted) return;
//         setError(e instanceof Error ? e.message : "Failed to load helmet 01");
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

//   // --- build ONLY 2 rows from helmet 01 ---
//   const baseRows: AlertRow[] = useMemo(() => {
//     if (!latest01) return [];

//     const base = parseHelmetDatetime(latest01.datetime);
//     const older = new Date(base.getTime() - 60_000);

//     return [
//       {
//         sr: 1,
//         helmetId: "01",
//         username: "test",
//         location: "Warehouse A",
//         date: fmtDDMMYYYY(base),
//         time: fmtHHMM(base),
//         alert: "Triggered",
//       },
//       {
//         sr: 2,
//         helmetId: "01",
//         username: "test",
//         location: "Gate 3",
//         date: fmtDDMMYYYY(older),
//         time: fmtHHMM(older),
//         alert: "Failed",
//       },
//     ];
//   }, [latest01]);

//   // filter + search
//   const filtered = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();

//     return baseRows.filter((r) => {
//       if (q) {
//         const fields = [
//           r.sr,
//           r.helmetId,
//           r.username,
//           r.location,
//           r.date,
//           r.time,
//           r.alert,
//         ];
//         const ok = fields.some((v) => String(v).toLowerCase().includes(q));
//         if (!ok) return false;
//       }

//       if (locFilter !== "All" && r.location !== locFilter) return false;
//       if (statusFilter !== "All" && r.alert !== statusFilter) return false;

//       if (selectedHelmet !== "All" && r.helmetId !== selectedHelmet) return false;
//       if (
//         selectedHelmet === "All" &&
//         selectedLocation !== "All" &&
//         r.location !== selectedLocation
//       )
//         return false;

//       return true;
//     });
//   }, [baseRows, searchTerm, locFilter, statusFilter, selectedHelmet, selectedLocation]);

//   // pagination handlers
//   const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
//   const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(+e.target.value);
//     setPage(0);
//   };

//   // right-sidebar stats
//   const healthData = useMemo(() => {
//     const counts: Record<string, number> = {
//       Healthy: 0,
//       Moderate: 0,
//       Critical: 0,
//     };

//     for (const r of baseRows) {
//       const h = r.alert === "Failed" ? "Critical" : "Moderate";
//       counts[h] += 1;
//     }

//     const items = [
//       { name: "Healthy", value: counts.Healthy, color: "#4CAF50" },
//       { name: "Moderate", value: counts.Moderate, color: "#FFC107" },
//       { name: "Critical", value: counts.Critical, color: "#F44336" },
//     ].filter((d) => d.value > 0);

//     return items.length ? items : [{ name: "Healthy", value: 1, color: "#4CAF50" }];
//   }, [baseRows]);

//   const totalHealth = healthData.reduce((sum, d) => sum + d.value, 0);

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         alignItems: 'stretch',
//         gap: 2,
//         width: '100%',
//         height: '100%',
//         minHeight: 0,
//         overflow: 'hidden',
//         pt: 0.5,
//         px: 0.3,
//         pb: 0.1,
//       }}
//     >
//       {/* LEFT SECTION (78%) */}
//       <Box
//         sx={{
//           flex: '0 0 calc(78% - 8px)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           minHeight: 0,
//           overflow: 'hidden',
//         }}
//       >
//         {/* TOP CARD - Compact */}
//         <Box
//           sx={{
//             bgcolor: 'rgba(255,255,255,0.05)',
//             backdropFilter: 'blur(8px)',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             px: 2,
//             py: 1.5,
//             flexShrink: 0,
//             height: '70px',
//             gap: 2,
//           }}
//         >
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//             <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
//               Alerts
//             </Typography>
//             <Chip
//               size="small"
//               label={loading ? "Loading…" : error ? "Error" : "Live (helmet 01)"}
//               sx={{
//                 height: 22,
//                 bgcolor: 'rgba(255,255,255,0.08)',
//                 color: 'rgba(255,255,255,0.85)',
//                 border: '1px solid rgba(255,255,255,0.10)',
//                 '& .MuiChip-label': { px: 1, fontSize: 11, fontWeight: 500 },
//               }}
//             />
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//             {/* Helmet ID */}
//             <FormControl size="small" sx={{ minWidth: 130 }}>
//               <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
//                 Helmet ID
//               </InputLabel>
//               <Select
//                 value={selectedHelmet}
//                 label="Helmet ID"
//                 onChange={(e) => {
//                   setSelectedHelmet(e.target.value);
//                   setPage(0);
//                 }}
//                 sx={{
//                   height: 36,
//                   bgcolor: 'rgba(255,255,255,0.04)',
//                   color: '#fff',
//                   borderRadius: 2,
//                   fontSize: 13,
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(255,255,255,0.14)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(255,255,255,0.22)',
//                   },
//                   '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
//                 }}
//                 MenuProps={{
//                   PaperProps: {
//                     sx: {
//                       bgcolor: 'rgba(20,20,20,0.98)',
//                       backdropFilter: 'blur(12px)',
//                       border: '1px solid rgba(255,255,255,0.12)',
//                       mt: 0.5,
//                       '& .MuiMenuItem-root': {
//                         color: '#fff',
//                         fontSize: 13,
//                         '&:hover': {
//                           bgcolor: 'rgba(255,255,255,0.08)',
//                         },
//                         '&.Mui-selected': {
//                           bgcolor: 'rgba(255,255,255,0.12)',
//                         },
//                       },
//                     },
//                   },
//                 }}
//               >
//                 {helmetIds.map((id) => (
//                   <MenuItem key={id} value={id}>
//                     {id}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Location */}
//             <FormControl size="small" sx={{ minWidth: 150 }}>
//               <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
//                 Location
//               </InputLabel>
//               <Select
//                 value={selectedLocation}
//                 label="Location"
//                 onChange={(e) => {
//                   setSelectedLocation(e.target.value);
//                   setPage(0);
//                 }}
//                 sx={{
//                   height: 36,
//                   bgcolor: 'rgba(255,255,255,0.04)',
//                   color: '#fff',
//                   borderRadius: 2,
//                   fontSize: 13,
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(255,255,255,0.14)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(255,255,255,0.22)',
//                   },
//                   '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
//                 }}
//                 MenuProps={{
//                   PaperProps: {
//                     sx: {
//                       bgcolor: 'rgba(20,20,20,0.98)',
//                       backdropFilter: 'blur(12px)',
//                       border: '1px solid rgba(255,255,255,0.12)',
//                       mt: 0.5,
//                       '& .MuiMenuItem-root': {
//                         color: '#fff',
//                         fontSize: 13,
//                         '&:hover': {
//                           bgcolor: 'rgba(255,255,255,0.08)',
//                         },
//                         '&.Mui-selected': {
//                           bgcolor: 'rgba(255,255,255,0.12)',
//                         },
//                       },
//                     },
//                   },
//                 }}
//               >
//                 {locations.map((loc) => (
//                   <MenuItem key={loc} value={loc}>
//                     {loc}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>

//             {/* Buttons - Compact */}
//             <Button
//               variant="contained"
//               disabled={!single}
//               sx={{
//                 bgcolor: single ? '#FED200' : 'rgba(254,210,0,0.12)',
//                 color: single ? '#000' : 'rgba(0,0,0,0.4)',
//                 fontWeight: 600,
//                 fontSize: 12,
//                 borderRadius: 2,
//                 height: 36,
//                 px: 2,
//                 textTransform: 'none',
//                 border: single ? '1px solid rgba(254,210,0,0.3)' : '1px solid rgba(254,210,0,0.2)',
//                 '&:hover': { 
//                   bgcolor: single ? '#FFC107' : 'rgba(254,210,0,0.12)',
//                 },
//                 '&.Mui-disabled': {
//                   bgcolor: 'rgba(254,210,0,0.12)',
//                   color: 'rgba(0,0,0,0.4)',
//                 },
//               }}
//             >
//               Alert One
//             </Button>

//             <Button
//               variant="contained"
//               disabled={!byLoc}
//               sx={{
//                 bgcolor: byLoc ? '#FED200' : 'rgba(254,210,0,0.12)',
//                 color: byLoc ? '#000' : 'rgba(0,0,0,0.4)',
//                 fontWeight: 600,
//                 fontSize: 12,
//                 borderRadius: 2,
//                 height: 36,
//                 px: 2,
//                 textTransform: 'none',
//                 border: byLoc ? '1px solid rgba(254,210,0,0.3)' : '1px solid rgba(254,210,0,0.2)',
//                 '&:hover': { 
//                   bgcolor: byLoc ? '#FFC107' : 'rgba(254,210,0,0.12)',
//                 },
//                 '&.Mui-disabled': {
//                   bgcolor: 'rgba(254,210,0,0.12)',
//                   color: 'rgba(0,0,0,0.4)',
//                 },
//               }}
//             >
//               Alert Location
//             </Button>

//             <Button
//               variant="contained"
//               disabled={!allSel}
//               sx={{
//                 bgcolor: allSel ? '#FED200' : 'rgba(254,210,0,0.12)',
//                 color: allSel ? '#000' : 'rgba(0,0,0,0.4)',
//                 fontWeight: 600,
//                 fontSize: 12,
//                 borderRadius: 2,
//                 height: 36,
//                 px: 2,
//                 textTransform: 'none',
//                 border: allSel ? '1px solid rgba(254,210,0,0.3)' : '1px solid rgba(254,210,0,0.2)',
//                 '&:hover': { 
//                   bgcolor: allSel ? '#FFC107' : 'rgba(254,210,0,0.12)',
//                 },
//                 '&.Mui-disabled': {
//                   bgcolor: 'rgba(254,210,0,0.12)',
//                   color: 'rgba(0,0,0,0.4)',
//                 },
//               }}
//             >
//               Alert All
//             </Button>
//           </Box>
//         </Box>

//         {/* BOTTOM CARD: Alerts List */}
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
//           {/* Header */}
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
//             <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>
//               Alerts List
//             </Typography>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//               <TextField
//                 size="small"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setPage(0);
//                 }}
//                 sx={{
//                   width: 180,
//                   '& .MuiOutlinedInput-root': {
//                     height: 36,
//                     bgcolor: 'rgba(255,255,255,0.04)',
//                     borderRadius: 2,
//                   },
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(255,255,255,0.14)',
//                   },
//                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: 'rgba(255,255,255,0.22)',
//                   },
//                   '& .MuiOutlinedInput-input': {
//                     color: '#fff',
//                     fontSize: 13,
//                   },
//                 }}
//               />

//               <FormControl size="small" sx={{ minWidth: 130 }}>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
//                   Location
//                 </InputLabel>
//                 <Select
//                   value={locFilter}
//                   label="Location"
//                   onChange={(e) => {
//                     setLocFilter(e.target.value);
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
//                   {locations.map((loc) => (
//                     <MenuItem key={loc} value={loc}>
//                       {loc}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <FormControl size="small" sx={{ minWidth: 130 }}>
//                 <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
//                   Alert Status
//                 </InputLabel>
//                 <Select
//                   value={statusFilter}
//                   label="Alert Status"
//                   onChange={(e) => {
//                     setStatusFilter(e.target.value);
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
//                   {alertStatuses.map((st) => (
//                     <MenuItem key={st} value={st}>
//                       {st}
//                     </MenuItem>
//                   ))}
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
//                         {["Sr No", "Helmet Id", "Username", "Location", "Date", "Time", "Alert"].map(
//                           (col) => (
//                             <TableCell
//                               key={col}
//                               sx={{
//                                 backgroundColor: 'rgba(20,20,22,0.95)',
//                                 color: 'rgba(255,255,255,0.9)',
//                                 fontSize: 12,
//                                 fontWeight: 600,
//                                 padding: '10px 12px',
//                                 borderBottom: '1px solid rgba(255,255,255,0.12)',
//                                 position: 'sticky',
//                                 top: 0,
//                                 zIndex: 2,
//                                 whiteSpace: 'nowrap',
//                               }}
//                             >
//                               {col}
//                             </TableCell>
//                           )
//                         )}
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
//                       {filtered
//                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                         .map((r) => (
//                           <TableRow key={r.sr} hover>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
//                               {r.sr}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {r.helmetId}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {r.username}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {r.location}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {r.date}
//                             </TableCell>
//                             <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
//                               {r.time}
//                             </TableCell>
//                             <TableCell
//                               sx={{
//                                 fontWeight: 600,
//                                 color: r.alert === 'Triggered' ? '#FFC107' : '#F44336',
//                               }}
//                             >
//                               {r.alert}
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>

//                 <TablePagination
//                   rowsPerPageOptions={[5, 10, 25, 50]}
//                   component="div"
//                   count={filtered.length}
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

//       {/* RIGHT SECTION - Stats (22%) */}
//       <Box
//         sx={{
//           flex: '0 0 calc(22% - 8px)',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           minHeight: 0,
//           overflow: 'hidden',
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
//             height: 'calc(50% - 4px)',
//             overflow: 'hidden',
//           }}
//         >
//           <Typography 
//             sx={{ 
//               color: '#fff', 
//               fontWeight: 600, 
//               fontSize: 16,
//               mb: 1.5,
//               flexShrink: 0,
//             }}
//           >
//             Alert Stats
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
//                     data={healthData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={50}
//                     outerRadius={65}
//                     dataKey="value"
//                   >
//                     {healthData.map((e, i) => (
//                       <Cell key={i} fill={e.color} />
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
//                   {totalHealth}
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
//               {healthData.map((item) => {
//                 const pct = totalHealth ? Math.round((item.value / totalHealth) * 100) : 0;
//                 return (
//                   <Box 
//                     key={item.name} 
//                     sx={{ 
//                       display: 'flex', 
//                       flexDirection: 'column', 
//                       alignItems: 'center',
//                       gap: 0.3,
//                     }}
//                   >
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
//                       <Box 
//                         sx={{ 
//                           width: 10, 
//                           height: 10, 
//                           borderRadius: '50%', 
//                           bgcolor: item.color,
//                         }} 
//                       />
//                       <Typography 
//                         sx={{ 
//                           color: 'rgba(255,255,255,0.85)', 
//                           fontSize: 11,
//                           fontWeight: 500,
//                         }}
//                       >
//                         {item.name}
//                       </Typography>
//                     </Box>
//                     <Typography 
//                       sx={{ 
//                         color: '#fff', 
//                         fontWeight: 600, 
//                         fontSize: 12,
//                       }}
//                     >
//                       {pct}%
//                     </Typography>
//                   </Box>
//                 );
//               })}
//             </Box>
//           </Box>
//         </Box>

//         {/* Threshold Ranges */}
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
//                 { p: "Alcohol", r: "0.02% - 0.05%" },
//                 { p: "Heart Rate", r: "60 bpm - 90 bpm" },
//                 { p: "Carbon Monoxide", r: "0.8 ppm - 2.0 ppm" },
//                 { p: "Nitrogen Dioxide", r: "0.3 ppm - 0.8 ppm" },
//                 { p: "Volatile Gas", r: "0.1 ppm - 0.4 ppm" },
//                 { p: "Env. Temp", r: "25°C - 32°C" },
//                 { p: "Object Temp", r: "29°C - 35°C" },
//               ].map((item) => (
//                 <Box
//                   key={item.p}
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
//                     {item.p}
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
//                     {item.r}
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

// src/pages/Alerts.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Divider,
  TablePagination,
} from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { fetchLatestForHelmet, type SmartHelmet } from "../services/helmetService";

/** Dynamo/AppSync sends datetime like "2026-01-09 11:40:15"
 *  JS Date parsing can be inconsistent for that format,
 *  so we normalize to "2026-01-09T11:40:15"
 */
function parseHelmetDatetime(dt?: string | null): Date {
  if (!dt) return new Date();
  const normalized = dt.includes("T") ? dt : dt.replace(" ", "T");
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? new Date() : d;
}

function fmtDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function fmtHHMM(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

type AlertRow = {
  sr: number;
  helmetId: string;
  username: string;
  location: string;
  date: string;
  time: string;
  alert: "Triggered" | "Failed";
};

export default function Alerts() {
  // --- pagination + table state ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [locFilter, setLocFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // --- top-card dropdowns ---
  const helmetIds = ["All", "01"];
  const [selectedHelmet, setSelectedHelmet] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const locations = ["All", "Warehouse A", "Gate 3", "Loading Dock"];
  const alertStatuses = ["All", "Triggered", "Failed"];

  // enable logic for top buttons
  const single = selectedHelmet !== "All";
  const byLoc = selectedHelmet === "All" && selectedLocation !== "All";
  const allSel = selectedHelmet === "All" && selectedLocation === "All";

  // --- live fetch (helmet 01 latest) ---
  const [latest01, setLatest01] = useState<SmartHelmet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await fetchLatestForHelmet("01");
        if (!mounted) return;
        setLatest01(data);
        setError(null);
        setLoading(false);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load helmet 01");
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

  // --- build ONLY 2 rows from helmet 01 ---
  const baseRows: AlertRow[] = useMemo(() => {
    if (!latest01) return [];

    const base = parseHelmetDatetime(latest01.datetime);
    const older = new Date(base.getTime() - 60_000);

    return [
      {
        sr: 1,
        helmetId: "01",
        username: "test",
        location: "Warehouse A",
        date: fmtDDMMYYYY(base),
        time: fmtHHMM(base),
        alert: "Triggered",
      },
      {
        sr: 2,
        helmetId: "01",
        username: "test",
        location: "Gate 3",
        date: fmtDDMMYYYY(older),
        time: fmtHHMM(older),
        alert: "Failed",
      },
    ];
  }, [latest01]);

  // filter + search
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return baseRows
      .filter((r) => {
        if (q) {
          const fields = [r.sr, r.helmetId, r.username, r.location, r.date, r.time, r.alert];
          const ok = fields.some((v) => String(v).toLowerCase().includes(q));
          if (!ok) return false;
        }

        if (locFilter !== "All" && r.location !== locFilter) return false;
        if (statusFilter !== "All" && r.alert !== statusFilter) return false;

        if (selectedHelmet !== "All" && r.helmetId !== selectedHelmet) return false;
        if (selectedHelmet === "All" && selectedLocation !== "All" && r.location !== selectedLocation)
          return false;

        return true;
      })
      .sort((a, b) => a.sr - b.sr);
  }, [baseRows, searchTerm, locFilter, statusFilter, selectedHelmet, selectedLocation]);

  // pagination handlers
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  // ✅ Right-side pie (based on filtered rows, like Dashboard)
  const alertPieData = useMemo(() => {
    const total = filtered.length;
    const denom = total || 1;

    const moderate = filtered.filter((r) => r.alert === "Triggered").length;
    const critical = filtered.filter((r) => r.alert === "Failed").length;

    // Pie needs at least one positive value; keep donut visible even when total=0
    const safeModerate = total === 0 ? 1 : moderate;

    const items = [
      {
        name: "Moderate",
        value: safeModerate,
        percentage: Math.round((moderate / denom) * 100),
        color: "#FFC107",
      },
      {
        name: "Critical",
        value: critical,
        percentage: Math.round((critical / denom) * 100),
        color: "#F44336",
      },
    ].filter((x) => x.value > 0);

    return items.length
      ? items
      : [{ name: "Moderate", value: 1, percentage: 0, color: "#FFC107" }];
  }, [filtered]);

  const totalAlerts = filtered.length;

  const pctFor = (name: "Moderate" | "Critical") =>
    alertPieData.find((p) => p.name === name)?.percentage ?? 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: 2,
        width: "100%",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        pt: 0.5,
        px: 0.3,
        pb: 0.1,
      }}
    >
      {/* LEFT SECTION (78%) */}
      <Box
        sx={{
          flex: "0 0 calc(78% - 8px)",
          display: "flex",
          flexDirection: "column",
          gap: 1, // ✅ tighter (more room for table)
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* TOP CARD - tighter + no Live chip */}
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 0.9,
            flexShrink: 0,
            minHeight: 43, // ✅ tighter than before
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
              Generate Alerts
            </Typography>
            {/* ✅ removed the live chip as requested */}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            {/* Helmet ID */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
              <Select
                value={selectedHelmet}
                label="Helmet ID"
                onChange={(e) => {
                  setSelectedHelmet(e.target.value);
                  setPage(0);
                }}
                sx={{
                  bgcolor: "#1C1C1E",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 1,
                  height: 34,
                  fontSize: 12,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": { py: 0.6, px: 1.25 },
                  "& .MuiSelect-icon": { color: "#888" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#28282B",
                      color: "#fff",
                      "& .MuiMenuItem-root": {
                        color: "#fff",
                        fontSize: 12,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                        "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.12)" },
                      },
                    },
                  },
                }}
              >
                {helmetIds.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Location */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
              <Select
                value={selectedLocation}
                label="Location"
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setPage(0);
                }}
                sx={{
                  bgcolor: "#1C1C1E",
                  color: "#fff",
                  border: "1px solid #333",
                  borderRadius: 1,
                  height: 34,
                  fontSize: 12,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": { py: 0.6, px: 1.25 },
                  "& .MuiSelect-icon": { color: "#888" },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "#28282B",
                      color: "#fff",
                      "& .MuiMenuItem-root": {
                        color: "#fff",
                        fontSize: 12,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                        "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.12)" },
                      },
                    },
                  },
                }}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Buttons - tighter */}
            <Button
              variant="contained"
              disabled={!single}
              sx={{
                bgcolor: single ? "#FED200" : "rgba(254,210,0,0.12)",
                color: single ? "#000" : "rgba(0,0,0,0.4)",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 2,
                height: 34,
                px: 2,
                textTransform: "none",
                border: single
                  ? "1px solid rgba(254,210,0,0.3)"
                  : "1px solid rgba(254,210,0,0.2)",
                "&:hover": { bgcolor: single ? "#FFC107" : "rgba(254,210,0,0.12)" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(254,210,0,0.12)",
                  color: "rgba(0,0,0,0.4)",
                },
              }}
            >
              Alert One
            </Button>

            <Button
              variant="contained"
              disabled={!byLoc}
              sx={{
                bgcolor: byLoc ? "#FED200" : "rgba(254,210,0,0.12)",
                color: byLoc ? "#000" : "rgba(0,0,0,0.4)",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 2,
                height: 34,
                px: 2,
                textTransform: "none",
                border: byLoc
                  ? "1px solid rgba(254,210,0,0.3)"
                  : "1px solid rgba(254,210,0,0.2)",
                "&:hover": { bgcolor: byLoc ? "#FFC107" : "rgba(254,210,0,0.12)" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(254,210,0,0.12)",
                  color: "rgba(0,0,0,0.4)",
                },
              }}
            >
              Alert Location
            </Button>

            <Button
              variant="contained"
              disabled={!allSel}
              sx={{
                bgcolor: allSel ? "#FED200" : "rgba(254,210,0,0.12)",
                color: allSel ? "#000" : "rgba(0,0,0,0.4)",
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 2,
                height: 34,
                px: 2,
                textTransform: "none",
                border: allSel
                  ? "1px solid rgba(254,210,0,0.3)"
                  : "1px solid rgba(254,210,0,0.2)",
                "&:hover": { bgcolor: allSel ? "#FFC107" : "rgba(254,210,0,0.12)" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(254,210,0,0.12)",
                  color: "rgba(0,0,0,0.4)",
                },
              }}
            >
              Alert All
            </Button>
          </Box>
        </Box>

        {/* BOTTOM CARD: Alerts List */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 2,
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 16 }}>
              Alerts List
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(0);
                }}
                sx={{
                  width: 180,
                  "& .MuiOutlinedInput-root": {
                    height: 36,
                    bgcolor: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.14)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.22)",
                  },
                  "& .MuiOutlinedInput-input": {
                    color: "#fff",
                    fontSize: 13,
                  },
                }}
              />

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                  Location
                </InputLabel>
                <Select
                  value={locFilter}
                  label="Location"
                  onChange={(e) => {
                    setLocFilter(e.target.value);
                    setPage(0);
                  }}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.14)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.22)",
                    },
                    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.6)" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "rgba(20,20,20,0.98)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        mt: 0.5,
                        "& .MuiMenuItem-root": {
                          color: "#fff",
                          fontSize: 13,
                          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                          "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.12)" },
                        },
                      },
                    },
                  }}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
                  Alert Status
                </InputLabel>
                <Select
                  value={statusFilter}
                  label="Alert Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    color: "#fff",
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.14)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.22)",
                    },
                    "& .MuiSelect-icon": { color: "rgba(255,255,255,0.6)" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "rgba(20,20,20,0.98)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        mt: 0.5,
                        "& .MuiMenuItem-root": {
                          color: "#fff",
                          fontSize: 13,
                          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                          "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.12)" },
                        },
                      },
                    },
                  }}
                >
                  {alertStatuses.map((st) => (
                    <MenuItem key={st} value={st}>
                      {st}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Table Area */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {loading && (
              <Box sx={{ p: 3 }}>
                <Typography sx={{ color: "#fff" }}>Loading…</Typography>
              </Box>
            )}

            {error && (
              <Box sx={{ p: 3 }}>
                <Typography sx={{ color: "#f44336" }}>{error}</Typography>
              </Box>
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
                      borderColor: "rgba(255,255,255,0.08)",
                      textAlign: "center",
                    },
                    "&::-webkit-scrollbar": { width: "8px", height: "8px" },
                    "&::-webkit-scrollbar-thumb": {
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "4px",
                      "&:hover": { background: "rgba(255,255,255,0.3)" },
                    },
                    "&::-webkit-scrollbar-track": { background: "transparent" },
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      "& .MuiTableRow-root:hover": { backgroundColor: "rgba(255,255,255,0.04)" },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        {["Sr No", "Helmet Id", "Username", "Location", "Date", "Time", "Alert"].map(
                          (col) => (
                            <TableCell
                              key={col}
                              sx={{
                                bgcolor: "rgba(255,255,255,0.05)",
                                color: "rgba(255,255,255,0.9)",
                                fontSize: 12,
                                fontWeight: 500,
                                padding: "10px 12px",
                                borderBottom: "1px solid rgba(255,255,255,0.12)",
                                position: "sticky",
                                top: 0,
                                zIndex: 2,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {col}
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    </TableHead>

                    <TableBody
                      sx={{
                        "& .MuiTableCell-body": {
                          fontSize: 12,
                          padding: "10px 12px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        },
                      }}
                    >
                      {filtered
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((r) => (
                          <TableRow key={r.sr} hover>
                            <TableCell sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                              {r.sr}
                            </TableCell>
                            <TableCell sx={{ color: "rgba(255,255,255,0.75)" }}>{r.helmetId}</TableCell>
                            <TableCell sx={{ color: "rgba(255,255,255,0.75)" }}>{r.username}</TableCell>
                            <TableCell sx={{ color: "rgba(255,255,255,0.75)" }}>{r.location}</TableCell>
                            <TableCell sx={{ color: "rgba(255,255,255,0.75)" }}>{r.date}</TableCell>
                            <TableCell sx={{ color: "rgba(255,255,255,0.75)" }}>{r.time}</TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: r.alert === "Triggered" ? "#FFC107" : "#F44336",
                              }}
                            >
                              {r.alert}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filtered.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    "& .MuiTablePagination-selectLabel": { fontSize: 12 },
                    "& .MuiTablePagination-displayedRows": { fontSize: 12 },
                    "& .MuiTablePagination-selectIcon": { color: "rgba(255,255,255,0.6)" },
                    "& .MuiTablePagination-select": { color: "#fff", fontSize: 12 },
                    "& .MuiIconButton-root": {
                      color: "rgba(255,255,255,0.6)",
                      padding: "6px",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                      "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
                    },
                    px: 2,
                    py: 1,
                    minHeight: "52px",
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
          flex: "0 0 calc(22% - 8px)",
          display: "flex",
          flexDirection: "column",
          gap: 1.5, // ✅ matches dashboard
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Alert Stats - same sizing as Dashboard (fixed 200px, bigger donut) */}
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            height: "200px",
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              mb: 1,
              color: "#fff",
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            Alert Stats
          </Typography>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.9,
              minHeight: 0,
            }}
          >
            <Box sx={{ width: "100%", height: "125px", position: "relative", flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {alertPieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center text */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 400,
                    fontSize: 9,
                    lineHeight: 1.2,
                  }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {totalAlerts}
                </Typography>
              </Box>
            </Box>

            {/* Legend - single row (Moderate | Critical) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 1,
                px: 0.5,
                flexShrink: 0,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#FFC107" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 10, whiteSpace: "nowrap" }}>
                  Trigerred 
                </Typography>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap" }}>
                  {pctFor("Moderate")}%
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#F44336" }} />
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 10, whiteSpace: "nowrap" }}>
                  Failed
                </Typography>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap" }}>
                  {pctFor("Critical")}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Threshold Ranges - same sizing as Dashboard */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 500,
              fontSize: 14,
              mb: 1,
              flexShrink: 0,
            }}
          >
            Threshold Ranges
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 1.5, flexShrink: 0 }} />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              pr: 0.5,
              minHeight: 0,
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,0.2)",
                borderRadius: "3px",
                "&:hover": { background: "rgba(255,255,255,0.3)" },
              },
              "&::-webkit-scrollbar-track": { background: "transparent" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { p: "Alcohol", r: "0.02% - 0.05%" },
                { p: "Heart Rate", r: "60 bpm - 90 bpm" },
                { p: "Carbon Monoxide", r: "0.8 ppm - 2.0 ppm" },
                { p: "Nitrogen Dioxide", r: "0.3 ppm - 0.8 ppm" },
                { p: "Volatile Gas", r: "0.1 ppm - 0.4 ppm" },
                { p: "Env. Temp", r: "25°C - 32°C" },
                { p: "Object Temp", r: "29°C - 35°C" },
              ].map((item) => (
                <Box
                  key={item.p}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12,
                      fontWeight: 500,
                      flex: 1,
                    }}
                  >
                    {item.p}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: 12,
                      fontWeight: 500,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.r}
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
