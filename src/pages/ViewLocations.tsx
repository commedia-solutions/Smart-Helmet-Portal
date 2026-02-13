// // src/pages/ViewLocations.tsx
// import { useState, useEffect, useMemo } from "react";
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
//   Card,
//   TextField,
// } from "@mui/material";

// import UpdateLocationModal, { type LocationRow } from "../Components/UpdateLocationsmodal";

// const API = import.meta.env.VITE_API_BASE_URL!;

// /* ---------------- shared styles ---------------- */
// const glassCard = {
//   bgcolor: "rgba(255,255,255,0.05)",
//   backdropFilter: "blur(8px)",
//   border: "1px solid rgba(255,255,255,0.2)",
//   borderRadius: 2,
// };

// const thinScrollbar = {
//   "&::-webkit-scrollbar": { width: "6px", height: "6px" },
//   "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: "3px" },
//   "&::-webkit-scrollbar-track": { background: "transparent" },
// };

// export default function ViewLocations() {
//   const [rows, setRows] = useState<LocationRow[]>([]);
//   const [editing, setEditing] = useState<LocationRow | null>(null);

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRpp] = useState(10);

//   const [snackOpen, setSnackOpen] = useState(false);
//   const [snackMsg, setSnackMsg] = useState("");
//   const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

//   // load on mount
//   useEffect(() => {
//     let mounted = true;

//     async function load() {
//       try {
//         const res = await fetch(`${API}/locations`);
//         const data = (await res.json()) as LocationRow[];
//         if (mounted) setRows(data);
//       } catch (err) {
//         console.error(err);
//         setSnackSeverity("error");
//         setSnackMsg("Failed to load locations");
//         setSnackOpen(true);
//       }
//     }

//     load();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // reload helper
//   const reload = async () => {
//     const res = await fetch(`${API}/locations`);
//     const data = (await res.json()) as LocationRow[];
//     setRows(data);
//   };

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return rows;
//     return rows.filter((r) => `${r.id} ${r.name}`.toLowerCase().includes(q));
//   }, [rows, search]);

//   /* ✅ IMPORTANT: NO <MainLayout> here */
//   return (
//     <Box
//       sx={{
//         flex: 1,
//         display: "flex",
//         flexDirection: "column",
//         pt: 10,
//         px: 1.2,
//         gap: 1.5,
//         height: "calc(100vh - 90px)",
//         overflow: "hidden",
//         color: "#fff",
//       }}
//     >
//       <Card sx={{ ...glassCard, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             px: 2,
//             py: 1,
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//             gap: 2,
//             flexWrap: "wrap",
//           }}
//         >
//           <Typography variant="h6" sx={{ color: "#fff", fontWeight: 500 }}>
//             Locations
//           </Typography>

//           <TextField
//             size="small"
//             placeholder="Search location…"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(0);
//             }}
//             sx={{
//               width: 240,
//               "& .MuiOutlinedInput-root": { height: 32, bgcolor: "#1C1C1E" },
//               "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 12, py: 0.5 },
//               "& .MuiOutlinedInput-notchedOutline": { border: "1px solid #333" },
//             }}
//           />
//         </Box>

