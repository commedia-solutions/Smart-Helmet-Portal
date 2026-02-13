// src/pages/Reports.tsx
import { useState, useEffect, useMemo, useCallback } from "react";
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

/* -------------------- local types (NO service imports) -------------------- */
type SmartHelmet = { deviceId: string };

type KPIResult = {
  avg_ALCOHOL: number; min_ALCOHOL: number; max_ALCOHOL: number;
  avg_Hrt: number; min_Hrt: number; max_Hrt: number;
  avg_CARBON_MONOXIDE: number; min_CARBON_MONOXIDE: number; max_CARBON_MONOXIDE: number;
  avg_NITROGEN_DIOXIDE: number; min_NITROGEN_DIOXIDE: number; max_NITROGEN_DIOXIDE: number;
  avg_VOLATILE_GAS: number; min_VOLATILE_GAS: number; max_VOLATILE_GAS: number;
  avg_Env_temp: number; min_Env_temp: number; max_Env_temp: number;
  avg_Obj_temp: number; min_Obj_temp: number; max_Obj_temp: number;
  lastUpdated: string;
};

type TimeSeriesPoint = {
  bucketTs: string; // ISO
  ALCOHOL?: number;
  Hrt?: number;
  CARBON_MONOXIDE?: number;
  NITROGEN_DIOXIDE?: number;
  VOLATILE_GAS?: number;
  Env_temp?: number;
  Obj_temp?: number;
};

/* -------------------- constants & dummy blocks -------------------- */
const METRICS = ["Alcohol", "HeartRate", "CO", "NO2", "VOC", "EnvTemp", "ObjectTemp"] as const;
type Metric = (typeof METRICS)[number];

const KPI_FIELD_MAP: Record<
  Metric,
  { avg: keyof KPIResult; min: keyof KPIResult; max: keyof KPIResult }
> = {
  Alcohol: { avg: "avg_ALCOHOL", min: "min_ALCOHOL", max: "max_ALCOHOL" },
  HeartRate: { avg: "avg_Hrt", min: "min_Hrt", max: "max_Hrt" },
  CO: { avg: "avg_CARBON_MONOXIDE", min: "min_CARBON_MONOXIDE", max: "max_CARBON_MONOXIDE" },
  NO2: { avg: "avg_NITROGEN_DIOXIDE", min: "min_NITROGEN_DIOXIDE", max: "max_NITROGEN_DIOXIDE" },
  VOC: { avg: "avg_VOLATILE_GAS", min: "min_VOLATILE_GAS", max: "max_VOLATILE_GAS" },
  EnvTemp: { avg: "avg_Env_temp", min: "min_Env_temp", max: "max_Env_temp" },
  ObjectTemp: { avg: "avg_Obj_temp", min: "min_Obj_temp", max: "max_Obj_temp" },
};

const DUMMY_HELMETS: SmartHelmet[] = [
  { deviceId: "01" },
  { deviceId: "02" },
  { deviceId: "03" },
  { deviceId: "04" },
  { deviceId: "05" },
  { deviceId: "06" },
];

const DUMMY_ALERTS = Array.from({ length: 50 }).map((_, i) => {
  const h = String((i % 6) + 1).padStart(2, "0");
  const users = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Heidi"];
  const locs = ["Warehouse A", "Gate 3", "Loading Dock"];
  const dates = ["26/06/2025", "25/06/2025", "24/06/2025"];
  const times = ["09:15", "10:20", "11:45"];
  return {
    id: i + 1,
    helmetId: h,
    username: users[i % users.length],
    location: locs[i % locs.length],
    date: dates[i % dates.length],
    time: times[i % times.length],
    status: i % 2 === 0 ? "Active" : "Inactive",
    alert: i % 3 === 0 ? "Failed" : "Triggered",
  };
});

