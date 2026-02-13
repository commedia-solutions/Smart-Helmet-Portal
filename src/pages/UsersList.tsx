// src/pages/UsersList.tsx
import { useEffect, useMemo, useState } from "react";
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

/* ---------------- shared styles (same vibe) ---------------- */
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
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": { py: 0.6, px: 1.25, color: "#fff" },
  "& .MuiSelect-icon": { color: "#888" },
};

const inputSx = {
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

/* ---------------- dummy fallback ---------------- */
const DUMMY_LOCATIONS: RawLocation[] = [
  { id: 1, name: "Warehouse A" },
  { id: 2, name: "Gate 3" },
  { id: 3, name: "Loading Dock" },
  { id: 4, name: "Plant 2" },
  { id: 5, name: "Assembly Line" },
];

const makeDummyUsers = (): RawUser[] => {
  const names = [
    "Alice",
    "Bob",
    "Carol",
    "Dave",
    "Eve",
    "Frank",
    "Grace",
    "Heidi",
    "Ivan",
    "Judy",
    "Mallory",
    "Oscar",
    "Peggy",
    "Trent",
    "Victor",
    "Wendy",
    "Yara",
    "Zack",
  ];

  return names.map((n, i) => {
    const loc = DUMMY_LOCATIONS[i % DUMMY_LOCATIONS.length];
    const assigned = i % 3 !== 0; // ~2/3 assigned
    const helmet = assigned ? String((i % 12) + 1).padStart(2, "0") : null;

    return {
      id: 100 + i + 1,
      name: n,
      mobile: `98${(10000000 + i * 12345).toString().slice(0, 8)}`,
      helmetId: helmet,
      locationId: loc.id,
      locationName: loc.name,
    };
  });
};

const mapUser = (u: RawUser): UserRow => ({
  id: u.id,
  helmetId: u.helmetId ?? "",
  user: u.name,
  mobile: u.mobile,
  location: u.locationName,
  status: u.helmetId ? "Active" : "Inactive",
});

export default function UsersList() {
  // data
  const [rows, setRows] = useState<UserRow[]>([]);
  const [locations, setLocations] = useState<RawLocation[]>([]);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  // fallback mode (dummy UI when API empty/fails)
  const [dummyMode, setDummyMode] = useState(false);

  // add user inputs
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newLocId, setNewLocId] = useState<string>("");

  // table filters + pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState<"All" | string>("All");
  const [filterHelmet, setFilterHelmet] = useState<"All" | string>("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      try {
        const [uRes, lRes] = await Promise.allSettled([
          fetch(`${API}/users`),
          fetch(`${API}/locations`),
        ]);

        // locations
        let locs: RawLocation[] = [];
        if (lRes.status === "fulfilled" && lRes.value.ok) {
          locs = (await lRes.value.json()) as RawLocation[];
        }
        if (!mounted) return;
        setLocations(locs.length ? locs : DUMMY_LOCATIONS);

        // users
        let users: RawUser[] = [];
        if (uRes.status === "fulfilled" && uRes.value.ok) {
          users = (await uRes.value.json()) as RawUser[];
        }

        if (!mounted) return;

        // if API empty => use dummy (per your UI need)
        if (!users || users.length === 0) {
          setDummyMode(true);
          setRows(makeDummyUsers().map(mapUser));
        } else {
          setDummyMode(false);
          setRows(users.map(mapUser));
        }
      } catch (e) {
        if (!mounted) return;
        setDummyMode(true);
        setLocations(DUMMY_LOCATIONS);
        setRows(makeDummyUsers().map(mapUser));
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const reloadUsers = async () => {
    if (dummyMode) return; // keep dummy UI stable
    const r = await fetch(`${API}/users`);
    const raw = (await r.json()) as RawUser[];
    setRows(raw.map(mapUser));
  };

  // counts
  const totalUsers = rows.length;
  const assignedCount = rows.filter((r) => !!r.helmetId).length;
  const unassignedCount = totalUsers - assignedCount;

  // filters
  const helmetIds = useMemo(() => {
    const ids = Array.from(new Set(rows.map((r) => r.helmetId)))
      .filter((x) => x && x.trim().length > 0);

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
        const hay = [String(r.id), r.helmetId, r.user, r.mobile, r.location, r.status]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [rows, filterLocation, filterHelmet, searchTerm]);

  // update handlers
  const handleSave = async (upd: UserRow) => {
    if (dummyMode) {
      const status = upd.helmetId ? "Active" : "Inactive";
      setRows((prev) => prev.map((x) => (x.id === upd.id ? { ...upd, status } : x)));
      setEditingUser(null);
      showSnack("success", `User "${upd.user}" updated`);
      return;
    }

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

  const handleDelete = async (id: number) => {
    if (dummyMode) {
      setRows((prev) => prev.filter((x) => x.id !== id));
      setEditingUser(null);
      showSnack("success", "User deleted successfully");
      return;
    }

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
  const handleCreateUser = async () => {
    const name = newName.trim();
    const mobile = newMobile.trim();
    const locationId = Number(newLocId);

    if (!name) return showSnack("error", "Name is required");
    if (!mobile) return showSnack("error", "Mobile is required");
    if (!newLocId || !Number.isFinite(locationId)) return showSnack("error", "Location is required");

    const loc = locations.find((l) => l.id === locationId);
    if (!loc) return showSnack("error", "Invalid location");

    if (dummyMode) {
      const nextId = (Math.max(...rows.map((r) => r.id), 0) || 100) + 1;
      const newRow: UserRow = {
        id: nextId,
        helmetId: "",
        user: name,
        mobile,
        location: loc.name,
        status: "Inactive",
      };
      setRows((prev) => [newRow, ...prev]);
      setNewName("");
      setNewMobile("");
      setNewLocId("");
      showSnack("success", `User "${name}" created`);
      return;
    }

    try {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, locationId }),
      });

      if (!res.ok) throw await res.json();

      showSnack("success", `User "${name}" created`);
      setNewName("");
      setNewMobile("");
      setNewLocId("");
      await reloadUsers();
    } catch (err: any) {
      showSnack("error", err?.error || err?.message || "Create user failed");
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        pt: 0.2,
        px: 0.7,  
        pb: 1.5,
        gap: 1,
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* SINGLE ROW - Count + Add User combined */}
      <Card sx={{ ...glassCard, flexShrink: 0 }}>
        <CardContent
          sx={{
            p: 1.2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "nowrap",
            "&:last-child": { pb: 1.2 },
          }}
        >
          {/* COUNT SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
                Total
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                {totalUsers}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.2)", height: 30 }} />

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
                Assigned
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#FFD600", lineHeight: 1 }}>
                {assignedCount}
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.2)", height: 30 }} />

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>
                Unassigned
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                {unassignedCount}
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.3)", height: 40, mx: 1 }} />

          {/* ADD USER SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flex: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>
              Add User
            </Typography>

            <TextField
              size="small"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={{ width: 170, ...inputSx }}
            />

            <TextField
              size="small"
              placeholder="Mobile"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
              sx={{ width: 150, ...inputSx }}
            />

            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Location</InputLabel>
              <Select
                value={newLocId}
                label="Location"
                onChange={(e) => setNewLocId(String(e.target.value))}
                sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
              >
                <MenuItem value="">
                  <em style={{ color: "#fff" }}>Location</em>
                </MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l.id} value={String(l.id)} sx={{ color: "#fff" }}>
                    {l.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleCreateUser}
              disabled={!newName.trim() || !newMobile.trim() || !newLocId}
              sx={yellowBtnSx}
            >
              Create
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* MAIN TABLE CARD - Larger now */}
      <Card
        sx={{
          ...glassCard,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1.5,
            py: 1.2,
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
              sx={{ width: 260, ...inputSx }}
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
                <MenuItem value="All" sx={{ color: "#fff" }}>All</MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l.id} value={l.name} sx={{ color: "#fff" }}>
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
                <MenuItem value="All" sx={{ color: "#fff" }}>All</MenuItem>
                {helmetIds.map((id) => (
                  <MenuItem key={id} value={id} sx={{ color: "#fff" }}>
                    {id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", px: 1, py: 0.8, overflow: "hidden", minHeight: 0 }}>
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
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r, i) => {
                    const srNo = page * rowsPerPage + i + 1;
                    return (
                      <TableRow key={r.id} hover sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}>
                        <TableCell sx={{ color: "#fff" }}>{srNo}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>{r.helmetId || "—"}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>{r.user}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>{r.mobile}</TableCell>
                        <TableCell sx={{ color: "#fff" }}>{r.location}</TableCell>
                        <TableCell sx={{ color: r.status === "Active" ? "#4CAF50" : "#F44336", fontWeight: 900 }}>
                          {r.status}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={outlineBtnSx}
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
              px: 1.5,
              flexShrink: 0,
              "& .MuiTablePagination-selectIcon": { color: "#fff" },
              "& .MuiInputBase-root .MuiSvgIcon-root": { color: "#fff" },
              "& .MuiTablePagination-displayedRows": { color: "#fff" },
              "& .MuiTablePagination-select": { color: "#fff" },
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