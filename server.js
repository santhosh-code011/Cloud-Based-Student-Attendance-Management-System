// ============================================================================
// Cloud-Based Student Attendance Management System - Backend Server
// Zero-dependency pure Node.js server (Runs with `node server.js` instantly)
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'cloud_db.json');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Seed default initial data if database file doesn't exist
function getInitialData() {
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
        entries: {
          "STU-101": "Present",
          "STU-102": "Present",
          "STU-103": "Absent",
          "STU-104": "Present",
          "STU-109": "Late"
        }
      },
      {
        id: "REC-2026-10-21-CS-DB",
        date: "2026-10-21",
        department: "Computer Science",
        semester: "Semester 6",
        subject: "Distributed Database Systems",
        faculty: "Prof. Nalini Pillai",
        markedAt: "2026-10-21T10:30:00.000Z",
        entries: {
          "STU-101": "Present",
          "STU-102": "Present",
          "STU-103": "Present",
          "STU-104": "Present",
          "STU-109": "Present"
        }
      },
      {
        id: "REC-2026-10-22-CS-CC",
        date: "2026-10-22",
        department: "Computer Science",
        semester: "Semester 6",
        subject: "Cloud Computing & DevOps",
        faculty: "Dr. Sandeep Rao",
        markedAt: "2026-10-22T09:30:00.000Z",
        entries: {
          "STU-101": "Present",
          "STU-102": "Present",
          "STU-103": "Absent",
          "STU-104": "Excused",
          "STU-109": "Present"
        }
      },
      {
        id: "REC-2026-10-23-IT-WT",
        date: "2026-10-23",
        department: "Information Technology",
        semester: "Semester 6",
        subject: "Modern Web Frameworks",
        faculty: "Prof. Amit Sengupta",
        markedAt: "2026-10-23T11:00:00.000Z",
        entries: {
          "STU-105": "Present",
          "STU-106": "Present",
          "STU-110": "Late"
        }
      },
      {
        id: "REC-2026-10-24-AI-ML",
        date: "2026-10-24",
        department: "AI & Data Science",
        semester: "Semester 4",
        subject: "Machine Learning Foundations",
        faculty: "Dr. Preeti Deshmukh",
        markedAt: "2026-10-24T09:00:00.000Z",
        entries: {
          "STU-107": "Present",
          "STU-108": "Present"
        }
      }
    ],
    leaveRequests: [
      { id: "LEV-101", studentId: "STU-103", studentName: "Rohan Verma", rollNo: "CS2026-003", reason: "Viral fever and medical rest", startDate: "2026-10-24", endDate: "2026-10-25", status: "Pending", submittedAt: "2026-10-23" },
      { id: "LEV-102", studentId: "STU-104", studentName: "Priya Nair", rollNo: "CS2026-004", reason: "Inter-college Hackathon Participation", startDate: "2026-10-22", endDate: "2026-10-22", status: "Approved", submittedAt: "2026-10-20" }
    ]
  };
}

// In-memory data store (keeps workspace cleanly strictly within 6 files)
let memoryDb = getInitialData();

function readDatabase() {
  return memoryDb;
}

function saveDatabase(data) {
  memoryDb = data;
  return true;
}

// Main HTTP request listener
const server = http.createServer((req, res) => {
  // Enable CORS for external API integrations or cross-origin dev tools
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. Health Endpoint
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: "online",
      cloudSync: "ready",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. GET /api/data - fetch all data
  if (pathname === '/api/data' && req.method === 'GET') {
    const data = readDatabase();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // 3. POST /api/sync - sync state from frontend
  if (pathname === '/api/sync' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const currentData = readDatabase();
        const mergedData = {
          ...currentData,
          ...payload,
          systemInfo: {
            ...currentData.systemInfo,
            ...(payload.systemInfo || {}),
            lastCloudSync: new Date().toISOString()
          }
        };
        saveDatabase(mergedData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: "Cloud synced successfully", timestamp: new Date().toISOString() }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON body", details: err.message }));
      }
    });
    return;
  }

  // 4. Static file serving
  let filePath = pathname === '/' ? path.join(__dirname, 'index.html') : path.join(__dirname, pathname);

  // Normalize path security (avoid directory traversal)
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  const ext = path.extname(safePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(safePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA routing if available
        fs.readFile(path.join(__dirname, 'index.html'), (spaErr, spaContent) => {
          if (spaErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(spaContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ☁️  Cloud-Based Student Attendance Management System`);
  console.log(` 🚀 Server is running at: http://localhost:${PORT}`);
  console.log(` 📁 Single directory clean structure (Ready for GitHub)`);
  console.log(`=======================================================`);
});
