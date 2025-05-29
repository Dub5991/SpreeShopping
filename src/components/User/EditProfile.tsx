// src/components/User/EditProfile.tsx
// Edit user profile form, extracted for modularity and reusability

import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

// Color constants for styling
const accent = "#6366f1";
const success = "#10b981";
const defaultAvatar = "https://api.dicebear.com/7.x/identicon/svg?seed=spree";

// EditProfile component props definition
const EditProfile: React.FC<{
  form: any;
  setForm: (form: any) => void;
  avatarUrl: string;
  avatarUploading: boolean;
  saving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setEditMode: (edit: boolean) => void;
  setAvatarUrl: (url: string) => void;
  setAvatarFile: (file: File | null) => void;
  profile: any;
  fileInputRef: React.RefObject<HTMLInputElement>;
}> = ({
  form,
  setForm,
  avatarUrl,
  avatarUploading,
  saving,
  handleChange,
  handleSave,
  handleAvatarChange,
  setEditMode,
  setAvatarUrl,
  setAvatarFile,
  profile,
  fileInputRef
}) => (
  // Animated container for the form
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
    {/* User profile edit form */}
    <Form onSubmit={handleSave} style={{ color: "#1e293b", fontSize: "1.13rem" }}>
      {/* Name input */}
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
      {/* Phone input */}
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
      {/* Address input */}
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
      {/* Action buttons */}
      <div className="d-flex mt-4 gap-2">
        {/* Save button */}
        <Button
          variant="success"
          type="submit"
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
          as={motion.button}
          whileTap={{ scale: 0.96 }}
        >
          {saving ? (
            <>
              {/* Spinner while saving */}
              <Spinner
                animation="border"
                size="sm"
                style={{ marginRight: 8, color: "#fff" }}
              />
              Saving...
            </>
          ) : (
            <>
              <span role="img" aria-label="save">💾</span> Save
            </>
          )}
        </Button>
        {/* Cancel button */}
        <Button
          variant="secondary"
          onClick={() => {
            setEditMode(false);
            setForm(profile);
            setAvatarUrl(profile.avatarUrl || defaultAvatar);
            setAvatarFile(null);
          }}
          disabled={saving || avatarUploading}
          as={motion.button}
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
        </Button>
      </div>
    </Form>
  </motion.div>
);

export default EditProfile;