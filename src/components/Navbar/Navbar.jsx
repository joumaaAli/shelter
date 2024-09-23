import React, { use, useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import styles from "./Navbar.module.scss";
import { path } from "@/utils/routes";
import { HandleLogout } from "@/services/userServices";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/component";
import Image from "next/image";
import Logo from "@/utils/img/logo.png";

const NavBar = () => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  return (
    <Navbar bg="light" expand="lg" className={styles.navbar}>
      <Container className={styles.navbarContainer}>
        <Navbar.Brand>
          <Image src={Logo} alt="Logo" width={50} height={50} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto d-flex align-items-center">
            <Nav.Link
              className={`${styles.navLink} ${
                router.pathname === path.fahrzeugangebot ? styles.active : ""
              }`}
              href={path.home}
            >
              Fahrzeugangebot
            </Nav.Link>
            <Nav.Link
              className={`${styles.navLink} ${
                router.pathname === path.services ? styles.active : ""
              }`}
              href={path.services}
            >
              Services
            </Nav.Link>
            <Nav.Link
              className={`${styles.navLink} ${
                router.pathname === path.aboutUs ? styles.active : ""
              }`}
              href={path.aboutUs}
            >
              Über uns
            </Nav.Link>
            <Nav.Link
              className={`${styles.navLink} ${
                router.pathname === path.contact ? styles.active : ""
              }`}
              href={path.contact}
            >
              Kontakt
            </Nav.Link>

            {user && (
              <Nav.Link
                className={`${styles.navLink} ${
                  router.pathname === path.admin ? styles.active : ""
                }`}
                href={path.admin}
              >
                Dashboard
              </Nav.Link>
            )}

            {user ? (
              <p
                className={`${styles.navLink} m-0 p-0`}
                onClick={() => {
                  HandleLogout();
                  router.push(path.home);
                }}
              >
                Logout
              </p>
            ) : (
              <Nav.Link className={styles.navLink} href={path.auth.login}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