/* -------------------- stable-ish dummy generators -------------------- */
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function buildDummyKPIs(helmetId: string): KPIResult {
  const seed = hashStr(`kpi:${helmetId}:${new Date().toISOString().slice(0, 13)}`); // changes hourly
  const rnd = mulberry32(seed);

  const alcoholAvg = clamp(rnd() * 0.08, 0, 0.15);
  const hrtAvg = clamp(60 + rnd() * 60, 35, 180);
  const coAvg = clamp(0.3 + rnd() * 3.5, 0, 20);
  const no2Avg = clamp(0.05 + rnd() * 0.9, 0, 5);
  const vocAvg = clamp(0.1 + rnd() * 2.0, 0, 10);
  const envAvg = clamp(18 + rnd() * 22, -10, 65);
  const objAvg = clamp(envAvg + rnd() * 5, -10, 80);

  const spread = (base: number, s: number) => {
    const min = clamp(base - s * (0.6 + rnd() * 0.4), 0, 999);
    const max = clamp(base + s * (0.6 + rnd() * 0.4), 0, 999);
    return { min, max };
  };

  const a = spread(alcoholAvg, 0.02);
  const h = spread(hrtAvg, 18);
  const c = spread(coAvg, 1.4);
  const n = spread(no2Avg, 0.35);
  const v = spread(vocAvg, 0.8);
  const e = spread(envAvg, 6);
  const o = spread(objAvg, 7);

  return {
    avg_ALCOHOL: alcoholAvg, min_ALCOHOL: a.min, max_ALCOHOL: a.max,
    avg_Hrt: hrtAvg, min_Hrt: h.min, max_Hrt: h.max,
    avg_CARBON_MONOXIDE: coAvg, min_CARBON_MONOXIDE: c.min, max_CARBON_MONOXIDE: c.max,
    avg_NITROGEN_DIOXIDE: no2Avg, min_NITROGEN_DIOXIDE: n.min, max_NITROGEN_DIOXIDE: n.max,
    avg_VOLATILE_GAS: vocAvg, min_VOLATILE_GAS: v.min, max_VOLATILE_GAS: v.max,
    avg_Env_temp: envAvg, min_Env_temp: e.min, max_Env_temp: e.max,
    avg_Obj_temp: objAvg, min_Obj_temp: o.min, max_Obj_temp: o.max,
    lastUpdated: new Date().toISOString(),
  };
}

function buildDummyTimeSeries(helmetId: string, hours = 24): TimeSeriesPoint[] {
  const now = Date.now();
  const seed = hashStr(`ts:${helmetId}:${new Date().toISOString().slice(0, 10)}`); // stable per day
  const rnd = mulberry32(seed);

  const baseAlcohol = rnd() * 0.06;
  const baseHrt = 65 + rnd() * 45;
  const baseCO = 0.4 + rnd() * 2.5;
  const baseNO2 = 0.08 + rnd() * 0.6;
  const baseVOC = 0.2 + rnd() * 1.2;
  const baseEnv = 20 + rnd() * 15;

  const points: TimeSeriesPoint[] = [];
  const stepMs = 60 * 60 * 1000;

  for (let i = hours; i >= 0; i--) {
    const t = new Date(now - i * stepMs);
    const wave = Math.sin((hours - i) / 3) * 0.35 + (rnd() - 0.5) * 0.25;

    const env = clamp(baseEnv + wave * 2.4, -10, 65);
    const obj = clamp(env + (rnd() * 3.8 - 0.6), -10, 80);

    points.push({
      bucketTs: t.toISOString(),
      ALCOHOL: +clamp(baseAlcohol + wave * 0.015, 0, 0.15).toFixed(4),
      Hrt: +clamp(baseHrt + wave * 12, 35, 180).toFixed(0),
      CARBON_MONOXIDE: +clamp(baseCO + wave * 0.7, 0, 20).toFixed(3),
      NITROGEN_DIOXIDE: +clamp(baseNO2 + wave * 0.18, 0, 5).toFixed(3),
      VOLATILE_GAS: +clamp(baseVOC + wave * 0.5, 0, 10).toFixed(3),
      Env_temp: +env.toFixed(2),
      Obj_temp: +obj.toFixed(2),
    });
  }

  return points;
}

