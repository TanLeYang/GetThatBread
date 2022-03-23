import type { NextPage } from "next";
import { useContext, useEffect } from "react";
import AuthContext from "../contexts/authContext";
import HeroSection from "../components/Hero";
import Container from "../components/Container";
import Header from "../components/Header";

const Landing: NextPage = () => {
  const { user, refresh } = useContext(AuthContext);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Header />
      <section className="relative">
        <HeroSection />
      </section>
    </Container>
  );
};

export default Landing;
