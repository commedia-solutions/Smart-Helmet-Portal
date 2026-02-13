import { useEffect, useMemo, useRef, useState } from "react";
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
};

export default function Faults() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(e instanceof Error ? e.message : "Failed to load faults data");
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

  const fmt = (v: unknown, suffix = "") => {
    if (v === null || v === undefined || v === "") return "—";
    return `${v}${suffix ? ` ${suffix}` : ""}`;
  };

  const rows: Row[] = useMemo(() => {
    return helmets.map((h) => {
      const d = h.datetime ? new Date(h.datetime) : new Date();
      const dateStr = isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB");

      return {
        deviceId: h.deviceId,
        date: dateStr,
        alcohol: fmt(h.alcohol, "ppm"),
        heartRate: h.hrt ?? "—",
        carbonMonoxide: fmt(h.carbonMonoxide, "ppm"),
        nitrogenDioxide: fmt(h.nitrogenDioxide, "ppm"),
        volatileGas: fmt(h.volatileGas, "ppm"),
        envTemp: fmt(h.envTemp, "°C"),
        objectTemp: fmt(h.objTemp, "°C"),
        status: h.status,
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
        ];

        return fields.some((f) => String(f).toLowerCase().includes(q));
      })
      .sort((a, b) => Number(a.deviceId) - Number(b.deviceId));
  }, [rows, searchTerm, statusFilter]);

  const total = filteredRows.length;

  // ✅ Same legend labels as Dashboard (always show 3)
const HEALTH_LEGEND = [
  { name: "Healthy", color: "#4CAF50" },
  { name: "Moderate", color: "#FFC107" },
  { name: "Critical", color: "#F44336" },
] as const;

// ✅ (For now) Faults page uses all as Healthy (keeps same behavior as your current donut)
// You can later replace this with real severity logic.
const pieData = useMemo(() => {
  const t = filteredRows.length || 1;

  const counts = { Healthy: filteredRows.length, Moderate: 0, Critical: 0 };

  const items = [
    {
      name: "Healthy",
      value: counts.Healthy,
      percentage: Math.round((counts.Healthy / t) * 100),
      color: "#4CAF50",
    },
    {
      name: "Moderate",
      value: counts.Moderate,
      percentage: Math.round((counts.Moderate / t) * 100),
      color: "#FFC107",
    },
    {
      name: "Critical",
      value: counts.Critical,
      percentage: Math.round((counts.Critical / t) * 100),
      color: "#F44336",
    },
  ].filter((x) => x.value > 0);

  return items.length ? items : [{ name: "Healthy", value: 1, percentage: 0, color: "#4CAF50" }];
}, [filteredRows]);

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
      {/* LEFT SECTION - Table (78%) */}
      <Box
        sx={{
          flex: '0 0 calc(78% - 8px)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 2,
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 16 }}>
                Faults Management
              </Typography>

              <Chip
                size="small"
                label={loading ? "Loading…" : error ? "Error" : "Live data"}
                sx={{
                  height: 22,
                  bgcolor: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  '& .MuiChip-label': { px: 1, fontSize: 11, fontWeight: 500 },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    height: 36,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    borderRadius: 2,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.14)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.22)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff',
                    fontSize: 13,
                  },
                }}
              />

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
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
                    bgcolor: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    borderRadius: 2,
                    height: 36,
                    fontSize: 13,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.14)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.22)',
                    },
                    '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.6)' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: 'rgba(20,20,20,0.98)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        mt: 0.5,
                        '& .MuiMenuItem-root': {
                          color: '#fff',
                          fontSize: 13,
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
                      borderColor: 'rgba(255,255,255,0.08)',
                      textAlign: 'center',
                    },
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.3)',
                      },
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
                        backgroundColor: 'rgba(255,255,255,0.04)' 
                      } 
                    }}
                  >
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
                        ].map((h) => (
                          <TableCell
                            key={h}
                            sx={{
                              bgcolor: "rgba(255,255,255,0.05)",
                              color: 'rgba(255,255,255,0.9)',
                              fontSize: 12,
                              fontWeight: 500,
                              padding: '10px 12px',
                              borderBottom: '1px solid rgba(255,255,255,0.12)',
                              position: 'sticky',
                              top: 0,
                              zIndex: 2,
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
                          fontSize: 12,
                          padding: '10px 12px',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        },
                      }}
                    >
                      {filteredRows
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((r, i) => (
                          <TableRow key={`${r.deviceId}-${i}`} hover>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                              {r.deviceId}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.date}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.alcohol}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.heartRate}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.carbonMonoxide}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.nitrogenDioxide}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.volatileGas}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.envTemp}
                            </TableCell>
                            <TableCell sx={{ color: 'rgba(255,255,255,0.75)' }}>
                              {r.objectTemp}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 600,
                                color: r.status === 'Active' ? '#4CAF50' : '#F44336',
                              }}
                            >
                              {r.status}
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
                  onPageChange={(_, p) => setPage(p)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    '& .MuiTablePagination-selectLabel': {
                      fontSize: 12,
                    },
                    '& .MuiTablePagination-displayedRows': {
                      fontSize: 12,
                    },
                    '& .MuiTablePagination-selectIcon': { 
                      color: 'rgba(255,255,255,0.6)' 
                    },
                    '& .MuiTablePagination-select': {
                      color: '#fff',
                      fontSize: 12,
                    },
                    '& .MuiIconButton-root': {
                      color: 'rgba(255,255,255,0.6)',
                      padding: '6px',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-disabled': {
                        color: 'rgba(255,255,255,0.3)',
                      },
                    },
                    px: 2,
                    py: 1,
                    minHeight: '52px',
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
        {/* Helmet Stats - Fixed Height */}
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
            <Box sx={{ width: '100%', height: '125px', position: 'relative', flexShrink: 0 }}>
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
  {pieData.map((entry, idx) => (
    <Cell key={idx} fill={entry.color} />
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
                    fontWeight: 500, 
                    fontSize: 11,
                    lineHeight: 1.2,
                  }}
                >
                  Total
                </Typography>
                <Typography 
                  sx={{ 
                    color: '#fff', 
                    fontWeight: 700, 
                    fontSize: 28,
                    lineHeight: 1.2,
                  }}
                >
                  {total}
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
    flexWrap: "nowrap",
    gap: 1,
    px: 0.5,
    flexShrink: 0,
  }}
>
  {HEALTH_LEGEND.map((it) => (
    <Box key={it.name} sx={{ display: "flex", alignItems: "center", gap: 0.6, minWidth: 0 }}>
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

        {/* Threshold Ranges */}
        <Box
          sx={{
            flex: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Typography 
            sx={{ 
              color: '#fff', 
              fontWeight: 500, 
              fontSize: 16,
              mb: 1,
              flexShrink: 0,
            }}
          >
            Threshold Ranges
          </Typography>
          
          <Divider 
            sx={{ 
              borderColor: 'rgba(255,255,255,0.12)', 
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
                      fontWeight: 500,
                      flex: 1,
                    }}
                  >
                    {item.parameter}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,0.65)', 
                      fontSize: 12,
                      fontWeight: 500,
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