export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      EVENT_PUBLIK: {
        Row: {
          admin_id: string
          deskripsi_event: string | null
          id_event: number
          id_jenis_acara: number
          id_taman: number
          nama_event: string
          tanggal_event: string
        }
        Insert: {
          admin_id: string
          deskripsi_event?: string | null
          id_event?: number
          id_jenis_acara: number
          id_taman: number
          nama_event: string
          tanggal_event: string
        }
        Update: {
          admin_id?: string
          deskripsi_event?: string | null
          id_event?: number
          id_jenis_acara?: number
          id_taman?: number
          nama_event?: string
          tanggal_event?: string
        }
        Relationships: [
          {
            foreignKeyName: "EVENT_PUBLIK_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "PROFIL_USER"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "EVENT_PUBLIK_id_jenis_acara_fkey"
            columns: ["id_jenis_acara"]
            isOneToOne: false
            referencedRelation: "JENIS_ACARA"
            referencedColumns: ["id_jenis_acara"]
          },
          {
            foreignKeyName: "EVENT_PUBLIK_id_taman_fkey"
            columns: ["id_taman"]
            isOneToOne: false
            referencedRelation: "TAMAN_KOTA"
            referencedColumns: ["id_taman"]
          },
        ]
      }
      FOTO_TAMAN: {
        Row: {
          id_foto: number
          id_taman: number
          url_foto: string
        }
        Insert: {
          id_foto?: number
          id_taman: number
          url_foto: string
        }
        Update: {
          id_foto?: number
          id_taman?: number
          url_foto?: string
        }
        Relationships: [
          {
            foreignKeyName: "FOTO_TAMAN_id_taman_fkey"
            columns: ["id_taman"]
            isOneToOne: false
            referencedRelation: "TAMAN_KOTA"
            referencedColumns: ["id_taman"]
          },
        ]
      }
      JENIS_ACARA: {
        Row: {
          id_jenis_acara: number
          nama_jenis: string
        }
        Insert: {
          id_jenis_acara?: number
          nama_jenis: string
        }
        Update: {
          id_jenis_acara?: number
          nama_jenis?: string
        }
        Relationships: []
      }
      NOTIFIKASI: {
        Row: {
          id_notifikasi: number
          id_reservasi: number | null
          pesan: string
          status_notifikasi: string
          tanggal_notifikasi: string
          user_id: string
        }
        Insert: {
          id_notifikasi?: number
          id_reservasi?: number | null
          pesan: string
          status_notifikasi?: string
          tanggal_notifikasi?: string
          user_id: string
        }
        Update: {
          id_notifikasi?: number
          id_reservasi?: number | null
          pesan?: string
          status_notifikasi?: string
          tanggal_notifikasi?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "NOTIFIKASI_id_reservasi_fkey"
            columns: ["id_reservasi"]
            isOneToOne: false
            referencedRelation: "RESERVASI"
            referencedColumns: ["id_reservasi"]
          },
          {
            foreignKeyName: "NOTIFIKASI_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "PROFIL_USER"
            referencedColumns: ["user_id"]
          },
        ]
      }
      PROFIL_USER: {
        Row: {
          nama: string
          role: string
          telepon: string | null
          user_id: string
        }
        Insert: {
          nama: string
          role?: string
          telepon?: string | null
          user_id: string
        }
        Update: {
          nama?: string
          role?: string
          telepon?: string | null
          user_id?: string
        }
        Relationships: []
      }
      RESERVASI: {
        Row: {
          admin_id_keputusan: string | null
          data_pengisi: string | null
          deskripsi_acara: string | null
          id_jenis_acara: number
          id_reservasi: number
          id_taman: number
          nama_acara: string
          status_reservasi: string
          tanggal_keputusan_admin: string | null
          tanggal_pengajuan: string
          tanggal_reservasi: string
          user_id: string
        }
        Insert: {
          admin_id_keputusan?: string | null
          data_pengisi?: string | null
          deskripsi_acara?: string | null
          id_jenis_acara: number
          id_reservasi?: number
          id_taman: number
          nama_acara: string
          status_reservasi?: string
          tanggal_keputusan_admin?: string | null
          tanggal_pengajuan?: string
          tanggal_reservasi: string
          user_id: string
        }
        Update: {
          admin_id_keputusan?: string | null
          data_pengisi?: string | null
          deskripsi_acara?: string | null
          id_jenis_acara?: number
          id_reservasi?: number
          id_taman?: number
          nama_acara?: string
          status_reservasi?: string
          tanggal_keputusan_admin?: string | null
          tanggal_pengajuan?: string
          tanggal_reservasi?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "RESERVASI_admin_id_keputusan_fkey"
            columns: ["admin_id_keputusan"]
            isOneToOne: false
            referencedRelation: "PROFIL_USER"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "RESERVASI_id_jenis_acara_fkey"
            columns: ["id_jenis_acara"]
            isOneToOne: false
            referencedRelation: "JENIS_ACARA"
            referencedColumns: ["id_jenis_acara"]
          },
          {
            foreignKeyName: "RESERVASI_id_taman_fkey"
            columns: ["id_taman"]
            isOneToOne: false
            referencedRelation: "TAMAN_KOTA"
            referencedColumns: ["id_taman"]
          },
          {
            foreignKeyName: "RESERVASI_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "PROFIL_USER"
            referencedColumns: ["user_id"]
          },
        ]
      }
      TAMAN_KOTA: {
        Row: {
          deskripsi: string | null
          id_taman: number
          keterangan_status: string | null
          nama_taman: string
          status_ketersediaan: string
          tingkat_aksesibilitas: string | null
        }
        Insert: {
          deskripsi?: string | null
          id_taman?: number
          keterangan_status?: string | null
          nama_taman: string
          status_ketersediaan: string
          tingkat_aksesibilitas?: string | null
        }
        Update: {
          deskripsi?: string | null
          id_taman?: number
          keterangan_status?: string | null
          nama_taman?: string
          status_ketersediaan?: string
          tingkat_aksesibilitas?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
