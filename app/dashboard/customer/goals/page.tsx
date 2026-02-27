"use client";

import { useState, useEffect } from "react";
import {
  Target, Plus, Trash2, CheckCircle2, Clock, TrendingUp,
  Home, GraduationCap, Plane, Heart, Shield, Car, Pencil, X, Check
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: GoalCategory;
  priority: "high" | "medium" | "low";
  createdAt: string;
}

type GoalCategory = "retirement" | "property" | "education" | "travel" | "health" | "emergency" | "vehicle" | "custom";

// ── Constants ─────────────────────────────────────────────────────────────

const CATEGORY_META: Record<GoalCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  retirement:{ label: "Retirement",  icon: Shield,        color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
  property:  { label: "Property",    icon: Home,          color: "text-blue-500",   bg: "bg-blue-500/10 border-blue-500/20" },
  education: { label: "Education",   icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
  travel:    { label: "Travel",      icon: Plane,         color: "text-cyan-500",   bg: "bg-cyan-500/10 border-cyan-500/20" },
  health:    { label: "Healthcare",  icon: Heart,         color: "text-rose-500",   bg: "bg-rose-500/10 border-rose-500/20" },
  emergency: { label: "Emergency",   icon: Shield,        color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  vehicle:   { label: "Vehicle",     icon: Car,           color: "text-green-500",  bg: "bg-green-500/10 border-green-500/20" },
  custom:    { label: "Custom",      icon: Target,        color: "text-gray-400",   bg: "bg-gray-500/10 border-gray-500/20" },
};

const PRIORITY_META = {
  high:   { label: "High",   dot: "bg-red-500",    text: "text-red-500"    },
  medium: { label: "Medium", dot: "bg-yellow-500", text: "text-yellow-500" },
  low:    { label: "Low",    dot: "bg-green-500",  text: "text-green-500"  },
};

const SAMPLE_GOALS: Goal[] = [
  {
    id: "1",
    title: "Retirement Nest Egg",
    description: "Build a comfortable retirement fund to sustain my lifestyle at age 60.",
    targetAmount: 10000000,
    currentAmount: 1250000,
    targetDate: "2054-01-01",
    category: "retirement",
    priority: "high",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Buy Family Home",
    description: "Save for a down payment on a 4-bedroom house in Nairobi.",
    targetAmount: 3000000,
    currentAmount: 820000,
    targetDate: "2028-06-01",
    category: "property",
    priority: "high",
    createdAt: "2024-03-10",
  },
  {
    id: "3",
    title: "Children's Education",
    description: "University fund for two children's undergraduate degrees.",
    targetAmount: 2400000,
    currentAmount: 400000,
    targetDate: "2035-09-01",
    category: "education",
    priority: "medium",
    createdAt: "2024-05-20",
  },
  {
    id: "4",
    title: "Emergency Fund",
    description: "6 months of living expenses as a financial safety net.",
    targetAmount: 300000,
    currentAmount: 210000,
    targetDate: "2025-12-31",
    category: "emergency",
    priority: "medium",
    createdAt: "2024-07-01",
  },
];

const currency = (n: number) =>
  "KES " + Math.round(n).toLocaleString("en-KE");

const pct = (current: number, target: number) =>
  target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

const yearsLeft = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24 * 365)));
};

// ── Empty Form ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "",
  description: "",
  targetAmount: "",
  currentAmount: "",
  targetDate: "",
  category: "custom" as GoalCategory,
  priority: "medium" as "high" | "medium" | "low",
};

