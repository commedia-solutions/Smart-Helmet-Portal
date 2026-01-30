// import type { ApolloQueryResult } from '@apollo/client';
// import { dashboardClient } from '../apolloClient';
// import { GET_LATEST } from '../graphql/queries';

// export type HelmetStatus = 'Active' | 'Inactive';

// export interface SmartHelmet {
//   deviceId: string;
//   datetime: string;
//   alcohol: number;
//   carbonMonoxide: number;
//   nitrogenDioxide: number;
//   volatileGas: number;
//   envTemp: number;
//   objTemp: number;
//   hrt: number;
//   status: HelmetStatus;
// }

// /**
//  * Since your schema has no "list devices", we define which helmets exist here.
//  * Update MAX_HELMETS (or provide IDs array) as per your deployment.
//  */
// const MAX_HELMETS = 300;

// export function getDefaultHelmetIds(max = MAX_HELMETS): string[] {
//   // Produces "01", "02", ... "300"
//   return Array.from({ length: max }, (_, i) => String(i + 1).padStart(2, '0'));
// }

// // --- GraphQL response types (match schema) ---
// type HelmetLatestGQL = {
//   Device_ID: string;
//   ts?: number | null;
//   datetime?: string | null;
//   time?: string | null;
//   Env_temp?: number | null;
//   Obj_temp?: number | null;
//   Hrt?: number | null;
//   VOLATILE_GAS?: number | null;
//   CARBON_MONOXIDE?: number | null;
//   NITROGEN_DIOXIDE?: number | null;
//   ALCOHOL?: number | null;
//   Helmet_Status?: string | null;
// };

// type GetLatestResponse = {
//   getLatest?: HelmetLatestGQL | null;
// };

// function toNum(v: unknown, fallback = 0): number {
//   const n = typeof v === 'number' ? v : Number(v);
//   return Number.isFinite(n) ? n : fallback;
// }

// function normalizeStatus(s: unknown): HelmetStatus {
//   const v = String(s ?? '').trim().toLowerCase();
//   // treat anything not "active" as inactive (covers "-----" too)
//   return v === 'active' ? 'Active' : 'Inactive';
// }

// function mapLatest(item: HelmetLatestGQL): SmartHelmet {
//   return {
//     deviceId: item.Device_ID,
//     datetime: item.datetime ?? new Date().toISOString(),
//     alcohol: toNum(item.ALCOHOL),
//     carbonMonoxide: toNum(item.CARBON_MONOXIDE),
//     nitrogenDioxide: toNum(item.NITROGEN_DIOXIDE),
//     volatileGas: toNum(item.VOLATILE_GAS),
//     envTemp: toNum(item.Env_temp),
//     objTemp: toNum(item.Obj_temp),
//     hrt: toNum(item.Hrt),
//     status: normalizeStatus(item.Helmet_Status),
//   };
// }

// /**
//  * Fetch latest reading for ONE device.
//  */
// export async function fetchLatestForHelmet(deviceId: string): Promise<SmartHelmet | null> {
//   const res: ApolloQueryResult<GetLatestResponse> =
//     await dashboardClient.query<GetLatestResponse>({
//       query: GET_LATEST,
//       variables: { Device_ID: deviceId },
//       fetchPolicy: 'network-only',
//     });

//   const latest = res.data?.getLatest;
//   if (!latest) return null;
//   return mapLatest(latest);
// }

// /**
//  * Fetch latest readings for MANY devices (dashboard).
//  * Uses a concurrency limit so AppSync doesn't get hammered.
//  */
// export async function fetchSmartHelmets(
//   deviceIds: string[] = getDefaultHelmetIds(),
//   opts: { concurrency?: number } = {}
// ): Promise<SmartHelmet[]> {
//   const concurrency = Math.max(1, opts.concurrency ?? 12);

//   const out: SmartHelmet[] = [];
//   let idx = 0;

//   async function worker(): Promise<void> {
//     while (idx < deviceIds.length) {
//       const myIdx = idx++;
//       const id = deviceIds[myIdx];
//       try {
//         const latest = await fetchLatestForHelmet(id);
//         if (latest) out.push(latest);
//       } catch {
//         // ignore per-device errors so dashboard still loads
//       }
//     }
//   }

//   const workers = Array.from({ length: concurrency }, () => worker());
//   await Promise.all(workers);

//   out.sort((a, b) => Number(a.deviceId) - Number(b.deviceId));
//   return out;
// }


import type { ApolloQueryResult } from '@apollo/client';
import { dashboardClient } from '../apolloClient';
import { GET_LATEST } from '../graphql/queries';

export type HelmetStatus = 'Active' | 'Inactive';

export interface SmartHelmet {
  deviceId: string;

  /** Raw datetime string coming from Dynamo/AppSync (often: "YYYY-MM-DD HH:mm:ss") */
  datetime: string;

  /** Raw ts from Dynamo/AppSync (Float). Prefer this if present. */
  ts?: number | null;

  /** Parsed “last reading time” in epoch ms (used to compute status reliably) */
  lastSeenMs: number;

  alcohol: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  volatileGas: number;
  envTemp: number;
  objTemp: number;
  hrt: number;

  /** Computed from lastSeenMs (NOT from Helmet_Status) */
  status: HelmetStatus;
}

/**
 * ✅ Active/Inactive window:
 * Helmet is Active if we received a reading within last N ms.
 *
 * Change this anytime without touching logic:
 * - default = 7000ms (works well if your publish interval is ~3–5s)
 * - you can override via VITE_HELMET_ACTIVE_WINDOW_MS
 */
