import Link from "next/link";

const mockEvaluation = {
  id: "1",
  memberName: "David Kim",
  memberEmail: "david@acme.com",
  evaluatorName: "Alice Chen",
  periodStart: "2026-02-22",
  periodEnd: "2026-03-22",
  claudeScore: 8,
  codexScore: 7,
  productivityScore: 9,
  qualityScore: 8,
  overallScore: 8,
  strengths:
    "Excellent prompt engineering skills. Consistently writes clear, specific prompts that maximize output quality.",
  improvements:
    "Could improve Codex task scoping - sometimes tasks are too broad and need to be broken down further.",
  notes:
    "David has shown significant growth this quarter. Recommend for advanced AI training program.",
  status: "SUBMITTED" as const,
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8
      ? "bg-green-500"
      : score >= 6
        ? "bg-yellow-500"
        : score >= 4
          ? "bg-orange-500"
          : "bg-red-500";
  const textColor =
    score >= 8
      ? "text-green-400"
      : score >= 6
        ? "text-yellow-400"
        : score >= 4
          ? "text-orange-400"
          : "text-red-400";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className={`font-bold ${textColor}`}>{score}/10</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

export default function EvaluationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const evaluation = mockEvaluation;
  const statusColors: Record<string, string> = {
    DRAFT: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    ACKNOWLEDGED: "bg-green-500/10 text-green-400 border-green-500/30",
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/evaluations"
              className="text-gray-400 hover:text-gray-200 text-sm mb-2 inline-block"
            >
              &larr; Back to Evaluations
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Evaluation Details
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[evaluation.status]}`}
          >
            {evaluation.status}
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Team Member</h3>
              <p className="text-lg font-semibold text-white">
                {evaluation.memberName}
              </p>
              <p className="text-gray-400 text-sm">{evaluation.memberEmail}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-1">Evaluation Period</h3>
              <p className="text-lg font-semibold text-white">
                {evaluation.periodStart} &mdash; {evaluation.periodEnd}
              </p>
              <p className="text-gray-400 text-sm">
                Evaluated by {evaluation.evaluatorName}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6">Scores</h2>
          <div className="space-y-4">
            <ScoreBar
              label="Claude Proficiency"
              score={evaluation.claudeScore}
            />
            <ScoreBar
              label="Codex Proficiency"
              score={evaluation.codexScore}
            />
            <ScoreBar
              label="Productivity Impact"
              score={evaluation.productivityScore}
            />
            <ScoreBar label="Work Quality" score={evaluation.qualityScore} />
            <div className="border-t border-gray-700 pt-4">
              <ScoreBar
                label="Overall Rating"
                score={evaluation.overallScore}
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-gray-800 rounded-lg px-6 py-3">
              <span className="text-gray-400">Average:</span>
              <span className="text-2xl font-bold text-indigo-400">
                {(
                  (evaluation.claudeScore +
                    evaluation.codexScore +
                    evaluation.productivityScore +
                    evaluation.qualityScore +
                    evaluation.overallScore) /
                  5
                ).toFixed(1)}
              </span>
              <span className="text-gray-400">/ 10</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Strengths
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {evaluation.strengths}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-3">
              Areas for Improvement
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {evaluation.improvements}
            </p>
          </div>
        </div>

        {evaluation.notes && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
              Additional Notes
            </h3>
            <p className="text-gray-300 leading-relaxed">{evaluation.notes}</p>
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <Link
            href="/evaluations"
            className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
          >
            Back
          </Link>
          {evaluation.status === "SUBMITTED" && (
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
