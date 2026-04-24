import { BookOpenText, Brain, Target } from "lucide-react";

const TIPS = [
  {
    title: "Read Questions Twice",
    description: "Spend a second read on each question to avoid simple mistakes before selecting an option.",
    icon: BookOpenText
  },
  {
    title: "Attempt In Two Passes",
    description: "Finish easy questions first, then come back to the difficult ones to improve total score.",
    icon: Target
  },
  {
    title: "Review Weak Topics",
    description: "Use your history scores to spot low-performance quizzes and practice those topics more.",
    icon: Brain
  }
];

function StudentHelp() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-cyan-600 to-teal-600 p-6 text-white shadow-lg md:p-8">
        <h2 className="text-3xl font-semibold">Study Tips</h2>
        <p className="mt-2 max-w-2xl text-sm text-cyan-50/95">
          Use these simple habits while attempting quizzes to raise accuracy and move up on the leaderboard.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {TIPS.map((tip) => {
          const Icon = tip.icon;
          return (
            <article
              key={tip.title}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-teal-50 p-2 text-teal-600">
                <Icon size={20} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{tip.title}</h3>
              <p className="text-sm text-slate-600">{tip.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default StudentHelp;
