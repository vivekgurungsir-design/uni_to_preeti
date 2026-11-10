export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      saved_translations: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          source_text: string;
          converted_text: string;
          conversion_mode: "unicode-to-preeti" | "preeti-to-unicode";
          is_favorite: boolean;
          is_public: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title?: string;
          source_text: string;
          converted_text: string;
          conversion_mode: "unicode-to-preeti" | "preeti-to-unicode";
          is_favorite?: boolean;
          is_public?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          source_text?: string;
          converted_text?: string;
          conversion_mode?: "unicode-to-preeti" | "preeti-to-unicode";
          is_favorite?: boolean;
          is_public?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feedback_reports: {
        Row: {
          id: string;
          user_id: string | null;
          original_text: string;
          expected_output: string;
          actual_output: string;
          conversion_mode: "unicode-to-preeti" | "preeti-to-unicode";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          original_text: string;
          expected_output: string;
          actual_output: string;
          conversion_mode: "unicode-to-preeti" | "preeti-to-unicode";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          original_text?: string;
          expected_output?: string;
          actual_output?: string;
          conversion_mode?: "unicode-to-preeti" | "preeti-to-unicode";
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      custom_dictionary: {
        Row: {
          id: string;
          user_id: string | null;
          preeti_term: string;
          unicode_term: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          preeti_term: string;
          unicode_term: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          preeti_term?: string;
          unicode_term?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type SavedTranslation = Database["public"]["Tables"]["saved_translations"]["Row"];
export type InsertTranslation = Database["public"]["Tables"]["saved_translations"]["Insert"];
export type FeedbackReport = Database["public"]["Tables"]["feedback_reports"]["Row"];
export type CustomDictionaryItem = Database["public"]["Tables"]["custom_dictionary"]["Row"];
