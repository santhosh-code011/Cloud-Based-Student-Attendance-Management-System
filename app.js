// ============================================================================
// Cloud-Based Student Attendance Management System - Core Application Logic
// Architecture: Single-Page Application (SPA) with Cloud & Local Sync Engine
// ============================================================================

const App = (function () {
  'use strict';

  // Application State
  const state = {
    systemInfo: {
      institutionName: "CloudTech Institute of Engineering & Technology",
      academicYear: "2026-2027",
      lastCloudSync: new Date().toISOString(),
      cloudRegion: "aws-us-east-1 (Cloud Replica Active)"
    },
    students: [],
    attendanceRecords: [],
    leaveRequests: [],
    currentSessionMarks: {}, // studentId -> 'Present' | 'Absent' | 'Late' | 'Excused'
    activeTab: 'tab-dashboard',
    theme: 'theme-dark',
    cloudMode: 'REST_AND_LOCAL',
    apiEndpoint: window.location.origin.includes('http') ? `${window.location.origin}/api` : 'http://localhost:3000/api',
    isSyncing: false,
    charts: {
      trend: null,
      distribution: null,
      subjectBar: null
    }
  };

  // LocalStorage Key
  const STORAGE_KEY = 'cloud_attendance_system_v1';

  // Seed default data for instant offline readiness
  function getDefaultDataset() {
    return {
      systemInfo: {
        institutionName: "CloudTech Institute of Engineering & Technology",
        academicYear: "2026-2027",
        lastCloudSync: new Date().toISOString(),
        cloudRegion: "aws-us-east-1 (Cloud Replica Active)"
      },
      students: [
        { id: "STU-101", name: "Aarav Sharma", rollNo: "CS2026-001", department: "Computer Science", semester: "Semester 6", email: "aarav.sharma@cloudtech.edu", phone: "+91 98765 43210", avatar: "👨‍💻", status: "Active" },
        { id: "STU-102", name: "Ananya Patel", rollNo: "CS2026-002", department: "Computer Science", semester: "Semester 6", email: "ananya.patel@cloudtech.edu", phone: "+91 98765 43211", avatar: "👩‍💻", status: "Active" },
        { id: "STU-103", name: "Rohan Verma", rollNo: "CS2026-003", department: "Computer Science", semester: "Semester 6", email: "rohan.verma@cloudtech.edu", phone: "+91 98765 43212", avatar: "👨‍🎓", status: "Active" },
        { id: "STU-104", name: "Priya Nair", rollNo: "CS2026-004", department: "Computer Science", semester: "Semester 6", email: "priya.nair@cloudtech.edu", phone: "+91 98765 43213", avatar: "👩‍🎓", status: "Active" },
        { id: "STU-105", name: "Vikram Malhotra", rollNo: "IT2026-001", department: "Information Technology", semester: "Semester 6", email: "vikram.m@cloudtech.edu", phone: "+91 98765 43214", avatar: "👨‍💼", status: "Active" },
        { id: "STU-106", name: "Sneha Reddy", rollNo: "IT2026-002", department: "Information Technology", semester: "Semester 6", email: "sneha.reddy@cloudtech.edu", phone: "+91 98765 43215", avatar: "👩‍🔬", status: "Active" },
        { id: "STU-107", name: "Kavya Iyer", rollNo: "AI2026-001", department: "AI & Data Science", semester: "Semester 4", email: "kavya.iyer@cloudtech.edu", phone: "+91 98765 43216", avatar: "👩‍💻", status: "Active" },
        { id: "STU-108", name: "Devansh Gupta", rollNo: "AI2026-002", department: "AI & Data Science", semester: "Semester 4", email: "devansh.g@cloudtech.edu", phone: "+91 98765 43217", avatar: "👨‍🔬", status: "Active" },
        { id: "STU-109", name: "Meera Joshi", rollNo: "CS2026-005", department: "Computer Science", semester: "Semester 6", email: "meera.joshi@cloudtech.edu", phone: "+91 98765 43218", avatar: "👩‍🎓", status: "Active" },
        { id: "STU-110", name: "Arjun Das", rollNo: "IT2026-003", department: "Information Technology", semester: "Semester 6", email: "arjun.das@cloudtech.edu", phone: "+91 98765 43219", avatar: "👨‍🎓", status: "Active" }
      ],
      attendanceRecords: [
        {
          id: "REC-2026-10-20-CS-CC",
          date: "2026-10-20",
          department: "Computer Science",
          semester: "Semester 6",
          subject: "Cloud Computing & DevOps",
          faculty: "Dr. Sandeep Rao",
          markedAt: "2026-10-20T09:30:00.000Z",
          entries: { "STU-101": "Present", "STU-102": "Present", "STU-103": "Absent", "STU-104": "Present", "STU-109": "Late" }
        },
        {
          id: "REC-2026-10-21-CS-DB",
          date: "2026-10-21",
          department: "Computer Science",
          semester: "Semester 6",
          subject: "Distributed Database Systems",
          faculty: "Prof. Nalini Pillai",
          markedAt: "2026-10-21T10:30:00.000Z",
          entries: { "STU-101": "Present", "STU-102": "Present", "STU-103": "Present", "STU-104": "Present", "STU-109": "Present" }
        },
        {
          id: "REC-2026-10-22-CS-CC",
          date: "2026-10-22",
          department: "Computer Science",
          semester: "Semester 6",
          subject: "Cloud Computing & DevOps",
          faculty: "Dr. Sandeep Rao",
          markedAt: "2026-10-22T09:30:00.000Z",
          entries: { "STU-101": "Present", "STU-102": "Present", "STU-103": "Absent", "STU-104": "Excused", "STU-109": "Present" }
        },
        {
          id: "REC-2026-10-23-IT-WT",
          date: "2026-10-23",
          department: "Information Technology",
          semester: "Semester 6",
          subject: "Modern Web Frameworks",
          faculty: "Prof. Amit Sengupta",
          markedAt: "2026-10-23T11:00:00.000Z",
          entries: { "STU-105": "Present", "STU-106": "Present", "STU-110": "Late" }
        },
        {
          id: "REC-2026-10-24-AI-ML",
          date: "2026-10-24",
          department: "AI & Data Science",
          semester: "Semester 4",
          subject: "Machine Learning Foundations",
          faculty: "Dr. Preeti Deshmukh",
          markedAt: "2026-10-24T09:00:00.000Z",
          entries: { "STU-107": "Present", "STU-108": "Present" }
        }
      ],
      leaveRequests: [
        { id: "LEV-101", studentId: "STU-103", studentName: "Rohan Verma", rollNo: "CS2026-003", reason: "Viral fever and physician recommended rest", startDate: "2026-10-24", endDate: "2026-10-25", status: "Pending", submittedAt: "2026-10-23" },
        { id: "LEV-102", studentId: "STU-104", studentName: "Priya Nair", rollNo: "CS2026-004", reason: "Inter-collegiate Hackathon Finalist Competition", startDate: "2026-10-22", endDate: "2026-10-22", status: "Approved", submittedAt: "2026-10-20" }
      ]
    };
  }

  // ==========================================================================
  // INITIALIZATION & CLOUD SYNC ENGINE
  // ==========================================================================
  async function init() {
    setupEventListeners();
    setDefaultDateInput();
    loadTheme();

    // Load initial data (Try Node API first, fallback to LocalStorage/Default)
    await loadInitialData();

    // Render all modules
    renderAll();
    showToast("Cloud Attendance System Initialized", "info");
  }

  function setDefaultDateInput() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('markDateInput');
    if (dateInput) dateInput.value = today;
  }

  async function loadInitialData() {
    setCloudStatus("Connecting...", true);

    try {
      // 1. Attempt to fetch from Node.js REST API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${state.apiEndpoint}/data`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const cloudData = await res.json();
        state.students = cloudData.students || [];
        state.attendanceRecords = cloudData.attendanceRecords || [];
        state.leaveRequests = cloudData.leaveRequests || [];
        state.systemInfo = cloudData.systemInfo || state.systemInfo;

        saveToLocalStorage();
        setCloudStatus("Cloud Synced", false);
        updatePingBadge("12 ms (Online)");
        return;
      }
    } catch (err) {
      console.warn("Cloud REST API unavailable, switching to local cached storage:", err.message);
    }

    // 2. Fallback to LocalStorage
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        state.students = parsed.students || [];
        state.attendanceRecords = parsed.attendanceRecords || [];
        state.leaveRequests = parsed.leaveRequests || [];
        state.systemInfo = parsed.systemInfo || state.systemInfo;
        setCloudStatus("Offline (Local Cache)", false);
        updatePingBadge("Local Mode");
        return;
      } catch (e) {
        console.error("Local storage parse error:", e);
      }
    }

    // 3. Fallback to initial seeds
    const defaults = getDefaultDataset();
    state.students = defaults.students;
    state.attendanceRecords = defaults.attendanceRecords;
    state.leaveRequests = defaults.leaveRequests;
    state.systemInfo = defaults.systemInfo;
    saveToLocalStorage();
    setCloudStatus("Seed Data Loaded", false);
  }

  // Save changes locally and push to cloud API
  async function persistState(showMessage = false) {
    saveToLocalStorage();

    if (state.cloudMode === 'LOCAL_ONLY') {
      if (showMessage) showToast("Saved to local storage", "success");
      return;
    }

    setCloudStatus("Syncing to Cloud...", true);
    const startTime = performance.now();

    try {
      const payload = {
        students: state.students,
        attendanceRecords: state.attendanceRecords,
        leaveRequests: state.leaveRequests,
        systemInfo: state.systemInfo
      };

      const res = await fetch(`${state.apiEndpoint}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (res.ok) {
        setCloudStatus("Cloud Synced", false);
        updatePingBadge(`${elapsed} ms (Optimal)`);
        if (showMessage) showToast("Changes synced to Cloud Replica", "success");
      } else {
        throw new Error("HTTP " + res.status);
      }
    } catch (err) {
      setCloudStatus("Offline (Saved Locally)", false);
      updatePingBadge("Server Offline");
      if (showMessage) showToast("Synced locally (Cloud server offline)", "info");
    }
  }

  function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      students: state.students,
      attendanceRecords: state.attendanceRecords,
      leaveRequests: state.leaveRequests,
      systemInfo: state.systemInfo
    }));
  }

  function setCloudStatus(text, syncing) {
    const el = document.getElementById('cloudStatusIndicator');
    const label = document.getElementById('cloudStatusText');
    if (!el || !label) return;

    label.textContent = text;
    if (syncing) {
      el.classList.add('syncing');
    } else {
      el.classList.remove('syncing');
    }
  }

  function updatePingBadge(text) {
    const badge = document.getElementById('cloudLatencyBadge');
    const footerPing = document.getElementById('backendPingText');
    if (badge) badge.textContent = text;
    if (footerPing) footerPing.textContent = `REST API: ${text}`;
  }

  // ==========================================================================
  // EVENT LISTENERS & NAVIGATION
  // ==========================================================================
  function setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        navigateTab(targetTab);
      });
    });

    // Mobile Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggleBtn');
    const sidebar = document.getElementById('appSidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', toggleTheme);
    }

    // Quick Manual Sync Button
    const quickSyncBtn = document.getElementById('quickSyncBtn');
    if (quickSyncBtn) {
      quickSyncBtn.addEventListener('click', () => persistState(true));
    }

    // Mark Attendance: Filter Change Listeners
    const markDept = document.getElementById('markDeptSelect');
    const markSem = document.getElementById('markSemSelect');
    const markSubject = document.getElementById('markSubjectSelect');
    const markDate = document.getElementById('markDateInput');

    [markDept, markSem, markSubject, markDate].forEach(el => {
      if (el) el.addEventListener('change', () => loadMarkingSession());
    });

    // Mark Attendance: Batch Action Buttons
    document.getElementById('btnMarkAllPresent')?.addEventListener('click', () => batchSetMarks('Present'));
    document.getElementById('btnMarkAllAbsent')?.addEventListener('click', () => batchSetMarks('Absent'));
    document.getElementById('btnResetSession')?.addEventListener('click', resetSessionDraft);
    document.getElementById('btnCommitSession')?.addEventListener('click', commitSessionAttendance);

    // Marking Quick Search
    document.getElementById('markingSearchInput')?.addEventListener('input', (e) => {
      renderMarkingRoster(e.target.value);
    });

    // Student Directory Filters & Search
    document.getElementById('studentDirectorySearch')?.addEventListener('input', renderStudentDirectory);
    document.getElementById('studentDeptFilter')?.addEventListener('change', renderStudentDirectory);
    document.getElementById('studentEligibilityFilter')?.addEventListener('change', renderStudentDirectory);

    // Add Student Modal Open
    document.getElementById('btnOpenAddStudentModal')?.addEventListener('click', () => openStudentModal());

    // Student Form Submit
    document.getElementById('studentForm')?.addEventListener('submit', handleSaveStudent);

    // Leave Request Modal Open
    document.getElementById('btnOpenNewLeaveModal')?.addEventListener('click', openLeaveModal);
    document.getElementById('leaveForm')?.addEventListener('submit', handleSaveLeave);

    // Export CSV & Print Report
    document.getElementById('btnExportCSV')?.addEventListener('click', exportAttendanceCSV);
    document.getElementById('btnPrintReport')?.addEventListener('click', printFormalSheet);

    // Report Subject Filter
    document.getElementById('reportSubjectFilter')?.addEventListener('change', renderReportHistory);

    // Cloud Settings Actions
    document.getElementById('btnTestCloudPing')?.addEventListener('click', testCloudPing);
    document.getElementById('btnExportJSON')?.addEventListener('click', exportDatabaseJSON);
    document.getElementById('importDbInput')?.addEventListener('change', handleImportDatabase);
    document.getElementById('btnSeedDemoData')?.addEventListener('click', seedDemoDataPrompt);
    document.getElementById('btnWipeDatabase')?.addEventListener('click', wipeDatabasePrompt);
  }

  function navigateTab(tabId) {
    state.activeTab = tabId;

    // Update Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.id === tabId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Close Mobile Sidebar if opened
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.remove('sidebar-open');

    // Trigger tab specific renders
    if (tabId === 'tab-dashboard') {
      renderDashboard();
    } else if (tabId === 'tab-mark') {
      loadMarkingSession();
    } else if (tabId === 'tab-students') {
      renderStudentDirectory();
    } else if (tabId === 'tab-reports') {
      renderReports();
    } else if (tabId === 'tab-leaves') {
      renderLeaveRequests();
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    if (isDark) {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      document.getElementById('themeIcon').textContent = '☀️';
      localStorage.setItem('cloud_attend_theme', 'theme-light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      document.getElementById('themeIcon').textContent = '🌙';
      localStorage.setItem('cloud_attend_theme', 'theme-dark');
    }
    // Re-render charts with appropriate theme colors
    renderCharts();
  }

  function loadTheme() {
    const saved = localStorage.getItem('cloud_attend_theme') || 'theme-dark';
    document.body.className = saved;
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = saved === 'theme-light' ? '☀️' : '🌙';
  }

  // ==========================================================================
  // RENDER ALL MODULES
  // ==========================================================================
  function renderAll() {
    renderDashboard();
    renderStudentDirectory();
    renderReports();
    renderLeaveRequests();
    updateSidebarBadges();
  }

  function updateSidebarBadges() {
    const stuBadge = document.getElementById('sidebarStudentCount');
    if (stuBadge) stuBadge.textContent = state.students.length;

    const pendingLeaves = state.leaveRequests.filter(l => l.status === 'Pending').length;
    const leaveBadge = document.getElementById('sidebarPendingLeaves');
    if (leaveBadge) leaveBadge.textContent = pendingLeaves;
  }

  // ==========================================================================
  // MODULE 1: DASHBOARD & METRICS
  // ==========================================================================
  function renderDashboard() {
    const totalStudents = state.students.length;
    const totalSessions = state.attendanceRecords.length;

    // Calculate aggregated attendance percentage
    let totalEntries = 0;
    let presentEntries = 0;
    let absentEntries = 0;
    let lateEntries = 0;
    let excusedEntries = 0;

    state.attendanceRecords.forEach(rec => {
      Object.values(rec.entries).forEach(status => {
        totalEntries++;
        if (status === 'Present') presentEntries++;
        else if (status === 'Late') { lateEntries++; presentEntries += 0.8; }
        else if (status === 'Absent') absentEntries++;
        else if (status === 'Excused') { excusedEntries++; presentEntries++; }
      });
    });

    const avgPct = totalEntries > 0 ? ((presentEntries / totalEntries) * 100).toFixed(1) : "100.0";

    // Defaulters (< 75%)
    const defaulters = getDefaultersList();

    // DOM Updates
    const kpiAvg = document.getElementById('kpiAvgAttendance');
    if (kpiAvg) kpiAvg.textContent = `${avgPct}%`;

    const kpiTotal = document.getElementById('kpiTotalStudents');
    if (kpiTotal) kpiTotal.textContent = totalStudents;

    const kpiSess = document.getElementById('kpiTotalSessions');
    if (kpiSess) kpiSess.textContent = totalSessions;

    const kpiDef = document.getElementById('kpiDefaultersCount');
    if (kpiDef) kpiDef.textContent = defaulters.length;

    renderRecentSessionsTable();
    renderDefaultersWatchlist(defaulters);
    renderCharts();
  }

  function getStudentStats(studentId) {
    let classesHeld = 0;
    let attendedScore = 0;

    state.attendanceRecords.forEach(rec => {
      if (rec.entries && rec.entries[studentId]) {
        classesHeld++;
        const status = rec.entries[studentId];
        if (status === 'Present') attendedScore += 1;
        else if (status === 'Late') attendedScore += 0.8;
        else if (status === 'Excused') attendedScore += 1;
      }
    });

    const percentage = classesHeld > 0 ? Math.round((attendedScore / classesHeld) * 100) : 100;
    const isEligible = percentage >= 75;

    return { classesHeld, attendedScore: Math.round(attendedScore), percentage, isEligible };
  }

  function getDefaultersList() {
    return state.students
      .map(stu => ({ ...stu, ...getStudentStats(stu.id) }))
      .filter(s => s.classesHeld > 0 && s.percentage < 75);
  }

  function renderRecentSessionsTable() {
    const tbody = document.getElementById('dashboardRecentSessionsBody');
    if (!tbody) return;

    const recent = [...state.attendanceRecords].slice(-5).reverse();

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding: 24px; color: var(--text-dim);">No attendance sessions logged yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(r => {
      const entries = Object.values(r.entries || {});
      const presentCount = entries.filter(s => s === 'Present' || s === 'Excused').length;
      const rate = entries.length > 0 ? Math.round((presentCount / entries.length) * 100) : 0;

      return `
        <tr>
          <td><strong>${r.date}</strong></td>
          <td><span style="color: var(--primary); font-weight: 600;">${r.subject}</span></td>
          <td>${r.department} • <small>${r.semester}</small></td>
          <td>
            <div class="progress-pill-wrapper">
              <div class="progress-track">
                <div class="progress-fill" style="width: ${rate}%; background: ${rate >= 75 ? 'var(--emerald)' : 'var(--rose)'};"></div>
              </div>
              <strong style="color: ${rate >= 75 ? 'var(--emerald)' : 'var(--rose)'};">${rate}%</strong>
            </div>
          </td>
          <td><small>${r.faculty || 'Faculty'}</small></td>
        </tr>
      `;
    }).join('');
  }

  function renderDefaultersWatchlist(defaulters) {
    const container = document.getElementById('defaulterWatchlistContainer');
    if (!container) return;

    if (defaulters.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 32px 10px; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🎉</div>
          <strong>No Academic Attendance Defaulters!</strong>
          <p style="font-size: 0.78rem; color: var(--text-dim); margin-top: 4px;">All enrolled students are above the 75% attendance threshold.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = defaulters.map(d => `
      <div class="defaulter-item">
        <div class="defaulter-meta">
          <strong>${d.name}</strong>
          <span>${d.rollNo} • ${d.department}</span>
        </div>
        <div class="defaulter-rate">
          <span class="defaulter-pct">${d.percentage}%</span>
          <small style="color: var(--rose); font-size: 0.72rem;">${d.attendedScore}/${d.classesHeld} classes</small>
        </div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // CHART RENDERING (Chart.js)
  // ==========================================================================
  function renderCharts() {
    if (typeof Chart === 'undefined') return;

    const isDark = document.body.classList.contains('theme-dark');
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    // 1. Trend Line Chart
    const trendCanvas = document.getElementById('chartAttendanceTrend');
    if (trendCanvas) {
      const sortedRecords = [...state.attendanceRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
      const dates = sortedRecords.map(r => r.date);
      const rates = sortedRecords.map(r => {
        const entries = Object.values(r.entries || {});
        if (entries.length === 0) return 100;
        const present = entries.filter(s => s === 'Present' || s === 'Late').length;
        return Math.round((present / entries.length) * 100);
      });

      if (state.charts.trend) state.charts.trend.destroy();

      state.charts.trend = new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: dates.length > 0 ? dates : ['No Data'],
          datasets: [{
            label: 'Attendance Rate %',
            data: rates.length > 0 ? rates : [100],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#06b6d4',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              min: 40,
              max: 100,
              grid: { color: gridColor },
              ticks: { color: textColor, callback: val => `${val}%` }
            },
            x: {
              grid: { color: gridColor },
              ticks: { color: textColor }
            }
          }
        }
      });
    }

    // 2. Status Distribution Doughnut Chart
    const distCanvas = document.getElementById('chartDistribution');
    if (distCanvas) {
      let counts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
      state.attendanceRecords.forEach(r => {
        Object.values(r.entries || {}).forEach(st => {
          if (counts[st] !== undefined) counts[st]++;
        });
      });

      if (state.charts.distribution) state.charts.distribution.destroy();

      state.charts.distribution = new Chart(distCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Present', 'Absent', 'Late', 'Excused'],
          datasets: [{
            data: [counts.Present, counts.Absent, counts.Late, counts.Excused],
            backgroundColor: ['#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: textColor, boxWidth: 12, padding: 12 }
            }
          },
          cutout: '72%'
        }
      });
    }

    // 3. Subject-wise Bar Chart
    const subjectCanvas = document.getElementById('chartSubjectBreakdown');
    if (subjectCanvas) {
      const subjectMap = {};
      state.attendanceRecords.forEach(r => {
        if (!subjectMap[r.subject]) {
          subjectMap[r.subject] = { total: 0, attended: 0 };
        }
        Object.values(r.entries || {}).forEach(status => {
          subjectMap[r.subject].total++;
          if (status === 'Present' || status === 'Late' || status === 'Excused') {
            subjectMap[r.subject].attended++;
          }
        });
      });

      const subjects = Object.keys(subjectMap);
      const subjectRates = subjects.map(s => {
        const item = subjectMap[s];
        return item.total > 0 ? Math.round((item.attended / item.total) * 100) : 0;
      });

      if (state.charts.subjectBar) state.charts.subjectBar.destroy();

      state.charts.subjectBar = new Chart(subjectCanvas, {
        type: 'bar',
        data: {
          labels: subjects.length > 0 ? subjects : ['No Subjects'],
          datasets: [{
            label: 'Subject Attendance Rate (%)',
            data: subjectRates.length > 0 ? subjectRates : [0],
            backgroundColor: 'rgba(6, 182, 212, 0.75)',
            hoverBackgroundColor: '#06b6d4',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              min: 0,
              max: 100,
              grid: { color: gridColor },
              ticks: { color: textColor, callback: val => `${val}%` }
            },
            x: {
              grid: { display: false },
              ticks: { color: textColor }
            }
          }
        }
      });
    }
  }

  // ==========================================================================
  // MODULE 2: MARK ATTENDANCE
  // ==========================================================================
  function loadMarkingSession() {
    const dept = document.getElementById('markDeptSelect').value;
    const sem = document.getElementById('markSemSelect').value;
    const subject = document.getElementById('markSubjectSelect').value;
    const date = document.getElementById('markDateInput').value;

    // Check if an existing session already exists for this combination
    const existing = state.attendanceRecords.find(r => r.date === date && r.subject === subject && r.department === dept);

    state.currentSessionMarks = {};

    // Get matching students
    const eligibleStudents = state.students.filter(s => s.department === dept);

    eligibleStudents.forEach(stu => {
      if (existing && existing.entries && existing.entries[stu.id]) {
        state.currentSessionMarks[stu.id] = existing.entries[stu.id];
      } else {
        // Default to Present
        state.currentSessionMarks[stu.id] = 'Present';
      }
    });

    const subEl = document.getElementById('markingRosterSubtitle');
    if (subEl) {
      subEl.textContent = `Marking session for ${dept} (${sem}) • Course: ${subject} • ${eligibleStudents.length} Students`;
    }

    renderMarkingRoster();
    updateSessionCounters();
  }

  function renderMarkingRoster(searchQuery = '') {
    const tbody = document.getElementById('markingTableBody');
    if (!tbody) return;

    const dept = document.getElementById('markDeptSelect').value;
    let students = state.students.filter(s => s.department === dept);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      students = students.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
    }

    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center" style="padding: 30px; color: var(--text-dim);">
            No students found enrolled in ${dept}. Add students in the Student Directory.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = students.map(stu => {
      const currentStatus = state.currentSessionMarks[stu.id] || 'Present';
      const stats = getStudentStats(stu.id);

      return `
        <tr data-student-id="${stu.id}">
          <td>
            <div class="student-meta-cell">
              <div class="student-avatar">${stu.avatar || '🎓'}</div>
              <div class="student-name-box">
                <strong>${stu.name}</strong>
                <span>${stu.email || 'No email registered'}</span>
              </div>
            </div>
          </td>
          <td><code>${stu.rollNo}</code></td>
          <td>
            <span class="status-chip ${stats.percentage >= 75 ? 'eligible' : 'shortage'}">
              ${stats.percentage}%
            </span>
          </td>
          <td class="text-center">
            <div class="status-btn-group" data-student="${stu.id}">
              <button type="button" class="status-choice-btn ${currentStatus === 'Present' ? 'active' : ''}" data-status="Present" onclick="App.setStudentStatus('${stu.id}', 'Present')">Present</button>
              <button type="button" class="status-choice-btn ${currentStatus === 'Late' ? 'active' : ''}" data-status="Late" onclick="App.setStudentStatus('${stu.id}', 'Late')">Late</button>
              <button type="button" class="status-choice-btn ${currentStatus === 'Absent' ? 'active' : ''}" data-status="Absent" onclick="App.setStudentStatus('${stu.id}', 'Absent')">Absent</button>
              <button type="button" class="status-choice-btn ${currentStatus === 'Excused' ? 'active' : ''}" data-status="Excused" onclick="App.setStudentStatus('${stu.id}', 'Excused')">Excused</button>
            </div>
          </td>
          <td>
            <input type="text" class="form-input" style="font-size: 0.78rem; padding: 4px 8px; width: 140px;" placeholder="Optional remark..." value="${currentStatus === 'Excused' ? 'On Duty/Medical' : ''}">
          </td>
        </tr>
      `;
    }).join('');
  }

  function setStudentStatus(studentId, status) {
    state.currentSessionMarks[studentId] = status;

    // Update active class on button group
    const group = document.querySelector(`.status-btn-group[data-student="${studentId}"]`);
    if (group) {
      group.querySelectorAll('.status-choice-btn').forEach(b => {
        if (b.getAttribute('data-status') === status) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
    }

    updateSessionCounters();
  }

  function batchSetMarks(status) {
    const dept = document.getElementById('markDeptSelect').value;
    const students = state.students.filter(s => s.department === dept);

    students.forEach(s => {
      state.currentSessionMarks[s.id] = status;
    });

    renderMarkingRoster();
    updateSessionCounters();
    showToast(`Batch updated all students to '${status}'`, "info");
  }

  function resetSessionDraft() {
    loadMarkingSession();
    showToast("Session marks reset", "info");
  }

  function updateSessionCounters() {
    const marks = Object.values(state.currentSessionMarks);
    const present = marks.filter(m => m === 'Present').length;
    const absent = marks.filter(m => m === 'Absent').length;
    const late = marks.filter(m => m === 'Late').length;
    const excused = marks.filter(m => m === 'Excused').length;

    const elP = document.getElementById('countPresent');
    const elA = document.getElementById('countAbsent');
    const elL = document.getElementById('countLate');
    const elE = document.getElementById('countExcused');

    if (elP) elP.textContent = present;
    if (elA) elA.textContent = absent;
    if (elL) elL.textContent = late;
    if (elE) elE.textContent = excused;
  }

  async function commitSessionAttendance() {
    const dept = document.getElementById('markDeptSelect').value;
    const sem = document.getElementById('markSemSelect').value;
    const subject = document.getElementById('markSubjectSelect').value;
    const date = document.getElementById('markDateInput').value;
    const faculty = document.getElementById('markFacultyInput').value;

    if (!date) {
      showToast("Please choose a valid session date.", "error");
      return;
    }

    const sessionKey = `REC-${date}-${dept.replace(/\s+/g, '')}-${subject.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5)}`;

    const newRecord = {
      id: sessionKey,
      date,
      department: dept,
      semester: sem,
      subject,
      faculty: faculty || "Faculty Proctor",
      markedAt: new Date().toISOString(),
      entries: { ...state.currentSessionMarks }
    };

    // Replace if exists, else append
    const existingIndex = state.attendanceRecords.findIndex(r => r.date === date && r.subject === subject && r.department === dept);
    if (existingIndex >= 0) {
      state.attendanceRecords[existingIndex] = newRecord;
    } else {
      state.attendanceRecords.push(newRecord);
    }

    await persistState(false);
    showToast(`Session for ${subject} successfully committed to Cloud!`, "success");
    renderAll();
  }

  // ==========================================================================
  // MODULE 3: STUDENT DIRECTORY
  // ==========================================================================
  function renderStudentDirectory() {
    const tbody = document.getElementById('studentDirectoryTableBody');
    if (!tbody) return;

    const searchQuery = (document.getElementById('studentDirectorySearch')?.value || '').toLowerCase();
    const deptFilter = document.getElementById('studentDeptFilter')?.value || 'ALL';
    const eligFilter = document.getElementById('studentEligibilityFilter')?.value || 'ALL';

    let list = state.students.map(s => ({ ...s, ...getStudentStats(s.id) }));

    if (deptFilter !== 'ALL') {
      list = list.filter(s => s.department === deptFilter);
    }

    if (eligFilter === 'ELIGIBLE') {
      list = list.filter(s => s.percentage >= 75);
    } else if (eligFilter === 'SHORTAGE') {
      list = list.filter(s => s.percentage < 75);
    }

    if (searchQuery) {
      list = list.filter(s => s.name.toLowerCase().includes(searchQuery) || s.rollNo.toLowerCase().includes(searchQuery) || (s.email && s.email.toLowerCase().includes(searchQuery)));
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 28px; color: var(--text-dim);">No matching student records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(stu => `
      <tr>
        <td>
          <div class="student-meta-cell">
            <div class="student-avatar">${stu.avatar || '🎓'}</div>
            <div class="student-name-box">
              <strong>${stu.name}</strong>
              <span>${stu.email || 'No email'}</span>
            </div>
          </div>
        </td>
        <td><code>${stu.rollNo}</code></td>
        <td>${stu.department} <br><small style="color: var(--text-dim);">${stu.semester}</small></td>
        <td>
          <div class="progress-pill-wrapper">
            <div class="progress-track">
              <div class="progress-fill" style="width: ${stu.percentage}%; background: ${stu.percentage >= 75 ? 'var(--emerald)' : 'var(--rose)'};"></div>
            </div>
            <strong style="color: ${stu.percentage >= 75 ? 'var(--emerald)' : 'var(--rose)'};">${stu.percentage}%</strong>
          </div>
        </td>
        <td>${stu.attendedScore} / ${stu.classesHeld}</td>
        <td>
          <span class="status-chip ${stu.isEligible ? 'eligible' : 'shortage'}">
            ${stu.isEligible ? '✓ Eligible (≥75%)' : '⚠ Attendance Shortage'}
          </span>
        </td>
        <td class="text-right">
          <button class="action-btn secondary-btn" style="padding: 4px 8px; font-size: 0.75rem;" onclick="App.viewStudentProfile('${stu.id}')">View ID</button>
          <button class="action-btn secondary-btn" style="padding: 4px 8px; font-size: 0.75rem;" onclick="App.openEditStudent('${stu.id}')">Edit</button>
          <button class="action-btn danger-outline-btn" style="padding: 4px 8px; font-size: 0.75rem;" onclick="App.deleteStudent('${stu.id}')">✕</button>
        </td>
      </tr>
    `).join('');
  }

  function openStudentModal(student = null) {
    const modal = document.getElementById('studentModal');
    const title = document.getElementById('studentModalTitle');
    const form = document.getElementById('studentForm');

    form.reset();
    document.getElementById('studentEditId').value = '';

    if (student) {
      title.textContent = "Edit Student Profile";
      document.getElementById('studentEditId').value = student.id;
      document.getElementById('studentNameInput').value = student.name;
      document.getElementById('studentRollInput').value = student.rollNo;
      document.getElementById('studentDeptInput').value = student.department;
      document.getElementById('studentSemInput').value = student.semester;
      document.getElementById('studentEmailInput').value = student.email || '';
      document.getElementById('studentPhoneInput').value = student.phone || '';
    } else {
      title.textContent = "Enroll New Student";
    }

    modal.classList.add('open');
  }

  function openEditStudent(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (student) openStudentModal(student);
  }

  async function handleSaveStudent(e) {
    e.preventDefault();
    const editId = document.getElementById('studentEditId').value;
    const name = document.getElementById('studentNameInput').value.trim();
    const rollNo = document.getElementById('studentRollInput').value.trim();
    const department = document.getElementById('studentDeptInput').value;
    const semester = document.getElementById('studentSemInput').value;
    const email = document.getElementById('studentEmailInput').value.trim();
    const phone = document.getElementById('studentPhoneInput').value.trim();

    if (!name || !rollNo) return;

    if (editId) {
      const idx = state.students.findIndex(s => s.id === editId);
      if (idx >= 0) {
        state.students[idx] = { ...state.students[idx], name, rollNo, department, semester, email, phone };
        showToast("Student profile updated", "success");
      }
    } else {
      const newId = `STU-${100 + state.students.length + 1}`;
      const avatars = ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍🔬', '👩‍🔬', '👨‍💼'];
      const avatar = avatars[Math.floor(Math.random() * avatars.length)];

      state.students.push({
        id: newId,
        name,
        rollNo,
        department,
        semester,
        email: email || `${rollNo.toLowerCase()}@cloudtech.edu`,
        phone,
        avatar,
        status: "Active"
      });
      showToast(`Student ${name} enrolled successfully`, "success");
    }

    closeModals();
    await persistState(false);
    renderAll();
  }

  async function deleteStudent(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    if (!confirm(`Are you sure you want to remove ${student.name} (${student.rollNo}) from the roster?`)) {
      return;
    }

    state.students = state.students.filter(s => s.id !== studentId);
    await persistState(false);
    renderAll();
    showToast(`Removed student ${student.name}`, "info");
  }

  function viewStudentProfile(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    const stats = getStudentStats(student.id);
    const content = document.getElementById('profileModalContent');

    content.innerHTML = `
      <div class="digital-id-badge">
        <div class="id-header-top">
          <span class="id-institute">${state.systemInfo.institutionName}</span>
          <span style="font-size: 0.65rem; color: #a5b4fc; font-weight: 700;">CLOUD DIGITAL IDENTITY</span>
        </div>
        <div class="id-body-grid">
          <div class="id-avatar-circle">${student.avatar || '🎓'}</div>
          <div class="id-details">
            <h4>${student.name}</h4>
            <p><strong>Roll No:</strong> <code>${student.rollNo}</code></p>
            <p><strong>Dept:</strong> ${student.department} (${student.semester})</p>
            <p><strong>Email:</strong> ${student.email || 'N/A'}</p>
          </div>
          <div class="id-qr-box">
            <div class="qr-code-placeholder">
              <svg viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#ffffff"/>
                <path d="M10 10h30v30h-30zM15 15h20v20h-20zM22 22h6v6h-6zM60 10h30v30h-30zM65 15h20v20h-20zM72 22h6v6h-6zM10 60h30v30h-30zM15 65h20v20h-20zM22 72h6v6h-6zM50 15h5v15h-5zM50 45h10v10h-10zM70 50h20v5h-20zM60 70h15v20h-15zM80 80h10v10h-10z" fill="#000000"/>
              </svg>
            </div>
            <small style="color: var(--text-dim); font-size: 0.65rem; display: block; margin-top: 4px;">Smart QR</small>
          </div>
        </div>
      </div>

      <div style="margin-top: 18px; background: rgba(0,0,0,0.2); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">Cumulative Attendance</span>
          <span style="font-size: 1.25rem; font-weight: 700; color: ${stats.percentage >= 75 ? 'var(--emerald)' : 'var(--rose)'};">${stats.percentage}%</span>
        </div>
        <div class="progress-track" style="width: 100%; height: 8px; margin: 8px 0;">
          <div class="progress-fill" style="width: ${stats.percentage}%; background: ${stats.percentage >= 75 ? 'var(--emerald)' : 'var(--rose)'};"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-dim);">
          <span>Classes Attended: ${stats.attendedScore}</span>
          <span>Total Lectures: ${stats.classesHeld}</span>
          <span>Status: ${stats.isEligible ? 'Eligible for Exams' : 'Shortage Detention'}</span>
        </div>
      </div>
    `;

    document.getElementById('profileModal').classList.add('open');
  }

  // ==========================================================================
  // MODULE 4: REPORTS, ANALYTICS & EXPORTS
  // ==========================================================================
  function renderReports() {
    populateSubjectDropdownFilter();
    renderReportHistory();
  }

  function populateSubjectDropdownFilter() {
    const sel = document.getElementById('reportSubjectFilter');
    if (!sel) return;

    const subjects = [...new Set(state.attendanceRecords.map(r => r.subject))];
    const currentVal = sel.value;

    sel.innerHTML = `<option value="ALL">All Subjects</option>` + subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    if (subjects.includes(currentVal)) sel.value = currentVal;
  }

  function renderReportHistory() {
    const tbody = document.getElementById('reportSessionLogsBody');
    if (!tbody) return;

    const subjectFilter = document.getElementById('reportSubjectFilter')?.value || 'ALL';
    let logs = [...state.attendanceRecords].reverse();

    if (subjectFilter !== 'ALL') {
      logs = logs.filter(l => l.subject === subjectFilter);
    }

    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding: 24px; color: var(--text-dim);">No sessions found for selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = logs.map(l => {
      const entries = Object.values(l.entries || {});
      const p = entries.filter(s => s === 'Present').length;
      const a = entries.filter(s => s === 'Absent').length;
      const lOrE = entries.filter(s => s === 'Late' || s === 'Excused').length;

      return `
        <tr>
          <td><code style="font-size: 0.75rem;">${l.id}</code></td>
          <td><strong>${l.date}</strong></td>
          <td>${l.subject}</td>
          <td>${l.department}</td>
          <td><span style="color: var(--emerald); font-weight: 600;">${p}</span></td>
          <td><span style="color: var(--rose); font-weight: 600;">${a}</span></td>
          <td><span style="color: var(--amber); font-weight: 600;">${lOrE}</span></td>
          <td><small>${l.faculty}</small></td>
          <td class="text-right">
            <button class="action-btn secondary-btn" style="padding: 4px 8px; font-size: 0.72rem;" onclick="App.deleteSessionLog('${l.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  async function deleteSessionLog(sessionId) {
    if (!confirm("Are you sure you want to delete this historical attendance session?")) return;

    state.attendanceRecords = state.attendanceRecords.filter(r => r.id !== sessionId);
    await persistState(false);
    renderAll();
    showToast("Session record removed", "info");
  }

  // Export CSV
  function exportAttendanceCSV() {
    if (state.students.length === 0) {
      showToast("No student data available to export.", "error");
      return;
    }

    let csv = "Student ID,Roll Number,Name,Department,Semester,Classes Attended,Total Classes,Attendance Percentage,Eligibility Status\n";

    state.students.forEach(s => {
      const stats = getStudentStats(s.id);
      csv += `"${s.id}","${s.rollNo}","${s.name}","${s.department}","${s.semester}",${stats.attendedScore},${stats.classesHeld},"${stats.percentage}%","${stats.isEligible ? 'Eligible' : 'Detained Shortage'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_transcript_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Attendance CSV downloaded", "success");
  }

  // Formal Print Sheet
  function printFormalSheet() {
    const tbody = document.getElementById('printTableBody');
    if (!tbody) return;

    tbody.innerHTML = state.students.map(s => {
      const stats = getStudentStats(s.id);
      return `
        <tr>
          <td>${s.rollNo}</td>
          <td>${s.name}</td>
          <td>${s.department} (${s.semester})</td>
          <td>${stats.classesHeld}</td>
          <td>${stats.attendedScore}</td>
          <td>${stats.percentage}%</td>
          <td>${stats.isEligible ? 'ELIGIBLE' : 'SHORTAGE'}</td>
        </tr>
      `;
    }).join('');

    const meta = document.getElementById('printMetaDetails');
    if (meta) {
      meta.textContent = `Generated: ${new Date().toLocaleString()} | Institution: ${state.systemInfo.institutionName} | Status: Verified Cloud Record`;
    }

    window.print();
  }

  // ==========================================================================
  // MODULE 5: LEAVE & MEDICAL ON-DUTY APPROVALS
  // ==========================================================================
  function renderLeaveRequests() {
    const tbody = document.getElementById('leaveRequestsTableBody');
    if (!tbody) return;

    if (state.leaveRequests.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 24px; color: var(--text-dim);">No leave applications logged.</td></tr>`;
      return;
    }

    tbody.innerHTML = state.leaveRequests.map(l => `
      <tr>
        <td><code>${l.id}</code></td>
        <td><strong>${l.studentName}</strong></td>
        <td><code>${l.rollNo}</code></td>
        <td>${l.reason}</td>
        <td>${l.startDate} ${l.startDate !== l.endDate ? `to ${l.endDate}` : ''}</td>
        <td>
          <span class="status-chip ${l.status === 'Approved' ? 'eligible' : l.status === 'Rejected' ? 'shortage' : 'pending'}">
            ${l.status}
          </span>
        </td>
        <td class="text-right">
          ${l.status === 'Pending' ? `
            <button class="action-btn secondary-btn" style="padding: 4px 8px; font-size: 0.72rem; color: var(--emerald);" onclick="App.updateLeaveStatus('${l.id}', 'Approved')">Approve</button>
            <button class="action-btn secondary-btn" style="padding: 4px 8px; font-size: 0.72rem; color: var(--rose);" onclick="App.updateLeaveStatus('${l.id}', 'Rejected')">Reject</button>
          ` : `
            <small style="color: var(--text-dim);">Processed</small>
          `}
        </td>
      </tr>
    `).join('');
  }

  function openLeaveModal() {
    const sel = document.getElementById('leaveStudentSelect');
    if (sel) {
      sel.innerHTML = state.students.map(s => `<option value="${s.id}">${s.name} (${s.rollNo} - ${s.department})</option>`).join('');
    }
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('leaveStartDate').value = today;
    document.getElementById('leaveEndDate').value = today;
    document.getElementById('leaveModal').classList.add('open');
  }

  async function handleSaveLeave(e) {
    e.preventDefault();
    const studentId = document.getElementById('leaveStudentSelect').value;
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    const startDate = document.getElementById('leaveStartDate').value;
    const endDate = document.getElementById('leaveEndDate').value;
    const reason = document.getElementById('leaveReasonInput').value.trim();

    const newLeave = {
      id: `LEV-${100 + state.leaveRequests.length + 1}`,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      reason,
      startDate,
      endDate,
      status: "Approved", // Auto-approved for faculty entry
      submittedAt: new Date().toISOString().split('T')[0]
    };

    state.leaveRequests.unshift(newLeave);

    // Automatically update any sessions in this range for this student to 'Excused'
    state.attendanceRecords.forEach(rec => {
      if (rec.date >= startDate && rec.date <= endDate) {
        if (rec.entries && rec.entries[student.id]) {
          rec.entries[student.id] = 'Excused';
        }
      }
    });

    closeModals();
    await persistState(false);
    renderAll();
    showToast(`Leave authorized for ${student.name}`, "success");
  }

  async function updateLeaveStatus(leaveId, newStatus) {
    const leave = state.leaveRequests.find(l => l.id === leaveId);
    if (!leave) return;

    leave.status = newStatus;

    if (newStatus === 'Approved') {
      state.attendanceRecords.forEach(rec => {
        if (rec.date >= leave.startDate && rec.date <= leave.endDate) {
          if (rec.entries && rec.entries[leave.studentId]) {
            rec.entries[leave.studentId] = 'Excused';
          }
        }
      });
    }

    await persistState(false);
    renderAll();
    showToast(`Leave request ${newStatus.toLowerCase()}`, "info");
  }

  // ==========================================================================
  // MODULE 6: SETTINGS, BACKUP & RECOVERY
  // ==========================================================================
  async function testCloudPing() {
    setCloudStatus("Pinging Cloud...", true);
    const start = performance.now();

    try {
      const res = await fetch(`${state.apiEndpoint}/health`);
      const elapsed = Math.round(performance.now() - start);

      if (res.ok) {
        updatePingBadge(`${elapsed} ms (Healthy)`);
        setCloudStatus("Cloud Synced", false);
        showToast(`Cloud Ping Success: ${elapsed}ms roundtrip`, "success");
      } else {
        throw new Error("Status " + res.status);
      }
    } catch (e) {
      updatePingBadge("Server Offline");
      setCloudStatus("Offline Mode", false);
      showToast("Node REST server is offline. Running on LocalStorage.", "info");
    }
  }

  function exportDatabaseJSON() {
    const data = {
      systemInfo: state.systemInfo,
      students: state.students,
      attendanceRecords: state.attendanceRecords,
      leaveRequests: state.leaveRequests,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloud_attendance_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Full Database JSON backup downloaded", "success");
  }

  function handleImportDatabase(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (event) {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.students && imported.attendanceRecords) {
          state.students = imported.students;
          state.attendanceRecords = imported.attendanceRecords;
          state.leaveRequests = imported.leaveRequests || [];
          if (imported.systemInfo) state.systemInfo = imported.systemInfo;

          await persistState(false);
          renderAll();
          showToast("Database restored successfully!", "success");
        } else {
          showToast("Invalid attendance database JSON format.", "error");
        }
      } catch (err) {
        showToast("Error parsing JSON file.", "error");
      }
    };
    reader.readAsText(file);
  }

  async function seedDemoDataPrompt() {
    if (!confirm("This will reload sample students and attendance records. Continue?")) return;

    const defaults = getDefaultDataset();
    state.students = defaults.students;
    state.attendanceRecords = defaults.attendanceRecords;
    state.leaveRequests = defaults.leaveRequests;
    state.systemInfo = defaults.systemInfo;

    await persistState(false);
    renderAll();
    showToast("Demo Academic Sample Data Reloaded", "success");
  }

  async function wipeDatabasePrompt() {
    if (!confirm("⚠️ WARNING: This will permanently delete all attendance sessions and leaves. Continue?")) return;

    state.attendanceRecords = [];
    state.leaveRequests = [];
    await persistState(false);
    renderAll();
    showToast("Attendance history wiped", "info");
  }

  // ==========================================================================
  // UTILITIES & MODAL HANDLING
  // ==========================================================================
  function closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('open'));
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // Close modals when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModals();
    }
  });

  // Keyboard escape to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModals();
  });

  // Public API
  return {
    init,
    navigateTab,
    setStudentStatus,
    openEditStudent,
    deleteStudent,
    viewStudentProfile,
    deleteSessionLog,
    updateLeaveStatus,
    closeModals
  };
})();

// Bootstrap App on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
