
import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  BrainCircuit,
  Download,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
  Zap,
  Target,
  ChevronRight,
  Filter,
  BookOpen,
  FileText,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAIInsights } from '../services/geminiService';
import { UserRole } from '../types';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'History'];

const SUBJECT_OVERVIEW = [
  { name: 'Mathematics', value: 92 },
  { name: 'Science', value: 85 },
  { name: 'English', value: 78 },
  { name: 'History', value: 88 },
];

const COLORS = ['#22819A', '#90C2E7', '#F59E0B', '#10B981'];

const CHAPTER_COMPARISON_DATA: Record<string, any[]> = {
  'Mathematics': [
    { name: 'Polynomials', yourScore: 95, avgScore: 72 },
    { name: 'Algebra', yourScore: 88, avgScore: 70 },
    { name: 'Quadratic Eq', yourScore: 40, avgScore: 68 },
    { name: 'Number Systems', yourScore: 82, avgScore: 75 },
    { name: 'Geometry', yourScore: 75, avgScore: 70 },
  ],
  'Science': [
    { name: 'Atomic Structure', yourScore: 88, avgScore: 65 },
    { name: 'Chemical Rxns', yourScore: 92, avgScore: 78 },
    { name: 'Thermodynamics', yourScore: 45, avgScore: 62 },
    { name: 'Light & Optics', yourScore: 80, avgScore: 70 },
    { name: 'Cell Biology', yourScore: 70, avgScore: 75 },
  ],
  'English': [
    { name: 'Tenses', yourScore: 78, avgScore: 82 },
    { name: 'Grammar', yourScore: 85, avgScore: 80 },
    { name: 'Active/Passive', yourScore: 90, avgScore: 75 },
    { name: 'Literature', yourScore: 65, avgScore: 70 },
  ],
  'History': [
    { name: 'French Revolution', yourScore: 88, avgScore: 74 },
    { name: 'Industrialization', yourScore: 92, avgScore: 80 },
    { name: 'Civil Rights', yourScore: 85, avgScore: 82 },
  ]
};

const CONCEPT_MASTERY_DATA: Record<string, any[]> = {
  'Mathematics': [
    { concept: 'Calculus', level: 80 },
    { concept: 'Algebra', level: 95 },
    { concept: 'Trigonometry', level: 62 },
    { concept: 'Statistics', level: 88 },
  ],
  'Science': [
    { concept: 'Thermodynamics', level: 45 },
    { concept: 'Optics', level: 90 },
    { concept: 'Genetics', level: 78 },
    { concept: 'Electrochem', level: 85 },
  ],
  'English': [
    { concept: 'Syntax', level: 85 },
    { concept: 'Vocabulary', level: 75 },
    { concept: 'Poetry', level: 68 },
    { concept: 'Debate', level: 92 },
  ],
  'History': [
    { concept: 'Timeline', level: 95 },
    { concept: 'Analysis', level: 82 },
    { concept: 'Geography', level: 70 },
  ]
};

const QUIZ_SCORES: Record<string, any[]> = {
  'Mathematics': [
    { id: 'q1', title: 'Unit Test: Polynomials', score: 28, total: 30, date: '2024-03-15', type: 'Unit Test', status: 'Graded' },
    { id: 'q2', title: 'Weekly Quiz: Algebra Basics', score: 18, total: 20, date: '2024-03-10', type: 'Quiz', status: 'Graded' },
    { id: 'q3', title: 'Surprise Test: Geometry', score: 12, total: 15, date: '2024-03-05', type: 'Test', status: 'Graded' },
    { id: 'q4', title: 'Monthly Assessment: Number Systems', score: 45, total: 50, date: '2024-02-28', type: 'Exam', status: 'Graded' },
  ],
  'Science': [
    { id: 's1', title: 'Lab Quiz: Chemical Reactions', score: 14, total: 15, date: '2024-03-12', type: 'Quiz', status: 'Graded' },
    { id: 's2', title: 'Unit Test: Atomic Structure', score: 25, total: 30, date: '2024-03-08', type: 'Unit Test', status: 'Graded' },
    { id: 's3', title: 'Weekly Quiz: Thermodynamics', score: 9, total: 20, date: '2024-03-01', type: 'Quiz', status: 'Graded' },
  ],
  'English': [
    { id: 'e1', title: 'Grammar Assessment: Tenses', score: 19, total: 20, date: '2024-03-14', type: 'Quiz', status: 'Graded' },
    { id: 'e2', title: 'Literature Test: Shakespeare', score: 22, total: 30, date: '2024-03-07', type: 'Test', status: 'Graded' },
  ],
  'History': [
    { id: 'h1', title: 'Unit Test: French Revolution', score: 27, total: 30, date: '2024-03-11', type: 'Unit Test', status: 'Graded' },
    { id: 'h2', title: 'Quiz: Industrialization', score: 15, total: 15, date: '2024-03-04', type: 'Quiz', status: 'Graded' },
  ]
};

