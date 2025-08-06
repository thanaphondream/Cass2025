"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()_\-])[A-Za-z\d@$!%*?&()_\-]{8,}$/;
    return re.test(password);
  };

  const handleLogin = () => {
    const newErrors: typeof errors = {};

    if (!username.trim()) newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    if (!email.trim()) newErrors.email = "กรุณากรอกอีเมล";
    else if (!validateEmail(email)) newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    else if (!validatePassword(password))
      newErrors.password =
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัว รวมตัวพิมพ์เล็ก, พิมพ์ใหญ่, ตัวเลข และอักขระพิเศษ";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      sessionStorage.setItem("password", password);
      router.push(
        `/passwordotp?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h2>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block font-medium mb-1">
          ชื่อที่ล็อกอิน
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`border rounded px-3 py-2 w-full focus:outline-none ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          อีเมล
        </label>
        <input
          type="email"
          id="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`border rounded px-3 py-2 w-full focus:outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block font-medium mb-1">
          รหัสผ่าน
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border rounded px-3 py-2 w-full focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full transition-colors"
      >
        ล็อกอิน
      </button>
    </div>
  );
};

export default Login;
