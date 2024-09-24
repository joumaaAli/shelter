import { HandleLogout } from "@/services/userServices";
import { path } from "@/utils/routes";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navLinks = [
    { label: "الرئيسية", href: path.home },
    { label: "المنازل", href: path.houses },
    { label: "الملاجئ", href: path.shelters },
  ];

  const adminLinks = [{ label: "لوحة التحكم", href: path.admin }];

  const authentiatedLinks = [{ label: "لوحة التحكم", href: path.myhouse }];

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
        if (data.session.user.app_metadata.role === "super-admin") {
          setRole(data.session.user.app_metadata.role);
        }
      }
    };

    // Initial session fetch
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  const isAdmin = role === "super-admin";

  return (
    <Navbar bg="light" expand="lg" className={styles.navbar} dir="rtl">
      <Container className={styles.navbarContainer}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="end"
            className={styles.offcanvas}
          >
            <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
              <Offcanvas.Title
                id="offcanvasNavbarLabel-expand-lg"
                className="ms-auto"
              >
                المحتوى
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className=" d-flex align-items-start">
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

                {user &&
                  !isAdmin &&
                  authentiatedLinks.map((link, index) => (
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

                {user && (
                  <>
                    <Nav.Link
                      className={styles.navLink}
                      onClick={() => {
                        HandleLogout();
                        router.push(path.home);
                      }}
                    >
                      تسجيل الخروج
                    </Nav.Link>
                  </>
                )}

                {!user && (
                  <>
                    <Nav.Link className={styles.navLink} href={path.auth.login}>
                      تسجيل الدخول
                    </Nav.Link>
                    <Nav.Link
                      className={styles.navLink}
                      href={path.auth.register}
                    >
                      إنشاء حساب
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
