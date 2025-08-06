"use client";

import { useState } from "react";

export default function SendEmailPage() {
  const [form, setForm] = useState({ to: "", subject: "", text: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:3005/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setStatus(data.message || "ส่งอีเมลเรียบร้อยแล้ว");
    } catch (error) {
      console.error(error);
      setStatus("เกิดข้อผิดพลาดในการส่งอีเมล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">📩 ส่งอีเมล</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="to"
          type="email"
          placeholder="อีเมลผู้รับ (To)"
          value={form.to}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 w-full rounded"
        />

        <input
          name="subject"
          placeholder="หัวข้อ (Subject)"
          value={form.subject}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 w-full rounded"
        />

        <textarea
          name="text"
          placeholder="ข้อความ (Message)"
          value={form.text}
          onChange={handleChange}
          required
          rows={5}
          className="border border-gray-300 p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "กำลังส่ง..." : "ส่ง"}
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm text-green-600">
          {status}
        </p>
      )}
    </div>
  );
}
