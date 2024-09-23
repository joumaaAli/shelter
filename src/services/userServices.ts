import { createClient } from "@/utils/supabase/component";

export interface RegisterData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
}

export const handleLogin = async (email: string, password: string) => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message, result: !error };
};

export const HandleLogout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  console.log("Logout successful");
};
