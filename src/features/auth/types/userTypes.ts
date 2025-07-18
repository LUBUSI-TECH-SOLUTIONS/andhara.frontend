export type RegisterResponse = {
  message: string;
  user: {
    email: string;
    role: string;
  };
};

export type UserRequest = {
  id: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  confirmation_sent_at: string;
  recovery_sent_at: string;
  email_change_sent_at: string;
  new_email: string;
  new_phone: string;
  invited_at: string;
  action_link: string;
  email: string;
  phone: string;
  created_at: string;
  confirmed_at: string;
  email_confirmed_at: string;
  phone_confirmed_at: string;
  last_sign_in_at: string;
  role: string;
  updated_at: string;
  identities: Array<{
    id: string;
    identity_id: string;
    user_id: string;
    identity_data: Record<string, any>;
    provider: string;
    created_at: string;
    last_sign_in_at: string;
    updated_at: string;
  }>;
  is_anonymous: boolean;
  factors: Array<{
    id: string;
    friendly_name: string;
    factor_type: 'totp'; // si hay otros tipos, se pueden agregar como union types
    status: 'verified' | 'unverified'; // ajusta según tus posibles estados
    created_at: string;
    updated_at: string;
  }>;
};

export const roles = [
  { role: "admin", label: "Administrador" },
  { role: "usuario-bogota", label: "Operador Bogotá" },
  { role: "usuario-cali", label: "Operador Cali" },
  { role: "usuario-valledupar", label: "Operador Valledupar" },
  
] as const;