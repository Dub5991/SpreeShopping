import React, { useState } from "react";
import { register } from "../../firebase/auth";
import { createUserDoc } from "../../firebase/firestore";
import { Form, Button, Alert, Card, InputGroup, ProgressBar } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const accent = "#6366f1";

// Map Firebase error codes to safe generic messages
const friendlyError = (err: unknown): string => {
  const code = (err as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/email-already-in-use":   "An account with this email already exists.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/weak-password":          "Password must be at least 8 characters.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
  };
  return map[code] ?? "Registration failed. Please try again.";
};

// Password strength: 0 (too short) | 1 (weak) | 2 (good) | 3 (strong)
const getStrength = (pw: string) => {
  if (pw.length === 0) return { score: 0, label: "", variant: "danger" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Good", "Strong"];
  const variants = ["danger", "warning", "info", "success"];
  return { score, label: labels[score], variant: variants[score] };
};

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const strength = getStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await register(email, password);
      // Create Firestore user doc — all new accounts default to role "user"
      // To grant admin access, set role: "admin" in Firebase Console for that user
      await createUserDoc(userCredential.user.uid, {
        email,
        displayName: "",
        phone: "",
        address: "",
        avatarUrl: "",
        role: "user",
      });
      navigate("/login");
    } catch (err: unknown) {
      setError(friendlyError(err));
    }
    setLoading(false);
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
            style={{ color: accent, letterSpacing: "-1px", textShadow: "0 2px 8px #6366f122" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Register for Spree
          </motion.h2>
          <Form onSubmit={handleSubmit} autoComplete="on">
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@email.com"
                style={{ borderRadius: "1em" }}
              />
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  style={{ borderRadius: "1em" }}
                  minLength={8}
                />
              </InputGroup>
            </Form.Group>
            {/* Password strength bar */}
            {password.length > 0 && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 mt-1"
                >
                  <ProgressBar
                    now={(strength.score / 3) * 100}
                    variant={strength.variant}
                    style={{ height: 6, borderRadius: 4 }}
                  />
                  <small className={`text-${strength.variant} fw-semibold`}>
                    {strength.label}
                  </small>
                </motion.div>
              </AnimatePresence>
            )}
            <Button
              type="submit"
              variant="primary"
              className="w-100 fw-bold rounded-pill mt-2"
              style={{ background: accent, border: "none", letterSpacing: "0.03em", fontSize: "1.1rem" }}
              disabled={loading}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm me-2" />
                : <span role="img" aria-label="register">📝</span>}
              {" "}Register
            </Button>
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to="/login" style={{ color: accent, fontWeight: 600 }}>Login</Link>
            </div>
          </Form>
          {error && (
            <Alert variant="danger" className="mt-3 text-center" style={{ borderRadius: "1em" }}>
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default Register;
