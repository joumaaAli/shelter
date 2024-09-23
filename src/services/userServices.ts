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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, result: null };
  }

  // Fetch user session to get the role
  const { data: sessionData } = await supabase.auth.getSession();

  return {
    error: null,
    result: sessionData?.session?.user?.email?.includes("admin"),
  }; // return user role
};

export const HandleLogout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  console.log("Logout successful");
};

export const handleRegister = async (email: any, password: any) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
};
