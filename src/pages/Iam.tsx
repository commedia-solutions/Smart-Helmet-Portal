// src/pages/Iam.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import UpdateIamModal from "../Components/UpdateIamModal";
import type { IAMRow } from "../Components/UpdateIamModal";

/* ---------------- shared styles ---------------- */
const glassCard = {
  bgcolor: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 2,
};

const thinScrollbar = {
  "&::-webkit-scrollbar": { width: "6px", height: "6px" },
  "&::-webkit-scrollbar-thumb": {
    background: "#333",
    borderRadius: "3px",
    "&:hover": { background: "#444" },
  },
  "&::-webkit-scrollbar-track": { background: "transparent" },
};

const darkSelectSx = {
  bgcolor: "#1C1C1E",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 1,
  height: 34,
  fontSize: 12,
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": { py: 0.6, px: 1.25 },
  "& .MuiSelect-icon": { color: "#888" },
};

const darkInputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#1C1C1E",
    border: "1px solid #333",
    borderRadius: 1,
    height: 34,
    "& fieldset": { border: "none" },
  },
  "& .MuiOutlinedInput-input": { color: "#fff", fontSize: 12, py: 0.6 },
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

const softBtnSx = {
  height: 34,
  fontSize: 12,
  fontWeight: 800,
  textTransform: "none",
  bgcolor: "rgba(255,255,255,0.10)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.16)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
};

type Helmet = { deviceId: string };
type LocationRow = { id: number; name: string };

/* ---------------- dummy data ---------------- */
const DUMMY_HELMETS: Helmet[] = Array.from({ length: 12 }).map((_, i) => ({
  deviceId: String(i + 1).padStart(2, "0"),
}));

const DUMMY_LOCATIONS: LocationRow[] = [
  { id: 1, name: "Warehouse A" },
  { id: 2, name: "Gate 3" },
  { id: 3, name: "Loading Dock" },
  { id: 4, name: "Plant 2" },
  { id: 5, name: "Assembly Line" },
];

const mk = (id: number, helmetId: string, user: string, location: string): IAMRow => ({
  id,
  helmetId,
  user,
  location,
  status: helmetId ? "Active" : "Inactive",
});

const DUMMY_USERS: IAMRow[] = [
  mk(101, "01", "Alice", "Warehouse A"),
  mk(102, "02", "Bob", "Gate 3"),
  mk(103, "03", "Carol", "Loading Dock"),
  mk(104, "", "Dave", "Plant 2"),
  mk(105, "04", "Eve", "Warehouse A"),
  mk(106, "", "Frank", "Assembly Line"),
  mk(107, "05", "Grace", "Gate 3"),
  mk(108, "06", "Heidi", "Loading Dock"),
];

