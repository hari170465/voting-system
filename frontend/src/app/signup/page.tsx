"use client";
import { useState } from "react";
import { Auth } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Signup() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await Auth.signup(email, password);
      r.push("/vote");
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-md">
      <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
        type="password"
        placeholder="Password (min 6 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Sign up
      </button>
    </form>
  );
}