function buildDummyReportRows(helmetId: string | undefined, fromISO: string, toISO: string) {
  const locs = ["Warehouse A", "Gate 3", "Loading Dock"];
  const users = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Heidi"];

  const hid = helmetId ?? "All";
  const seed = hashStr(`export:${hid}:${fromISO}:${toISO}`);
  const rnd = mulberry32(seed);

  const from = new Date(fromISO).getTime();
  const to = new Date(toISO).getTime();
  const safeTo = Number.isFinite(to) ? to : Date.now();
  const safeFrom = Number.isFinite(from) ? from : safeTo - 24 * 60 * 60 * 1000;

  const span = Math.max(1, safeTo - safeFrom);
  const rows = Math.min(200, Math.max(40, Math.floor(span / (12 * 60 * 1000))));
  const step = span / rows;

  return Array.from({ length: rows }).map((_, i) => {
    const ts = new Date(safeFrom + i * step);
    const wave = Math.sin(i / 8) * 0.35 + (rnd() - 0.5) * 0.2;

    const env = clamp(26 + wave * 5, -10, 65);
    const obj = clamp(env + (rnd() * 4.5), -10, 80);

    const alcohol = clamp(0.02 + wave * 0.02 + (rnd() - 0.5) * 0.01, 0, 0.15);
    const hrt = clamp(78 + wave * 14 + (rnd() - 0.5) * 8, 35, 180);
    const co = clamp(1.8 + wave * 1.0 + (rnd() - 0.5) * 0.6, 0, 20);
    const no2 = clamp(0.35 + wave * 0.25 + (rnd() - 0.5) * 0.2, 0, 5);
    const voc = clamp(0.65 + wave * 0.7 + (rnd() - 0.5) * 0.25, 0, 10);

    const status = rnd() > 0.2 ? "Active" : "Inactive";
    const alert = alcohol > 0.06 || co > 3.2 || no2 > 0.9 ? "Triggered" : rnd() > 0.92 ? "Failed" : "OK";

    return {
      timestamp: ts.toISOString(),
      helmetId: helmetId ?? String(Math.floor(rnd() * 6) + 1).padStart(2, "0"),
      username: users[Math.floor(rnd() * users.length)],
      location: locs[Math.floor(rnd() * locs.length)],
      status,
      alert,
      Alcohol: +alcohol.toFixed(4),
      HeartRate: +hrt.toFixed(0),
      CO: +co.toFixed(3),
      NO2: +no2.toFixed(3),
      VOC: +voc.toFixed(3),
      EnvTemp: +env.toFixed(2),
      ObjectTemp: +obj.toFixed(2),
    };
  });
}

/* ------------------------------------------------------------------ */

