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

export const DATABASE_ERROR_MESSAGE =
  "Database error. Please check Supabase URL, key, schema, storage bucket, and RLS policies.";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Unknown database error.";
}

export function createDatabaseError(action: string, error?: unknown): Error {
  const detail = error ? ` ${getErrorMessage(error)}` : "";
  return new Error(`${DATABASE_ERROR_MESSAGE} Failed to ${action}.${detail}`);
}

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

export function getSupabase(context: SupabaseContext = {}): SupabaseClient {
  const supabaseUrl = process.env[SUPABASE_URL_ENV];

  if (!supabaseUrl || !isSupabaseConfigured()) {
    throw createDatabaseError("connect to Supabase");
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
