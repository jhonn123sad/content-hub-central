export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      conteudos: {
        Row: {
          created_at: string
          data_publicacao: string | null
          description: string | null
          drive_url: string | null
          formato: string | null
          id: string
          image_url: string | null
          notes: string | null
          planned_date: string | null
          platform: string | null
          priority: string | null
          projeto_id: string | null
          published_url: string | null
          script_or_copy: string | null
          status: string
          titulo: string
          updated_at: string
          url_midia: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data_publicacao?: string | null
          description?: string | null
          drive_url?: string | null
          formato?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          planned_date?: string | null
          platform?: string | null
          priority?: string | null
          projeto_id?: string | null
          published_url?: string | null
          script_or_copy?: string | null
          status?: string
          titulo: string
          updated_at?: string
          url_midia?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data_publicacao?: string | null
          description?: string | null
          drive_url?: string | null
          formato?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          planned_date?: string | null
          platform?: string | null
          priority?: string | null
          projeto_id?: string | null
          published_url?: string | null
          script_or_copy?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          url_midia?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conteudos_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      criativos: {
        Row: {
          conteudo_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          nome: string
          notes: string | null
          project_id: string | null
          status: string | null
          tipo_arquivo: string | null
          url_arquivo: string
          user_id: string
        }
        Insert: {
          conteudo_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          nome: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          tipo_arquivo?: string | null
          url_arquivo: string
          user_id: string
        }
        Update: {
          conteudo_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          nome?: string
          notes?: string | null
          project_id?: string | null
          status?: string | null
          tipo_arquivo?: string | null
          url_arquivo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "criativos_conteudo_id_fkey"
            columns: ["conteudo_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criativos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      metas: {
        Row: {
          created_at: string
          goal_type: string | null
          id: string
          objetivo_valor: number | null
          period: string | null
          prazo: string | null
          progresso_valor: number | null
          project_id: string | null
          start_date: string | null
          status: string | null
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_type?: string | null
          id?: string
          objetivo_valor?: number | null
          period?: string | null
          prazo?: string | null
          progresso_valor?: number | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_type?: string | null
          id?: string
          objetivo_valor?: number | null
          period?: string | null
          prazo?: string | null
          progresso_valor?: number | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projetos: {
        Row: {
          created_at: string
          daily_content_goal: number | null
          descricao: string | null
          drive_url: string | null
          id: string
          main_platform: string | null
          niche: string | null
          objective: string | null
          start_date: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          daily_content_goal?: number | null
          descricao?: string | null
          drive_url?: string | null
          id?: string
          main_platform?: string | null
          niche?: string | null
          objective?: string | null
          start_date?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          daily_content_goal?: number | null
          descricao?: string | null
          drive_url?: string | null
          id?: string
          main_platform?: string | null
          niche?: string | null
          objective?: string | null
          start_date?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      referencias: {
        Row: {
          content_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          notes: string | null
          project_id: string | null
          tags: string[] | null
          titulo: string
          type: string | null
          url: string | null
          user_id: string
        }
        Insert: {
          content_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          project_id?: string | null
          tags?: string[] | null
          titulo: string
          type?: string | null
          url?: string | null
          user_id: string
        }
        Update: {
          content_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          project_id?: string | null
          tags?: string[] | null
          titulo?: string
          type?: string | null
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referencias_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "conteudos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referencias_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mvp_archive_content: {
        Args: { p_id: string }
        Returns: {
          created_at: string
          data_publicacao: string | null
          description: string | null
          drive_url: string | null
          formato: string | null
          id: string
          image_url: string | null
          notes: string | null
          planned_date: string | null
          platform: string | null
          priority: string | null
          projeto_id: string | null
          published_url: string | null
          script_or_copy: string | null
          status: string
          titulo: string
          updated_at: string
          url_midia: string | null
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "conteudos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_archive_creative: {
        Args: { p_id: string }
        Returns: {
          conteudo_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          nome: string
          notes: string | null
          project_id: string | null
          status: string | null
          tipo_arquivo: string | null
          url_arquivo: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "criativos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_archive_goal: {
        Args: { p_id: string }
        Returns: {
          created_at: string
          goal_type: string | null
          id: string
          objetivo_valor: number | null
          period: string | null
          prazo: string | null
          progresso_valor: number | null
          project_id: string | null
          start_date: string | null
          status: string | null
          titulo: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "metas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_archive_project: {
        Args: { p_id: string }
        Returns: {
          created_at: string
          daily_content_goal: number | null
          descricao: string | null
          drive_url: string | null
          id: string
          main_platform: string | null
          niche: string | null
          objective: string | null
          start_date: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "projetos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_archive_reference: {
        Args: { p_id: string }
        Returns: {
          content_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          notes: string | null
          project_id: string | null
          tags: string[] | null
          titulo: string
          type: string | null
          url: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "referencias"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_create_content: {
        Args: {
          p_description: string
          p_drive_url: string
          p_format: string
          p_image_url: string
          p_notes: string
          p_planned_date: string
          p_platform: string
          p_priority: string
          p_project_id: string
          p_published_date: string
          p_published_url: string
          p_script_or_copy: string
          p_status: string
          p_title: string
        }
        Returns: {
          created_at: string
          data_publicacao: string | null
          description: string | null
          drive_url: string | null
          formato: string | null
          id: string
          image_url: string | null
          notes: string | null
          planned_date: string | null
          platform: string | null
          priority: string | null
          projeto_id: string | null
          published_url: string | null
          script_or_copy: string | null
          status: string
          titulo: string
          updated_at: string
          url_midia: string | null
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "conteudos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_create_content_v2: {
        Args: {
          p_description: string
          p_drive_url: string
          p_format: string
          p_image_url: string
          p_notes: string
          p_planned_date: string
          p_platform: string
          p_priority: string
          p_project_id: string
          p_published_date: string
          p_published_url: string
          p_script_or_copy: string
          p_status: string
          p_title: string
        }
        Returns: {
          created_at: string
          data_publicacao: string | null
          description: string | null
          drive_url: string | null
          formato: string | null
          id: string
          image_url: string | null
          notes: string | null
          planned_date: string | null
          platform: string | null
          priority: string | null
          projeto_id: string | null
          published_url: string | null
          script_or_copy: string | null
          status: string
          titulo: string
          updated_at: string
          url_midia: string | null
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "conteudos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_create_creative: {
        Args: {
          p_content_id: string
          p_description: string
          p_file_url: string
          p_image_url: string
          p_notes: string
          p_project_id: string
          p_status: string
          p_title: string
          p_type: string
        }
        Returns: {
          conteudo_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          nome: string
          notes: string | null
          project_id: string | null
          status: string | null
          tipo_arquivo: string | null
          url_arquivo: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "criativos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_create_goal: {
        Args: {
          p_end_date: string
          p_goal_type: string
          p_period: string
          p_project_id: string
          p_start_date: string
          p_status: string
          p_target_count: number
          p_title: string
        }
        Returns: {
          created_at: string
          goal_type: string | null
          id: string
          objetivo_valor: number | null
          period: string | null
          prazo: string | null
          progresso_valor: number | null
          project_id: string | null
          start_date: string | null
          status: string | null
          titulo: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "metas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_create_project: {
        Args: { p_description: string; p_status: string; p_title: string }
        Returns: {
          created_at: string
          daily_content_goal: number | null
          descricao: string | null
          drive_url: string | null
          id: string
          main_platform: string | null
          niche: string | null
          objective: string | null
          start_date: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "projetos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_create_reference: {
        Args: {
          p_content_id: string
          p_description: string
          p_image_url: string
          p_notes: string
          p_project_id: string
          p_title: string
          p_type: string
          p_url: string
        }
        Returns: {
          content_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          notes: string | null
          project_id: string | null
          tags: string[] | null
          titulo: string
          type: string | null
          url: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "referencias"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_dashboard_summary: { Args: never; Returns: Json }
      mvp_list_contents: {
        Args: never
        Returns: {
          active: boolean
          description: string
          drive_url: string
          format: string
          id: string
          image_url: string
          notes: string
          planned_date: string
          platform: string
          priority: string
          project_id: string
          published_date: string
          published_url: string
          script_or_copy: string
          status: string
          title: string
        }[]
      }
      mvp_list_creatives: {
        Args: never
        Returns: {
          active: boolean
          content_id: string
          description: string
          file_url: string
          id: string
          image_url: string
          notes: string
          project_id: string
          status: string
          title: string
          type: string
        }[]
      }
      mvp_list_goals: {
        Args: never
        Returns: {
          active: boolean
          end_date: string
          goal_type: string
          id: string
          period: string
          project_id: string
          start_date: string
          status: string
          target_count: number
          title: string
        }[]
      }
      mvp_list_projects: {
        Args: never
        Returns: {
          active: boolean
          description: string
          id: string
          status: string
          title: string
        }[]
      }
      mvp_list_references: {
        Args: never
        Returns: {
          active: boolean
          content_id: string
          description: string
          id: string
          image_url: string
          notes: string
          project_id: string
          title: string
          type: string
          url: string
        }[]
      }
      mvp_update_content: {
        Args: {
          p_description: string
          p_drive_url: string
          p_format: string
          p_id: string
          p_image_url: string
          p_notes: string
          p_planned_date: string
          p_platform: string
          p_priority: string
          p_project_id: string
          p_published_date: string
          p_published_url: string
          p_script_or_copy: string
          p_status: string
          p_title: string
        }
        Returns: {
          created_at: string
          data_publicacao: string | null
          description: string | null
          drive_url: string | null
          formato: string | null
          id: string
          image_url: string | null
          notes: string | null
          planned_date: string | null
          platform: string | null
          priority: string | null
          projeto_id: string | null
          published_url: string | null
          script_or_copy: string | null
          status: string
          titulo: string
          updated_at: string
          url_midia: string | null
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "conteudos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_update_creative: {
        Args: {
          p_content_id: string
          p_description: string
          p_file_url: string
          p_id: string
          p_image_url: string
          p_notes: string
          p_project_id: string
          p_status: string
          p_title: string
          p_type: string
        }
        Returns: {
          conteudo_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          nome: string
          notes: string | null
          project_id: string | null
          status: string | null
          tipo_arquivo: string | null
          url_arquivo: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "criativos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_update_goal: {
        Args: {
          p_end_date: string
          p_goal_type: string
          p_id: string
          p_period: string
          p_project_id: string
          p_start_date: string
          p_status: string
          p_target_count: number
          p_title: string
        }
        Returns: {
          created_at: string
          goal_type: string | null
          id: string
          objetivo_valor: number | null
          period: string | null
          prazo: string | null
          progresso_valor: number | null
          project_id: string | null
          start_date: string | null
          status: string | null
          titulo: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "metas"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_update_project: {
        Args: {
          p_description: string
          p_id: string
          p_status: string
          p_title: string
        }
        Returns: {
          created_at: string
          daily_content_goal: number | null
          descricao: string | null
          drive_url: string | null
          id: string
          main_platform: string | null
          niche: string | null
          objective: string | null
          start_date: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "projetos"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mvp_update_reference: {
        Args: {
          p_content_id: string
          p_description: string
          p_id: string
          p_image_url: string
          p_notes: string
          p_project_id: string
          p_title: string
          p_type: string
          p_url: string
        }
        Returns: {
          content_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          notes: string | null
          project_id: string | null
          tags: string[] | null
          titulo: string
          type: string | null
          url: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "referencias"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
