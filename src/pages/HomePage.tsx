import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import HeroWave from "../components/HeroWave"; // <-- Use the separate HeroWave component

// --- Accessibility: Skip to main content ---
const SkipLink: React.FC = () => (
  <a href="#main-content" className="visually-hidden-focusable">
    Skip to main content
  </a>
);

const heroGradient = "linear-gradient(135deg, #6366f1 0%, #f59e42 100%)";
const testimonialBg = "#f1f5f9";
const newsletterBg = "#eef2ff";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.13, duration: 0.6, type: "spring" },
  }),
};

const featureCards: { icon: React.ReactNode; title: string; desc: string; color: string }[] = [
  {
    icon: "🔥",
    title: "Hot Deals",
    desc: "Find the best discounts and offers every day.",
    color: "#f59e42",
  },
  {
    icon: "🎯",
    title: "Curated Picks",
    desc: "Handpicked trending products just for you.",
    color: "#6366f1",
  },
  {
    icon: "🛡️",
    title: "Secure Shopping",
    desc: "Shop with confidence and secure checkout.",
    color: "#10b981",
  },
];

const testimonials: { avatar: string; author: string; text: string; color: string }[] = [
  {
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    author: "Liam Nguyen",
    text: "Checkout was seamless and the rewards are awesome!",
    color: "#6366f1",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/36.jpg",
    author: "Sophia Lee",
    text: "I love the variety of products and fast shipping.",
    color: "#f59e42",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    author: "Noah Kim",
    text: "The deals are unbeatable. I saved so much money!",
    color: "#10b981",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/53.jpg",
    author: "Ava Johnson",
    text: "Super easy to navigate and great customer service.",
    color: "#6366f1",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    author: "Ethan Brown",
    text: "Spree keeps surprising me with new features.",
    color: "#f59e42",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    author: "Mia Garcia",
    text: "I recommend Spree to all my friends and family.",
    color: "#10b981",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const newsletterRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNewsletterSuccess(false);
    setNewsletterError(null);

    setTimeout(() => {
      if (email.includes("@")) {
        setNewsletterSuccess(true);
        setEmail("");
        setTimeout(() => {
          alertRef.current?.focus();
        }, 100);
      } else {
        setNewsletterError("Please enter a valid email address.");
      }
    }, 800);
  };

  return (
    <div className={clsx("bg-light", "min-vh-100", "d-flex", "flex-column")}>
      <SkipLink />
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className={clsx(
          "position-relative",
          "overflow-hidden",
          "mb-5",
          "shadow-lg",
          "rounded-4",
          "px-3",
          "py-5",
          "px-md-5",
          "py-md-5"
        )}
        style={{
          background: heroGradient,
          boxShadow: "0 8px 40px 0 #6366f133",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={7} className="mb-4 mb-md-0">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="fw-bold display-4 mb-3"
                style={{
                  color: "#fff",
                  textShadow: "0 4px 24px #0002",
                  letterSpacing: 0.5,
                  lineHeight: 1.1,
                }}
              >
                Welcome to <span style={{ color: "#f59e42" }}>Spree</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
                className="lead mb-4"
                style={{
                  color: "#f3f4f6",
                  fontWeight: 500,
                  fontSize: "1.35rem",
                  textShadow: "0 2px 8px #0001",
                  maxWidth: 520,
                }}
              >
                Discover trending products, exclusive deals, and a shopping experience that rewards you every step of the way.
              </motion.p>
              <div className="d-flex flex-wrap gap-3">
                <Button
                  variant="light"
                  size="lg"
                  className={clsx(
                    "fw-bold",
                    "rounded-pill",
                    "shadow-sm",
                    "px-5",
                    "py-2",
                    "fs-5"
                  )}
                  style={{ color: "#6366f1", minWidth: 160 }}
                  onClick={() => navigate("/products")}
                  aria-label="Shop Now"
                >
                  Shop Now
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className={clsx(
                    "fw-bold",
                    "rounded-pill",
                    "shadow-sm",
                    "px-5",
                    "py-2",
                    "fs-5"
                  )}
                  style={{ color: "#fff", borderColor: "#fff", minWidth: 160 }}
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
                  aria-label="Join Newsletter"
                >
                  Join Newsletter
                </Button>
              </div>
            </Col>
            <Col xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
                className="d-flex flex-column align-items-center"
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "2.5rem",
                    boxShadow: "0 8px 32px #f59e4222",
                    padding: "2.5rem 1.5rem",
                    width: "100%",
                    maxWidth: 350,
                  }}
                >
                  <Row className="g-3">
                    {featureCards.map((f, idx) => (
                      <Col xs={12} key={f.title}>
                        <motion.div
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeUp}
                          custom={idx}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className="fs-1"
                              style={{
                                color: f.color,
                                background: "#f3f4f6",
                                borderRadius: "50%",
                                width: 56,
                                height: 56,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: `0 2px 8px ${f.color}22`,
                              }}
                              aria-label={f.title}
                            >
                              {f.icon}
                            </span>
                            <div>
                              <div className="fw-bold fs-5" style={{ color: f.color }}>
                                {f.title}
                              </div>
                              <div className="text-secondary" style={{ fontSize: "1rem" }}>
                                {f.desc}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
        <HeroWave /> {/* Use the imported HeroWave component here */}
      </motion.section>

      {/* Testimonials Section */}
      <section>
        <Container className="mb-5 py-4" style={{ background: testimonialBg, borderRadius: 24 }}>
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className={clsx("text-center", "mb-4", "fw-bold", "fs-2", "fs-md-1")}
            style={{ color: "#6366f1" }}
          >
            What Our Customers Say
          </motion.h3>
          <Row className="g-4">
            {testimonials.map((t, idx) => (
              <Col xs={12} md={4} key={t.author}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={idx}
                >
                  <Card
                    className={clsx(
                      "border-0",
                      "rounded-4",
                      "shadow-sm",
                      "h-100"
                    )}
                    style={{ background: "#fff" }}
                  >
                    <Card.Body>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          src={t.avatar}
                          alt={t.author}
                          width={72}
                          height={72}
                          className="rounded-circle mb-3 border border-3"
                          style={{ borderColor: t.color, objectFit: "cover" }}
                        />
                        <Card.Text
                          className={clsx("fst-italic", "text-secondary", "fs-5", "mb-2")}
                        >
                          "{t.text}"
                        </Card.Text>
                        <div
                          className={clsx("fw-bold", "mt-2")}
                          style={{ color: t.color }}
                        >
                          {t.author}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter Signup Section */}
      <section>
        <Container className="mb-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <Card className={clsx("rounded-4", "shadow-sm", "border-0")}>
              <Card.Body className="p-4" style={{ background: newsletterBg, borderRadius: 16 }}>
                <h4 className="fw-bold mb-3" style={{ color: "#6366f1" }}>
                  Join Our Newsletter
                </h4>
                <Form ref={newsletterRef} onSubmit={handleNewsletterSubmit} className="d-flex flex-column flex-md-row gap-3 align-items-center">
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="rounded-pill px-4 py-2 fs-5"
                    style={{ maxWidth: 320 }}
                    aria-label="Email address"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    className={clsx(
                      "fw-bold",
                      "rounded-pill",
                      "shadow-sm",
                      "px-4",
                      "fs-5",
                      "w-100",
                      "w-sm-auto"
                    )}
                    style={{
                      height: "48px",
                    }}
                    aria-label="Subscribe"
                  >
                    Subscribe
                  </Button>
                </Form>
                {newsletterSuccess && (
                  <Alert
                    ref={alertRef}
                    variant="success"
                    className="mt-3 mb-0"
                    tabIndex={-1}
                  >
                    Thank you for subscribing!
                  </Alert>
                )}
                {newsletterError && (
                  <Alert
                    variant="danger"
                    className="mt-3 mb-0"
                    tabIndex={-1}
                  >
                    {newsletterError}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer
        className={clsx(
          "bg-dark",
          "text-white",
          "rounded-4",
          "py-4",
          "mt-auto",
          "shadow-sm",
          "px-2",
          "px-md-5"
        )}
        style={{
          textAlign: "center",
          fontSize: "1.1rem",
        }}
      >
        <div>
          &copy; {new Date().getFullYear()} Spree. All rights reserved. |{" "}
          <span style={{ color: "#f59e42" }}>Built for you</span>
        </div>
        <div className="mt-2">
          <a
            href="mailto:support@spree.com"
            className="text-white text-decoration-underline"
            style={{ fontSize: "0.95rem" }}
          >
            Contact Support
          </a>
        </div>
      </footer>
      <style>{`
        @media (max-width: 768px) {
          .display-4 { font-size: 2.1rem !important; }
          .fs-5 { font-size: 1.08rem !important; }
          .fs-4 { font-size: 1.2rem !important; }
        }
        @media (max-width: 576px) {
          .display-4 { font-size: 1.5rem !important; }
          .fs-5 { font-size: 1rem !important; }
          .fs-4 { font-size: 1.1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;