import axiosInstance from "@/utils/axiosInstance";
import { createClient } from "@/utils/supabase/component";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  let newEmail = email;
  if (!email.includes("@")) {
    newEmail = email + "@example.com";
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email: newEmail,
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
};

export const handleRegister = async (email: string, password: string) => {
  const supabase = createClient();

  // Register the user in Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error };
  }
  // After registration in Supabase, create a corresponding record in Prisma
  const supabaseUserId = data?.user?.id;

  try {
    await axiosInstance.post("/auth/register", {
      id: supabaseUserId,
    });
  } catch (error) {
    console.error("Failed to create user in Prisma", error);
    return { error: error };
  }

  return { data };
};
