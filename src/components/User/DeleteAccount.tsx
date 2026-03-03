import React, { useState } from "react";
import { Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { deleteUserDoc } from "../../firebase/firestore";
import { deleteCurrentUser } from "../../firebase/auth";
import { clearUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DeleteAccount: React.FC = () => {
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirm !== "DELETE") return;
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      // Remove Firestore user document first
      await deleteUserDoc(user.uid);
      // Delete Firebase Auth account
      await deleteCurrentUser();
      // Clear Redux state and redirect home
      dispatch(clearUser());
      localStorage.removeItem("cart");
      navigate("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete account.";
      // Firebase requires re-authentication if session is old
      if ((err as { code?: string }).code === "auth/requires-recent-login") {
        setError("For security, please log out and log back in before deleting your account.");
      } else {
        setError(msg);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <motion.button
        type="button"
        className="btn btn-outline-danger rounded-pill fw-bold px-4 py-2"
        style={{ fontSize: "0.95rem", letterSpacing: "0.02em" }}
        onClick={() => { setShow(true); setConfirm(""); setError(null); }}
        whileTap={{ scale: 0.97 }}
      >
        Delete Account
      </motion.button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title className="text-danger fw-bold">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>This action is permanent.</strong> Your profile, all associated data, and your login
            credentials will be deleted immediately and cannot be recovered.
          </Alert>
          <Form.Group>
            <Form.Label className="fw-semibold">
              Type <strong>DELETE</strong> to confirm:
            </Form.Label>
            <Form.Control
              type="text"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="DELETE"
              style={{ borderRadius: "0.75em", fontWeight: 600 }}
              autoComplete="off"
            />
          </Form.Group>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none" }}>
          <Button variant="secondary" onClick={() => setShow(false)} disabled={loading} className="rounded-pill">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={confirm !== "DELETE" || loading}
            className="rounded-pill fw-bold"
          >
            {loading ? <><Spinner size="sm" className="me-2" />Deleting...</> : "Permanently Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAccount;
