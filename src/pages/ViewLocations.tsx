// // src/pages/ViewLocations.tsx
// import  { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Paper,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TablePagination,
//   Button,
//   Snackbar,
//   Alert,
// } from '@mui/material';
// import MainLayout from '../layout/MainLayout';
// import UpdateLocationModal, { type LocationRow } from '../Components/UpdateLocationsmodal';

// const API = import.meta.env.VITE_API_BASE_URL!;

// export default function ViewLocations() {
//   // ─── State ─────────────────────────────────────────────────────────
//   const [rows, setRows]           = useState<LocationRow[]>([]);
//   const [editing, setEditing]     = useState<LocationRow | null>(null);

//   const [page, setPage]           = useState(0);
//   const [rowsPerPage, setRpp]     = useState(10);

//   const [snackOpen, setSnackOpen]         = useState(false);
//   const [snackMsg, setSnackMsg]           = useState('');
//   const [snackSeverity, setSnackSeverity] = useState<'success'|'error'>('success');

//   // ─── Load on mount ───────────────────────────────────────────────────
//   useEffect(() => {
//     let mounted = true;
//     async function load() {
//       try {
//         const res = await fetch(`${API}/locations`);
//         const data = (await res.json()) as LocationRow[];
//         if (mounted) setRows(data);
//       } catch (err) {
//         console.error(err);
//         setSnackSeverity('error');
//         setSnackMsg('Failed to load locations');
//         setSnackOpen(true);
//       }
//     }
//     load();
//     return () => { mounted = false; };
//   }, []);

//   // helper to reload
//   const reload = async () => {
//     try {
//       const res = await fetch(`${API}/locations`);
//       const data = (await res.json()) as LocationRow[];
//       setRows(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ─── Render ──────────────────────────────────────────────────────────
//   return (
//     <MainLayout>
//       <Box
//         sx={{
//           flex:1,
//           display:'flex',
//           flexDirection:'column',
//           pt:10,
//           px:2,
//           gap:2,
//           height:'calc(100vh - 90px)',
//           overflow:'hidden'
//         }}
//       >
//         {/* Locations List Card */}
//         <Box sx={{
//           flex:1,
//           display:'flex',
//           flexDirection:'column',
//           bgcolor:'rgba(255,255,255,0.05)',
//           backdropFilter:'blur(8px)',
//           border:'1px solid rgba(255,255,255,0.2)',
//           borderRadius:2,
//           overflow:'hidden'
//         }}>
//           {/* Header */}
//           <Box sx={{
//             display:'flex',
//             alignItems:'center',
//             justifyContent:'space-between',
//             px:2, py:1,
//             borderBottom:'1px solid rgba(255,255,255,0.2)'
//           }}>
//             <Typography variant="h6" sx={{ color:'#fff', fontWeight:500 }}>
//               Locations List
//             </Typography>
//             {/* you could add search/filter here */}
//           </Box>

//           {/* Table */}
//           <Box sx={{
//             flex:1,
//             display:'flex',
//             flexDirection:'column',
//             px:1, py:1,
//             overflow:'hidden'
//           }}>
//             <TableContainer component={Paper} sx={{
//               flex:1,
//               bgcolor:'transparent',
//               boxShadow:'none',
//               overflowY:'auto',
//               '& .MuiTableCell-root': { borderColor:'rgba(255,255,255,0.1)', textAlign:'center' }
//             }}>
//               <Table stickyHeader>
//                 <TableHead>
//                   <TableRow>
//                     {['Sr No','Location Name','Update'].map(col => (
//                       <TableCell
//                         key={col}
//                         sx={{
//                           backgroundColor:'rgba(40,40,45,1)',
//                           color:'rgba(255,255,255,0.9)',
//                           fontSize:'0.75rem',
//                           fontWeight:500,
//                           padding:'8px 12px',
//                           borderBottom:'1px solid rgba(255,255,255,0.2)'
//                         }}
//                       >
//                         {col}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody sx={{
//                   '& .MuiTableCell-body': {
//                     fontSize:'0.75rem',
//                     padding:'8px 6px',
//                     borderBottom:'1px solid rgba(255,255,255,0.05)'
//                   }
//                 }}>
//                   {rows
//                     .slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
//                     .map((r,i) => {
//                       const srNo = page*rowsPerPage + i + 1;
//                       return (
//                         <TableRow key={r.id} hover>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
//                             {srNo}
//                           </TableCell>
//                           <TableCell sx={{ color:'rgba(255,255,255,0.8)' }}>
//                             {r.name}
//                           </TableCell>
//                           <TableCell align="center">
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               sx={{ color:'#fff', borderColor:'#555', textTransform:'none' }}
//                               onClick={()=>setEditing(r)}
//                             >
//                               Update
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   }
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <TablePagination
//               rowsPerPageOptions={[5,10,25]}
//               component="div"
//               count={rows.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={(_,newPage)=>setPage(newPage)}
//               onRowsPerPageChange={e=>{ setRpp(+e.target.value); setPage(0); }}
//               sx={{
//                 color:'#fff',
//                 borderTop:'1px solid rgba(255,255,255,0.2)',
//                 px:2,
//                 '& .MuiTablePagination-selectIcon':{ color:'#fff' }
//               }}
//             />
//           </Box>
//         </Box>

