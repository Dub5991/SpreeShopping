import React from "react";
import { Form, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

const success = "#10b981";
const defaultAvatar = "https://api.dicebear.com/7.x/identicon/svg?seed=spree";

interface EditProfileProps {
  form: any;
  setForm: (form: any) => void;
  avatarUploading: boolean;
  saving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
  setEditMode: (edit: boolean) => void;
  setAvatarUrl: (url: string) => void;
  setAvatarFile: (file: File | null) => void;
  profile: any;
}

const EditProfile: React.FC<EditProfileProps> = ({
  form,
  setForm,
  avatarUploading,
  saving,
  handleChange,
  handleSave,
  setEditMode,
  setAvatarUrl,
  setAvatarFile,
  profile,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring" }}
    style={{
      background: "rgba(255,255,255,0.93)",
      borderRadius: "1rem",
      padding: "1.2rem 1rem",
      boxShadow: "0 2px 8px #6366f111",
    }}
  >
    <Form onSubmit={handleSave} style={{ color: "#1e293b", fontSize: "1.13rem" }}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          name="displayName"
          value={form.displayName || ""}
          onChange={handleChange}
          placeholder="Your name"
          autoFocus
          style={{ borderRadius: "1em" }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="Phone number"
          style={{ borderRadius: "1em" }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          placeholder="Address"
          style={{ borderRadius: "1em" }}
        />
      </Form.Group>
      <div className="d-flex mt-4 gap-2">
        <motion.button
          type="submit"
          className="btn btn-success"
          style={{
            marginRight: 12,
            fontWeight: 700,
            borderRadius: "1.5em",
            letterSpacing: "0.5px",
            background: success,
            border: "none",
            boxShadow: "0 2px 8px #10b98122",
            transition: "background 0.2s",
          }}
          disabled={saving || avatarUploading}
          whileTap={{ scale: 0.96 }}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" style={{ marginRight: 8, color: "#fff" }} />
              Saving...
            </>
          ) : (
            <>
              <span role="img" aria-label="save">💾</span> Save
            </>
          )}
        </motion.button>
        <motion.button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setEditMode(false);
            setForm(profile);
            setAvatarUrl(profile.avatarUrl || defaultAvatar);
            setAvatarFile(null);
          }}
          disabled={saving || avatarUploading}
          whileTap={{ scale: 0.96 }}
          style={{
            borderRadius: "1.5em",
            fontWeight: 700,
            letterSpacing: "0.5px",
            background: "#64748b",
            border: "none",
            color: "#fff",
            boxShadow: "0 2px 8px #64748b22",
            transition: "background 0.2s",
          }}
        >
          Cancel
        </motion.button>
      </div>
    </Form>
  </motion.div>
);

export default EditProfile;