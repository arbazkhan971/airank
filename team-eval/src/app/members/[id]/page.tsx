import Link from "next/link";
import { MemberProfileClient } from "./client";

interface PageProps {
  params: { id: string };
}

// ── Mock Data ──────────────────────────────────────────────────────────

const MEMBERS: Record<
  string,
  {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
    title: string;
    teams: string[];
    joinedAt: string;
    totalSpend: number;
  }
> = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@acme.dev",
    avatar: null,
    role: "Senior Engineer",
    title: "AI Architect",
    teams: ["Platform", "AI Core"],
    joinedAt: "2024-06-15",
    totalSpend: 1240,
  },
  "2": {
    id: "2",
    name: "Alex Rivera",
    email: "alex@acme.dev",
    avatar: null,
    role: "Staff Engineer",
    title: "Power User",
    teams: ["Backend", "Infrastructure"],
    joinedAt: "2024-03-20",
    totalSpend: 680,
  },
  "3": {
    id: "3",
    name: "Mika Tanaka",
    email: "mika@acme.dev",
    avatar: null,
    role: "Engineering Manager",
    title: "Heavy Hitter",
    teams: ["Frontend", "Design Systems"],
    joinedAt: "2024-01-10",
    totalSpend: 320,
  },
};

function getMember(id: string) {
  return MEMBERS[id] ?? MEMBERS["1"];
}

// ── Server Component ───────────────────────────────────────────────────

export default function MemberProfilePage({ params }: PageProps) {
  const member = getMember(params.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav breadcrumb */}
      <div className="border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link
              href="/dashboard"
              className="hover:text-zinc-300 transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/leaderboard"
              className="hover:text-zinc-300 transition-colors"
            >
              Members
            </Link>
            <span>/</span>
            <span className="text-zinc-200">{member.name}</span>
          </div>
        </div>
      </div>

      <MemberProfileClient member={member} />
    </div>
  );
}
