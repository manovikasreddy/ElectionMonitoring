let currentRole = null;
let currentUser = null;
let reports = [];
let chart = null;

// Initialize page
window.onload = function () {
  initChart();
  updateStats();
  setInterval(updateStats, 3000);
  setupLogin();
};

// -------- LOGIN / LOGOUT --------

function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  const roleButtons = document.getElementById("roleButtons");
  const userBar = document.getElementById("userBar");
  const userLabel = document.getElementById("userLabel");
  const logoutBtn = document.getElementById("logoutBtn");

  loginForm.onsubmit = function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const role = document.getElementById("roleSelect").value;

    if (!username || !role) {
      alert("Enter user name and select role");
      return;
    }

    currentUser = username;
    currentRole = role;

    // show user bar
    userLabel.textContent = `Logged in as: ${username} (${role})`;
    userBar.style.display = "flex";

    // hide role buttons so each user sees only own panel
    roleButtons.style.display = "none";

    // hide login
    const loginPanel = document.getElementById("loginSection");
    loginPanel.classList.remove("active");
    loginPanel.style.display = "none";

    // show only this role panel
    showPanel(role);
  };

  logoutBtn.onclick = function () {
    currentUser = null;
    currentRole = null;

    userBar.style.display = "none";

    document
      .querySelectorAll(".panel")
      .forEach((p) => p.classList.remove("active"));

    const loginPanel = document.getElementById("loginSection");
    loginPanel.style.display = "block";
    loginPanel.classList.add("active");
  };
}

// if someone clicks hidden role buttons
function changeRole(role) {
  alert("Each user can view only their own role dashboard after login.");
}

function showPanel(role) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.remove("active");
  });
  const panel = document.getElementById(role);
  if (panel) panel.classList.add("active");
}

// -------- Citizen --------

function findStation() {
  const location = document.getElementById("location").value;
  if (location.trim()) {
    alert(
      `📍 Station 45 found!\nDistance: 2.3 km\nAddress: ${location}`
    );
  } else {
    alert("Please enter your location");
  }
}

function reportIssue(event) {
  event.preventDefault();
  const type = document.getElementById("issueType").value;
  const desc = document.getElementById("issueDesc").value;
  if (!desc.trim()) {
    alert("Please describe the issue");
    return;
  }

  const reporter = currentUser || "Anonymous";

  const report = {
    id: reports.length + 1,
    type,
    desc,
    reporter,
    time: new Date().toLocaleString(),
    status: "Pending",
  };

  reports.push(report);
  document.getElementById("issueForm").reset();
  alert("✅ Report submitted successfully!");
  updateReportList();
}

// -------- Observer --------

function checkStation() {
  const stationId = document.getElementById("stationId").value;
  if (stationId.trim()) {
    alert(
      `Station ${stationId}:\n✅ Active\nQueue: 15 voters\nStatus: Normal`
    );
  } else {
    alert("Enter station ID");
  }
}

function reportAnomaly() {
  if (confirm("Report anomaly to authorities?")) {
    alert("🚨 Anomaly reported!\nReference: EVT-" + Date.now());
  }
}

// -------- Analyst --------

function updateReportList() {
  const list = document.getElementById("reportList");
  if (reports.length === 0) {
    list.innerHTML = "No reports yet";
    return;
  }

  list.innerHTML = reports
    .slice(-5)
    .map(
      (r) =>
        `<div class="report-item">
          <strong>#${r.id} - ${r.type}</strong><br/>
          ${r.desc}<br/>
          <small>By: ${r.reporter} | ${r.time} | Status: ${r.status}</small>
        </div>`
    )
    .join("");
}

function updateStats() {
  if (!chart) return;
  chart.data.datasets[0].data[2] = reports.length;
  chart.update();
}

// -------- Admin --------

function clearAllReports() {
  if (confirm("Clear all citizen reports?")) {
    reports = [];
    updateReportList();
    alert("All reports cleared");
  }
}

// -------- Chart --------

function initChart() {
  const ctx = document.getElementById("voteChart");
  if (!ctx) return;

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Candidate A", "Candidate B", "Issues"],
      datasets: [
        {
          data: [60, 40, 0],
          backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
        },
      ],
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
    },
  });
}
