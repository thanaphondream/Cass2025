"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; 

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 600,
  height: "auto",
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const User_ = () => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [copied, setCopied] = useState(false); 

  const token = localStorage.getItem('token')

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTokenInput("");
    setGeneratedToken("");
    setCopied(false);
  };

  // const check_inputtoken = (nametk: string) => {
  //   const hasEnglishLetters = /[a-zA-Z]/.test(nametk)
  //   const hasUppercase = /[A-Z]/.test(nametk)
  //   const hasNumber = /[0-9]/.test(nametk)
  // }

  const handleGenerateToken = async () => {
    if (!user) return null;
    const { username, email }: User = user;
    const nametoken: string = tokenInput;
    // check_inputtoken(nametoken)
    const rsw = await fetch('http://localhost:3005/api/login/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username, email, nametoken})
    })
    const rsw_json = await rsw.json()
    console.log("rsw_json", rsw_json)
    // const newToken = Math.random().toString(36).substring(2, 12);
    setGeneratedToken(rsw_json.token);
    localStorage.setItem('token', rsw_json.token)
    setCopied(false);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const Dataapi = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          setStatus("ไม่พบอีเมลใน localStorage");
          return;
        }

        const res = await fetch(`http://localhost:3005/api/user-email/${email}`);
        const res_json = await res.json();

        if (res.ok) {
          setUser(res_json);
          setStatus(null);
        } else {
          setUser(null);
          setStatus(res_json.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      } catch (err) {
        console.error(err);
        setUser(null);
        setStatus("⚠ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      }
    };

    Dataapi();
  }, []);

  return (
    // <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
    <div className="mx-auto mt-12 p-6 bg-white rounded shadow">

      {status && <p className="text-red-500">{status}</p>}

      {user ? (
        <div className="space-y-2">
          <div className="flex justify-end">
          <button
            onClick={handleOpen}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ขอโทเคน
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">ข้อมูลผู้ใช้</h2>
          <p><strong>ชื่อผู้ใช้</strong> {user.username}</p>
          <p><strong>อีเมล:</strong> {user.email}</p>

        {token && (
          <div className="mt-7 rounded-lg shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-2">🔐 โทเคนที่สร้างได้:</p>
            <div className="px-3 py-2 bg-white border border-gray-300 rounded text-gray-800 font-mono text-sm break-all">
              {token}
            </div>
          </div>
        )}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-title" variant="h6" gutterBottom>
                🔐 สร้างโทเคน
              </Typography>

              <TextField
                fullWidth
                label="กรอกรหัส Token"
                variant="outlined"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateToken}
                fullWidth
                sx={{ mb: 2 }}
              >
                สร้างโทเคน
              </Button>

              <div className="flex items-center gap-2">
                <TextField
                  fullWidth
                  label="โทเคนที่สร้างได้"
                  value={generatedToken}
                  InputProps={{ readOnly: true }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCopyToken}
                  disabled={!generatedToken}
                >
                  <ContentCopyIcon />
                </Button>
              </div>

              {copied && (
                <Typography color="success.main" sx={{ mt: 1 }}>
                  ✅ คัดลอกแล้ว!
                </Typography>
              )}

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                sx={{ mt: 3 }}
                fullWidth
              >
                ปิด
              </Button>
            </Box>
          </Modal>
        </div>
      ) : (
        <p>⏳ กำลังโหลดข้อมูลผู้ใช้...</p>
      )}
    </div>
  );
};

export default User_;
