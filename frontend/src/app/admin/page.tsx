"use client";
import { useEffect, useState } from "react";
import { Auth, Candidates } from "@/lib/api";

export default function AdminPage() {
  const [me, setMe] = useState<any>(null);
  const [cands, setCands] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", manifesto: "", isActive: true });
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    const me = await Auth.me();
    setMe(me);
    const list = await Candidates.adminList();
    setCands(list);
  };

  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await Candidates.create(form);
      setForm({ name: "", manifesto: "", isActive: true });
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    setErr(null);
    try {
      await Candidates.update(id, { isActive: !isActive });
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const del = async (id: string) => {
    setErr(null);
    try {
      await Candidates.del(id);
      await load();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (me && me.role !== "ADMIN") return <p className="text-gray-800">Forbidden (admin only).</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Admin — Candidates</h1>
      {err && <p className="text-sm text-red-600">{err}</p>}

      <form onSubmit={create} className="grid gap-2 max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          placeholder="Manifesto (optional)"
          value={form.manifesto}
          onChange={(e) => setForm({ ...form, manifesto: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>
        <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 w-fit">
          Create
        </button>
      </form>

      <ul className="space-y-3">
        {cands.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-gray-900">{c.name}</div>
              <div className="text-xs text-gray-600">{c.isActive ? "Active" : "Inactive"}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleActive(c.id, c.isActive)}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700"
              >
                Toggle
              </button>
              <button
                onClick={() => del(c.id)}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
