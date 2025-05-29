import React, { useState } from "react";
import { register, sendPasswordReset } from "../../firebase/auth";
import { createUserDoc } from "../../firebase/firestore";
import { Form, Button, Alert, Card, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const accent = "#6366f1";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [resetEmail, setResetEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [resetMsg, setResetMsg] = useState<string>("");
  const [showReset, setShowReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Autofill only after focus
  const handleEmailFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.setAttribute("autocomplete", "username");
  };
  const handlePasswordFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.setAttribute("autocomplete", "new-password");
  };
  const handleResetEmailFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.setAttribute("autocomplete", "username");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await register(email, password);
      await createUserDoc(userCredential.user.uid, { email });
      setError("");
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg("");
    setError("");
    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail || email);
      setResetMsg("Password reset email sent! Check your inbox.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Password reset failed.");
      }
    }
    setResetLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        className={clsx("shadow-lg", "p-3", "border-0")}
        style={{
          maxWidth: 410,
          width: "100%",
          borderRadius: "2rem",
          background: "linear-gradient(120deg, #f8fafc 70%, #e0e7ff 100%)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.10), 0 1.5px 8px rgba(30,41,59,0.08)",
        }}
      >
        <Card.Body>
          <motion.h2
            className="mb-4 fw-bold text-center"
            style={{
              color: accent,
              letterSpacing: "-1px",
              textShadow: "0 2px 8px #6366f122",
            }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Register for Spree
          </motion.h2>
          <AnimatePresence>
            {!showReset ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <Form onSubmit={handleSubmit} autoComplete="off">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="you@email.com"
                      style={{ borderRadius: "1em" }}
                      autoFocus={false}
                      onFocus={handleEmailFocus}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Create a password"
                      style={{ borderRadius: "1em" }}
                      autoFocus={false}
                      onFocus={handlePasswordFocus}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 fw-bold rounded-pill"
                    style={{
                      background: accent,
                      border: "none",
                      letterSpacing: "0.03em",
                      fontSize: "1.1rem",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <span role="img" aria-label="register">📝</span>
                    )}
                    Register
                  </Button>
                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      className="p-0 fw-semibold"
                      style={{ color: accent, textDecoration: "underline" }}
                      onClick={() => setShowReset(true)}
                      tabIndex={0}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ color: accent, fontWeight: 600 }}>
                      Login
                    </Link>
                  </div>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <Form onSubmit={handleReset} autoComplete="off">
                  <Form.Group className="mb-3">
                    <Form.Label>Enter your email to reset password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="email"
                        value={resetEmail || email}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                        placeholder="you@email.com"
                        style={{ borderRadius: "1em" }}
                        autoFocus={false}
                        autoComplete="off"
                        onFocus={handleResetEmailFocus}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="info"
                    className="w-100 fw-bold rounded-pill"
                    style={{
                      background: "#38bdf8",
                      border: "none",
                      letterSpacing: "0.03em",
                      fontSize: "1.1rem",
                    }}
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" />
                    ) : (
                      <span role="img" aria-label="reset">✉️</span>
                    )}
                    Send Reset Email
                  </Button>
                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      className="p-0 fw-semibold"
                      style={{ color: accent, textDecoration: "underline" }}
                      onClick={() => setShowReset(false)}
                      tabIndex={0}
                    >
                      Back to register
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ color: accent, fontWeight: 600 }}>
                      Login
                    </Link>
                  </div>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <Alert variant="danger" className="mt-3 text-center" style={{ borderRadius: "1em" }}>
              {error}
            </Alert>
          )}
          {resetMsg && (
            <Alert variant="success" className="mt-3 text-center" style={{ borderRadius: "1em" }}>
              {resetMsg}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default Register;