export default function Reports() {
  // dummy helmets
  const [helmets, setHelmets] = useState<SmartHelmet[]>([]);
  useEffect(() => {
    const t = setTimeout(() => setHelmets(DUMMY_HELMETS), 200);
    return () => clearTimeout(t);
  }, []);

  // toolbar state
  const [reportHelmet, setReportHelmet] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTimeline, setSelectedTimeline] =
    useState<"1h" | "1d" | "1w" | "1m" | "3m" | "6m">("1d");
  const [exporting, setExporting] = useState(false);

  // KPI dummy polling
  const [kpis, setKpis] = useState<KPIResult | null>(null);

  const loadKPIs = useCallback(() => {
    let idArg = reportHelmet;
    if (idArg === "All") {
      if (!helmets.length) return;
      idArg = helmets[0].deviceId;
    }
    setKpis(buildDummyKPIs(idArg));
  }, [reportHelmet, helmets]);

  useEffect(() => {
    loadKPIs();
    const iv = setInterval(loadKPIs, 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, [loadKPIs]);

  // time series dummy polling
  const [tsHelmet, setTsHelmet] = useState("All");
  const [tsData, setTsData] = useState<TimeSeriesPoint[]>([]);

  const loadTS = useCallback(() => {
    let idArg = tsHelmet;
    if (idArg === "All") {
      if (!helmets.length) return;
      idArg = helmets[0].deviceId;
    }
    setTsData(buildDummyTimeSeries(idArg, 24));
  }, [tsHelmet, helmets]);

  useEffect(() => {
    loadTS();
    const iv = setInterval(loadTS, 30 * 60 * 1000);
    return () => clearInterval(iv);
  }, [loadTS]);

  const chartData = useMemo(
    () =>
      tsData.map((p) => ({
        time: new Date(p.bucketTs).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        Alcohol: p.ALCOHOL ?? 0,
        HeartRate: p.Hrt ?? 0,
        CO: p.CARBON_MONOXIDE ?? 0,
        NO2: p.NITROGEN_DIOXIDE ?? 0,
        VOC: p.VOLATILE_GAS ?? 0,
        EnvTemp: p.Env_temp ?? 0,
        ObjectTemp: p.Obj_temp ?? 0,
      })),
    [tsData]
  );

  // export dummy
  const handleExport = async (all = false) => {
    setExporting(true);
    try {
      let fromISO: string, toISO: string;

      if (all) {
        toISO = new Date().toISOString();
        const now = Date.now();
        let delta = 24 * 60 * 60 * 1000;
        if (selectedTimeline === "1h") delta = 60 * 60 * 1000;
        if (selectedTimeline === "1w") delta = 7 * 24 * 60 * 60 * 1000;
        if (selectedTimeline === "1m") delta = 30 * 24 * 60 * 60 * 1000;
        if (selectedTimeline === "3m") delta = 90 * 24 * 60 * 60 * 1000;
        if (selectedTimeline === "6m") delta = 180 * 24 * 60 * 60 * 1000;
        fromISO = new Date(now - delta).toISOString();
      } else {
        if (!fromDate || !toDate) {
          alert("Please select From and To dates.");
          return;
        }
        fromISO = new Date(fromDate).toISOString();
        toISO = new Date(toDate).toISOString();
      }

      const id = reportHelmet === "All" ? undefined : reportHelmet;
      const rows = buildDummyReportRows(id, fromISO, toISO);

      const ws = XLSX.utils.json_to_sheet(rows);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      const filename = `report-${reportHelmet}-${fromISO.slice(0, 10)}.csv`;
      saveAs(blob, filename);
    } catch (err: any) {
      console.error(err);
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  const exportEnabled = !!(fromDate && toDate && !exporting);
  const exportAllEnabled = !!(!exporting);

  // alerts table filters (dummy)
  const [search, setSearch] = useState("");
  const [filterLoc, setFilterLoc] =
    useState<"All" | "Warehouse A" | "Gate 3" | "Loading Dock">("All");
  const [filterAlert, setFilterAlert] =
    useState<"All" | "Triggered" | "Failed">("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const alerts = useMemo(
    () =>
      DUMMY_ALERTS.filter((r) => {
        if (filterLoc !== "All" && r.location !== filterLoc) return false;
        if (filterAlert !== "All" && r.alert !== filterAlert) return false;
        if (search) {
          const q = search.toLowerCase();
          return [r.helmetId, r.username, r.location, r.date, r.time, r.status, r.alert].some((v) =>
            v.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [search, filterLoc, filterAlert]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        gap: 2.5,
        overflow: "hidden",
      }}
    >
      {/* ─── Toolbar: Generate Report ─── */}
      <Card
        sx={{
          bgcolor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            p: 2.5,
            "&:last-child": { pb: 2.5 },
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", minWidth: 160, fontWeight:500 }}>
            Generate Report
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
                fontSize: 12,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}
              MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
            >
              <MenuItem value="All">All</MenuItem>
              {helmets.map((h) => (
                <MenuItem key={h.deviceId} value={h.deviceId}>
                  {h.deviceId}
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
            sx={{
              width: 140,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#1C1C1E",
                border: "1px solid #333",
                borderRadius: 1,
                "& fieldset": { border: "none" },
              },
            }}
            InputLabelProps={{ shrink: true, sx: { color: "#aaa", fontSize: 12 } }}
            inputProps={{ sx: { color: "#fff", fontSize: 12 } }}
          />

          <TextField
            size="small"
            type="date"
            label="To"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            sx={{
              width: 140,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#1C1C1E",
                border: "1px solid #333",
                borderRadius: 1,
                "& fieldset": { border: "none" },
              },
            }}
            InputLabelProps={{ shrink: true, sx: { color: "#aaa", fontSize: 12 } }}
            inputProps={{ sx: { color: "#fff", fontSize: 12 } }}
          />

           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 13 }}>
                      \
              </Typography>
                      {/* ✅ removed the live chip as requested */}
                    </Box>
          

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
                fontSize: 12,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
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

          <Box sx={{ ml: "auto", display: "flex", gap: 1.5 }}>
            <Button
              variant="contained"
              disabled={!exportEnabled}
              onClick={() => handleExport(false)}
              sx={{
                bgcolor: "#FFD600",
                color: "#000",
                fontSize: 12,
                fontWeight: 600,
                px: 2.5,
                "&:hover": { bgcolor: "#FFC107" },
                "&:disabled": { bgcolor: "#555", color: "#888" },
              }}
            >
              Export
            </Button>

            <Button
              variant="contained"
              disabled={!exportAllEnabled}
              onClick={() => handleExport(true)}
              sx={{
                bgcolor: "#FFD600",
                color: "#000",
                fontSize: 12,
                fontWeight: 600,
                px: 2.5,
                "&:hover": { bgcolor: "#FFC107" },
                "&:disabled": { bgcolor: "#555", color: "#888" },
              }}
            >
              Export All
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ─── Scrollable Content Area ─── */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          pr: 0.5,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#333",
            borderRadius: "3px",
            "&:hover": { background: "#444" },
          },
          "&::-webkit-scrollbar-track": { background: "transparent" },
        }}
      >
        {/* KPI Cards */}
        {/* <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 2,
            flexShrink: 0,
          }}
        >
          {METRICS.map((m) => {
            const F = KPI_FIELD_MAP[m];
            const avg = kpis?.[F.avg] ?? 0;
            const min = kpis?.[F.min] ?? 0;
            const max = kpis?.[F.max] ?? 0;

            return (
              <Card
                key={m}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 20px rgba(255,214,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.75rem",
                      mb: 0.5,
                    }}
                  >
                    Avg {m}
                  </Typography>

                  <Typography variant="h5" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                    {Number(avg).toFixed(2)}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#FFD600", fontSize: "0.7rem" }}>
                      Min {Number(min).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#FFD600", fontSize: "0.7rem" }}>
                      Max {Number(max).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })} 
        </Box> */}

        {/* KPI Cards — FORCE single row (no wrap) */}
<Box
  sx={{
    display: "flex",
    flexWrap: "nowrap",
    gap: 1.2,
    flexShrink: 0,
    minWidth: 0,
    overflowX: "auto",
    overflowY: "hidden",
    pt:1,
    pb: 0.5,
    "&::-webkit-scrollbar": { height: "6px" },
    "&::-webkit-scrollbar-thumb": {
      background: "#333",
      borderRadius: "3px",
      "&:hover": { background: "#444" },
    },
    "&::-webkit-scrollbar-track": { background: "transparent" },
  }}
>
  {METRICS.map((m) => {
    const F = KPI_FIELD_MAP[m];
    const avg = kpis?.[F.avg] ?? 0;
    const min = kpis?.[F.min] ?? 0;
    const max = kpis?.[F.max] ?? 0;

    return (
      <Card
        key={m}
        sx={{
          bgcolor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 2,
          flex: "1 1 0",
          minWidth: 150,          // ✅ lets 7 fit better
          maxWidth: 220,          // ✅ prevents huge cards
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 20px rgba(255,214,0,0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 1.6, "&:last-child": { pb: 1.6 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 11,
              mb: 0.4,
              whiteSpace: "nowrap",
            }}
          >
            Avg {m}
          </Typography>

          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 22, mb: 0.8 }}>
            {Number(avg).toFixed(2)}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
            <Typography sx={{ color: "#FFD600", fontSize: 11, whiteSpace: "nowrap" }}>
              Min {Number(min).toFixed(2)}
            </Typography>
            <Typography sx={{ color: "#FFD600", fontSize: 11, whiteSpace: "nowrap" }}>
              Max {Number(max).toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  })}
</Box>


        {/* Time Series Chart */}
        <Card
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Time Series (Last 24h)
              </Typography>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel sx={{ color: "#aaa", fontSize: 12 }}>Helmet ID</InputLabel>
                <Select
                  value={tsHelmet}
                  label="Helmet ID"
                  onChange={(e) => setTsHelmet(e.target.value)}
                  sx={{
                    bgcolor: "#1C1C1E",
                    color: "#fff",
                    border: "1px solid #333",
                    borderRadius: 1,
                    fontSize: 12,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                  MenuProps={{ PaperProps: { sx: { bgcolor: "#28282B", color: "#fff" } } }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {helmets.map((h) => (
                    <MenuItem key={h.deviceId} value={h.deviceId}>
                      {h.deviceId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#888" style={{ fontSize: "11px" }} />
                  <YAxis stroke="#888" style={{ fontSize: "11px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#222",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: "#fff",
                      fontSize: 11,
                      paddingTop: "10px",
                    }}
                  />
                  <Line type="monotone" dataKey="Alcohol" stroke="#4CAF50" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="HeartRate" stroke="#FFC107" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="CO" stroke="#F44336" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="NO2" stroke="#2196F3" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="VOC" stroke="#9C27B0" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="EnvTemp" stroke="#FF9800" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Alerts & Faults History */}
        <Card
          sx={{
            bgcolor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 400,
            maxHeight: 500,
            flexShrink: 0,
          }}
        >
          {/* Header + Filters */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 2,
              p: 2.5,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fff", flex: "1 1 auto", minWidth: "200px" }}>
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
                minWidth: 180,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1C1C1E",
                  height: 36,
                  border: "1px solid #333",
                  borderRadius: 1,
                  "& fieldset": { border: "none" },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#fff",
                  fontSize: 12,
                  p: 1,
                },
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
                  height: 36,
                  fontSize: 12,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": { py: 0.75, px: 1.5 },
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
                  height: 36,
                  fontSize: 12,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": { py: 0.75, px: 1.5 },
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

          {/* Scrollable Table */}
          <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <TableContainer
              sx={{
                flex: 1,
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": {
                  background: "#333",
                  borderRadius: "3px",
                  "&:hover": { background: "#444" },
                },
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
                          backgroundColor: "rgba(40,40,45,0.95)",
                          color: "rgba(255,255,255,0.9)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "12px 16px",
                          borderBottom: "1px solid rgba(255,255,255,0.2)",
                          textAlign: "center",
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {alerts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((r) => (
                      <TableRow
                        key={r.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", p: "10px 16px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.id}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", p: "10px 16px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.helmetId}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", p: "10px 16px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.username}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", p: "10px 16px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.location}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", p: "10px 16px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.date}
                        </TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", p: "10px 16px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {r.time}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: r.status === "Active" ? "#4CAF50" : "#F44336",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            p: "10px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          {r.status}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: r.alert === "Triggered" ? "#FFC107" : "#F44336",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            p: "10px 16px",
                            textAlign: "center",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
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
                flexShrink: 0,
                "& .MuiTablePagination-selectIcon": { color: "#fff" },
                "& .MuiInputBase-root .MuiSvgIcon-root": { color: "#fff" },
                "& .MuiTablePagination-displayedRows": { fontSize: "0.75rem" },
                "& .MuiTablePagination-select": { fontSize: "0.75rem" },
              }}
            />
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
