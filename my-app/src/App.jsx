import { useState, useEffect } from "react";

// ─── Kingsley's Data ──────────────────────────────────────────────────────────
const INITIAL_STATE = {
  balance: 50000,
  mealBudget: 15000,      // total meal budget
  mealSpent: 3200,        // amount spent on food
  studentId: "BU/DS/2024/001",
  name: "Ubaegede Kingsley",
  major: "Data Science",
  year: "100 Level",
  gpa: "5.0 / 5.0",
  university: "Bingham University",
  transactions: [
    { id: 1, desc: "Cafeteria – Breakfast", amt: -800, date: "Today, 8:10 AM", icon: "🍳", cat: "food" },
    { id: 2, desc: "Library Fine Paid", amt: -200, date: "Today, 09:10 AM", icon: "📚", cat: "fee" },
    { id: 3, desc: "Top-Up via Transfer", amt: +10000, date: "Yesterday", icon: "💳", cat: "topup" },
    { id: 4, desc: "Gym Access", amt: -500, date: "Yesterday", icon: "🏋️", cat: "facility" },
    { id: 5, desc: "Printing – 20 pages", amt: -400, date: "May 20", icon: "🖨️", cat: "facility" },
    { id: 6, desc: "Cafeteria – Lunch", amt: -1200, date: "May 20", icon: "🍽️", cat: "food" },
  ],
  attendance: {
    MATH102: {
      name: "Mathematics",
      code: "MATH 102",
      present: 14, total: 18,
      icon: "📐",
      color: "#f59e0b",
      topics: [
        "Calculus – Differentiation & Integration",
        "Vectors & Matrices",
        "Sequences & Series",
        "Complex Numbers",
        "Differential Equations",
      ],
      focus: "Master differentiation rules and integration techniques — these form the foundation of Data Science algorithms.",
    },
    PHY102: {
      name: "General Physics",
      code: "PHY 102",
      present: 16, total: 18,
      icon: "⚛️",
      color: "#8b5cf6",
      topics: [
        "Mechanics – Newton's Laws",
        "Waves & Oscillations",
        "Thermodynamics",
        "Electromagnetism",
        "Modern Physics Intro",
      ],
      focus: "Focus on electromagnetism and waves — they underpin signal processing used in AI/ML.",
    },
    PHY108: {
      name: "Gen Physics Practical",
      code: "PHY 108",
      present: 10, total: 12,
      icon: "🔬",
      color: "#10b981",
      topics: [
        "Measurement & Errors",
        "Motion Experiments",
        "Optics Lab",
        "Electricity Lab",
        "Data Recording & Analysis",
      ],
      focus: "Practice data recording carefully — clean data collection is the #1 skill in Data Science.",
    },
    CSC104: {
      name: "Intro to Python",
      code: "CSC 104",
      present: 17, total: 18,
      icon: "🐍",
      color: "#00d4ff",
      topics: [
        "Variables, Data Types & Operators",
        "Control Flow – if/else, loops",
        "Functions & Modules",
        "Lists, Dicts & File I/O",
        "Intro to Libraries (NumPy, Pandas)",
      ],
      focus: "Python is your most important course. Master loops, functions, and Pandas — used daily in Data Science.",
    },
    COS102: {
      name: "Computer Science",
      code: "COS 102",
      present: 13, total: 18,
      icon: "💻",
      color: "#ec4899",
      topics: [
        "Number Systems & Boolean Algebra",
        "Computer Architecture",
        "Operating Systems Basics",
        "Algorithms & Flowcharts",
        "Intro to Databases",
      ],
      focus: "Understand algorithms and databases — they are the backbone of all data systems.",
    },
    BBST104: {
      name: "Christian Studies",
      code: "BBST 104",
      present: 15, total: 18,
      icon: "✝️",
      color: "#f97316",
      topics: [
        "Old Testament Survey",
        "New Testament Survey",
        "Christian Ethics",
        "Church History",
        "Faith & Academic Excellence",
      ],
      focus: "Reflect on ethics — essential for responsible data use and AI development.",
    },
    GST112: {
      name: "Nigerian Culture",
      code: "GST 112",
      present: 16, total: 18,
      icon: "🇳🇬",
      color: "#22c55e",
      topics: [
        "Nigerian History & Pre-colonial Era",
        "Major Ethnic Groups & Languages",
        "Nigerian Political Systems",
        "Culture, Arts & Literature",
        "National Development & Citizenship",
      ],
      focus: "Understanding Nigeria's data landscape requires cultural context — great for localized AI solutions.",
    },
  },
  events: [
    { id: 1, title: "Bingham TechFest 2026", date: "May 25", time: "9:00 AM", venue: "Innovation Hub", registered: true, seats: 200, filled: 178, tag: "Tech" },
    { id: 2, title: "Data Science Workshop", date: "May 28", time: "10:00 AM", venue: "CS Building", registered: false, seats: 100, filled: 62, tag: "Career" },
    { id: 3, title: "Bingham Sports Day", date: "Jun 1", time: "8:00 AM", venue: "Stadium", registered: false, seats: 800, filled: 450, tag: "Sports" },
    { id: 4, title: "Python Bootcamp", date: "Jun 5", time: "2:00 PM", venue: "CSC Lab", registered: true, seats: 50, filled: 48, tag: "Tech" },
  ],
  announcements: [
    { id: 1, title: "First Semester Exam Timetable", body: "First semester exams begin June 10. Check the Bingham student portal for your timetable.", time: "2h ago", urgent: true },
    { id: 2, title: "CSC104 Python Assignment Due", body: "Submit your Python mini-project on the portal before May 28, 11:59 PM.", time: "5h ago", urgent: true },
    { id: 3, title: "Campus Chapel Schedule", body: "Compulsory chapel holds every Wednesday 8–9 AM at the University Chapel.", time: "1d ago", urgent: false },
    { id: 4, title: "Library Extended Hours", body: "The library will remain open until midnight during exam week starting June 7.", time: "2d ago", urgent: false },
  ],
  navNodes: [
    { id: "lib", name: "Library", x: 20, y: 25, type: "academic" },
    { id: "caf", name: "Cafeteria", x: 55, y: 40, type: "food" },
    { id: "gym", name: "Gymnasium", x: 75, y: 70, type: "sports" },
    { id: "adm", name: "Admin Block", x: 30, y: 60, type: "admin" },
    { id: "csc", name: "CSC Lab", x: 62, y: 18, type: "academic" },
    { id: "hostel", name: "Hostel Block", x: 15, y: 75, type: "housing" },
    { id: "chapel", name: "Chapel", x: 80, y: 35, type: "chapel" },
    { id: "med", name: "Medical Center", x: 45, y: 75, type: "health" },
  ],
};