export default function Iam() {
  const navigate = useNavigate();

  // data (dummy)
  const [helmets] = useState<Helmet[]>(DUMMY_HELMETS);
  const [rows, setRows] = useState<IAMRow[]>(DUMMY_USERS);
  const [locationsList, setLocationsList] = useState<LocationRow[]>(DUMMY_LOCATIONS);

  // top controls
  const [selectedHelmet, setSelectedHelmet] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // add location modal
  const [addLocOpen, setAddLocOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  // update modal
  const [editingRow, setEditingRow] = useState<IAMRow | null>(null);

  // snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  // table filters + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState<"All" | string>("All");
  const [filterHelmet, setFilterHelmet] = useState<"All" | string>("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const usersList = useMemo(
    () => rows.map((r) => ({ id: r.id, name: r.user })).sort((a, b) => a.name.localeCompare(b.name)),
    [rows]
  );

  const showSnack = (severity: "success" | "error", msg: string) => {
    setSnackSeverity(severity);
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  /* ---------------- actions (dummy) ---------------- */

  // Assign helmet + location to selected user
  const handleAssignAll = () => {
    if (!selectedHelmet || !selectedUser || !selectedLocation) return;

    const conflict = rows.find((r) => r.helmetId === selectedHelmet && r.id !== selectedUser);
    if (conflict) {
      showSnack("error", `Helmet ${selectedHelmet} is already assigned to ${conflict.user}`);
      return;
    }

    const uname = rows.find((r) => r.id === selectedUser)?.user ?? "User";

    setRows((prev) =>
      prev.map((r) =>
        r.id === selectedUser
          ? { ...r, helmetId: selectedHelmet, location: selectedLocation, status: "Active" }
          : r
      )
    );

    showSnack("success", `Assigned ${selectedHelmet} → ${uname} (${selectedLocation})`);
    setSelectedHelmet("");
    // keep user/location optionally; but UX feels better to keep user selected
  };

  // Add new location (from modal)
  const handleAddNewLocation = () => {
    const name = newLocation.trim();
    if (!name) {
      showSnack("error", "Location name is required");
      return;
    }

    const exists = locationsList.some((l) => l.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      showSnack("error", `Location "${name}" already exists`);
      return;
    }

    const nextId = (Math.max(...locationsList.map((l) => l.id), 0) || 0) + 1;
    setLocationsList((prev) => [...prev, { id: nextId, name }]);
    setSelectedLocation(name);
    setNewLocation("");
    setAddLocOpen(false);
    showSnack("success", `Location "${name}" added`);
  };

  // Save update from modal (dummy)
  const handleSaveUpdate = (f: IAMRow) => {
    if (f.helmetId) {
      const conflict = rows.find((r) => r.helmetId === f.helmetId && r.id !== f.id);
      if (conflict) {
        showSnack("error", `Helmet ${f.helmetId} is already assigned to ${conflict.user}`);
        return;
      }
    }

    const locOK = locationsList.some((l) => l.name === f.location);
    if (!locOK) {
      showSnack("error", "Invalid location");
      return;
    }

    const status = f.helmetId ? "Active" : "Inactive";
    setRows((prev) => prev.map((r) => (r.id === f.id ? { ...f, status } : r)));
    setEditingRow(null);
    showSnack("success", `User ${f.user} updated`);
  };

  // Delete user (dummy)
  const handleDeleteUser = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    setEditingRow(null);
    showSnack("success", `User ${id} deleted`);
  };

  /* ---------------- filtering ---------------- */

  // Assigned base for main table
  const assignedBase = useMemo(() => rows.filter((r) => !!r.helmetId), [rows]);

  const filteredRows = useMemo(() => {
    return assignedBase.filter((r) => {
      if (filterLocation !== "All" && r.location !== filterLocation) return false;
      if (filterHelmet !== "All" && r.helmetId !== filterHelmet) return false;

      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        const hay = [r.helmetId, r.user, r.location, r.status].join(" ").toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [assignedBase, filterLocation, filterHelmet, searchTerm]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        gap: 2,
        overflow: "hidden",
      }}
    >
      {/* TOP CONTROLS (updated layout) */}
      <Card sx={{ ...glassCard, flexShrink: 0 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            flexWrap: "wrap",
            p: 2,
            "&:last-child": { pb: 2 },
          }}
        >
          {/* Assign user group */}
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 800 }}>
            Assign User
          </Typography>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
            <Select
              value={selectedHelmet}
              label="Helmet ID"
              onChange={(e) => setSelectedHelmet(e.target.value)}
              sx={darkSelectSx}
              MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {helmets
                .slice()
                .sort((a, b) => +a.deviceId - +b.deviceId)
                .map((h) => (
                  <MenuItem key={h.deviceId} value={h.deviceId}>
                    {h.deviceId}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Select User</InputLabel>
            <Select
              value={selectedUser}
              label="Select User"
             onChange={(e) => {
  const v = String(e.target.value ?? "");   // ✅ always string
  const uid: number | "" = v === "" ? "" : Number(v);

  setSelectedUser(uid);

  // helpful UX: prefill location if user exists
  if (uid !== "") {
    const u = rows.find((r) => r.id === uid);
    if (u) setSelectedLocation(u.location || "");
  }
}}

              sx={darkSelectSx}
              MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {usersList.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.22)" }}
          />

          {/* Location group */}
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 800 }}>
            Select Location
          </Typography>

          <FormControl size="small" sx={{ minWidth: 210 }}>
            <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
            <Select
              value={selectedLocation}
              label="Location"
              onChange={(e) => setSelectedLocation(e.target.value)}
              sx={darkSelectSx}
              MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {locationsList.map((l) => (
                <MenuItem key={l.id} value={l.name}>
                  {l.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => setAddLocOpen(true)} sx={softBtnSx}>
            Add New
          </Button>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.22)" }}
          />

          {/* Final action */}
          <Button
            variant="contained"
            disabled={!selectedHelmet || !selectedUser || !selectedLocation}
            onClick={handleAssignAll}
            sx={yellowBtnSx}
          >
            Assign
          </Button>
        </CardContent>
      </Card>

      {/* MAIN AREA */}
      <Box sx={{ flex: 1, minHeight: 0, display: "flex", gap: 2.5, overflow: "hidden" }}>
        {/* LEFT: TABLE */}
        <Card
          sx={{
            ...glassCard,
            flex: "1 1 70%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* table header filters */}
          <Box
            sx={{
              px: 2.5,
              py: 1.8,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 800, flex: "1 1 auto", minWidth: 170 }}>
              Assigned Users
            </Typography>

            <TextField
              size="small"
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 200, ...darkInputSx }}
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
              <Select
                value={filterLocation}
                label="Location"
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setPage(0);
                }}
                sx={darkSelectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="All">All</MenuItem>
                {locationsList.map((l) => (
                  <MenuItem key={l.id} value={l.name}>
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
              <Select
                value={filterHelmet}
                label="Helmet ID"
                onChange={(e) => {
                  setFilterHelmet(e.target.value);
                  setPage(0);
                }}
                sx={darkSelectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="All">All</MenuItem>
                {helmets
                  .slice()
                  .sort((a, b) => +a.deviceId - +b.deviceId)
                  .map((h) => (
                    <MenuItem key={h.deviceId} value={h.deviceId}>
                      {h.deviceId}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {/* table area */}
          <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
            <TableContainer
              component={Paper}
              sx={{
                flex: 1,
                bgcolor: "transparent",
                boxShadow: "none",
                overflowY: "auto",
                "& .MuiTableCell-root": { borderColor: "rgba(255,255,255,0.1)", textAlign: "center" },
                ...thinScrollbar,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Sr No", "Helmet ID", "User", "Location", "Status", "Update"].map((col) => (
                      <TableCell
                        key={col}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "rgba(255,255,255,0.9)",
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "12px 16px",
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
                      padding: "10px 12px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, i) => {
                    const srNo = page * rowsPerPage + i + 1;
                    return (
                      <TableRow
                        key={r.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{srNo}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.helmetId}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.user}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.location}</TableCell>
                        <TableCell
                          sx={{
                            color: r.status === "Active" ? "#4CAF50" : "#F44336",
                            fontWeight: 900,
                          }}
                        >
                          {r.status}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "#fff",
                              borderColor: "rgba(255,255,255,0.28)",
                              fontSize: 11,
                              textTransform: "none",
                              py: 0.4,
                              "&:hover": {
                                borderColor: "#FFD600",
                                bgcolor: "rgba(255,214,0,0.08)",
                              },
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
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRows.length}
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
                flexShrink: 0,
                "& .MuiTablePagination-selectIcon": { color: "#fff" },
                "& .MuiInputBase-root .MuiSvgIcon-root": { color: "#fff" },
                "& .MuiTablePagination-displayedRows": { fontSize: "0.75rem" },
                "& .MuiTablePagination-select": { fontSize: "0.75rem" },
              }}
            />
          </Box>
        </Card>

        {/* RIGHT: USERS LIST */}
        <Card
          sx={{
            ...glassCard,
            flex: "0 0 28%",
            minWidth: 280,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 1.8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
              Users List
            </Typography>
            <Button
              size="small"
              sx={{
                color: "#FFD600",
                textTransform: "none",
                fontSize: 12,
                fontWeight: 800,
                "&:hover": { bgcolor: "rgba(255,214,0,0.08)" },
              }}
              onClick={() => navigate("/users")}
            >
              View All →
            </Button>
          </Box>

          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column", p: 1.5 }}>
            <TableContainer sx={{ flex: 1, minHeight: 0, overflowY: "auto", ...thinScrollbar }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {["Name", "Location", "Helmet"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          backgroundColor: "rgba(40,40,45,0.95)",
                          color: "rgba(255,255,255,0.9)",
                          fontSize: 11,
                          fontWeight: 900,
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          py: 1.2,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((u) => (
                    <TableRow key={u.id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)", fontSize: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {u.user}
                      </TableCell>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)", fontSize: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {u.location}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: u.helmetId ? "#FFD600" : "rgba(255,255,255,0.55)",
                          fontSize: 12,
                          fontWeight: 900,
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {u.helmetId || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Card>
      </Box>

      {/* Add Location Modal */}
      <Dialog
        open={addLocOpen}
        onClose={() => setAddLocOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#121214",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 2,
            minWidth: 420,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Add New Location</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder="Enter location name"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            sx={{ mt: 1, ...darkInputSx }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setAddLocOpen(false)} sx={softBtnSx}>
            Cancel
          </Button>
          <Button onClick={handleAddNewLocation} sx={yellowBtnSx} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Modal */}
      {editingRow && (
        <UpdateIamModal
          open
          row={editingRow}
          helmets={helmets.map((h) => h.deviceId).sort((a, b) => +a - +b)}
          users={usersList.map((u) => u.name)}
          locations={locationsList.map((l) => l.name)}
          onClose={() => setEditingRow(null)}
          onSave={handleSaveUpdate}
          onDelete={handleDeleteUser}
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
