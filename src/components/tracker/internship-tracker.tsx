"use client";

import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  Code2,
  Flame,
  Github,
  GraduationCap,
  LayoutDashboard,
  Link as LinkIcon,
  Menu,
  Plus,
  RotateCcw,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  title: string;
  stack: string;
  github: string;
  deployment: string;
  status: "Planning" | "Building" | "Done";
};

type Application = {
  id: string;
  company: string;
  role: string;
  status: "Wishlist" | "Applied" | "Interview" | "Offer";
};

type TopicKey = "arrays" | "strings" | "dp" | "graphs" | "trees";
type DifficultyKey = "easy" | "medium" | "hard";

type Profile = {
  targetCgpa: number;
  currentCgpa: number;
  completedSemesters: number;
  totalSemesters: number;
  leetcodeGoal: number;
  projectsGoal: number;
  dailyStudyHours: number;
  mockTarget: number;
  mocksDone: number;
  companyWishlist: number;
};

type TrackerState = {
  profile: Profile;
  habits: Record<string, boolean>;
  roadmap: Record<string, boolean>;
  resume: Record<string, boolean>;
  solved: {
    arrays: number;
    strings: number;
    dp: number;
    graphs: number;
    trees: number;
    easy: number;
    medium: number;
    hard: number;
  };
  projects: Project[];
  applications: Application[];
};

const STORAGE_KEY = "full-stack-internship-tracker-v1";

const navItems = [
  ["overview", "Overview", LayoutDashboard],
  ["roadmap", "Roadmap", Rocket],
  ["habits", "Habits", CalendarCheck],
  ["dsa", "DSA", Code2],
  ["projects", "Projects", Github],
  ["career", "Career", BriefcaseBusiness]
] as const;

const phases = [
  {
    id: "foundation",
    title: "Foundation",
    weeks: "Weeks 1-8",
    skills: ["CS basics", "Git/GitHub", "JavaScript", "TypeScript", "Linux CLI"],
    goals: ["Revise OOP and DBMS", "Solve 60 easy DSA problems", "Ship a portfolio v1"]
  },
  {
    id: "frontend",
    title: "Frontend Development",
    weeks: "Weeks 9-20",
    skills: ["React", "Next.js", "Tailwind CSS", "Accessibility", "State management"],
    goals: ["Build 3 polished UIs", "Learn App Router patterns", "Practice responsive layouts"]
  },
  {
    id: "backend",
    title: "Backend Development",
    weeks: "Weeks 21-32",
    skills: ["Node.js", "REST APIs", "PostgreSQL", "Auth", "Testing"],
    goals: ["Design CRUD APIs", "Add JWT/session auth", "Deploy a backend project"]
  },
  {
    id: "advanced",
    title: "Advanced Full Stack",
    weeks: "Weeks 33-44",
    skills: ["System design", "Caching", "Docker", "CI/CD", "Performance"],
    goals: ["Refactor for scale", "Add observability", "Write technical case studies"]
  },
  {
    id: "internship",
    title: "Internship Preparation",
    weeks: "Weeks 45-52",
    skills: ["Resume", "Mock interviews", "Applications", "Networking", "Behavioral prep"],
    goals: ["Apply to 80 companies", "Complete 12 mocks", "Polish top 3 projects"]
  }
];

const habits = ["Code", "DSA", "Project", "Read", "Apply"];
const resumeItems = ["One-page resume", "ATS keywords", "Portfolio live", "LinkedIn polished", "Project writeups"];
const quotes = [
  "Tiny commits become visible momentum.",
  "Ship something today, even if it is small.",
  "Consistency is the quiet superpower.",
  "A polished project tells your story before you enter the room."
];

const initialState: TrackerState = {
  profile: {
    targetCgpa: 8.5,
    currentCgpa: 0,
    completedSemesters: 0,
    totalSemesters: 8,
    leetcodeGoal: 300,
    projectsGoal: 4,
    dailyStudyHours: 4,
    mockTarget: 12,
    mocksDone: 0,
    companyWishlist: 0
  },
  habits: {},
  roadmap: {},
  resume: {},
  solved: {
    arrays: 0,
    strings: 0,
    dp: 0,
    graphs: 0,
    trees: 0,
    easy: 0,
    medium: 0,
    hard: 0
  },
  projects: [],
  applications: []
};

