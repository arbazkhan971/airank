"use client";

import { useState } from "react";
import Link from "next/link";

const mockInvites = [
  { id: "1", email: "new.hire@acme.com", role: "MEMBER", status: "pending", expiresAt: "2026-03-29" },
  { id: "2", email: "manager@acme.com", role: "MANAGER", status: "pending", expiresAt: "2026-03-28" },
  { id: "3", email: "prev@acme.com", role: "MEMBER", status: "accepted", expiresAt: "2026-03-20" },
];

export default function InvitesPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      setEmail("");
    } catch {
      alert("Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${id}`);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-gray-400 hover:text-gray-200 text-sm mb-2 inline-block">
          &larr; Back to Admin
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8">Manage Invitations</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Send New Invitation</h2>
          <form onSubmit={handleSendInvite} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="w-48">
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="MEMBER">Member</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 whitespace-nowrap"
            >
              {sending ? "Sending..." : "Send Invite"}
            </button>
          </form>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">All Invitations</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm text-gray-400">
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Expires</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInvites.map((invite) => (
                <tr key={invite.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-white">{invite.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs font-medium">
                      {invite.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      invite.status === "pending" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                    }`}>
                      {invite.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{invite.expiresAt}</td>
                  <td className="px-6 py-4">
                    {invite.status === "pending" && (
                      <button onClick={() => copyLink(invite.id)} className="text-indigo-400 hover:text-indigo-300 text-sm">
                        {copied === invite.id ? "Copied!" : "Copy Link"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
