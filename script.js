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
    const password = document.getElementById("password").value;
    const selectedRole = document.getElementById("roleSelect").value;

    // Simple client‑side validation only
    if (!username || !password || !selectedRole) {
      alert("Please enter user name, password and select role");
      return;
    }

    // In a real app, check credentials on the server.
    currentUser = username;
    currentRole = selectedRole;

    userLabel.textContent = `Logged in as: ${username} (${currentRole})`;
    userBar.style.display = "flex";

    roleButtons.style.display = "none";

    const loginPanel = document.getElementById("loginSection");
    loginPanel.classList.remove("active");
    loginPanel.style.display = "none";

    showPanel(currentRole);
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

// called if hidden role buttons are clicked
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

// -------- helper for links --------

function showCreateAccount() {
  alert("Create account: in a real system this would save username, password and role to secure storage or a backend.");
}

function forgotPassword() {
  alert("Forgot password: in a real system this would send a reset link or verification code to the user.");
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
  if (!list) return;

  if (reports.length === 0) {
    list.innerHTML = "No reports yet";
    return;
  }

  list.innerHTML = reports
    .slice(-10)
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
          data: [60, 40, reports.length],
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