export function InternshipTracker() {
  const [state, setState] = useState<TrackerState>(initialState);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dsaDraft, setDsaDraft] = useState({
    topic: "arrays" as TopicKey,
    difficulty: "easy" as DifficultyKey
  });
  const [projectDraft, setProjectDraft] = useState({
    title: "",
    stack: "",
    github: "",
    deployment: "",
    status: "Planning" as Project["status"]
  });
  const [applicationDraft, setApplicationDraft] = useState({
    company: "",
    role: "",
    status: "Wishlist" as Application["status"]
  });

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<TrackerState>;
      setState({
        ...initialState,
        ...parsed,
        profile: { ...initialState.profile, ...parsed.profile },
        solved: { ...initialState.solved, ...parsed.solved }
      });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const days = useMemo(() => buildDays(), []);
  const completedHabits = Object.values(state.habits).filter(Boolean).length;
  const totalHabits = days.length * habits.length;
  const habitPercent = Math.round((completedHabits / totalHabits) * 100);
  const streak = calculateStreak(days, state.habits);
  const roadmapPercent = Math.round(
    (Object.values(state.roadmap).filter(Boolean).length /
      phases.reduce((sum, phase) => sum + phase.skills.length + phase.goals.length, 0)) *
      100
  );
  const resumePercent = Math.round(
    (resumeItems.filter((item) => state.resume[item]).length / resumeItems.length) * 100
  );
  const projectPercent = Math.round(
    (state.projects.filter((project) => project.status === "Done").length /
      Math.max(1, state.profile.projectsGoal)) *
      100
  );
  const dsaTotal = state.solved.easy + state.solved.medium + state.solved.hard;
  const dsaPercent = Math.round((dsaTotal / Math.max(1, state.profile.leetcodeGoal)) * 100);
  const readiness = Math.round(
    roadmapPercent * 0.28 + habitPercent * 0.18 + dsaPercent * 0.22 + projectPercent * 0.18 + resumePercent * 0.14
  );
  const cgpaGap = Math.max(0, state.profile.targetCgpa - state.profile.currentCgpa);
  const remainingSemesters = Math.max(0, state.profile.totalSemesters - state.profile.completedSemesters);
  const requiredCgpa = calculateRequiredCgpa(state.profile);
  const xp = completedHabits * 20 + dsaTotal * 8 + state.projects.filter((p) => p.status === "Done").length * 350;
  const quote = quotes[new Date().getDay() % quotes.length];

  const topicData = [
    { topic: "Arrays", solved: state.solved.arrays, goal: Math.ceil(state.profile.leetcodeGoal * 0.24) },
    { topic: "Strings", solved: state.solved.strings, goal: Math.ceil(state.profile.leetcodeGoal * 0.17) },
    { topic: "Trees", solved: state.solved.trees, goal: Math.ceil(state.profile.leetcodeGoal * 0.15) },
    { topic: "Graphs", solved: state.solved.graphs, goal: Math.ceil(state.profile.leetcodeGoal * 0.12) },
    { topic: "DP", solved: state.solved.dp, goal: Math.ceil(state.profile.leetcodeGoal * 0.14) }
  ];
  const difficultyData = [
    { name: "Easy", value: state.solved.easy, color: "#67e8f9" },
    { name: "Medium", value: state.solved.medium, color: "#86efac" },
    { name: "Hard", value: state.solved.hard, color: "#f0abfc" }
  ];
  const analyticsData = [
    { month: "Jan", readiness: 12 },
    { month: "Mar", readiness: 24 },
    { month: "May", readiness: Math.max(35, readiness - 18) },
    { month: "Jul", readiness: Math.max(45, readiness - 8) },
    { month: "Now", readiness }
  ];

  function toggleHabit(day: string, habit: string) {
    const key = `${day}:${habit}`;
    setState((current) => ({
      ...current,
      habits: { ...current.habits, [key]: !current.habits[key] }
    }));
  }

  function toggleRoadmap(id: string) {
    setState((current) => ({
      ...current,
      roadmap: { ...current.roadmap, [id]: !current.roadmap[id] }
    }));
  }

  function toggleResume(item: string) {
    setState((current) => ({
      ...current,
      resume: { ...current.resume, [item]: !current.resume[item] }
    }));
  }

  function updateProfile<K extends keyof Profile>(key: K, value: Profile[K]) {
    setState((current) => ({
      ...current,
      profile: { ...current.profile, [key]: value }
    }));
  }

  function addDsaProblem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState((current) => ({
      ...current,
      solved: {
        ...current.solved,
        [dsaDraft.topic]: current.solved[dsaDraft.topic] + 1,
        [dsaDraft.difficulty]: current.solved[dsaDraft.difficulty] + 1
      }
    }));
  }

  function updateSolved(key: keyof TrackerState["solved"], value: number) {
    setState((current) => ({
      ...current,
      solved: { ...current.solved, [key]: Math.max(0, value) }
    }));
  }

  function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectDraft.title.trim()) {
      return;
    }

    setState((current) => ({
      ...current,
      projects: [{ id: crypto.randomUUID(), ...projectDraft }, ...current.projects]
    }));
    setProjectDraft({ title: "", stack: "", github: "", deployment: "", status: "Planning" });
  }

  function cycleProjectStatus(projectId: string) {
    const order: Project["status"][] = ["Planning", "Building", "Done"];
    setState((current) => ({
      ...current,
      projects: current.projects.map((project) => {
        if (project.id !== projectId) return project;
        return { ...project, status: order[(order.indexOf(project.status) + 1) % order.length] };
      })
    }));
  }

  function addApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!applicationDraft.company.trim()) {
      return;
    }

    setState((current) => ({
      ...current,
      applications: [{ id: crypto.randomUUID(), ...applicationDraft }, ...current.applications]
    }));
    setApplicationDraft({ company: "", role: "", status: "Wishlist" });
  }

  function cycleApplicationStatus(applicationId: string) {
    const order: Application["status"][] = ["Wishlist", "Applied", "Interview", "Offer"];
    setState((current) => ({
      ...current,
      applications: current.applications.map((application) => {
        if (application.id !== applicationId) return application;
        return { ...application, status: order[(order.indexOf(application.status) + 1) % order.length] };
      })
    }));
  }

  function resetForNewUser() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  }

  return (
    <main className="glass-grid min-h-screen">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onReset={resetForNewUser}
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              Internship OS
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <section id="overview" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Hero
            readiness={readiness}
            xp={xp}
            streak={streak}
            quote={quote}
            onReset={resetForNewUser}
          />
          <DashboardCards
            profile={state.profile}
            readiness={readiness}
            dsaTotal={dsaTotal}
            projectPercent={projectPercent}
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>CGPA goal achiever</CardTitle>
                <CardDescription>Maintain your academic target alongside internship prep.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <LabeledNumber
                    label="Current CGPA"
                    value={state.profile.currentCgpa}
                    step={0.01}
                    max={10}
                    onChange={(value) => updateProfile("currentCgpa", value)}
                  />
                  <LabeledNumber
                    label="Target CGPA"
                    value={state.profile.targetCgpa}
                    step={0.01}
                    max={10}
                    onChange={(value) => updateProfile("targetCgpa", value)}
                  />
                  <LabeledNumber
                    label="Completed semesters"
                    value={state.profile.completedSemesters}
                    step={1}
                    max={state.profile.totalSemesters}
                    onChange={(value) => updateProfile("completedSemesters", Math.round(value))}
                  />
                  <LabeledNumber
                    label="Total semesters"
                    value={state.profile.totalSemesters}
                    step={1}
                    max={12}
                    onChange={(value) => updateProfile("totalSemesters", Math.max(1, Math.round(value)))}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniStat label="Gap to target" value={cgpaGap.toFixed(2)} />
                  <MiniStat label="Semesters left" value={String(remainingSemesters)} />
                  <MiniStat label="Needed avg" value={requiredCgpa === null ? "Set data" : requiredCgpa.toFixed(2)} />
                </div>
                <Progress value={Math.round((state.profile.currentCgpa / Math.max(1, state.profile.targetCgpa)) * 100)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress analytics</CardTitle>
                <CardDescription>Readiness trend based on roadmap, DSA, habits, projects, and career prep.</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="readiness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="readiness" stroke="#67e8f9" fill="url(#readiness)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>GitHub-style heatmap</CardTitle>
                <CardDescription>Daily habit intensity across the last 8 weeks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {days.map((day) => {
                    const count = habits.filter((habit) => state.habits[`${day.key}:${habit}`]).length;
                    return (
                      <div
                        key={day.key}
                        title={`${day.label}: ${count} habits`}
                        className={cn(
                          "aspect-square rounded-md border border-white/10 bg-white/5",
                          count === 1 && "bg-cyan-300/20",
                          count === 2 && "bg-cyan-300/35",
                          count === 3 && "bg-emerald-300/45",
                          count >= 4 && "bg-fuchsia-300/55"
                        )}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="roadmap" className="px-4 py-6 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="1-year roadmap" title="Phase-by-phase internship readiness plan" />
          <div className="grid gap-5 xl:grid-cols-2">
            {phases.map((phase, index) => {
              const items = [...phase.skills, ...phase.goals];
              const done = items.filter((item) => state.roadmap[`${phase.id}:${item}`]).length;
              const percent = Math.round((done / items.length) * 100);

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <CardTitle>{phase.title}</CardTitle>
                          <CardDescription>{phase.weeks}</CardDescription>
                        </div>
                        <Badge>{percent}% complete</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <Progress value={percent} />
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">Skills</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {phase.skills.map((skill) => (
                            <ChecklistRow
                              key={skill}
                              checked={Boolean(state.roadmap[`${phase.id}:${skill}`])}
                              label={skill}
                              onChange={() => toggleRoadmap(`${phase.id}:${skill}`)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-200/80">Weekly goals</p>
                        <div className="grid gap-2">
                          {phase.goals.map((goal) => (
                            <ChecklistRow
                              key={goal}
                              checked={Boolean(state.roadmap[`${phase.id}:${goal}`])}
                              label={goal}
                              onChange={() => toggleRoadmap(`${phase.id}:${goal}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="habits" className="px-4 py-6 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Habit tracker" title="Daily execution board" />
          <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
            <Card>
              <CardHeader>
                <CardTitle>Weekly streaks</CardTitle>
                <CardDescription>Keep the chain alive with focused daily reps.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <MetricLine icon={Flame} label="Current streak" value={`${streak} days`} />
                <MetricLine icon={CheckCircle2} label="Completion" value={`${habitPercent}%`} />
                <Progress value={habitPercent} />
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm text-slate-300">{quote}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar layout</CardTitle>
                <CardDescription>Track code, DSA, projects, reading, and applications for the last 8 weeks.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[96px_repeat(56,1fr)] gap-1 text-xs text-slate-500">
                    <div />
                    {days.map((day) => (
                      <div key={day.key} className="text-center">{day.short}</div>
                    ))}
                  </div>
                  <div className="mt-2 space-y-2">
                    {habits.map((habit) => (
                      <div key={habit} className="grid grid-cols-[96px_repeat(56,1fr)] items-center gap-1">
                        <div className="text-sm text-slate-300">{habit}</div>
                        {days.map((day) => (
                          <Checkbox
                            key={`${day.key}:${habit}`}
                            aria-label={`${habit} on ${day.label}`}
                            className="h-5 w-full rounded-md"
                            checked={Boolean(state.habits[`${day.key}:${habit}`])}
                            onCheckedChange={() => toggleHabit(day.key, habit)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="dsa" className="px-4 py-6 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="DSA tracker" title="LeetCode topic and difficulty progress" />
          <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Add completed problem</CardTitle>
                <CardDescription>Log each solved problem by topic and difficulty.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={addDsaProblem}>
                  <select
                    className="h-11 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white outline-none"
                    value={dsaDraft.topic}
                    onChange={(event) => setDsaDraft({ ...dsaDraft, topic: event.target.value as TopicKey })}
                  >
                    <option value="arrays">Arrays</option>
                    <option value="strings">Strings</option>
                    <option value="trees">Trees</option>
                    <option value="graphs">Graphs</option>
                    <option value="dp">Dynamic Programming</option>
                  </select>
                  <select
                    className="h-11 rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white outline-none"
                    value={dsaDraft.difficulty}
                    onChange={(event) => setDsaDraft({ ...dsaDraft, difficulty: event.target.value as DifficultyKey })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <Button type="submit">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </form>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <LabeledNumber
                    label="LeetCode goal"
                    value={state.profile.leetcodeGoal}
                    step={10}
                    max={1000}
                    onChange={(value) => updateProfile("leetcodeGoal", Math.round(value))}
                  />
                  <LabeledNumber
                    label="Daily study hours"
                    value={state.profile.dailyStudyHours}
                    step={0.5}
                    max={16}
                    onChange={(value) => updateProfile("dailyStudyHours", value)}
                  />
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-slate-400">Total solved</div>
                    <div className="mt-2 font-mono text-2xl font-semibold">{dsaTotal}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manual DSA totals</CardTitle>
                <CardDescription>Adjust counts if you already solved problems elsewhere.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {(["arrays", "strings", "trees", "graphs", "dp", "easy", "medium", "hard"] as const).map((key) => (
                  <LabeledNumber
                    key={key}
                    label={labelize(key)}
                    value={state.solved[key]}
                    step={1}
                    max={1000}
                    onChange={(value) => updateSolved(key, Math.round(value))}
                  />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic-wise progress</CardTitle>
                <CardDescription>Target: {state.profile.leetcodeGoal} curated problems before internship season.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="topic" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="solved" radius={[10, 10, 0, 0]} fill="#67e8f9" />
                    <Bar dataKey="goal" radius={[10, 10, 0, 0]} fill="rgba(255,255,255,0.12)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty breakdown</CardTitle>
                <CardDescription>{dsaTotal} solved problems logged.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={difficultyData} innerRadius={60} outerRadius={92} paddingAngle={4} dataKey="value">
                        {difficultyData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {difficultyData.map((item) => (
                    <div key={item.name} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                      <div className="text-lg font-semibold">{item.value}</div>
                      <div className="text-xs text-slate-400">{item.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="projects" className="px-4 py-6 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Project tracker" title="Portfolio-quality full-stack builds" />
          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <CardHeader>
                <CardTitle>Add project</CardTitle>
                <CardDescription>Track GitHub, deployment, stack, and completion.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={addProject}>
                  <LabeledNumber
                    label="Portfolio project goal"
                    value={state.profile.projectsGoal}
                    step={1}
                    max={20}
                    onChange={(value) => updateProfile("projectsGoal", Math.max(1, Math.round(value)))}
                  />
                  <Input placeholder="Project title" value={projectDraft.title} onChange={(event) => setProjectDraft({ ...projectDraft, title: event.target.value })} />
                  <Input placeholder="Tech stack" value={projectDraft.stack} onChange={(event) => setProjectDraft({ ...projectDraft, stack: event.target.value })} />
                  <Input placeholder="GitHub link" value={projectDraft.github} onChange={(event) => setProjectDraft({ ...projectDraft, github: event.target.value })} />
                  <Input placeholder="Deployment link" value={projectDraft.deployment} onChange={(event) => setProjectDraft({ ...projectDraft, deployment: event.target.value })} />
                  <select
                    className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white outline-none"
                    value={projectDraft.status}
                    onChange={(event) => setProjectDraft({ ...projectDraft, status: event.target.value as Project["status"] })}
                  >
                    <option>Planning</option>
                    <option>Building</option>
                    <option>Done</option>
                  </select>
                  <Button className="w-full" type="submit">
                    <Plus className="h-4 w-4" />
                    Add project
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {state.projects.length === 0 ? (
                <Card>
                  <CardContent className="p-5 text-sm text-slate-400">
                    No projects yet. Add your first portfolio project to start tracking completion.
                  </CardContent>
                </Card>
              ) : null}
              {state.projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{project.stack}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.github ? <Badge><Github className="mr-1 h-3 w-3" /> GitHub</Badge> : null}
                          {project.deployment ? <Badge><LinkIcon className="mr-1 h-3 w-3" /> Live</Badge> : null}
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => cycleProjectStatus(project.id)}>
                        {project.status}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="career" className="px-4 py-6 pb-12 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Resume + internships" title="Application command center" />
          <div className="grid gap-6 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Resume checklist</CardTitle>
                <CardDescription>{resumePercent}% ready for applications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resumeItems.map((item) => (
                  <ChecklistRow key={item} checked={Boolean(state.resume[item])} label={item} onChange={() => toggleResume(item)} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Internship applications</CardTitle>
                <CardDescription>Pipeline from wishlist to offer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <form className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3" onSubmit={addApplication}>
                  <Input
                    placeholder="Company"
                    value={applicationDraft.company}
                    onChange={(event) => setApplicationDraft({ ...applicationDraft, company: event.target.value })}
                  />
                  <Input
                    placeholder="Role"
                    value={applicationDraft.role}
                    onChange={(event) => setApplicationDraft({ ...applicationDraft, role: event.target.value })}
                  />
                  <select
                    className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 text-sm text-white outline-none"
                    value={applicationDraft.status}
                    onChange={(event) => setApplicationDraft({ ...applicationDraft, status: event.target.value as Application["status"] })}
                  >
                    <option>Wishlist</option>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                  </select>
                  <Button className="w-full" type="submit">
                    <Plus className="h-4 w-4" />
                    Add company
                  </Button>
                </form>
                {state.applications.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-400">
                    No applications yet. Add companies to build your wishlist and pipeline.
                  </div>
                ) : null}
                {state.applications.map((application) => (
                  <div key={application.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{application.company}</p>
                        <p className="text-sm text-slate-400">{application.role}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => cycleApplicationStatus(application.id)}>
                        {application.status}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mock interviews</CardTitle>
                <CardDescription>Target 12 technical and behavioral mocks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <LabeledNumber
                    label="Mocks done"
                    value={state.profile.mocksDone}
                    step={1}
                    max={100}
                    onChange={(value) => updateProfile("mocksDone", Math.round(value))}
                  />
                  <LabeledNumber
                    label="Mock target"
                    value={state.profile.mockTarget}
                    step={1}
                    max={100}
                    onChange={(value) => updateProfile("mockTarget", Math.max(1, Math.round(value)))}
                  />
                  <LabeledNumber
                    label="Company wishlist"
                    value={state.profile.companyWishlist}
                    step={1}
                    max={300}
                    onChange={(value) => updateProfile("companyWishlist", Math.round(value))}
                  />
                </div>
                <MetricLine icon={Trophy} label="Mocks done" value={`${state.profile.mocksDone} / ${state.profile.mockTarget}`} />
                <Progress value={Math.round((state.profile.mocksDone / Math.max(1, state.profile.mockTarget)) * 100)} />
                <MetricLine icon={Target} label="Company wishlist" value={`${state.profile.companyWishlist} saved`} />
                <MetricLine icon={Activity} label="Next focus" value="Graphs + APIs" />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

function Sidebar({
  mobileOpen,
  onClose,
  onReset
}: {
  mobileOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-950/70 p-5 backdrop-blur-2xl lg:block">
        <SidebarContent onReset={onReset} />
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden">
          <aside className="h-full w-80 max-w-[86vw] border-r border-white/10 bg-slate-950 p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-semibold">Navigation</span>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent onNavigate={onClose} onReset={onReset} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

function SidebarContent({
  onNavigate,
  onReset
}: {
  onNavigate?: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-[0_0_30px_rgba(103,232,249,0.35)]">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">Internship OS</div>
          <div className="text-xs text-slate-500">Full-stack roadmap</div>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map(([href, label, Icon]) => (
          <a
            key={href}
            href={`#${href}`}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
          >
            <Icon className="h-4 w-4 text-cyan-200" />
            {label}
          </a>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
        <p className="text-sm font-medium text-cyan-100">Today&apos;s rule</p>
        <p className="mt-2 text-sm text-slate-300">One solved problem, one useful commit, one honest review.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          onClick={() => {
            onReset();
            onNavigate?.();
          }}
        >
          <RotateCcw className="h-4 w-4" />
          New user
        </Button>
      </div>
    </div>
  );
}

function Hero({
  readiness,
  xp,
  streak,
  quote,
  onReset
}: {
  readiness: number;
  xp: number;
  streak: number;
  quote: string;
  onReset: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(103,232,249,0.18),transparent_35%,rgba(240,171,252,0.18))]" />
      <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <Badge className="mb-5 border-cyan-300/25 bg-cyan-300/10 text-cyan-100">
            <Sparkles className="mr-1 h-3 w-3" />
            Premium student productivity dashboard
          </Badge>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Full Stack Internship Tracker
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            A 1-year command center to build strong fundamentals, ship portfolio projects, solve DSA consistently, and become internship-ready with measurable progress.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#roadmap">Start roadmap</a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="#projects">Add project</a>
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              Reset for new user
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-slate-950/50 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Internship readiness</span>
            <span className="font-mono text-3xl font-semibold text-cyan-200">{readiness}%</span>
          </div>
          <Progress value={readiness} className="mt-4 h-3" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MiniStat label="XP earned" value={xp.toLocaleString()} />
            <MiniStat label="Streak" value={`${streak}d`} />
          </div>
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{quote}</p>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardCards({
  profile,
  readiness,
  dsaTotal,
  projectPercent
}: {
  profile: Profile;
  readiness: number;
  dsaTotal: number;
  projectPercent: number;
}) {
  const cards = [
    { label: "Current CGPA", value: profile.currentCgpa ? profile.currentCgpa.toFixed(2) : "Add it", icon: GraduationCap, helper: `Target ${profile.targetCgpa.toFixed(2)}` },
    { label: "LeetCode Goal", value: `${dsaTotal}/${profile.leetcodeGoal}`, icon: Code2, helper: "Problems solved" },
    { label: "Projects Goal", value: `${projectPercent}%`, icon: Github, helper: "Portfolio completion" },
    { label: "Daily Study Hours", value: `${profile.dailyStudyHours}h`, icon: CalendarCheck, helper: "Focused execution" },
    { label: "Readiness", value: `${readiness}%`, icon: Target, helper: "Composite score" }
  ];

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-cyan-200">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="font-mono text-2xl font-semibold">{card.value}</div>
              <div className="mt-1 text-sm font-medium text-slate-200">{card.label}</div>
              <div className="text-xs text-slate-500">{card.helper}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

function ChecklistRow({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <Checkbox checked={checked} onCheckedChange={onChange} aria-label={label} />
      <span className={cn("text-sm text-slate-300", checked && "text-white line-through decoration-cyan-200/60")}>{label}</span>
    </div>
  );
}

function LabeledNumber({
  label,
  value,
  step,
  max,
  onChange
}: {
  label: string;
  value: number;
  step: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/5 p-3">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <Input
        className="mt-2"
        type="number"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function MetricLine({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <Icon className="h-4 w-4 text-cyan-200" />
        {label}
      </div>
      <div className="font-mono text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="font-mono text-xl font-semibold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function buildDays() {
  return Array.from({ length: 56 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (55 - index));
    return {
      key: date.toISOString().slice(0, 10),
      short: String(date.getDate()),
      label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
    };
  });
}

function calculateStreak(days: ReturnType<typeof buildDays>, habitState: Record<string, boolean>) {
  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    const completedToday = habits.some((habit) => habitState[`${days[index].key}:${habit}`]);
    if (!completedToday) {
      break;
    }
    streak += 1;
  }
  return streak;
}

function calculateRequiredCgpa(profile: Profile) {
  if (profile.completedSemesters <= 0 || profile.currentCgpa <= 0) {
    return null;
  }

  const remaining = Math.max(0, profile.totalSemesters - profile.completedSemesters);
  if (remaining === 0) {
    return profile.currentCgpa;
  }

  const targetPoints = profile.targetCgpa * profile.totalSemesters;
  const currentPoints = profile.currentCgpa * profile.completedSemesters;
  return Math.max(0, (targetPoints - currentPoints) / remaining);
}

function labelize(value: string) {
  if (value === "dp") return "Dynamic programming";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.94)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  color: "#f8fafc"
};
