"use client";
import { useEffect, useState } from "react";
import { Auth, Candidates, Vote } from "@/lib/api";

export default function VotePage() {
  const [me, setMe] = useState<any>(null);
  const [cands, setCands] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await Auth.me();
        setMe(me);
        const list = await Candidates.list();
        setCands(list);
      } catch (e: any) {
        setErr(e.message);
      }
    })();
  }, []);

  const cast = async (id: string) => {
    setErr(null);
    setOk(null);
    try {
      await Vote.cast(id);
      setOk("Vote submitted! You can view results now.");
      const me = await Auth.me();
      setMe(me);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Cast your vote</h1>
      <p className="text-sm text-gray-600">Choose one candidate below.</p>
      {me?.hasVoted && (
        <p className="text-green-700">
          You have already voted.{" "}
          <a className="text-blue-700 underline" href="/results">
            See results
          </a>
          .
        </p>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {ok && <p className="text-sm text-green-700">{ok}</p>}

      <ul className="space-y-3">
        {cands.map((c) => (
          <li
            key={c.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-gray-900">{c.name}</div>
              {c.manifesto && (
                <div className="text-sm text-gray-600">{c.manifesto}</div>
              )}
            </div>
            <button
              disabled={me?.hasVoted}
              onClick={() => cast(c.id)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
