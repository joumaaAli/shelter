import { HandleLogout } from "@/services/userServices";
import { path } from "@/utils/routes";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Navigation links as a list of objects
  const navLinks = [
    { label: "الرئيسية", href: path.home }, // Home = الرئيسية
    { label: "عرض المركبات", href: path.fahrzeugangebot }, // Fahrzeugangebot = عرض المركبات
    { label: "خدمات", href: path.services }, // Services = خدمات
    { label: "معلومات عنا", href: path.aboutUs }, // Über uns = معلومات عنا
    { label: "اتصل بنا", href: path.contact }, // Kontakt = اتصل بنا
  ];

  const adminLinks = [
    { label: "لوحة التحكم", href: path.admin }, // Dashboard = لوحة التحكم
  ];

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      }
    };

    // Initial session fetch
    getSession();

    // Subscribe to session changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null); // No session means user is logged out
        }
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const isAdmin = user?.role === "super-admin"; // Check if the user is an admin

  return (
    <Navbar bg="light" expand="lg" className={styles.navbar} dir="rtl">
      <Container className={styles.navbarContainer}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className=" d-flex align-items-center">
            {/* Render general navigation links */}
            {navLinks.map((link, index) => (
              <Nav.Link
                key={index}
                className={`${styles.navLink} ${
                  router.pathname === link.href ? styles.active : ""
                }`}
                href={link.href}
              >
                {link.label}
              </Nav.Link>
            ))}

            {/* Render admin/dashboard-related links only for admin users */}
            {user &&
              isAdmin &&
              adminLinks.map((link, index) => (
                <Nav.Link
                  key={index}
                  className={`${styles.navLink} ${
                    router.pathname === link.href ? styles.active : ""
                  }`}
                  href={link.href}
                >
                  {link.label}
                </Nav.Link>
              ))}

            {/* Show logout option for both admin and normal users */}
            {user && (
              <p
                className={`${styles.navLink} m-0 p-0`}
                onClick={() => {
                  HandleLogout();
                  router.push(path.home);
                }}
              >
                تسجيل الخروج
              </p>
            )}

            {/* Show login and register links if no user is logged in */}
            {!user && (
              <>
                <Nav.Link className={styles.navLink} href={path.auth.login}>
                  تسجيل الدخول
                </Nav.Link>
                <Nav.Link className={styles.navLink} href={path.auth.register}>
                  التسجيل
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
