import React, { useState } from "react";
import { login, sendPasswordReset } from "../../firebase/auth";
import { getUserDoc } from "../../firebase/firestore";
import { Form, Button, Alert, Card, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const accent = "#6366f1";

// Map Firebase error codes to safe generic messages — never expose raw Firebase errors
// as they reveal whether an email exists in the system (user enumeration attack vector).
const friendlyError = (err: unknown): string => {
  const code = (err as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/user-not-found":         "Invalid email or password.",
    "auth/wrong-password":         "Invalid email or password.",
    "auth/invalid-credential":     "Invalid email or password.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/user-disabled":          "This account has been disabled.",
    "auth/unauthorized-domain":    "Login is not allowed from this domain. Please contact support.",
    "auth/invalid-api-key":        "Firebase configuration error. Please contact support.",
    "auth/app-not-authorized":     "This app is not authorized to use Firebase Authentication.",
  };
  return map[code] ?? "Something went wrong. Please try again.";
};

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [resetEmail, setResetEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [resetMsg, setResetMsg] = useState<string>("");
  const [showReset, setShowReset] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redirect to the page the user tried to access before being sent to login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/products";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await login(email, password);
      if (userCredential?.user) {
        const uid = userCredential.user.uid;
        // Fetch full profile + role from Firestore — role field controls admin access
        const docSnap = await getUserDoc(uid);
        const data = docSnap.exists() ? docSnap.data() : {};
        dispatch(
          setUser({
            uid,
            email: userCredential.user.email ?? "",
            displayName: data.displayName ?? userCredential.user.displayName ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            avatarUrl: data.avatarUrl ?? userCredential.user.photoURL ?? "",
            role: data.role ?? "user",
          })
        );
        navigate(from, { replace: true });
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: unknown) {
      setError(friendlyError(err));
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
    } catch {
      // Intentionally swallowed — always show same message to prevent email enumeration
    }
    setResetMsg("If that email is registered, a reset link has been sent.");
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
            style={{ color: accent, letterSpacing: "-1px", textShadow: "0 2px 8px #6366f122" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Login to Spree
          </motion.h2>
          <AnimatePresence>
            {!showReset ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <Form onSubmit={handleSubmit} autoComplete="on">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="login-email"
                      name="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="you@email.com"
                      style={{ borderRadius: "1em" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      id="login-password"
                      name="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      placeholder="Your password"
                      style={{ borderRadius: "1em" }}
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 fw-bold rounded-pill"
                    style={{ background: accent, border: "none", letterSpacing: "0.03em", fontSize: "1.1rem" }}
                    disabled={loading}
                  >
                    {loading
                      ? <span className="spinner-border spinner-border-sm me-2" />
                      : <span role="img" aria-label="login">🔓</span>}
                    {" "}Login
                  </Button>
                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      className="p-0 fw-semibold"
                      style={{ color: accent, textDecoration: "underline" }}
                      onClick={() => setShowReset(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <span>Don&apos;t have an account? </span>
                    <Link to="/register" style={{ color: accent, fontWeight: 600 }}>Register</Link>
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
                <Form onSubmit={handleReset} autoComplete="on">
                  <Form.Group className="mb-3">
                    <Form.Label>Enter your email to reset password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="email"
                        id="reset-email"
                        name="resetEmail"
                        value={resetEmail || email}
                        onChange={e => setResetEmail(e.target.value)}
                        required
                        placeholder="you@email.com"
                        autoComplete="email"
                        style={{ borderRadius: "1em" }}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="info"
                    className="w-100 fw-bold rounded-pill"
                    style={{ background: "#38bdf8", border: "none", letterSpacing: "0.03em", fontSize: "1.1rem" }}
                    disabled={resetLoading}
                  >
                    {resetLoading
                      ? <span className="spinner-border spinner-border-sm me-2" />
                      : <span role="img" aria-label="reset">✉️</span>}
                    {" "}Send Reset Email
                  </Button>
                  <div className="text-center mt-3">
                    <Button
                      variant="link"
                      className="p-0 fw-semibold"
                      style={{ color: accent, textDecoration: "underline" }}
                      onClick={() => setShowReset(false)}
                    >
                      Back to login
                    </Button>
                  </div>
                  <div className="text-center mt-2">
                    <span>Don&apos;t have an account? </span>
                    <Link to="/register" style={{ color: accent, fontWeight: 600 }}>Register</Link>
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

export default Login;