const ATTENDANCE_DATA: Record<string, { total: number, attended: number, batchAvg: number }> = {
  'Mathematics': { total: 45, attended: 42, batchAvg: 85 },
  'Science': { total: 40, attended: 38, batchAvg: 82 },
  'English': { total: 35, attended: 30, batchAvg: 80 },
  'History': { total: 30, attended: 28, batchAvg: 88 },
};

const Performance: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getAIInsights(`${selectedSubject} performance data. Current score: ${SUBJECT_OVERVIEW.find(s => s.name === selectedSubject)?.value}%.`);
      setAiInsights(data);
      setLoading(false);
    };
    fetchInsights();
  }, [selectedSubject]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header & Page Level Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary dark:text-secondary tracking-tight">Performance Deep-Dive</h1>
          <p className="text-[#6B7280] dark:text-slate-400 font-medium">Granular academic monitoring and mastery mapping</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-[#CDD4DD] dark:border-slate-800 shadow-sm">
           {SUBJECTS.map(subj => (
             <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`
                px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                ${selectedSubject === subj 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'text-[#6B7280] dark:text-slate-400 hover:bg-brandBg dark:hover:bg-slate-800'}
              `}
             >
               {subj}
             </button>
           ))}
        </div>
      </div>

      {/* Top Level Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceStatCard label={`${selectedSubject} Avg`} value={`${SUBJECT_OVERVIEW.find(s => s.name === selectedSubject)?.value}%`} icon={<TrendingUp className="text-green-500" />} trend="+3.2%" />
        <PerformanceStatCard label="Subject Rank" value="4th / 38" icon={<Award className="text-yellow-500" />} trend="↑ 1 rank" />
        <PerformanceStatCard label="Lecture Hours" value="42h" icon={<Calendar className="text-primary" />} />
        <PerformanceStatCard label="Quizzes Taken" value="12" icon={<Target className="text-blue-500" />} />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart / Overview */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-[#CDD4DD] dark:border-slate-800 p-8 shadow-custom">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[#2C3E50] dark:text-slate-200 flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" /> Mastery Balance
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SUBJECT_OVERVIEW}>
                <PolarGrid stroke="#CDD4DD" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }} />
                <Radar
                  name="Mastery"
                  dataKey="value"
                  stroke="#22819A"
                  fill="#22819A"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI INSIGHTS CARD */}
        <div className="lg:col-span-2 bg-primary rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <BrainCircuit size={160} className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Zap size={24} className="text-yellow-300" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{selectedSubject} AI Path Optimizer</h2>
               </div>
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Analysis</span>
               </div>
            </div>
            
            {loading ? (
              <div className="animate-pulse space-y-6 flex-1">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-20 bg-white/10 rounded-3xl w-full"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="space-y-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">Topic Strengths</p>
                    <div className="space-y-3">
                      {aiInsights?.strengths?.slice(0, 2).map((s: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm font-semibold bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                          <CheckCircle2 size={18} className="text-green-300 shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-3">Priority Focus</p>
                    <div className="space-y-3">
                      {aiInsights?.weaknesses?.slice(0, 2).map((w: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm font-semibold bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                          <AlertCircle size={18} className="text-orange-300 shrink-0" />
                          {w}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-[2rem] text-primary shadow-xl mt-auto">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Personalized Strategy</p>
                  <p className="text-sm font-bold leading-relaxed italic">"{aiInsights?.recommendation}"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHAPTER BAR CHART */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-[#CDD4DD] dark:border-slate-800 p-8 shadow-custom">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-lg font-bold text-[#2C3E50] dark:text-slate-200 flex items-center gap-2">
                  <BarChart2 size={20} className="text-primary" /> {selectedSubject} Chapter Benchmarking
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-500 font-medium">Comparison of your score vs batch average</p>
             </div>
             <button className="p-2 bg-brandBg dark:bg-slate-800 rounded-xl text-primary"><Filter size={16} /></button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHAPTER_COMPARISON_DATA[selectedSubject] || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Tooltip cursor={{fill: '#FEF7F8'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="yourScore" name="Your Mastery" fill="#22819A" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="avgScore" name="Batch Average" fill="#90C2E7" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CONCEPT HEATMAP */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-[#CDD4DD] dark:border-slate-800 p-8 shadow-custom">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h3 className="text-lg font-bold text-[#2C3E50] dark:text-slate-200 flex items-center gap-2">
                  <Zap size={20} className="text-primary" /> {selectedSubject} Concept Mastery
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-slate-500 font-medium">Granular proficiency levels across sub-topics</p>
             </div>
             <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 flex items-center justify-center">
                    <BookOpen size={12} className="text-slate-400" />
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(CONCEPT_MASTERY_DATA[selectedSubject] || []).map((item, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-[#CDD4DD] dark:border-slate-800 bg-brandBg/50 dark:bg-slate-800/30 space-y-4 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                   <p className="text-sm font-bold text-[#2C3E50] dark:text-slate-100">{item.concept}</p>
                   <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${item.level > 80 ? 'bg-green-100 text-green-600' : item.level > 60 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                      {item.level > 80 ? 'Master' : item.level > 60 ? 'Steady' : 'Action'}
                   </span>
                </div>
                
                <div className="space-y-2">
                   <div className="h-2.5 bg-white dark:bg-slate-700 rounded-full overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800">
                     <div 
                       className={`h-full transition-all duration-1000 rounded-full ${item.level > 80 ? 'bg-primary' : item.level > 60 ? 'bg-secondary' : 'bg-orange-400'}`} 
                       style={{ width: `${item.level}%` }}
                     />
                   </div>
                   <div className="flex justify-between text-[10px] font-bold text-[#6B7280] dark:text-slate-500 tracking-widest">
                      <span>0%</span>
                      <span>{item.level}% PROFICIENCY</span>
                   </div>
                </div>
                
                <button className="w-full py-2 bg-white dark:bg-slate-800 border border-[#CDD4DD] dark:border-slate-700 rounded-xl text-[9px] font-black text-[#22819A] uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-all">
                   Doubt History
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] flex items-center gap-4 border border-blue-100 dark:border-blue-900/30">
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                <AlertCircle size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-blue-800 dark:text-blue-300">
                  Adaptive Learning Suggestion
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed mt-0.5">
                  Your mastery in <strong>{CONCEPT_MASTERY_DATA[selectedSubject]?.[2]?.concept}</strong> is currently below batch average. We recommend attempting a practice set before the next lecture.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* RECENT ASSESSMENT SCORES & ATTENDANCE - PARENT ONLY */}
      {userRole === UserRole.PARENT && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-[#CDD4DD] dark:border-slate-800 p-8 shadow-custom">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#2C3E50] dark:text-slate-200 flex items-center gap-2">
                  <FileText size={22} className="text-primary" /> Recent {selectedSubject} Assessments
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-slate-500 font-medium">
                  Track your child's performance in recent tests and quizzes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-brandBg dark:bg-slate-800 text-primary rounded-xl text-xs font-bold border border-primary/10">
                  <Download size={14} /> Export Report
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#CDD4DD] dark:border-slate-800">
                    <th className="pb-4 text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">Assessment Name</th>
                    <th className="pb-4 text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">Type</th>
                    <th className="pb-4 text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="pb-4 text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest text-right">Score</th>
                    <th className="pb-4 text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CDD4DD]/50 dark:divide-slate-800/50">
                  {(QUIZ_SCORES[selectedSubject] || []).map((quiz) => (
                    <tr key={quiz.id} className="group hover:bg-brandBg/30 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-[#CDD4DD] dark:border-slate-700 shadow-sm">
                            <Target size={16} className="text-primary" />
                          </div>
                          <p className="text-sm font-bold text-[#2C3E50] dark:text-slate-200">{quiz.title}</p>
                        </div>
                      </td>
                      <td className="py-5">
                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                          {quiz.type}
                        </span>
                      </td>
                      <td className="py-5 text-xs font-medium text-[#6B7280] dark:text-slate-500">
                        {new Date(quiz.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-5 text-right">
                        <div className="inline-flex flex-col items-end">
                          <p className={`text-sm font-black ${quiz.score / quiz.total > 0.8 ? 'text-green-600' : quiz.score / quiz.total > 0.6 ? 'text-primary' : 'text-orange-600'}`}>
                            {quiz.score} / {quiz.total}
                          </p>
                          <p className="text-[9px] font-bold text-[#6B7280] opacity-60 uppercase tracking-tighter">
                            ({Math.round((quiz.score / quiz.total) * 100)}%)
                          </p>
                        </div>
                      </td>
                      <td className="py-5 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full w-fit mx-auto">
                          <CheckCircle2 size={12} />
                          {quiz.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-primary/5 dark:bg-primary/10 rounded-3xl border border-primary/10 flex items-start gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-primary">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary dark:text-secondary">Parent's Insight</p>
                <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 leading-relaxed">
                  Rahul's scores in <strong>{selectedSubject}</strong> have shown a consistent upward trend over the last 3 assessments. 
                  His accuracy in {selectedSubject === 'Mathematics' ? 'Algebra' : 'recent topics'} has improved by 15% compared to last month.
                </p>
              </div>
            </div>
          </div>

          {/* ATTENDANCE SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-[#CDD4DD] dark:border-slate-800 p-8 shadow-custom">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#2C3E50] dark:text-slate-200 flex items-center gap-2">
                <Clock size={22} className="text-primary" /> {selectedSubject} Attendance
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-slate-500 font-medium">Class participation summary</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - (ATTENDANCE_DATA[selectedSubject]?.attended / ATTENDANCE_DATA[selectedSubject]?.total))}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#2C3E50] dark:text-slate-100">
                    {Math.round((ATTENDANCE_DATA[selectedSubject]?.attended / ATTENDANCE_DATA[selectedSubject]?.total) * 100)}%
                  </span>
                  <span className="text-[10px] font-bold text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">Attended</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-4 bg-brandBg dark:bg-slate-800/50 rounded-2xl border border-[#CDD4DD]/50 dark:border-slate-700 text-center">
                  <p className="text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest mb-1">Total Classes</p>
                  <p className="text-xl font-black text-[#2C3E50] dark:text-slate-100">{ATTENDANCE_DATA[selectedSubject]?.total}</p>
                </div>
                <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10 text-center">
                  <p className="text-[10px] font-black text-primary dark:text-secondary uppercase tracking-widest mb-1">Attended</p>
                  <p className="text-xl font-black text-primary dark:text-secondary">{ATTENDANCE_DATA[selectedSubject]?.attended}</p>
                </div>
              </div>

              <div className="w-full p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                <p className="text-xs font-bold text-green-700 dark:text-green-400">
                  {ATTENDANCE_DATA[selectedSubject]?.attended >= ATTENDANCE_DATA[selectedSubject]?.total * 0.9 
                    ? "Excellent! Maintaining above 90% attendance." 
                    : "Good progress. Keep attending regularly."}
                </p>
              </div>

              <div className="w-full pt-6 border-t border-[#CDD4DD]/50 dark:border-slate-800/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#6B7280]" />
                    <span className="text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">Batch Average</span>
                  </div>
                  <span className="text-sm font-black text-[#2C3E50] dark:text-slate-200">{ATTENDANCE_DATA[selectedSubject]?.batchAvg}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="text-[10px] font-black text-[#6B7280] dark:text-slate-500 uppercase tracking-widest">Comparison</span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tight ${
                    Math.round((ATTENDANCE_DATA[selectedSubject]?.attended / ATTENDANCE_DATA[selectedSubject]?.total) * 100) >= ATTENDANCE_DATA[selectedSubject]?.batchAvg
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {Math.round((ATTENDANCE_DATA[selectedSubject]?.attended / ATTENDANCE_DATA[selectedSubject]?.total) * 100) - ATTENDANCE_DATA[selectedSubject]?.batchAvg >= 0 ? '↑' : '↓'}
                    {Math.abs(Math.round((ATTENDANCE_DATA[selectedSubject]?.attended / ATTENDANCE_DATA[selectedSubject]?.total) * 100) - ATTENDANCE_DATA[selectedSubject]?.batchAvg)}% {Math.round((ATTENDANCE_DATA[selectedSubject]?.attended / ATTENDANCE_DATA[selectedSubject]?.total) * 100) - ATTENDANCE_DATA[selectedSubject]?.batchAvg >= 0 ? 'above' : 'below'} batch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PerformanceStatCard: React.FC<{ label: string, value: string, icon: any, trend?: string }> = ({ label, value, icon, trend }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-[#CDD4DD] dark:border-slate-800 shadow-custom group hover:-translate-y-1 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-brandBg dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
      {trend && <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded-lg">{trend}</span>}
    </div>
    <p className="text-[10px] text-[#6B7280] dark:text-slate-500 font-black uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-[#2C3E50] dark:text-white mt-1">{value}</p>
  </div>
);

export default Performance;
