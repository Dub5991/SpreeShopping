import React, { useState } from "react";
import { Form, Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const success = "#10b981";
const defaultAvatar = "https://api.dicebear.com/7.x/identicon/svg?seed=spree";

// Only allow http/https URLs for avatar — reject javascript: data: and other dangerous protocols
const isValidHttpUrl = (url: string): boolean => {
  if (!url) return true; // empty is allowed (field is optional)
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

export type ProfileData = {
  displayName?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  email?: string;
  createdAt?: { toDate?: () => Date };
};

interface EditProfileProps {
  form: ProfileData;
  setForm: (form: ProfileData) => void;
  avatarUploading: boolean;
  saving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
  setEditMode: (edit: boolean) => void;
  setAvatarUrl: (url: string) => void;
  setAvatarFile: (file: File | null) => void;
  profile: ProfileData;
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
}) => {
  const [avatarUrlError, setAvatarUrlError] = useState<string | null>(null);

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && !isValidHttpUrl(val)) {
      setAvatarUrlError("Avatar URL must start with http:// or https://");
    } else {
      setAvatarUrlError(null);
    }
    handleChange(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (avatarUrlError) {
      e.preventDefault();
      return;
    }
    handleSave(e);
  };

  return (
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
      <Form onSubmit={handleSubmit} style={{ color: "#1e293b", fontSize: "1.13rem" }}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="displayName"
            value={form.displayName || ""}
            onChange={handleChange}
            placeholder="Your name"
            autoFocus
            maxLength={100}
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
            maxLength={20}
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
            maxLength={200}
            style={{ borderRadius: "1em" }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Avatar URL</Form.Label>
          <Form.Control
            name="avatarUrl"
            value={form.avatarUrl || ""}
            onChange={handleAvatarUrlChange}
            placeholder="https://example.com/avatar.jpg"
            maxLength={500}
            style={{ borderRadius: "1em" }}
            isInvalid={!!avatarUrlError}
          />
          {avatarUrlError && (
            <Alert variant="danger" className="mt-1 py-1 px-2" style={{ fontSize: "0.9rem", borderRadius: "0.75em" }}>
              {avatarUrlError}
            </Alert>
          )}
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
            disabled={saving || avatarUploading || !!avatarUrlError}
            whileTap={{ scale: 0.96 }}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" style={{ marginRight: 8, color: "#fff" }} />
                Saving...
              </>
            ) : (
              <><span role="img" aria-label="save">💾</span> Save</>
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
              setAvatarUrlError(null);
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
};

export default EditProfile;