//         {/* Update Modal */}
//         {editing && (
//           <UpdateLocationModal
//             open
//             row={editing}
//             onClose={()=>setEditing(null)}
//             onSave={async updated => {
//               try {
//                 const res = await fetch(`${API}/locations/${updated.id}`, {
//                   method:'PUT',
//                   headers:{ 'Content-Type':'application/json' },
//                   body:JSON.stringify({ name: updated.name })
//                 });
//                 if (!res.ok) throw await res.json();
//                 setSnackSeverity('success');
//                 setSnackMsg('Location updated');
//                 await reload();
//               } catch (err: any) {
//                 setSnackSeverity('error');
//                 setSnackMsg(err.message || 'Update failed');
//               } finally {
//                 setSnackOpen(true);
//                 setEditing(null);
//               }
//             }}
//             onDelete={async id => {
//               try {
//                 const res = await fetch(`${API}/locations/${id}`, { method:'DELETE' });
//                 if (!res.ok) throw new Error('Delete failed');
//                 setSnackSeverity('success');
//                 setSnackMsg('Location deleted');
//                 await reload();
//               } catch (err: any) {
//                 setSnackSeverity('error');
//                 setSnackMsg(err.message || 'Delete failed');
//               } finally {
//                 setSnackOpen(true);
//                 setEditing(null);
//               }
//             }}
//           />
//         )}

//         {/* Snackbar */}
//         <Snackbar
//           anchorOrigin={{ vertical:'top', horizontal:'right' }}
//           open={snackOpen}
//           autoHideDuration={3000}
//           onClose={()=>setSnackOpen(false)}
//         >
//           <Alert
//             severity={snackSeverity}
//             onClose={()=>setSnackOpen(false)}
//             sx={{ width:'100%' }}
//           >
//             {snackMsg}
//           </Alert>
//         </Snackbar>
//       </Box>
//     </MainLayout>
//   );
// }



// src/pages/ViewLocations.tsx
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
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
  Card,
  TextField,
} from "@mui/material";

import UpdateLocationModal, { type LocationRow } from "../Components/UpdateLocationsmodal";

const API = import.meta.env.VITE_API_BASE_URL!;

/* ---------------- shared styles ---------------- */
const glassCard = {
  bgcolor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 2,
};

const thinScrollbar = {
  "&::-webkit-scrollbar": { width: "6px", height: "6px" },
  "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
};

export default function ViewLocations() {
  const [rows, setRows] = useState<LocationRow[]>([]);
  const [editing, setEditing] = useState<LocationRow | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRpp] = useState(10);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  // load on mount
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(`${API}/locations`);
        const data = (await res.json()) as LocationRow[];
        if (mounted) setRows(data);
      } catch (err) {
        console.error(err);
        setSnackSeverity("error");
        setSnackMsg("Failed to load locations");
        setSnackOpen(true);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // reload helper
  const reload = async () => {
    const res = await fetch(`${API}/locations`);
    const data = (await res.json()) as LocationRow[];
    setRows(data);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${r.id} ${r.name}`.toLowerCase().includes(q));
  }, [rows, search]);

  /* ✅ IMPORTANT: NO <MainLayout> here */
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        pt: 10,
        px: 1.2,
        gap: 1.5,
        height: "calc(100vh - 90px)",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      <Card sx={{ ...glassCard, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
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
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
            Locations
          </Typography>

          <TextField
            size="small"
            placeholder="Search location…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{
              width: 240,
              "& .MuiOutlinedInput-root": { height: 32, bgcolor: "#1C1C1E" },
              "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 12, py: 0.5 },
              "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #333" },
            }}
          />
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1.5, py: 1, overflow: "hidden" }}>
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              bgcolor: "transparent",
              boxShadow: "none",
              overflow: "auto",
              "& .MuiTableCell-root": { borderColor: "rgba(255,255,255,0.1)", textAlign: "center" },
              ...thinScrollbar,
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Sr No", "Location Name", "Update"].map((col) => (
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
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r, i) => {
                    const srNo = page * rowsPerPage + i + 1;
                    return (
                      <TableRow key={r.id} hover>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{srNo}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.name}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{ color: "#fff", borderColor: "#555", textTransform: "none" }}
                            onClick={() => setEditing(r)}
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
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRpp(+e.target.value);
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
      </Card>

      {/* Update Modal */}
      {editing && (
        <UpdateLocationModal
          open
          row={editing}
          onClose={() => setEditing(null)}
          onSave={async (updated) => {
            try {
              const res = await fetch(`${API}/locations/${updated.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: updated.name }),
              });
              if (!res.ok) throw await res.json();
              setSnackSeverity("success");
              setSnackMsg("Location updated");
              await reload();
            } catch (err: any) {
              setSnackSeverity("error");
              setSnackMsg(err?.error || err?.message || "Update failed");
            } finally {
              setSnackOpen(true);
              setEditing(null);
            }
          }}
          onDelete={async (id) => {
            try {
              const res = await fetch(`${API}/locations/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("Delete failed");
              setSnackSeverity("success");
              setSnackMsg("Location deleted");
              await reload();
            } catch (err: any) {
              setSnackSeverity("error");
              setSnackMsg(err?.message || "Delete failed");
            } finally {
              setSnackOpen(true);
              setEditing(null);
            }
          }}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity={snackSeverity} onClose={() => setSnackOpen(false)} sx={{ width: "100%" }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
