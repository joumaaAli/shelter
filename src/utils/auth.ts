import { useSession } from "next-auth/react";

export const useUserLoggedIn = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    // Optional: Handle the loading state
    return { isLoading: true, isLoggedIn: false };
  }

  const isLoggedIn = !!session;

  return {
    isLoading: false,
    isLoggedIn,
    isAdmin: session?.user?.role === "ADMIN",
  };
};
