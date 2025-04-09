export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number: string;
          account_type: Database["public"]["Enums"]["account_type_enum"];
          balance: number;
          created_at: string;
          id: number;
          name: string;
          status: Database["public"]["Enums"]["account_status_enum"];
          user_id: number;
        };
        Insert: {
          account_number: string;
          account_type: Database["public"]["Enums"]["account_type_enum"];
          balance?: number;
          created_at?: string;
          id?: number;
          name: string;
          status?: Database["public"]["Enums"]["account_status_enum"];
          user_id: number;
        };
        Update: {
          account_number?: string;
          account_type?: Database["public"]["Enums"]["account_type_enum"];
          balance?: number;
          created_at?: string;
          id?: number;
          name?: string;
          status?: Database["public"]["Enums"]["account_status_enum"];
          user_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      inserted_checks: {
        Row: {
          amount: number;
          check_date: string;
          check_name: string;
          id: string;
          inserted_at: string | null;
        };
        Insert: {
          amount: number;
          check_date: string;
          check_name: string;
          id: string;
          inserted_at?: string | null;
        };
        Update: {
          amount?: number;
          check_date?: string;
          check_name?: string;
          id?: string;
          inserted_at?: string | null;
        };
        Relationships: [];
      };
      ledger: {
        Row: {
          account_id: number;
          amount: number;
          balance: number;
          created_at: string;
          description: string;
          entry_category: Database["public"]["Enums"]["ledger_category_enum"];
          id: number;
          transaction_id: number;
        };
        Insert: {
          account_id: number;
          amount: number;
          balance: number;
          created_at?: string;
          description: string;
          entry_category: Database["public"]["Enums"]["ledger_category_enum"];
          id?: number;
          transaction_id: number;
        };
        Update: {
          account_id?: number;
          amount?: number;
          balance?: number;
          created_at?: string;
          description?: string;
          entry_category?: Database["public"]["Enums"]["ledger_category_enum"];
          id?: number;
          transaction_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "ledger_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ledger_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_schedule: {
        Row: {
          account_id: number;
          amount: number;
          created_at: string;
          day_of_month: number | null;
          day_of_week: Database["public"]["Enums"]["day_enum"] | null;
          day_of_year: string | null;
          end_date: string;
          frequency: Database["public"]["Enums"]["schedule_frequency_enum"];
          id: number;
          start_date: string;
          status: Database["public"]["Enums"]["schedule_status_enum"];
        };
        Insert: {
          account_id: number;
          amount: number;
          created_at?: string;
          day_of_month?: number | null;
          day_of_week?: Database["public"]["Enums"]["day_enum"] | null;
          day_of_year?: string | null;
          end_date: string;
          frequency: Database["public"]["Enums"]["schedule_frequency_enum"];
          id?: number;
          start_date: string;
          status?: Database["public"]["Enums"]["schedule_status_enum"];
        };
        Update: {
          account_id?: number;
          amount?: number;
          created_at?: string;
          day_of_month?: number | null;
          day_of_week?: Database["public"]["Enums"]["day_enum"] | null;
          day_of_year?: string | null;
          end_date?: string;
          frequency?: Database["public"]["Enums"]["schedule_frequency_enum"];
          id?: number;
          start_date?: string;
          status?: Database["public"]["Enums"]["schedule_status_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "payment_schedule_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      states: {
        Row: {
          code: string;
          name: string;
        };
        Insert: {
          code: string;
          name: string;
        };
        Update: {
          code?: string;
          name?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          account_id: number;
          amount: number;
          balance: number;
          created_at: string;
          description: string;
          id: number;
          status: Database["public"]["Enums"]["transaction_status_enum"];
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"];
        };
        Insert: {
          account_id: number;
          amount: number;
          balance: number;
          created_at?: string;
          description: string;
          id?: number;
          status?: Database["public"]["Enums"]["transaction_status_enum"];
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"];
        };
        Update: {
          account_id?: number;
          amount?: number;
          balance?: number;
          created_at?: string;
          description?: string;
          id?: number;
          status?: Database["public"]["Enums"]["transaction_status_enum"];
          transaction_type?: Database["public"]["Enums"]["transaction_type_enum"];
        };
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          city: string;
          created_at: string;
          email: string;
          first_name: string;
          id: number;
          last_name: string;
          phone: string;
          role: Database["public"]["Enums"]["user_role_enum"];
          state: string;
          status: Database["public"]["Enums"]["user_status_enum"];
          street: string;
          zipcode: string;
        };
        Insert: {
          city: string;
          created_at?: string;
          email: string;
          first_name: string;
          id?: number;
          last_name: string;
          phone: string;
          role?: Database["public"]["Enums"]["user_role_enum"];
          state: string;
          status?: Database["public"]["Enums"]["user_status_enum"];
          street: string;
          zipcode: string;
        };
        Update: {
          city?: string;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: number;
          last_name?: string;
          phone?: string;
          role?: Database["public"]["Enums"]["user_role_enum"];
          state?: string;
          status?: Database["public"]["Enums"]["user_status_enum"];
          street?: string;
          zipcode?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_state_fkey";
            columns: ["state"];
            isOneToOne: false;
            referencedRelation: "states";
            referencedColumns: ["code"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_account_balance_change: {
        Args: {
          an: string;
        };
        Returns: Database["public"]["CompositeTypes"]["transaction_sums"];
      };
      get_account_transactions: {
        Args: {
          an: string;
        };
        Returns: {
          account_id: number;
          amount: number;
          balance: number;
          created_at: string;
          description: string;
          id: number;
          status: Database["public"]["Enums"]["transaction_status_enum"];
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"];
        }[];
      };
      get_balance_change: {
        Args: {
          uid: number;
        };
        Returns: Database["public"]["CompositeTypes"]["transaction_sums"];
      };
      get_daily_balance: {
        Args: {
          aid: number;
        };
        Returns: Database["public"]["CompositeTypes"]["daily_balance"][];
      };
      get_total_balance: {
        Args: {
          uid: number;
        };
        Returns: number;
      };
      get_user_transactions: {
        Args: {
          uid: number;
        };
        Returns: {
          account_id: number;
          amount: number;
          balance: number;
          created_at: string;
          description: string;
          id: number;
          status: Database["public"]["Enums"]["transaction_status_enum"];
          transaction_type: Database["public"]["Enums"]["transaction_type_enum"];
        }[];
      };
      transfer_funds: {
        Args: {
          p_from_account: string;
          p_to_account: string;
          p_amount: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      account_status_enum:
        | "Active"
        | "Frozen"
        | "Closed"
        | "Pending"
        | "Overdrawn";
      account_type_enum: "Savings" | "Checking";
      day_enum:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday";
      ledger_category_enum: "Credit" | "Debit";
      schedule_frequency_enum:
        | "Daily"
        | "Weekly"
        | "Monthly"
        | "Annually"
        | "Once";
      schedule_status_enum: "Active" | "Paused";
      transaction_status_enum: "Complete" | "Pending" | "Failed";
      transaction_type_enum: "Withdrawal" | "Deposit" | "Transfer" | "Payment";
      user_role_enum: "User" | "Admin";
      user_status_enum: "Active" | "Suspended" | "Deleted" | "Locked";
    };
    CompositeTypes: {
      daily_balance: {
        date: string | null;
        balance: number | null;
      };
      transaction_sums: {
        change_1_day: number | null;
        change_1_week: number | null;
        change_1_month: number | null;
        change_3_months: number | null;
        change_1_year: number | null;
        change_all_time: number | null;
      };
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
