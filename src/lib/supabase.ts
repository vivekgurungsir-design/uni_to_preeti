import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database, SavedTranslation, InsertTranslation, FeedbackReport } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
  );
};

let clientInstance: SupabaseClient<Database> | null = null;

export const getSupabase = (): SupabaseClient<Database> | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance && supabaseUrl && supabaseAnonKey) {
    clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
};

// Local storage fallback key for offline / unconfigured mode
const LOCAL_STORAGE_KEY = "nepali_preeti_translations_v1";

export async function fetchSavedTranslations(): Promise<SavedTranslation[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("saved_translations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data;
    }
  }

  // Fallback to localStorage on client
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function saveTranslation(translation: InsertTranslation): Promise<SavedTranslation> {
  const supabase = getSupabase();
  const newItem: SavedTranslation = {
    id: translation.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}`),
    user_id: translation.user_id || null,
    title: translation.title || "Untitled Conversion",
    source_text: translation.source_text,
    converted_text: translation.converted_text,
    conversion_mode: translation.conversion_mode,
    is_favorite: translation.is_favorite ?? false,
    is_public: translation.is_public ?? false,
    tags: translation.tags || [],
    created_at: translation.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase
      .from("saved_translations")
      .insert(newItem as any)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  }

  // Local storage save
  if (typeof window !== "undefined") {
    try {
      const existing = await fetchSavedTranslations();
      const updated = [newItem, ...existing.filter((i) => i.id !== newItem.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to local storage", e);
    }
  }

  return newItem;
}

export async function deleteSavedTranslation(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("saved_translations").delete().eq("id", id);
    if (!error) return true;
  }

  if (typeof window !== "undefined") {
    try {
      const existing = await fetchSavedTranslations();
      const filtered = existing.filter((item) => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function toggleFavoriteTranslation(id: string, is_favorite: boolean): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("saved_translations")
      .update({ is_favorite, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) return true;
  }

  if (typeof window !== "undefined") {
    try {
      const existing = await fetchSavedTranslations();
      const updated = existing.map((item) => (item.id === id ? { ...item, is_favorite } : item));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function getSharedTranslation(id: string): Promise<SavedTranslation | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("saved_translations")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data;
    }
  }

  if (typeof window !== "undefined") {
    try {
      const existing = await fetchSavedTranslations();
      return existing.find((item) => item.id === id) || null;
    } catch {
      return null;
    }
  }
  return null;
}

export async function submitFeedback(feedback: {
  original_text: string;
  expected_output: string;
  actual_output: string;
  conversion_mode: "unicode-to-preeti" | "preeti-to-unicode";
  notes?: string;
}): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("feedback_reports").insert(feedback as any);
    return !error;
  }
  return true; // Silent success in offline mode
}