// ─── QR Code ─────────────────────────────────────────────────────────────────
function QRCode({ value, size = 140 }) {
  const cells = 14;
  const cell = size / cells;
  const hash = [...value].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  const bits = [];
  for (let i = 0; i < cells * cells; i++) {
    bits.push(Math.abs((hash * (i + 7) * 31337) % 1000) < 480);
  }
  const marker = (ox, oy) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const idx = (oy + r) * cells + (ox + c);
      if (r === 0 || r === 6 || c === 0 || c === 6) bits[idx] = true;
      else if (r >= 2 && r <= 4 && c >= 2 && c <= 4) bits[idx] = true;
      else bits[idx] = false;
    }
  };
  marker(0, 0); marker(cells - 7, 0); marker(0, cells - 7);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ borderRadius: 8 }}>
      <rect width={size} height={size} fill="white" />
      {bits.map((on, i) => on ? (
        <rect key={i} x={(i % cells) * cell} y={Math.floor(i / cells) * cell}
          width={cell - 0.5} height={cell - 0.5} fill="#0a0e1a" rx={0.5} />
      ) : null)}
    </svg>
  );
}

// ─── Ring Progress ────────────────────────────────────────────────────────────
function Ring({ pct, size = 60, stroke = 6, color = "#00d4ff" }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2340" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)" }} />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill={color}
        fontSize={11} fontWeight="700" fontFamily="'Space Mono',monospace">{pct}%</text>
    </svg>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position:"fixed",bottom:96,left:"50%",transform:"translateX(-50%)",
      background:"linear-gradient(135deg,#00d4ff,#0099cc)",color:"#0a0e1a",
      padding:"11px 24px",borderRadius:50,fontFamily:"'Space Mono',monospace",
      fontSize:13,fontWeight:700,boxShadow:"0 8px 30px #00d4ff44",zIndex:9999,
      whiteSpace:"nowrap",animation:"toastIn 0.3s cubic-bezier(.34,1.56,.64,1)",
    }}>{msg}</div>
  );
}