// export const ACTIVE_WINDOW_MS =
//   Number(import.meta.env.VITE_HELMET_ACTIVE_WINDOW_MS) || 7000;

export const ACTIVE_WINDOW_MS =
  Number(import.meta.env.VITE_HELMET_ACTIVE_WINDOW_MS) || 15000;


/** Allow a bit of future skew if device clock is slightly ahead */
const FUTURE_SKEW_MS = 30_000;

const MAX_HELMETS = 300;

export function getDefaultHelmetIds(max = MAX_HELMETS): string[] {
  return Array.from({ length: max }, (_, i) => String(i + 1).padStart(2, '0'));
}

// --- GraphQL response types (match schema) ---
type HelmetLatestGQL = {
  Device_ID: string;
  ts?: number | null;
  datetime?: string | null;
  time?: string | null;
  Env_temp?: number | null;
  Obj_temp?: number | null;
  Hrt?: number | null;
  VOLATILE_GAS?: number | null;
  CARBON_MONOXIDE?: number | null;
  NITROGEN_DIOXIDE?: number | null;
  ALCOHOL?: number | null;
  Helmet_Status?: string | null; // <-- ignored for active/inactive
};

type GetLatestResponse = {
  getLatest?: HelmetLatestGQL | null;
};

function toNum(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * ✅ Parse Dynamo/AppSync time into epoch ms
 * Priority:
 * 1) ts (if present)   -> treat as seconds (1e9 range) or ms (1e12 range)
 * 2) datetime string   -> supports "YYYY-MM-DD HH:mm:ss" (local) or ISO
 * 3) fallback Date.now()
 */
function getLastSeenMs(item: HelmetLatestGQL): number {
  const ts = item.ts;

  if (typeof ts === 'number' && Number.isFinite(ts)) {
    // If it looks like ms epoch already (>= 1e12), keep as ms.
    // If it looks like seconds epoch (~1.7e9 in 2026), convert to ms.
    return ts >= 1e12 ? Math.round(ts) : Math.round(ts * 1000);
  }

  const dt = String(item.datetime ?? '').trim();
  if (dt) {
    // common format from your screenshots: "2026-01-09 11:40:15"
    // Convert to "2026-01-09T11:40:15" and parse as LOCAL time.
    const m = dt.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})$/);
    if (m) {
      const local = new Date(`${m[1]}T${m[2]}`);
      const t = local.getTime();
      if (!Number.isNaN(t)) return t;
    }

    // ISO / other valid date strings
    const t2 = new Date(dt).getTime();
    if (!Number.isNaN(t2)) return t2;
  }

  return Date.now();
}

/**
 * ✅ Final Active/Inactive decision
 * - Active if age <= ACTIVE_WINDOW_MS
 * - If timestamp is slightly in the future (clock skew), still Active within FUTURE_SKEW_MS
 */
export function computeHelmetStatus(lastSeenMs: number, nowMs = Date.now()): HelmetStatus {
  const age = nowMs - lastSeenMs;

  if (age <= ACTIVE_WINDOW_MS && age >= -FUTURE_SKEW_MS) return 'Active';
  return 'Inactive';
}

function mapLatest(item: HelmetLatestGQL): SmartHelmet {
  const lastSeenMs = getLastSeenMs(item);

  return {
    deviceId: item.Device_ID,
    datetime: item.datetime ?? new Date(lastSeenMs).toISOString(),
    ts: item.ts ?? null,
    lastSeenMs,

    alcohol: toNum(item.ALCOHOL),
    carbonMonoxide: toNum(item.CARBON_MONOXIDE),
    nitrogenDioxide: toNum(item.NITROGEN_DIOXIDE),
    volatileGas: toNum(item.VOLATILE_GAS),
    envTemp: toNum(item.Env_temp),
    objTemp: toNum(item.Obj_temp),
    hrt: toNum(item.Hrt),

    // ✅ computed from time freshness
    status: computeHelmetStatus(lastSeenMs),
  };
}

/**
 * Fetch latest reading for ONE device.
 */
export async function fetchLatestForHelmet(deviceId: string): Promise<SmartHelmet | null> {
  const res: ApolloQueryResult<GetLatestResponse> =
    await dashboardClient.query<GetLatestResponse>({
      query: GET_LATEST,
      variables: { Device_ID: deviceId },
      fetchPolicy: 'network-only',
    });

  const latest = res.data?.getLatest;
  if (!latest) return null;

  return mapLatest(latest);
}

/**
 * Fetch latest readings for MANY devices (dashboard).
 * Uses a concurrency limit so AppSync doesn't get hammered.
 */
export async function fetchSmartHelmets(
  deviceIds: string[] = getDefaultHelmetIds(),
  opts: { concurrency?: number } = {}
): Promise<SmartHelmet[]> {
  const concurrency = Math.max(1, opts.concurrency ?? 12);

  const out: SmartHelmet[] = [];
  let idx = 0;

  async function worker(): Promise<void> {
    while (idx < deviceIds.length) {
      const myIdx = idx++;
      const id = deviceIds[myIdx];
      try {
        const latest = await fetchLatestForHelmet(id);
        if (latest) out.push(latest);
      } catch {
        // ignore per-device errors so dashboard still loads
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  out.sort((a, b) => Number(a.deviceId) - Number(b.deviceId));
  return out;
}
