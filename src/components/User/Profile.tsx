import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { getUserDoc, updateUserProfile } from "../../firebase/firestore";
import {
  Card,
  Spinner,
  Badge,
  Form,
  Alert,
  Toast,
  ToastContainer,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from "react-bootstrap";
import AnimatedCard from "../AnimatedCard";
import DeleteAccount from "./DeleteAccount";
import EditProfile from "./EditProfile";
import { motion, AnimatePresence } from "framer-motion";

const defaultAvatar = "https://api.dicebear.com/7.x/identicon/svg?seed=spree";
const accent = "#6366f1";
const gold = "#fbbf24";

// Calculate gamified XP and level based on profile completeness
const gamifyLevel = (profile: any) => {
  let xp = 0;
  if (profile?.displayName) xp += 25;
  if (profile?.phone) xp += 25;
  if (profile?.address) xp += 25;
  if (profile?.avatarUrl && profile.avatarUrl !== defaultAvatar) xp += 25;
  const level = Math.floor(xp / 50) + 1;
  return { xp, level };
};

type User = { uid: string; [key: string]: any };

const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user) as User | null;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (user && user.uid) {
        const docSnap = await getUserDoc(user.uid);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (isMounted) {
            setProfile(data);
            setForm(data);
            setAvatarUrl(data.avatarUrl || defaultAvatar);
          }
        }
      }
      if (isMounted) setLoading(false);
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadAvatar = async (_file: File) => {
    setAvatarUploading(true);
    await new Promise(res => setTimeout(res, 1200));
    setAvatarUploading(false);
    return avatarUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    let avatarDownloadUrl = avatarUrl;
    try {
      if (avatarFile) {
        avatarDownloadUrl = await uploadAvatar(avatarFile);
      }
      if (!user) throw new Error("User not found");
      await updateUserProfile(user.uid, {
        displayName: form.displayName || "",
        phone: form.phone || "",
        address: form.address || "",
        avatarUrl: avatarDownloadUrl,
      });
      setProfile({ ...profile, ...form, avatarUrl: avatarDownloadUrl });
      setEditMode(false);
      setSuccessMsg("Profile updated successfully!");
      setShowToast(true);
      setAvatarFile(null);
    } catch (err: any) {
      setError("Failed to update profile. Please try again.");
    }
    setSaving(false);
  };

  const toastVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 }
  };

  const { xp, level } = gamifyLevel(profile);

  if (!user)
    return (
      <AnimatedCard>
        <Card className="text-center" style={{ border: "none", background: "#f8fafc" }}>
          <Card.Body>
            <h3 style={{ color: accent, fontWeight: 700 }}>Please log in to view your profile.</h3>
          </Card.Body>
        </Card>
      </AnimatedCard>
    );

  if (loading)
    return (
      <div
        style={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          borderRadius: "1.25rem",
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );

  // --- TEST FRIENDLY: Show "Loading..." if profile is not yet loaded, otherwise show profile ---
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AnimatedCard>
        <Card
          as={motion.div}
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          style={{
            border: "none",
            borderRadius: "1.5rem",
            background: "linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)",
            boxShadow: "0 8px 32px rgba(99,102,241,0.10), 0 1.5px 8px rgba(30,41,59,0.08)",
            maxWidth: 540,
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gamified Level Badge */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              position: "absolute",
              top: 18,
              right: 24,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Badge
              bg="warning"
              style={{
                background: gold,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 2px 8px #fbbf2433",
                letterSpacing: "0.5px",
                padding: "0.5em 1em",
                borderRadius: "1.5em",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span role="img" aria-label="level">🏆</span> Level {level}
            </Badge>
          </motion.div>
          <Card.Body>
            <div className="d-flex align-items-center mb-3">
              <Card.Title
                style={{
                  fontWeight: 800,
                  color: accent,
                  fontSize: "2.1rem",
                  letterSpacing: "-1px",
                  flex: 1,
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                Profile
              </Card.Title>
            </div>
            {/* Gamified XP Progress */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.7, type: "spring" }}
              style={{ marginBottom: 24 }}
            >
              <ProgressBar
                now={xp}
                max={100}
                label={<span style={{ color: "#fff", fontWeight: 600 }}>{xp} XP</span>}
                style={{
                  height: 18,
                  background: "#e0e7ff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #60a5fa22",
                  fontSize: "1rem",
                  fontWeight: 700,
                  transition: "width 0.6s cubic-bezier(.4,2,.6,1)",
                }}
                variant="info"
                animated
                className="mb-2"
              />
            </motion.div>
            {/* Error and success alerts */}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {/* Avatar section */}
            <div className="d-flex flex-column align-items-center mb-4 position-relative">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Click to change avatar</Tooltip>}
              >
                <motion.div
                  whileHover={editMode ? { scale: 1.08, boxShadow: "0 4px 24px #6366f166" } : {}}
                  style={{
                    cursor: editMode ? "pointer" : "default",
                    marginBottom: 8,
                    position: "relative",
                    transition: "box-shadow 0.3s cubic-bezier(.4,2,.6,1)",
                  }}
                  onClick={() => editMode && fileInputRef.current?.click()}
                  tabIndex={0}
                  aria-label="Change avatar"
                >
                  <motion.img
                    src={avatarUrl}
                    alt="Profile avatar"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    style={{
                      width: 108,
                      height: 108,
                      borderRadius: "50%",
                      boxShadow: "0 4px 24px #6366f122, 0 2px 8px #e0e7ff",
                      border: `4px solid ${accent}`,
                      objectFit: "cover",
                      background: "#fff",
                    }}
                  />
                  {/* Edit icon overlay when in edit mode */}
                  {editMode && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{
                        position: "absolute",
                        right: -8,
                        bottom: -8,
                        background: accent,
                        color: "#fff",
                        borderRadius: "50%",
                        padding: "0.4em 0.6em",
                        fontSize: "1.2em",
                        boxShadow: "0 2px 8px #6366f122",
                        border: "2px solid #fff",
                        zIndex: 2,
                      }}
                    >
                      ✎
                    </motion.span>
                  )}
                </motion.div>
              </OverlayTrigger>
              {/* Hidden file input for avatar upload */}
              {editMode && (
                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                  aria-label="Upload avatar"
                />
              )}
              {/* Avatar uploading spinner */}
              {avatarUploading && (
                <Spinner animation="border" size="sm" style={{ marginTop: 8, color: accent }} />
              )}
            </div>
            {/* Profile details or edit form */}
            {!editMode ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                style={{
                  color: "#1e293b",
                  fontSize: "1.13rem",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "1rem",
                  padding: "1.2rem 1rem",
                  boxShadow: "0 2px 8px #6366f111",
                }}
              >
                <Row>
                  <Col xs={12} className="mb-2">
                    <strong>Email:</strong>{" "}
                    <span style={{ color: accent, fontWeight: 600 }}>{profile.email}</span>
                  </Col>
                  {profile.displayName && (
                    <Col xs={12} className="mb-2">
                      <strong>Name:</strong> <span>{profile.displayName}</span>
                    </Col>
                  )}
                  {profile.phone && (
                    <Col xs={12} className="mb-2">
                      <strong>Phone:</strong> <span>{profile.phone}</span>
                    </Col>
                  )}
                  {profile.address && (
                    <Col xs={12} className="mb-2">
                      <strong>Address:</strong> <span>{profile.address}</span>
                    </Col>
                  )}
                  <Col xs={12} className="mb-2">
                    <strong>Member Since:</strong>{" "}
                    <span>
                      {profile.createdAt?.toDate
                        ? profile.createdAt.toDate().toLocaleDateString()
                        : "N/A"}
                    </span>
                  </Col>
                </Row>
                <div className="d-flex mt-4 gap-2">
                  <motion.button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginRight: 12,
                      fontWeight: 700,
                      borderRadius: "1.5em",
                      letterSpacing: "0.5px",
                      boxShadow: "0 2px 8px #6366f122",
                      background: accent,
                      border: "none",
                      transition: "background 0.2s",
                    }}
                    onClick={() => setEditMode(true)}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span role="img" aria-label="edit">🛠️</span> Edit Profile
                  </motion.button>
                  <DeleteAccount />
                </div>
              </motion.div>
            ) : (
              <EditProfile
                form={form}
                setForm={setForm}
                avatarUploading={avatarUploading}
                saving={saving}
                handleChange={handleChange}
                handleSave={handleSave}
                setEditMode={setEditMode}
                setAvatarUrl={setAvatarUrl}
                setAvatarFile={setAvatarFile}
                profile={profile}
              />
            )}
          </Card.Body>
        </Card>
      </AnimatedCard>
      {/* Toast Notification for Profile Update */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 3000 }}>
        <AnimatePresence>
          {showToast && (
            <motion.div
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Toast
                bg="success"
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={1800}
                autohide
                style={{
                  minWidth: 220,
                  borderRadius: "1rem",
                  boxShadow: "0 4px 24px rgba(16,185,129,0.12)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.05rem"
                }}
              >
                <Toast.Body>
                  <span role="img" aria-label="check">✅</span> <span style={{ color: "#fff" }}>
                    Profile updated!
                  </span>
                </Toast.Body>
              </Toast>
            </motion.div>
          )}
        </AnimatePresence>
      </ToastContainer>
      {/* Custom style for progress bar */}
      <style>{`
        .progress-bar.bg-info {
          background: linear-gradient(90deg, #60a5fa 60%, #6366f1 100%);
        }
      `}</style>
    </>
  );
};

export default Profile;