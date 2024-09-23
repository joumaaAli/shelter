import { path } from "@/utils/routes";
import AdminLayout from "./Admin/AdminLayout";
import AuthLayout from "./Auth/AuthLayout";
import DefaultLayout from "./Default/DefaultLayout";
import { createClient } from "@/utils/supabase/server-props";

export const getLayout = (pathname) => {
  if (pathname.includes("/auth")) {
    const AuthLayoutComponent = (page) => <AuthLayout>{page}</AuthLayout>;
    AuthLayoutComponent.displayName = "AuthLayoutComponent";
    return AuthLayoutComponent;
  } else if (pathname.includes("/dashboard")) {
    const AdminLayoutComponent = (page) => <AdminLayout>{page}</AdminLayout>;
    AdminLayoutComponent.displayName = "AdminLayoutComponent";
    return AdminLayoutComponent;
  } else {
    const DefaultLayoutComponent = (page) => (
      <DefaultLayout>{page}</DefaultLayout>
    );
    DefaultLayoutComponent.displayName = "DefaultLayoutComponent";
    return DefaultLayoutComponent;
  }
};

export const requireAuthentication = async (context) => {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: path.auth.login,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
};

export const requireNoAuthentication = async (context) => {
  const supabase = createClient(context);
  const { data, error } = await supabase.auth.getUser();
  if (data.user) {
    return {
      redirect: {
        destination: path.admin,
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: null,
    },
  };
};
