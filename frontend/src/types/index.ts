export type UserRole = "admin" | "citizen";

export interface User {
  role: UserRole;
  username?: string;
}

export interface LeakPredictionData {
  zone_id: string;
  timestamp: string;
  water_supplied_litres: number;
  water_consumed_litres: number;
  flowrate_lps: number;
  pressure_psi: number;
  latitude: number;
  longitude: number;
}

export interface LeakReportData {
  username: string;
  zone_id?: string;
  description?: string;
}

export interface LedgerEntry {
  index: number;
  timestamp: string;
  username: string;
  reward: number;
  previous_hash: string;
  hash: string;
}

export interface ManualTransactionData {
  username: string;
  reward: number;
  reason?: string;
}