//         {/* Table */}
//         <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1.5, py: 1, overflow: "hidden" }}>
//           <TableContainer
//             component={Paper}
//             sx={{
//               flex: 1,
//               bgcolor: "transparent",
//               boxShadow: "none",
//               overflow: "auto",
//               "& .MuiTableCell-root": { borderColor: "rgba(255,255,255,0.1)", textAlign: "center" },
//               ...thinScrollbar,
//             }}
//           >
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {["Sr No", "Location Name", "Update"].map((col) => (
//                     <TableCell
//                       key={col}
//                       sx={{
//                         backgroundColor: "rgba(40,40,45,1)",
//                         color: "rgba(255,255,255,0.9)",
//                         fontSize: "0.75rem",
//                         fontWeight: 500,
//                         padding: "8px 12px",
//                         borderBottom: "1px solid rgba(255,255,255,0.2)",
//                       }}
//                     >
//                       {col}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>

//               <TableBody
//                 sx={{
//                   "& .MuiTableCell-body": {
//                     fontSize: "0.75rem",
//                     padding: "8px 6px",
//                     borderBottom: "1px solid rgba(255,255,255,0.05)",
//                   },
//                 }}
//               >
//                 {filtered
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((r, i) => {
//                     const srNo = page * rowsPerPage + i + 1;
//                     return (
//                       <TableRow key={r.id} hover>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{srNo}</TableCell>
//                         <TableCell sx={{ color: "rgba(255,255,255,0.8)" }}>{r.name}</TableCell>
//                         <TableCell align="center">
//                           <Button
//                             size="small"
//                             variant="outlined"
//                             sx={{ color: "#fff", borderColor: "#555", textTransform: "none" }}
//                             onClick={() => setEditing(r)}
//                           >
//                             Update
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={filtered.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={(_, newPage) => setPage(newPage)}
//             onRowsPerPageChange={(e) => {
//               setRpp(+e.target.value);
//               setPage(0);
//             }}
//             sx={{
//               color: "#fff",
//               borderTop: "1px solid rgba(255,255,255,0.2)",
//               px: 2,
//               "& .MuiTablePagination-selectIcon": { color: "#fff" },
//               "& .MuiInputBase-root .MuiSvgIcon-root": { color: "#fff" },
//             }}
//           />
//         </Box>
//       </Card>

//       {/* Update Modal */}
//       {editing && (
//         <UpdateLocationModal
//           open
//           row={editing}
//           onClose={() => setEditing(null)}
//           onSave={async (updated) => {
//             try {
//               const res = await fetch(`${API}/locations/${updated.id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ name: updated.name }),
//               });
//               if (!res.ok) throw await res.json();
//               setSnackSeverity("success");
//               setSnackMsg("Location updated");
//               await reload();
//             } catch (err: any) {
//               setSnackSeverity("error");
//               setSnackMsg(err?.error || err?.message || "Update failed");
//             } finally {
//               setSnackOpen(true);
//               setEditing(null);
//             }
//           }}
//           onDelete={async (id) => {
//             try {
//               const res = await fetch(`${API}/locations/${id}`, { method: "DELETE" });
//               if (!res.ok) throw new Error("Delete failed");
//               setSnackSeverity("success");
//               setSnackMsg("Location deleted");
//               await reload();
//             } catch (err: any) {
//               setSnackSeverity("error");
//               setSnackMsg(err?.message || "Delete failed");
//             } finally {
//               setSnackOpen(true);
//               setEditing(null);
//             }
//           }}
//         />
//       )}

//       {/* Snackbar */}
//       <Snackbar
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//         open={snackOpen}
//         autoHideDuration={3000}
//         onClose={() => setSnackOpen(false)}
//       >
//         <Alert severity={snackSeverity} onClose={() => setSnackOpen(false)} sx={{ width: "100%" }}>
//           {snackMsg}
//         </Alert>
//       </Snackbar>
//     </Box>
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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

const yellowBtnSx = {
  bgcolor: "#FFD600",
  color: "#000",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "none",
  height: 34,
  px: 2.2,
  "&:hover": { bgcolor: "#FFC107" },
  "&.Mui-disabled": {
    bgcolor: "rgba(128,128,128,0.3)",
    color: "rgba(255,255,255,0.5)",
  },
};

const outlineBtnSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.28)",
  fontSize: 11,
  textTransform: "none",
  py: 0.4,
  "&:hover": {
    borderColor: "#FFD600",
    bgcolor: "rgba(255,214,0,0.08)",
  },
};

/* ---------------- dummy data ---------------- */
const DUMMY_LOCATIONS: LocationRow[] = [
  { id: 1, name: "Warehouse A" },
  { id: 2, name: "Gate 3" },
  { id: 3, name: "Loading Dock" },
  { id: 4, name: "Plant 2" },
  { id: 5, name: "Assembly Line" },
  { id: 6, name: "Main Office" },
  { id: 7, name: "Storage Unit B" },
  { id: 8, name: "Quality Control" },
];

export default function ViewLocations() {
  const [rows, setRows] = useState<LocationRow[]>([]);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRpp] = useState(10);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const [dummyMode, setDummyMode] = useState(false);

  const showSnack = (severity: "success" | "error", msg: string) => {
    setSnackSeverity(severity);
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  // load on mount
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch(`${API}/locations`);
        const data = (await res.json()) as LocationRow[];
        if (!mounted) return;

        if (!data || data.length === 0) {
          setDummyMode(true);
          setRows(DUMMY_LOCATIONS);
        } else {
          setDummyMode(false);
          setRows(data);
        }
      } catch (err) {
        if (!mounted) return;
        console.error(err);
        setDummyMode(true);
        setRows(DUMMY_LOCATIONS);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // reload helper
  const reload = async () => {
    if (dummyMode) return;
    const res = await fetch(`${API}/locations`);
    const data = (await res.json()) as LocationRow[];
    setRows(data);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${r.id} ${r.name}`.toLowerCase().includes(q));
  }, [rows, search]);

  // Add new location
  const handleAddLocation = async () => {
    const name = newLocationName.trim();
    if (!name) {
      showSnack("error", "Location name is required");
      return;
    }

    if (dummyMode) {
      const nextId = Math.max(...rows.map((r) => r.id), 0) + 1;
      const newLoc: LocationRow = { id: nextId, name };
      setRows((prev) => [newLoc, ...prev]);
      setNewLocationName("");
      setAddModalOpen(false);
      showSnack("success", `Location "${name}" added`);
      return;
    }

    try {
      const res = await fetch(`${API}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw await res.json();

      showSnack("success", `Location "${name}" added`);
      setNewLocationName("");
      setAddModalOpen(false);
      await reload();
    } catch (err: any) {
      showSnack("error", err?.error || err?.message || "Failed to add location");
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        pt: 0.5,
        px: 0.8,
        pb: 1.5,
        gap: 1,
        height: "100%",
        minHeight: 0,
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
            px: 1.5,
            py: 0.8,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
            Locations
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setAddModalOpen(true)}
              sx={yellowBtnSx}
            >
              Add New Location
            </Button>

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
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1C1C1E",
                  border: "1px solid #333",
                  borderRadius: 1,
                  height: 34,
                  "& fieldset": { border: "none" },
                },
                "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 12, py: 0.6 },
              }}
            />
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1, py: 0.8, overflow: "hidden" }}>
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
                        bgcolor: "rgba(255,255,255,0.05)",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        padding: "10px 12px",
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
                    padding: "10px 8px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    color: "#fff",
                  },
                }}
              >
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r, i) => {
                    const srNo = page * rowsPerPage + i + 1;
                    return (
                      <TableRow key={r.id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                        <TableCell sx={{ color: "#fff" }}>{srNo}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>{r.name}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            sx={outlineBtnSx}
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
              px: 1.5,
              "& .MuiTablePagination-selectIcon": { color: "#fff" },
              "& .MuiInputBase-root .MuiSvgIcon-root": { color: "#fff" },
              "& .MuiTablePagination-displayedRows": { color: "#fff" },
              "& .MuiTablePagination-select": { color: "#fff" },
            }}
          />
        </Box>
      </Card>

      {/* Add Location Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setNewLocationName("");
        }}
        PaperProps={{
          sx: {
            bgcolor: "#1C1C1E",
            color: "#fff",
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>
          Add New Location
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Enter location name"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddLocation();
            }}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#28282B",
                border: "1px solid #333",
                borderRadius: 1,
                "& fieldset": { border: "none" },
              },
              "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 14, py: 1.2 },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setAddModalOpen(false);
              setNewLocationName("");
            }}
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.3)",
              textTransform: "none",
              px: 2.5,
              "&:hover": { borderColor: "#fff" },
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddLocation}
            sx={yellowBtnSx}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Modal */}
      {editing && (
        <UpdateLocationModal
          open
          row={editing}
          onClose={() => setEditing(null)}
          onSave={async (updated) => {
            if (dummyMode) {
              setRows((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
              setEditing(null);
              showSnack("success", "Location updated");
              return;
            }

            try {
              const res = await fetch(`${API}/locations/${updated.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: updated.name }),
              });
              if (!res.ok) throw await res.json();
              showSnack("success", "Location updated");
              await reload();
            } catch (err: any) {
              showSnack("error", err?.error || err?.message || "Update failed");
            } finally {
              setEditing(null);
            }
          }}
          onDelete={async (id) => {
            if (dummyMode) {
              setRows((prev) => prev.filter((x) => x.id !== id));
              setEditing(null);
              showSnack("success", "Location deleted");
              return;
            }

            try {
              const res = await fetch(`${API}/locations/${id}`, { method: "DELETE" });
              if (!res.ok) throw new Error("Delete failed");
              showSnack("success", "Location deleted");
              await reload();
            } catch (err: any) {
              showSnack("error", err?.message || "Delete failed");
            } finally {
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