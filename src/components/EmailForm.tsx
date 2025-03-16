"use client";
import { useState } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    setStatus("⏳ Sending...");

    const response = await fetch("/api/sendemail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, subject, message }),
    });

    const result = await response.json();
    if (result.success) {
      setStatus("✅ Email sent successfully!");
    } else {
      setStatus("❌ Failed: " + result.error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 mt-2">
        Send Email
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