// ─── Course Detail Modal ──────────────────────────────────────────────────────
function CourseModal({ course, id, onClose, onCheckin, checkedIn }) {
  const pct = Math.round(course.present / course.total * 100);
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,background:"#000000dd",zIndex:300,
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      animation:"fadeIn 0.2s",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#0d1225",borderRadius:"24px 24px 0 0",padding:"24px",
        width:"100%",maxWidth:420,border:"1px solid #1e2d45",
        borderTop:`2px solid ${course.color}`,maxHeight:"80vh",overflowY:"auto",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{
            width:48,height:48,borderRadius:14,background:course.color+"22",
            border:`1.5px solid ${course.color}44`,display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:22,
          }}>{course.icon}</div>
          <div>
            <div style={{fontWeight:700,fontSize:17}}>{course.name}</div>
            <div style={{fontSize:12,color:course.color,fontFamily:"'Space Mono',monospace"}}>{course.code}</div>
          </div>
          <div style={{marginLeft:"auto"}}><Ring pct={pct} color={course.color} /></div>
        </div>

        {/* Attendance bar */}
        <div style={{background:"#111827",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:"#607090"}}>Attendance</span>
            <span style={{fontSize:12,fontFamily:"'Space Mono',monospace",color:pct>=75?"#10b981":"#f59e0b"}}>
              {course.present}/{course.total} classes
            </span>
          </div>
          <div style={{height:6,background:"#1a2340",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${course.color},${course.color}88)`,borderRadius:3,transition:"width 0.8s"}}/>
          </div>
        </div>

        {/* Focus tip */}
        <div style={{
          background:course.color+"11",border:`1px solid ${course.color}33`,
          borderRadius:12,padding:"12px 14px",marginBottom:14,
        }}>
          <div style={{fontSize:11,color:course.color,fontFamily:"'Space Mono',monospace",letterSpacing:1,marginBottom:6}}>🎯 FOCUS TIP</div>
          <div style={{fontSize:13,color:"#c8d0e0",lineHeight:1.6}}>{course.focus}</div>
        </div>

        {/* Topics */}
        <div style={{fontSize:11,color:"#607090",fontFamily:"'Space Mono',monospace",letterSpacing:1,marginBottom:10}}>📋 KEY TOPICS</div>
        {course.topics.map((t,i)=>(
          <div key={i} style={{
            display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",
            background:"#111827",borderRadius:10,marginBottom:6,
          }}>
            <div style={{
              minWidth:22,height:22,borderRadius:6,background:course.color+"22",
              border:`1px solid ${course.color}44`,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:10,fontWeight:700,color:course.color,
              fontFamily:"'Space Mono',monospace",
            }}>{i+1}</div>
            <div style={{fontSize:13,color:"#c8d0e0",lineHeight:1.5}}>{t}</div>
          </div>
        ))}

        <div style={{display:"flex",gap:8,marginTop:16}}>
          {!checkedIn ? (
            <button onClick={onCheckin} style={{
              flex:1,background:`linear-gradient(135deg,${course.color},${course.color}bb)`,
              color:"#0a0e1a",border:"none",borderRadius:50,padding:"12px",
              fontSize:13,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:"pointer",
            }}>📍 Mark Attendance</button>
          ) : (
            <div style={{
              flex:1,background:"#10b98122",color:"#10b981",border:"1px solid #10b98144",
              borderRadius:50,padding:"12px",fontSize:13,fontWeight:700,
              fontFamily:"'Space Mono',monospace",textAlign:"center",
            }}>✓ Attended Today</div>
          )}
          <button onClick={onClose} style={{
            background:"#1a2340",color:"#8090a0",border:"none",borderRadius:50,
            padding:"12px 20px",fontSize:13,cursor:"pointer",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Naira formatter ──────────────────────────────────────────────────────────
const N = (n) => `₦${Number(n).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function CampusWallet() {
  const [tab, setTab] = useState("home");
  const [state, setState] = useState(INITIAL_STATE);
  const [showQR, setShowQR] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [topupAmt, setTopupAmt] = useState("");
  const [showTopup, setShowTopup] = useState(false);
  const [checkedIn, setCheckedIn] = useState({});
  const [activeCourse, setActiveCourse] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [editName, setEditName] = useState(state.name);
  const [editMajor, setEditMajor] = useState(state.major);

  const notify = (msg) => setToast(msg);

  const isDark = theme === "dark";
  const bg = isDark ? "#0a0e1a" : "#f0f4ff";
  const surface = isDark ? "#111827" : "#ffffff";
  const surface2 = isDark ? "#0d1225" : "#f8faff";
  const border = isDark ? "#1e2d45" : "#dde4f0";
  const text = isDark ? "#e8eaf6" : "#1a2340";
  const sub = isDark ? "#607090" : "#8090b0";
  const accent = "#00d4ff";

  const handleRegister = (id) => {
    setState(s => ({ ...s, events: s.events.map(e => e.id===id ? {...e,registered:true,filled:e.filled+1} : e) }));
    notify("✅ Registered for event!");
  };

  const handleTopup = () => {
    const amt = parseFloat(topupAmt);
    if (!amt || amt <= 0) return;
    setState(s => ({
      ...s, balance: s.balance + amt,
      transactions: [{ id: Date.now(), desc: "Top-Up via Transfer", amt: +amt, date: "Just now", icon: "💳", cat: "topup" }, ...s.transactions],
    }));
    setTopupAmt(""); setShowTopup(false);
    notify(`${N(amt)} added to wallet!`);
  };

  const handleCheckin = (courseId) => {
    if (checkedIn[courseId]) return;
    setCheckedIn(c => ({ ...c, [courseId]: true }));
    setState(s => ({
      ...s,
      attendance: { ...s.attendance, [courseId]: { ...s.attendance[courseId], present: s.attendance[courseId].present + 1, total: s.attendance[courseId].total + 1 } },
    }));
    setActiveCourse(null);
    notify("📍 Attendance marked!");
  };

  const saveSettings = () => {
    setState(s => ({ ...s, name: editName, major: editMajor }));
    setShowSettings(false);
    notify("✅ Profile updated!");
  };

  const S = {
    app: { fontFamily:"'DM Sans',sans-serif", background:bg, minHeight:"100vh", maxWidth:420, margin:"0 auto", color:text, position:"relative", overflowX:"hidden" },
    scroll: { overflowY:"auto", paddingBottom:88, height:"calc(100vh - 0px)" },
    card: { background:surface, borderRadius:18, padding:"16px 18px", margin:"10px 14px", border:`1px solid ${border}`, position:"relative", overflow:"hidden" },
    tabBar: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:isDark?"#0d1225":"#fff", borderTop:`1px solid ${border}`, display:"flex", justifyContent:"space-around", padding:"8px 0 14px", zIndex:100, boxShadow:"0 -4px 20px #00000033" },
    tabBtn: (a) => ({ display:"flex", flexDirection:"column", alignItems:"center", gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 10px", opacity:a?1:0.4, transition:"all 0.2s" }),
    tabIcon: (a) => ({ fontSize:20, filter:a?"drop-shadow(0 0 6px #00d4ff)":"none", transition:"filter 0.2s" }),
    tabLabel: (a) => ({ fontSize:10, color:a?accent:sub, fontWeight:a?700:400, fontFamily:"'Space Mono',monospace", letterSpacing:0.5 }),
    btn: (v="primary") => ({
      background: v==="primary"?"linear-gradient(135deg,#00d4ff,#0099cc)" : v==="danger"?"#ff4466" : v==="outline"?"transparent" : isDark?"#1e2d45":"#eef2ff",
      color: v==="outline"?accent : v==="ghost"?(isDark?"#c0cce0":"#3050a0") : v==="primary"?"#0a0e1a" : text,
      border: v==="outline"?`1px solid ${accent}` : "none",
      borderRadius:50, padding:"9px 20px", fontSize:13, fontWeight:700,
      cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:0.5,
      transition:"all 0.2s", whiteSpace:"nowrap",
    }),
    label: { fontSize:11, color:sub, fontFamily:"'Space Mono',monospace", letterSpacing:2, textTransform:"uppercase" },
    glow: { position:"absolute", width:120, height:120, borderRadius:"50%", filter:"blur(55px)", pointerEvents:"none" },
    sectionTitle: { fontSize:11, fontWeight:700, color:sub, letterSpacing:2, textTransform:"uppercase", fontFamily:"'Space Mono',monospace", margin:"18px 18px 2px" },
  };

  const allAtt = Object.values(state.attendance);
  const overallPct = Math.round(allAtt.reduce((a,c)=>a+c.present,0) / allAtt.reduce((a,c)=>a+c.total,0) * 100);
  const mealPct = Math.round(state.mealSpent / state.mealBudget * 100);
  const mealLeft = state.mealBudget - state.mealSpent;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;0,9..40,800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:0;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes toastIn{from{opacity:0;transform:translate(-50%,20px) scale(0.9)}to{opacity:1;transform:translate(-50%,0) scale(1)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.2)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .ripple:active{transform:scale(0.96);}
        input:focus{outline:none;border-color:#00d4ff!important;}
      `}</style>

      <div style={S.app}>
        <div style={S.scroll}>

          {/* ══ HOME ══════════════════════════════════════════════════ */}
          {tab==="home" && (
            <>
              {/* Hero header */}
              <div style={{ padding:"24px 18px 0", background:isDark?"linear-gradient(160deg,#0d1a2e,#0a0e1a 70%)":"linear-gradient(160deg,#dbeafe,#f0f4ff 70%)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={S.label}>BINGHAM UNIVERSITY</div>
                    <div style={{ fontSize:24, fontWeight:800, color:text, lineHeight:1.2, marginTop:6 }}>{state.name}</div>
                    <div style={{ fontSize:13, color:accent, marginTop:3, fontWeight:500 }}>{state.major} · {state.year}</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setShowSettings(true)} style={{ width:42,height:42,borderRadius:12,background:isDark?"#1a2340":"#e8f0fe",border:`1px solid ${border}`,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>⚙️</button>
                    <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ width:42,height:42,borderRadius:12,background:isDark?"#1a2340":"#e8f0fe",border:`1px solid ${border}`,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {isDark?"☀️":"🌙"}
                    </button>
                  </div>
                </div>

                {/* Balance card */}
                <div style={{
                  margin:"18px 0 0",
                  background:isDark?"linear-gradient(135deg,#0d2137,#091a2a)":"linear-gradient(135deg,#1e40af,#1d4ed8)",
                  borderRadius:22,padding:"22px",
                  border:`1px solid ${isDark?"#00d4ff33":"#3b82f6"}`,
                  boxShadow:isDark?"0 0 50px #00d4ff15":"0 8px 32px #1d4ed844",
                  position:"relative",overflow:"hidden",
                }}>
                  <div style={{...S.glow, background:"#00d4ff",opacity:0.07,top:-30,right:-30}}/>
                  <div style={{...S.glow, background:"#8b5cf6",opacity:0.05,bottom:-40,left:20}}/>
                  <div style={{ fontSize:11, color:"#ffffff99", fontFamily:"'Space Mono',monospace", letterSpacing:2 }}>WALLET BALANCE</div>
                  <div style={{ fontSize:38, fontWeight:800, color:"#fff", margin:"6px 0 2px", fontFamily:"'Space Mono',monospace", letterSpacing:-1 }}>
                    {N(state.balance)}
                  </div>
                  <div style={{ fontSize:11, color:"#ffffff66", fontFamily:"'Space Mono',monospace" }}>{state.studentId}</div>
                  <div style={{ display:"flex", gap:8, marginTop:16 }}>
                    <button onClick={()=>setShowTopup(true)} style={{ background:"rgba(255,255,255,0.2)", backdropFilter:"blur(10px)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", borderRadius:50, padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Space Mono',monospace" }} className="ripple">
                      + Fund Wallet
                    </button>
                    <button onClick={()=>setShowQR(true)} style={{ background:"rgba(0,212,255,0.15)", backdropFilter:"blur(10px)", color:accent, border:`1px solid ${accent}44`, borderRadius:50, padding:"9px 20px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Space Mono',monospace" }} className="ripple">
                      📲 Pay
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"14px 14px 0" }}>
                {[
                  { label:"GPA", value:state.gpa.split("/")[0].trim(), sub:"/ 5.0", icon:"⭐", color:"#f59e0b" },
                  { label:"Attend.", value:`${overallPct}%`, sub:"overall", icon:"📊", color:overallPct>=75?"#10b981":"#f59e0b" },
                  { label:"Courses", value:Object.keys(state.attendance).length, sub:"enrolled", icon:"📚", color:"#8b5cf6" },
                ].map(s=>(
                  <div key={s.label} style={{ background:surface, borderRadius:16, padding:"14px 10px", border:`1px solid ${border}`, textAlign:"center" }}>
                    <div style={{ fontSize:22 }}>{s.icon}</div>
                    <div style={{ fontSize:20, fontWeight:800, color:s.color, fontFamily:"'Space Mono',monospace", marginTop:4, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontSize:9, color:sub, marginTop:3, fontFamily:"'Space Mono',monospace" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Meal budget tracker */}
              <div style={{ ...S.card, background:isDark?"linear-gradient(135deg,#1a1500,#0e1505)":"linear-gradient(135deg,#fef9ec,#f0fdf4)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div>
                    <div style={S.label}>MEAL BUDGET</div>
                    <div style={{ fontSize:22, fontWeight:800, color:"#f59e0b", fontFamily:"'Space Mono',monospace", marginTop:4 }}>
                      {N(mealLeft)} <span style={{ fontSize:12, color:sub }}>left</span>
                    </div>
                    <div style={{ fontSize:12, color:sub, marginTop:2 }}>Spent {N(state.mealSpent)} of {N(state.mealBudget)}</div>
                  </div>
                  <div style={{ fontSize:44 }}>🍱</div>
                </div>
                <div style={{ height:8, background:isDark?"#1a2340":"#e2e8f0", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${mealPct}%`, height:"100%", background:`linear-gradient(90deg,#f59e0b,#f97316)`, borderRadius:4, transition:"width 0.8s" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:11, color:sub }}>{mealPct}% used</span>
                  <button style={{ ...S.btn("ghost"), padding:"4px 12px", fontSize:11 }}
                    onClick={()=>{ setState(s=>({...s,mealSpent:Math.min(s.mealBudget,s.mealSpent+800)})); notify("🍽️ Meal deducted: ₦800"); }}>
                    Use Meal (₦800)
                  </button>
                </div>
              </div>

              {/* Announcements */}
              <div style={S.sectionTitle}>📢 Announcements</div>
              {state.announcements.slice(0,2).map(a=>(
                <div key={a.id} style={{ ...S.card, padding:"12px 16px" }}>
                  {a.urgent && <div style={{ position:"absolute", top:10, right:12, background:"#ff4466", borderRadius:50, padding:"2px 8px", fontSize:9, fontWeight:700, fontFamily:"'Space Mono',monospace" }}>URGENT</div>}
                  <div style={{ fontWeight:700, fontSize:14, paddingRight:60 }}>{a.title}</div>
                  <div style={{ fontSize:12, color:sub, marginTop:4, lineHeight:1.6 }}>{a.body}</div>
                  <div style={{ fontSize:10, color:sub, marginTop:6, fontFamily:"'Space Mono',monospace" }}>{a.time}</div>
                </div>
              ))}

              {/* Recent transactions */}
              <div style={S.sectionTitle}>💳 Recent Transactions</div>
              {state.transactions.slice(0,4).map(t=>(
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px", borderBottom:`1px solid ${border}` }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:isDark?"#1a2340":"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600 }}>{t.desc}</div>
                    <div style={{ fontSize:11, color:sub, fontFamily:"'Space Mono',monospace" }}>{t.date}</div>
                  </div>
                  <div style={{ fontWeight:700, fontFamily:"'Space Mono',monospace", color:t.amt>0?"#10b981":"#ff6b8a", fontSize:13 }}>
                    {t.amt>0?"+":""}{N(Math.abs(t.amt))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ══ ID CARD ═══════════════════════════════════════════════ */}
          {tab==="id" && (
            <>
              <div style={{ padding:"24px 18px 0" }}>
                <div style={S.label}>DIGITAL IDENTITY</div>
                <div style={{ fontSize:22, fontWeight:800, marginTop:6 }}>Student ID Card</div>
              </div>

              <div style={{ margin:"16px 14px" }}>
                <div style={{
                  background:"linear-gradient(135deg,#0d2137 0%,#091528 50%,#0a1520 100%)",
                  borderRadius:24, padding:"24px",
                  border:"1.5px solid #00d4ff44",
                  boxShadow:"0 20px 60px #00000066, 0 0 60px #00d4ff11",
                  overflow:"hidden", position:"relative",
                }}>
                  <div style={{...S.glow, background:"#00d4ff", opacity:0.08, top:-40, right:-20}}/>
                  <div style={{...S.glow, background:"#22c55e", opacity:0.06, bottom:-40, left:20}}/>

                  {/* University badge */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#22c55e,#16a34a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏫</div>
                      <div>
                        <div style={{ fontSize:10, color:"#00d4ff", fontFamily:"'Space Mono',monospace", letterSpacing:2 }}>BINGHAM UNIVERSITY</div>
                        <div style={{ fontSize:9, color:"#ffffff55", fontFamily:"'Space Mono',monospace" }}>KWA'MODA, KADUNAs</div>
                      </div>
                    </div>
                    <div style={{ fontSize:22 }}>🇳🇬</div>
                  </div>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.2 }}>{state.name}</div>
                      <div style={{ fontSize:13, color:"#8090a0", marginTop:4 }}>{state.major}</div>
                      <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 20px" }}>
                        {[["Level","100 Level"],["GPA","5.0/5.0"],["Session","2024/2025"],["Status","Active"]].map(([l,v])=>(
                          <div key={l}>
                            <div style={{ fontSize:9, color:"#607090", fontFamily:"'Space Mono',monospace" }}>{l}</div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#00d4ff", fontFamily:"'Space Mono',monospace" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop:14, background:"#ffffff0d", borderRadius:8, padding:"8px 12px", fontFamily:"'Space Mono',monospace", fontSize:12, color:"#00d4ff", letterSpacing:2 }}>
                        {state.studentId}
                      </div>
                    </div>
                    <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#00d4ff,#22c55e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, boxShadow:"0 0 20px #00d4ff33" }}>
                      👨‍💻
                    </div>
                  </div>

                  <div style={{ marginTop:20, height:1, background:"linear-gradient(90deg,#00d4ff33,transparent)" }}/>
                  <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:9, color:"#607090" }}>VALID UNTIL</div>
                      <div style={{ fontWeight:700, color:"#e8eaf6", fontFamily:"'Space Mono',monospace", fontSize:13 }}>JULY 2028</div>
                    </div>
                    <div style={{ background:"#fff", borderRadius:10, padding:6 }}>
                      <QRCode value={state.studentId} size={110}/>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding:"0 14px" }}>
                <button style={{ ...S.btn("primary"), width:"100%", padding:"14px", fontSize:15, borderRadius:14 }}
                  onClick={()=>{ setShowQR(true); notify("QR ready to scan!"); }}>
                  📲 Show QR for Campus Access
                </button>
              </div>

              <div style={S.sectionTitle}>🔑 Access Permissions</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, padding:"0 14px" }}>
                {["Library","CSC Lab","Gymnasium","Cafeteria","Chapel","Hostel Block","Medical Center","Sports Complex"].map(b=>(
                  <div key={b} style={{ background:isDark?"#111827":"#eef2ff", border:`1px solid ${accent}33`, borderRadius:8, padding:"6px 12px", fontSize:12, color:accent, fontFamily:"'Space Mono',monospace" }}>✓ {b}</div>
                ))}
              </div>
            </>
          )}

          {/* ══ WALLET ════════════════════════════════════════════════ */}
          {tab==="wallet" && (
            <>
              <div style={{ padding:"24px 18px 0" }}>
                <div style={S.label}>FINANCIAL CENTER</div>
                <div style={{ fontSize:22, fontWeight:800, marginTop:6 }}>My Wallet</div>
              </div>

              <div style={{ ...S.card, background:isDark?"linear-gradient(135deg,#091e33,#050d1a)":"linear-gradient(135deg,#1e40af,#1d4ed8)" }}>
                <div style={{...S.glow, background:"#00d4ff", opacity:0.08, top:-20, right:-20}}/>
                <div style={S.label}>AVAILABLE BALANCE</div>
                <div style={{ fontSize:36, fontWeight:800, fontFamily:"'Space Mono',monospace", color:accent, margin:"8px 0 4px", letterSpacing:-1 }}>
                  {N(state.balance)}
                </div>
                <div style={{ display:"flex", gap:8, marginTop:14 }}>
                  <button style={S.btn("primary")} onClick={()=>setShowTopup(true)}>+ Fund</button>
                  <button style={S.btn("outline")} onClick={()=>notify("Transfer coming soon!")}>↗ Transfer</button>
                  <button style={S.btn("ghost")} onClick={()=>notify("Statement sent!")}>📄 Statement</button>
                </div>
              </div>

              {/* Meal budget card */}
              <div style={{ ...S.card }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={S.label}>MEAL BUDGET</div>
                    <div style={{ fontSize:28, fontWeight:800, color:"#f59e0b", fontFamily:"'Space Mono',monospace", margin:"6px 0 2px" }}>{N(mealLeft)}</div>
                    <div style={{ fontSize:12, color:sub }}>remaining of {N(state.mealBudget)} budget</div>
                  </div>
                  <div style={{ fontSize:42 }}>🍱</div>
                </div>
                <div style={{ marginTop:12, height:8, background:isDark?"#1a2340":"#e2e8f0", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${mealPct}%`, height:"100%", background:"linear-gradient(90deg,#f59e0b,#f97316)", borderRadius:4 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                  <span style={{ fontSize:11, color:sub }}>{mealPct}% of budget used</span>
                  <button style={{ ...S.btn("ghost"), padding:"5px 14px", fontSize:11 }}
                    onClick={()=>{ setState(s=>({...s,mealBudget:s.mealBudget+5000})); notify("₦5,000 meal budget added!"); }}>
                    + Add Budget
                  </button>
                </div>
              </div>

              <div style={S.sectionTitle}>📑 All Transactions</div>
              {state.transactions.map(t=>(
                <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", borderBottom:`1px solid ${border}` }}>
                  <div style={{ width:42, height:42, borderRadius:13, background:isDark?"#1a2340":"#eef2ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{t.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:600 }}>{t.desc}</div>
                    <div style={{ fontSize:11, color:sub, fontFamily:"'Space Mono',monospace" }}>{t.date}</div>
                  </div>
                  <div style={{ fontWeight:700, fontFamily:"'Space Mono',monospace", color:t.amt>0?"#10b981":"#ff6b8a", fontSize:13 }}>
                    {t.amt>0?"+":""}{N(Math.abs(t.amt))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ══ COURSES / ATTENDANCE ══════════════════════════════════ */}
          {tab==="attend" && (
            <>
              <div style={{ padding:"24px 18px 0" }}>
                <div style={S.label}>ACADEMIC TRACKER</div>
                <div style={{ fontSize:22, fontWeight:800, marginTop:6 }}>Courses & Attendance</div>
              </div>

              {/* Overall */}
              <div style={{ ...S.card, display:"flex", alignItems:"center", gap:18 }}>
                <Ring pct={overallPct} size={78} stroke={7} color={overallPct>=75?"#10b981":"#f59e0b"}/>
                <div>
                  <div style={{ fontSize:13, color:sub }}>Overall Attendance</div>
                  <div style={{ fontSize:20, fontWeight:800, fontFamily:"'Space Mono',monospace", color:overallPct>=75?"#10b981":"#f59e0b", marginTop:2 }}>
                    {allAtt.reduce((a,c)=>a+c.present,0)}/{allAtt.reduce((a,c)=>a+c.total,0)} Classes
                  </div>
                  <div style={{ fontSize:11, marginTop:5, padding:"3px 10px", borderRadius:50, background:overallPct>=75?"#10b98122":"#f59e0b22", color:overallPct>=75?"#10b981":"#f59e0b", fontFamily:"'Space Mono',monospace", display:"inline-block" }}>
                    {overallPct>=75?"✓ On Track":"⚠ Needs Attention"}
                  </div>
                </div>
              </div>

              <div style={S.sectionTitle}>📚 My Courses — Tap for Details</div>
              {Object.entries(state.attendance).map(([id,c])=>{
                const pct = Math.round(c.present/c.total*100);
                return (
                  <div key={id} onClick={()=>setActiveCourse(id)} style={{ ...S.card, cursor:"pointer", transition:"all 0.2s" }} className="ripple">
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:46, height:46, borderRadius:13, background:c.color+"22", border:`1.5px solid ${c.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ fontWeight:700, fontSize:15 }}>{c.name}</div>
                          <Ring pct={pct} size={46} stroke={4} color={c.color}/>
                        </div>
                        <div style={{ fontSize:11, color:c.color, fontFamily:"'Space Mono',monospace", marginTop:2 }}>{c.code}</div>
                        <div style={{ marginTop:8, height:5, background:isDark?"#1a2340":"#e2e8f0", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${c.color},${c.color}88)`, borderRadius:3 }}/>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                          <span style={{ fontSize:11, color:sub }}>{c.present}/{c.total} present</span>
                          {checkedIn[id]
                            ? <span style={{ fontSize:11, color:"#10b981", fontFamily:"'Space Mono',monospace" }}>✓ Today</span>
                            : <span style={{ fontSize:11, color:accent }}>Tap to check in →</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* ══ EVENTS ════════════════════════════════════════════════ */}
          {tab==="events" && (
            <>
              <div style={{ padding:"24px 18px 0" }}>
                <div style={S.label}>CAMPUS LIFE</div>
                <div style={{ fontSize:22, fontWeight:800, marginTop:6 }}>Events & News</div>
              </div>

              <div style={S.sectionTitle}>🎫 Upcoming Events</div>
              {state.events.map(e=>{
                const fillPct=Math.round(e.filled/e.seats*100);
                const tC={Tech:"#00d4ff",Career:"#8b5cf6",Sports:"#10b981",Network:"#f59e0b"};
                const c=tC[e.tag];
                return (
                  <div key={e.id} style={S.card}>
                    <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ minWidth:52,height:52,background:c+"22",borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`1px solid ${c}44` }}>
                        <div style={{ fontSize:14,fontWeight:800,color:c,fontFamily:"'Space Mono',monospace" }}>{e.date.split(" ")[1]}</div>
                        <div style={{ fontSize:10,color:sub }}>{e.date.split(" ")[0]}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                          <div style={{ fontWeight:700, fontSize:15, flex:1 }}>{e.title}</div>
                          <div style={{ background:c+"22",color:c,border:`1px solid ${c}44`,borderRadius:50,padding:"2px 8px",fontSize:10,fontFamily:"'Space Mono',monospace",marginLeft:8 }}>{e.tag}</div>
                        </div>
                        <div style={{ fontSize:12,color:sub,marginTop:4 }}>📍 {e.venue} · ⏰ {e.time}</div>
                        <div style={{ marginTop:8,height:5,background:isDark?"#1a2340":"#e2e8f0",borderRadius:3,overflow:"hidden" }}>
                          <div style={{ width:`${fillPct}%`,height:"100%",background:c,borderRadius:3 }}/>
                        </div>
                        <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
                          <span style={{ fontSize:10,color:sub }}>{e.filled}/{e.seats} registered</span>
                          <span style={{ fontSize:10,color:fillPct>90?"#ff4466":sub }}>{e.seats-e.filled} seats left</span>
                        </div>
                        <div style={{ marginTop:10 }}>
                          {e.registered
                            ? <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"#10b98122",color:"#10b981",border:"1px solid #10b98144",borderRadius:50,padding:"6px 14px",fontSize:12,fontFamily:"'Space Mono',monospace" }}>✓ Registered</div>
                            : <button style={{ ...S.btn("primary"), background:`linear-gradient(135deg,${c},${c}bb)`, color:"#0a0e1a" }} onClick={()=>handleRegister(e.id)}>Register Free</button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div style={S.sectionTitle}>📢 Announcements</div>
              {state.announcements.map(a=>(
                <div key={a.id} style={{ ...S.card, padding:"14px 16px" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                    <div style={{ fontWeight:700,fontSize:14,flex:1 }}>{a.title}</div>
                    {a.urgent && <div style={{ background:"#ff4466",borderRadius:50,padding:"2px 8px",fontSize:9,fontWeight:700,fontFamily:"'Space Mono',monospace",marginLeft:8 }}>URGENT</div>}
                  </div>
                  <div style={{ fontSize:12,color:sub,marginTop:6,lineHeight:1.6 }}>{a.body}</div>
                  <div style={{ fontSize:10,color:sub,marginTop:8,fontFamily:"'Space Mono',monospace" }}>{a.time}</div>
                </div>
              ))}
            </>
          )}

          {/* ══ MAP ═══════════════════════════════════════════════════ */}
          {tab==="map" && (
            <>
              <div style={{ padding:"24px 18px 0" }}>
                <div style={S.label}>NAVIGATION</div>
                <div style={{ fontSize:22, fontWeight:800, marginTop:6 }}>Bingham Campus Map</div>
              </div>

              <div style={{ margin:"14px" }}>
                <div style={{ background:isDark?"#0d1225":"#e8f0fe", borderRadius:22, overflow:"hidden", border:`1px solid ${border}`, position:"relative", height:290 }}>
                  <svg width="100%" height="100%" style={{ position:"absolute", inset:0 }}>
                    <defs>
                      <pattern id="g" width="28" height="28" patternUnits="userSpaceOnUse">
                        <path d="M 28 0 L 0 0 0 28" fill="none" stroke={isDark?"#1a2340":"#dde4f0"} strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#g)"/>
                    {[["20%","25%","55%","40%"],["55%","40%","62%","18%"],["55%","40%","80%","35%"],["30%","60%","55%","40%"],["30%","60%","15%","75%"],["30%","60%","45%","75%"],["80%","35%","75%","70%"]].map(([x1,y1,x2,y2],i)=>(
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent+"33"} strokeWidth="1.5" strokeDasharray="4,4"/>
                    ))}
                  </svg>
                  {state.navNodes.map(n=>{
                    const tC={academic:accent,food:"#f59e0b",sports:"#10b981",admin:"#8b5cf6",housing:"#ec4899",chapel:"#f97316",health:"#ef4444"};
                    const tI={academic:"📚",food:"🍽️",sports:"🏋️",admin:"🏢",housing:"🏠",chapel:"⛪",health:"🏥"};
                    const isSel=selectedNode?.id===n.id;
                    return (
                      <div key={n.id} onClick={()=>setSelectedNode(isSel?null:n)} style={{ position:"absolute",left:`${n.x}%`,top:`${n.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:isSel?10:1 }}>
                        <div style={{ width:isSel?46:36,height:isSel?46:36,borderRadius:"50%",background:isSel?tC[n.type]:tC[n.type]+"22",border:`2px solid ${tC[n.type]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:isSel?18:13,boxShadow:isSel?`0 0 20px ${tC[n.type]}88`:"none",transition:"all 0.2s" }}>
                          {tI[n.type]}
                        </div>
                        {isSel && <div style={{ position:"absolute",bottom:"115%",left:"50%",transform:"translateX(-50%)",background:isDark?"#0d1225":"#fff",border:`1px solid ${tC[n.type]}66`,borderRadius:8,padding:"4px 10px",whiteSpace:"nowrap",fontSize:11,color:tC[n.type],fontFamily:"'Space Mono',monospace" }}>{n.name}</div>}
                      </div>
                    );
                  })}
                  {/* You dot */}
                  <div style={{ position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:accent,boxShadow:`0 0 0 6px ${accent}33, 0 0 0 12px ${accent}11`,animation:"pulse 2s infinite" }}/>
                  <div style={{ position:"absolute",bottom:10,right:10,background:isDark?"#0d1225cc":"#ffffffcc",backdropFilter:"blur(8px)",borderRadius:8,padding:"4px 10px",fontSize:10,color:sub,fontFamily:"'Space Mono',monospace",display:"flex",alignItems:"center",gap:4 }}>
                    <div style={{ width:8,height:8,borderRadius:"50%",background:accent }}/>You are here
                  </div>
                </div>

                {selectedNode && (
                  <div style={{ ...S.card, margin:"8px 0 0", animation:"slideUp 0.2s" }}>
                    <div style={{ fontWeight:700, fontSize:16 }}>{selectedNode.name}</div>
                    <div style={{ fontSize:12, color:sub, marginTop:3, textTransform:"capitalize" }}>{selectedNode.type} · Bingham University</div>
                    <div style={{ display:"flex", gap:8, marginTop:12 }}>
                      <button style={S.btn("primary")} onClick={()=>notify(`Navigating to ${selectedNode.name}!`)}>🧭 Navigate</button>
                      <button style={S.btn("ghost")} onClick={()=>notify("Hours: 7 AM – 10 PM")}>⏰ Hours</button>
                    </div>
                  </div>
                )}
              </div>

              <div style={S.sectionTitle}>🏛️ Campus Locations</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, padding:"0 14px" }}>
                {state.navNodes.map(n=>(
                  <div key={n.id} onClick={()=>setSelectedNode(n)} style={{ ...S.card, margin:0, padding:"12px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, border:selectedNode?.id===n.id?`1px solid ${accent}55`:S.card.border }}>
                    <div style={{ fontSize:20 }}>{{academic:"📚",food:"🍽️",sports:"🏋️",admin:"🏢",housing:"🏠",chapel:"⛪",health:"🏥"}[n.type]}</div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{n.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* ── Bottom Tab Bar ───────────────────────────────────────── */}
        <div style={S.tabBar}>
          {[{id:"home",icon:"🏠",label:"Home"},{id:"id",icon:"🪪",label:"ID"},{id:"wallet",icon:"💳",label:"Wallet"},{id:"attend",icon:"📚",label:"Courses"},{id:"events",icon:"🎫",label:"Events"},{id:"map",icon:"🗺️",label:"Map"}].map(t=>(
            <button key={t.id} style={S.tabBtn(tab===t.id)} onClick={()=>setTab(t.id)}>
              <span style={S.tabIcon(tab===t.id)}>{t.icon}</span>
              <span style={S.tabLabel(tab===t.id)}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── QR Modal ─────────────────────────────────────────────── */}
        {showQR && (
          <div onClick={()=>setShowQR(false)} style={{ position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,animation:"fadeIn 0.2s" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:"#0d1225",borderRadius:24,padding:28,border:"1px solid #00d4ff33",textAlign:"center",boxShadow:"0 20px 60px #00000088" }}>
              <div style={{ fontSize:11,color:"#607090",fontFamily:"'Space Mono',monospace",letterSpacing:2,marginBottom:16 }}>SCAN TO VERIFY</div>
              <div style={{ background:"white",padding:12,borderRadius:16,display:"inline-block" }}>
                <QRCode value={`${state.studentId}::${state.name}::${Date.now()}`}/>
              </div>
              <div style={{ marginTop:16,fontFamily:"'Space Mono',monospace",color:accent,fontSize:13 }}>{state.studentId}</div>
              <div style={{ fontSize:12,color:"#607090",marginTop:4 }}>Valid for 60 seconds</div>
              <button style={{ ...S.btn("outline"),marginTop:16 }} onClick={()=>setShowQR(false)}>Close</button>
            </div>
          </div>
        )}

        {/* ── Top-up Modal ─────────────────────────────────────────── */}
        {showTopup && (
          <div onClick={()=>setShowTopup(false)} style={{ position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,animation:"fadeIn 0.2s" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:isDark?"#0d1225":surface,borderRadius:"24px 24px 0 0",padding:"24px",border:`1px solid ${border}`,width:"100%",maxWidth:420,borderTop:`2px solid ${accent}` }}>
              <div style={{ fontSize:18,fontWeight:800,marginBottom:16 }}>Fund Wallet</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
                {[1000,2000,5000,10000].map(a=>(
                  <button key={a} style={{ ...S.btn("ghost"),padding:"12px",textAlign:"center",borderColor:topupAmt==a?accent:border,background:topupAmt==a?accent+"22":"transparent" }} onClick={()=>setTopupAmt(String(a))}>
                    {N(a)}
                  </button>
                ))}
              </div>
              <input type="number" value={topupAmt} onChange={e=>setTopupAmt(e.target.value)} placeholder="Enter custom amount (₦)"
                style={{ width:"100%",background:isDark?"#111827":"#f8faff",border:`1px solid ${border}`,borderRadius:12,padding:"14px 16px",color:text,fontSize:15,fontFamily:"'Space Mono',monospace",marginBottom:12 }}/>
              <button style={{ ...S.btn("primary"),width:"100%",padding:"14px",fontSize:15,borderRadius:14 }} onClick={handleTopup}>
                Add {topupAmt?N(topupAmt):"₦0"} to Wallet
              </button>
              <button style={{ ...S.btn("ghost"),width:"100%",marginTop:8,padding:"12px" }} onClick={()=>setShowTopup(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Settings Modal ───────────────────────────────────────── */}
        {showSettings && (
          <div onClick={()=>setShowSettings(false)} style={{ position:"fixed",inset:0,background:"#000000cc",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,animation:"fadeIn 0.2s" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:isDark?"#0d1225":surface,borderRadius:"24px 24px 0 0",padding:"24px",border:`1px solid ${border}`,width:"100%",maxWidth:420,borderTop:`2px solid ${accent}` }}>
              <div style={{ fontSize:18,fontWeight:800,marginBottom:18 }}>⚙️ Profile Settings</div>
              {[["Full Name",editName,setEditName],["Department",editMajor,setEditMajor]].map(([label,val,setter])=>(
                <div key={label} style={{ marginBottom:14 }}>
                  <div style={{ ...S.label, marginBottom:6 }}>{label}</div>
                  <input value={val} onChange={e=>setter(e.target.value)}
                    style={{ width:"100%",background:isDark?"#111827":"#f8faff",border:`1px solid ${border}`,borderRadius:12,padding:"12px 14px",color:text,fontSize:14,fontFamily:"'DM Sans',sans-serif" }}/>
                </div>
              ))}
              <div style={{ marginBottom:16 }}>
                <div style={{ ...S.label, marginBottom:8 }}>THEME</div>
                <div style={{ display:"flex",gap:8 }}>
                  {["dark","light"].map(t=>(
                    <button key={t} onClick={()=>setTheme(t)} style={{ ...S.btn(theme===t?"primary":"ghost"),flex:1,textTransform:"capitalize" }}>
                      {t==="dark"?"🌙 Dark":"☀️ Light"}
                    </button>
                  ))}
                </div>
              </div>
              <button style={{ ...S.btn("primary"),width:"100%",padding:"14px",borderRadius:14 }} onClick={saveSettings}>Save Changes</button>
              <button style={{ ...S.btn("ghost"),width:"100%",marginTop:8,padding:"12px" }} onClick={()=>setShowSettings(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Course Modal ─────────────────────────────────────────── */}
        {activeCourse && (
          <CourseModal
            course={state.attendance[activeCourse]}
            id={activeCourse}
            onClose={()=>setActiveCourse(null)}
            onCheckin={()=>handleCheckin(activeCourse)}
            checkedIn={!!checkedIn[activeCourse]}
          />
        )}

        {toast && <Toast msg={toast} onClose={()=>setToast(null)}/>}
      </div>
    </>
  );
}
