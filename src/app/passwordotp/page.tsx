"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEnvelope, FaSpinner } from "react-icons/fa";

const PasswordOTP = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState<string | null>(null);
  const [otp, setOtp] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);
  const [otpExpired, setOtpExpired] = useState<boolean>(false);
  const [inputOtp, setInputOtp] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    setPassword(sessionStorage.getItem("password"));
  }, []);

  useEffect(() => {
    if (cooldown === 0) return;

    const id = setInterval(() => {
      setCooldown((prev) => {
        const next = prev - 1;
        if (next === 0) {
          setStatus("📩 เวลาหมดแล้ว กรุณากดส่งอีเมลอีกครั้ง");
          setOtpExpired(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [cooldown]);

  const sendOtpEmail = async (code: string) => {
    try {
      const res = await fetch("http://localhost:3005/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "OTP Verification",
          text: `${code}`,
        }),
      });

      if (res.ok) {
        setStatus("📨 ส่งรหัส OTP ไปยังอีเมลเรียบร้อยแล้ว");
      } else {
        setStatus("❌ ส่งอีเมลไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  const handleSendOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(code);
    setOtpExpired(false); 
    setInputOtp("");
    setCooldown(30);
    setStatus("⏳ กำลังส่งรหัส...");
    await sendOtpEmail(code);
    console.log("OTP for dev ➜", code);
  };

  const handleVerify = async () => {
    if (isVerified) return;

    if (!otp) {
      setStatus("⚠ กรุณากดส่งรหัส OTP ก่อน");
      return;
    }

    if (otpExpired) {
      setStatus("⛔ รหัส OTP หมดอายุแล้ว กรุณากดส่งใหม่");
      return;
    }

    if (inputOtp !== otp) {
      setStatus("❌ รหัส OTP ไม่ถูกต้อง");
      return;
    }

    setIsVerified(true);
    setIsLoading(true);
    setStatus("✅ ยืนยันรหัส OTP สำเร็จ กำลังสร้างบัญชี...");

    try {
      const res = await fetch("http://localhost:3005/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setStatus("🎉 สมัครสมาชิกสำเร็จ! กำลังพาไปหน้าล็อกอิน...");
        localStorage.setItem("email", email)
        setTimeout(() => router.push("/userprofile"), 2000);
      } else {
            const errorRes = await res.json();
            const errorMsg = errorRes.message || errorRes.Error || "Unknown error";
            setStatus(`❌ สมัครสมาชิกไม่สำเร็จ: ${errorMsg}`);

        setIsVerified(false);
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200 space-y-6">
      <div className="text-center">
        <FaEnvelope className="mx-auto text-blue-500 text-4xl mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">ยืนยันตัวตนด้วยอีเมล</h2>
        <p className="text-sm text-gray-500">
          กดปุ่มเพื่อรับรหัส OTP ทางอีเมล <span className="font-medium">({email})</span>
        </p>
      </div>

      <button
        onClick={handleSendOtp}
        disabled={cooldown > 0 || isLoading || isVerified}
        className={`w-full flex justify-center items-center gap-2 py-2 rounded-md text-white transition
          ${cooldown > 0 || isVerified
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"}`}
      >
        {cooldown > 0 ? (
          <>
            <FaSpinner className="animate-spin" /> ส่งรหัสอีกครั้งใน {cooldown} วินาที
          </>
        ) : (
          <>
            <FaEnvelope /> ส่งรหัส OTP
          </>
        )}
      </button>

      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          disabled={isVerified}
          placeholder="กรอกรหัส OTP 6 หลัก"
          value={inputOtp}
          onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ""))}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleVerify}
          disabled={inputOtp.length !== 6 || isLoading || isVerified}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : "ตรวจสอบ"}
        </button>
      </div>

      {status && (
        <div
          className={`text-sm font-medium px-3 py-2 rounded min-h-[40px]
            ${status.startsWith("✅") || status.startsWith("🎉")
              ? "text-green-700 bg-green-100"
              : status.startsWith("❌") || status.startsWith("⛔")
                ? "text-red-700 bg-red-100"
                : "text-blue-700 bg-blue-100"}`}
        >
          {status}
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <span className="text-lg">←</span> ย้อนกลับ
        </button>

        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition"
        >
          🏠 กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
};

export default PasswordOTP;
