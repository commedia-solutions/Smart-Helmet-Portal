// src/pages/UsersList.tsx
import { useState, useEffect, useMemo } from "react";
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
  Card,
  CardContent,
  Divider,
} from "@mui/material";

import UpdateUserModal, { type UserRow } from "../Components/UpdateUserModal";

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

const selectSx = {
  bgcolor: "#1C1C1E",
  color: "#fff",
  border: "1px solid #333",
  borderRadius: 1,
  height: 34,
  fontSize: 12,
  "& .MuiSelect-select": { py: 0.6, px: 1.25 },
  "& .MuiSelect-icon": { color: "#888", fontSize: 18 },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
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

/* ---------------- dummy fallback ---------------- */
const DUMMY_USERS: UserRow[] = [
  { id: 1, helmetId: "01", user: "Alice", mobile: "9999911111", location: "Warehouse A", status: "Active" },
  { id: 2, helmetId: "02", user: "Bob", mobile: "9999922222", location: "Gate 3", status: "Active" },
  { id: 3, helmetId: "", user: "Carol", mobile: "9999933333", location: "Loading Dock", status: "Inactive" },
  { id: 4, helmetId: "03", user: "Dave", mobile: "9999944444", location: "Plant 2", status: "Active" },
  { id: 5, helmetId: "", user: "Eve", mobile: "9999955555", location: "Warehouse A", status: "Inactive" },
];

export default function UsersList() {
  // state
  const [rows, setRows] = useState<UserRow[]>([]);
  const [locations, setLocations] = useState<RawLocation[]>([]);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState<"All" | string>("All");
  const [filterHelmet, setFilterHelmet] = useState<"All" | string>("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // add-user (inline)
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newLocationId, setNewLocationId] = useState<number | "">("");

  // snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const showSnack = (severity: "success" | "error", msg: string) => {
    setSnackSeverity(severity);
    setSnackMsg(msg);
    setSnackOpen(true);
  };

  // load users + locations
  useEffect(() => {
    let mounted = true;

    async function load() {
      const [uRes, lRes] = await Promise.all([fetch(`${API}/users`), fetch(`${API}/locations`)]);
      const rawUsers = (await uRes.json()) as RawUser[];
      const rawLocs = (await lRes.json()) as RawLocation[];

      if (!mounted) return;

      const mapped: UserRow[] = rawUsers.map((u) => ({
        id: u.id,
        helmetId: u.helmetId ?? "",
        user: u.name,
        mobile: u.mobile,
        location: u.locationName,
        status: u.helmetId ? "Active" : "Inactive",
      }));

      // ✅ fallback dummy data so UI is never empty during dev
      setRows(mapped.length ? mapped : DUMMY_USERS);
      setLocations(rawLocs);
    }

    load().catch(() => {
      // if API fails, show dummy users anyway
      if (mounted) setRows(DUMMY_USERS);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const reloadUsers = async () => {
    const r = await fetch(`${API}/users`);
    const raw = (await r.json()) as RawUser[];
    const mapped: UserRow[] = raw.map((u) => ({
      id: u.id,
      helmetId: u.helmetId ?? "",
      user: u.name,
      mobile: u.mobile,
      location: u.locationName,
      status: u.helmetId ? "Active" : "Inactive",
    }));
    setRows(mapped.length ? mapped : DUMMY_USERS);
  };

  // update user
  const handleSave = async (upd: UserRow) => {
    try {
      const loc = locations.find((l) => l.name === upd.location);
      if (!loc) throw new Error("Invalid location");

      const res = await fetch(`${API}/users/${upd.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: upd.user,
          mobile: upd.mobile,
          locationId: loc.id,
        }),
      });

      if (!res.ok) throw await res.json();

      showSnack("success", `User "${upd.user}" updated`);
      setEditingUser(null);
      await reloadUsers();
    } catch (err: any) {
      showSnack("error", err?.error || err?.message || "Update failed");
    }
  };

  // delete user
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API}/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      showSnack("success", "User deleted successfully");
      setEditingUser(null);
      await reloadUsers();
    } catch (err: any) {
      showSnack("error", err?.message || "Delete failed");
    }
  };

  // add user
  const handleAddUser = async () => {
    const name = newName.trim();
    const mobile = newMobile.trim();

    if (!name) return showSnack("error", "Name is required");
    if (!mobile) return showSnack("error", "Mobile is required");
    if (!newLocationId) return showSnack("error", "Select a location");

    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          locationId: newLocationId,
        }),
      });

      if (!res.ok) throw await res.json();

      showSnack("success", `User "${name}" created`);
      setNewName("");
      setNewMobile("");
      setNewLocationId("");
      await reloadUsers();
    } catch (err: any) {
      showSnack("error", err?.error || err?.message || "Create user failed");
    }
  };

  // filters
  const helmetIds = useMemo(() => {
    const ids = Array.from(new Set(rows.map((r) => r.helmetId))).filter((x) => x && x.trim().length > 0);

    ids.sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
      return a.localeCompare(b);
    });

    return ids;
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (filterLocation !== "All" && r.location !== filterLocation) return false;
      if (filterHelmet !== "All" && r.helmetId !== filterHelmet) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const hay = [String(r.id), r.helmetId, r.user, r.mobile, r.location, r.status].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filterLocation, filterHelmet, searchTerm]);

  // ✅ stats: Assigned/Unassigned
  const totalUsers = rows.length;
  const assignedUsers = rows.filter((r) => (r.helmetId ?? "").trim().length > 0).length;
  const unassignedUsers = totalUsers - assignedUsers;

  // ✅ top card fixed compact height
  const TOP_CARD_H = 104;

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        // ✅ lift things up: smaller top padding + reduced gap
        pt: 6.5,
        px: 1.2,
        gap: 1.2,
        height: "calc(100vh - 70px)",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* TOP ROW */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", flexShrink: 0 }}>
        {/* Users Count Card (compact + assigned/unassigned on right) */}
        <Card sx={{ ...glassCard, height: TOP_CARD_H, minWidth: 320, flex: "0 0 360px" }}>
          <CardContent
            sx={{
              height: "100%",
              p: 1.6,
              "&:last-child": { pb: 1.6 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Left: Total */}
            <Box>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 800 }}>
                Total Users
              </Typography>
              <Typography sx={{ color: "#fff", fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
                {totalUsers}
              </Typography>
            </Box>

            {/* Right: Assigned / Unassigned vertical */}
            <Box sx={{ minWidth: 150 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700 }}>
                  Assigned
                </Typography>
                <Typography sx={{ color: "#FFD600", fontSize: 14, fontWeight: 900 }}>
                  {assignedUsers}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "rgba(255,255,255,0.16)", my: 0.6 }} />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700 }}>
                  Unassigned
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 900 }}>
                  {unassignedUsers}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Add User Card (compact row, no empty bottom space) */}
        <Card sx={{ ...glassCard, height: TOP_CARD_H, flex: "1 1 520px", minWidth: 520 }}>
          <CardContent
            sx={{
              height: "100%",
              p: 1.6,
              "&:last-child": { pb: 1.6 },
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              flexWrap: "wrap",
            }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 900, mr: 0.5 }}>
              Add User
            </Typography>

            <TextField
              size="small"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={{ width: 220, ...darkInputSx }}
            />

            <TextField
              size="small"
              placeholder="Mobile"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              sx={{ width: 190, ...darkInputSx }}
            />

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
              <Select
                value={newLocationId}
                label="Location"
                onChange={(e) => {
                  const v = String(e.target.value ?? "");
                  setNewLocationId(v === "" ? "" : Number(v));
                }}
                sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ ml: "auto" }}>
              <Button
                variant="contained"
                sx={yellowBtnSx}
                disabled={!newName.trim() || !newMobile.trim() || !newLocationId}
                onClick={handleAddUser}
              >
                Create
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* TABLE CARD */}
      <Card sx={{ ...glassCard, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
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
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", fontWeight: 900 }}>
            Users
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ width: 260, ...darkInputSx }}
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
              <Select
                value={filterLocation}
                label="Location"
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setPage(0);
                }}
                sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="All">All</MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l.id} value={l.name}>
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
              <Select
                value={filterHelmet}
                label="Helmet ID"
                onChange={(e) => {
                  setFilterHelmet(e.target.value);
                  setPage(0);
                }}
                sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="All">All</MenuItem>
                {helmetIds.map((id) => (
                  <MenuItem key={id} value={id}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1.5, py: 1, overflow: "hidden", minHeight: 0 }}>
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
                  {["Sr No", "Helmet ID", "User", "Mobile", "Location", "Status", "Update"].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        backgroundColor: "rgba(40,40,45,1)",
                        color: "rgba(255,255,255,0.9)",
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
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  },
                }}
              >
                {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r, i) => {
                  const srNo = page * rowsPerPage + i + 1;
                  return (
                    <TableRow key={r.id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{srNo}</TableCell>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.helmetId || "-"}</TableCell>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.user}</TableCell>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.mobile}</TableCell>
                      <TableCell sx={{ color: "rgba(255,255,255,0.85)" }}>{r.location}</TableCell>
                      <TableCell sx={{ color: r.status === "Active" ? "#4CAF50" : "#F44336", fontWeight: 900 }}>
                        {r.status}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "#fff",
                            borderColor: "rgba(255,255,255,0.28)",
                            textTransform: "none",
                            fontSize: 11,
                            py: 0.4,
                            "&:hover": { borderColor: "#FFD600", bgcolor: "rgba(255,214,0,0.08)" },
                          }}
                          onClick={() => setEditingUser(r)}
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
            onPageChange={(_, newPage) => setPage(newPage)}
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
      </Card>

      {/* Update Modal */}
      {editingUser && (
        <UpdateUserModal
          open={true}
          row={editingUser}
          helmets={helmetIds}
          users={[]} // not used
          locations={locations.map((l) => l.name)}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
          onDelete={handleDelete}
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