// ── Main Page ─────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<GoalCategory | "all">("all");

  // Summary stats
  const totalTarget  = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalSaved   = goals.reduce((s, g) => s + g.currentAmount, 0);
  const completed    = goals.filter(g => g.currentAmount >= g.targetAmount).length;
  const overallPct   = pct(totalSaved, totalTarget);

  const filtered = filter === "all" ? goals : goals.filter(g => g.category === filter);

  // Open add modal
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (goal: Goal) => {
    setForm({
      title: goal.title,
      description: goal.description,
      targetAmount: String(goal.targetAmount),
      currentAmount: String(goal.currentAmount),
      targetDate: goal.targetDate,
      category: goal.category,
      priority: goal.priority,
    });
    setEditingId(goal.id);
    setShowModal(true);
  };

  const saveGoal = () => {
    if (!form.title || !form.targetAmount || !form.targetDate) return;
    if (editingId) {
      setGoals(prev => prev.map(g =>
        g.id === editingId
          ? { ...g, ...form, targetAmount: Number(form.targetAmount), currentAmount: Number(form.currentAmount) || 0 }
          : g
      ));
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: form.title,
        description: form.description,
        targetAmount: Number(form.targetAmount),
        currentAmount: Number(form.currentAmount) || 0,
        targetDate: form.targetDate,
        category: form.category,
        priority: form.priority,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGoals(prev => [newGoal, ...prev]);
    }
    setShowModal(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
            <Target size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Goals</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Track and manage your financial milestones</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Saved */}
        <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-purple-600 dark:from-orange-600 dark:via-orange-700 dark:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-purple-500/20 rounded-full blur-xl" />
          <div className="relative z-10">
            <p className="text-sm font-bold opacity-90 mb-3">Total Saved Across Goals</p>
            <p className="text-3xl font-black tracking-tight mb-1">{currency(totalSaved)}</p>
            <p className="text-orange-50/80 text-xs">of {currency(totalTarget)} total target</p>
            <div className="mt-3 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/70 rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
            </div>
            <p className="text-orange-50/70 text-xs mt-1">{overallPct}% overall progress</p>
          </div>
        </div>

        {/* Goals Overview */}
        <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-indigo-600 dark:from-orange-600 dark:via-orange-700 dark:to-indigo-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl" />
          <div className="relative z-10">
            <p className="text-sm font-bold opacity-90 mb-3">Goals Overview</p>
            <p className="text-3xl font-black tracking-tight mb-1">{goals.length}</p>
            <p className="text-orange-50/80 text-xs">Active financial goals</p>
            <div className="mt-3 flex gap-3">
              <div className="flex flex-col">
                <span className="text-xl font-black">{completed}</span>
                <span className="text-orange-50/70 text-xs">Completed</span>
              </div>
              <div className="w-px bg-white/20" />
              <div className="flex flex-col">
                <span className="text-xl font-black">{goals.length - completed}</span>
                <span className="text-orange-50/70 text-xs">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nearest Deadline */}
        <div className="relative group bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 dark:from-orange-600 dark:via-orange-700 dark:to-pink-700 text-white rounded-2xl shadow-2xl hover:shadow-orange-500/50 p-6 transition-all duration-500 hover:-translate-y-1 overflow-hidden border border-orange-400/20">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-pink-500/20 rounded-full blur-xl" />
          <div className="relative z-10">
            <p className="text-sm font-bold opacity-90 mb-3">Nearest Deadline</p>
            {(() => {
              const nearest = [...goals].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())[0];
              return nearest ? (
                <>
                  <p className="text-xl font-black tracking-tight mb-1 truncate">{nearest.title}</p>
                  <p className="text-orange-50/80 text-xs">{yearsLeft(nearest.targetDate)} years remaining</p>
                  <p className="text-orange-50/70 text-xs mt-1">{new Date(nearest.targetDate).toLocaleDateString("en-KE", { year: "numeric", month: "long" })}</p>
                  <div className="mt-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 ${pct(nearest.currentAmount, nearest.targetAmount) >= 80 ? "" : ""}`}>
                      {pct(nearest.currentAmount, nearest.targetAmount)}% funded
                    </span>
                  </div>
                </>
              ) : <p className="text-orange-50/80 text-sm">No goals yet</p>;
            })()}
          </div>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 transition-colors duration-300">
        <div className="flex flex-wrap gap-2">
          {(["all", ...Object.keys(CATEGORY_META)] as (GoalCategory | "all")[]).map(cat => {
            const active = filter === cat;
            const meta = cat !== "all" ? CATEGORY_META[cat as GoalCategory] : null;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {meta && <meta.icon size={13} />}
                {cat === "all" ? "All Goals" : meta!.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-200 dark:bg-gray-600"}`}>
                  {cat === "all" ? goals.length : goals.filter(g => g.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Goals Grid ── */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-16 flex flex-col items-center justify-center text-center transition-colors duration-300">
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/10 mb-4">
            <Target size={36} className="text-orange-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No goals yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">Set your first financial goal and start tracking your journey to financial freedom with AutoNest.</p>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all">
            <Plus size={16} /> Add Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(goal => {
            const meta = CATEGORY_META[goal.category];
            const pri = PRIORITY_META[goal.priority];
            const progress = pct(goal.currentAmount, goal.targetAmount);
            const done = goal.currentAmount >= goal.targetAmount;
            const yLeft = yearsLeft(goal.targetDate);
            const Icon = meta.icon;

            return (
              <div
                key={goal.id}
                className={`group bg-white dark:bg-gray-800 border rounded-2xl shadow-xl p-6 flex flex-col gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${
                  done ? "border-green-400/40 dark:border-green-500/30" : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${meta.bg}`}>
                      <Icon size={18} className={meta.color} />
                    </div>
                    <div>
                      <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{goal.title}</h4>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-500/10 text-gray-500 hover:text-orange-500 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteId(goal.id)} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {goal.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{goal.description}</p>
                )}

                {/* Amounts */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Saved</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{currency(goal.currentAmount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Target</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{currency(goal.targetAmount)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-bold ${done ? "text-green-500" : "text-orange-500"}`}>{progress}%</span>
                    <span className="text-gray-400">{currency(goal.targetAmount - goal.currentAmount)} remaining</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        done
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : progress >= 75
                          ? "bg-gradient-to-r from-orange-400 to-orange-500"
                          : "bg-gradient-to-r from-orange-500 to-orange-600"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    {done ? (
                      <CheckCircle2 size={14} className="text-green-500" />
                    ) : (
                      <Clock size={14} className="text-gray-400" />
                    )}
                    <span className={`text-xs font-medium ${done ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}>
                      {done ? "Completed!" : `${yLeft} yr${yLeft !== 1 ? "s" : ""} left`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${pri.dot}`} />
                    <span className={`text-xs font-semibold ${pri.text}`}>{pri.label} priority</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transition-colors duration-300">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  {editingId ? <Pencil size={16} /> : <Plus size={16} />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingId ? "Edit Goal" : "Add New Goal"}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Goal Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Retirement Nest Egg"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of this goal..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                />
              </div>

              {/* Amounts row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Target Amount (KES) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={form.targetAmount}
                    onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Already Saved (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={form.currentAmount}
                    onChange={e => setForm(f => ({ ...f, currentAmount: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Target date */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Target Date *</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.entries(CATEGORY_META) as [GoalCategory, typeof CATEGORY_META[GoalCategory]][]).map(([key, meta]) => {
                    const Icon = meta.icon;
                    const active = form.category === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setForm(f => ({ ...f, category: key }))}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          active
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500 shadow-md shadow-orange-500/20"
                            : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400"
                        }`}
                      >
                        <Icon size={15} />
                        <span className="truncate w-full text-center">{meta.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Priority</label>
                <div className="flex gap-3">
                  {(["high", "medium", "low"] as const).map(p => {
                    const meta = PRIORITY_META[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setForm(f => ({ ...f, priority: p }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          form.priority === p
                            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500 shadow-md shadow-orange-500/20"
                            : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${form.priority === p ? "bg-white" : meta.dot}`} />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveGoal}
                disabled={!form.title || !form.targetAmount || !form.targetDate}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                <Check size={16} />
                {editingId ? "Save Changes" : "Add Goal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Delete Goal</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{goals.find(g => g.id === deleteId)?.title}"</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => deleteGoal(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}