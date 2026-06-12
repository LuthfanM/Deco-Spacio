import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  DECO_SPACIO_RECOVERY_KEY_HEADER,
  DECO_SPACIO_RECOVERY_KEY_HEADER_ENV,
  DECO_SPACIO_USER_ID_HEADER,
  DECO_SPACIO_USER_ID_HEADER_ENV,
  SUPABASE_KEY_ENV_KEYS,
  SUPABASE_URL_ENV,
} from "@/lib/store.constants";

type SupabaseContext = {
  userId?: string;
  recoveryKey?: string;
};

function getSupabaseKey(): string {
  for (const key of SUPABASE_KEY_ENV_KEYS) {
    const value = process.env[key];

    if (value) {
      return value;
    }
  }

  return "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env[SUPABASE_URL_ENV] && getSupabaseKey());
}

export function getSupabase(context: SupabaseContext = {}): SupabaseClient | null {
  const supabaseUrl = process.env[SUPABASE_URL_ENV];

  if (!supabaseUrl || !isSupabaseConfigured()) {
    return null;
  }

  const headers: Record<string, string> = {};
  const decoSpacioUserId =
    context.userId || process.env[DECO_SPACIO_USER_ID_HEADER_ENV];
  const decoSpacioRecoveryKey =
    context.recoveryKey || process.env[DECO_SPACIO_RECOVERY_KEY_HEADER_ENV];

  if (decoSpacioUserId) {
    headers[DECO_SPACIO_USER_ID_HEADER] = decoSpacioUserId;
  }

  if (decoSpacioRecoveryKey) {
    headers[DECO_SPACIO_RECOVERY_KEY_HEADER] = decoSpacioRecoveryKey;
  }

  return createClient(supabaseUrl, getSupabaseKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers,
    },
  });
}
