(() => {
  "use strict";

  const STORAGE_KEY = "peopledesk_employees_v1";
  const $ = (selector) => document.querySelector(selector);
  const form = $("#employeeForm");
  const modal = $("#employeeModal");
  const toast = $("#toast");
  let employees = loadEmployees();
  let toastTimer;

  const demoEmployees = [
    { id: makeId(), name: "Olivia Rhye", email: "olivia@company.com", department: "Design", role: "Product Designer", status: "Active", joined: "2024-03-18" },
    { id: makeId(), name: "Phoenix Baker", email: "phoenix@company.com", department: "Engineering", role: "Engineering Lead", status: "Active", joined: "2023-11-06" },
    { id: makeId(), name: "Lana Steiner", email: "lana@company.com", department: "Human Resources", role: "HR Manager", status: "On Leave", joined: "2022-08-22" },
    { id: makeId(), name: "Demi Wilkinson", email: "demi@company.com", department: "Marketing", role: "Marketing Specialist", status: "Active", joined: "2024-01-15" },
    { id: makeId(), name: "Candice Wu", email: "candice@company.com", department: "Engineering", role: "Frontend Developer", status: "Inactive", joined: "2021-06-01" },
    { id: makeId(), name: "Natali Craig", email: "natali@company.com", department: "Sales", role: "Account Executive", status: "Active", joined: "2023-09-11" },
    { id: makeId(), name: "Drew Cano", email: "drew@company.com", department: "Finance", role: "Financial Analyst", status: "Active", joined: "2024-05-20" },
    { id: makeId(), name: "Orlando Diggs", email: "orlando@company.com", department: "Operations", role: "Operations Coordinator", status: "On Leave", joined: "2022-12-12" }
  ];

  // First launch includes sample records. Remove these from storage to start with an empty directory.
  if (employees === null) {
    employees = demoEmployees;
    saveEmployees();
  }

  function makeId() {
    return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `emp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadEmployees() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === null ? null : JSON.parse(raw);
    } catch (error) {
      console.error("Could not read employee records:", error);
      return [];
    }
  }

  function saveEmployees() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      return true;
    } catch (error) {
      console.error("Could not save employee records:", error);
      showToast("Could not save data. Check browser storage settings.");
      return false;
    }
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
  }

  function formatDate(dateString) {
    if (!dateString) return "—";
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function renderStats() {
    $("#totalEmployees").textContent = employees.length;
    $("#activeEmployees").textContent = employees.filter(e => e.status === "Active").length;
    $("#onLeaveEmployees").textContent = employees.filter(e => e.status === "On Leave").length;
    $("#departmentCount").textContent = new Set(employees.map(e => e.department).filter(Boolean)).size;
  }

  function renderDepartmentFilter() {
    const select = $("#departmentFilter");
    const selected = select.value;
    const departments = [...new Set(employees.map(e => e.department).filter(Boolean))].sort();
    select.innerHTML = '<option value="">All departments</option>' + departments.map(d =>
      `<option value="${escapeHTML(d)}">${escapeHTML(d)}</option>`).join("");
    if (departments.includes(selected)) select.value = selected;
  }

  function renderDepartments() {
    const counts = employees.reduce((acc, employee) => {
      acc[employee.department] = (acc[employee.department] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...sorted.map(([, count]) => count));
    const chart = $("#departmentChart");
    if (!sorted.length) {
      chart.innerHTML = '<p class="empty-note">Add employees to see department distribution.</p>';
      return;
    }
    chart.innerHTML = sorted.map(([department, count]) => `
      <div class="dept-row">
        <span class="dept-name" title="${escapeHTML(department)}">${escapeHTML(department)}</span>
        <div class="bar-track" role="img" aria-label="${escapeHTML(department)}: ${count} employees">
          <div class="bar-fill" style="width:${Math.round(count / max * 100)}%"></div>
        </div>
        <span class="dept-number">${count}</span>
      </div>`).join("");
  }

  function getFilteredEmployees() {
    const query = $("#searchInput").value.trim().toLowerCase();
    const department = $("#departmentFilter").value;
    const status = $("#statusFilter").value;
    return employees.filter(e => {
      const searchable = `${e.name} ${e.email} ${e.role} ${e.department}`.toLowerCase();
      return (!query || searchable.includes(query)) &&
        (!department || e.department === department) &&
        (!status || e.status === status);
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  function renderTable() {
    const filtered = getFilteredEmployees();
    const body = $("#employeeTableBody");
    if (!filtered.length) {
      body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px 12px;color:#999cad">${employees.length ? "No employees match these filters." : "No employees yet. Add your first employee to get started."}</td></tr>`;
    } else {
      body.innerHTML = filtered.map(employee => {
        const statusClass = employee.status.toLowerCase().replace(/\s+/g, "-");
        const colorClass = `color-${[...employee.name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5}`;
        return `<tr>
          <td><div class="employee-cell"><div class="employee-avatar ${colorClass}">${escapeHTML(initials(employee.name))}</div><div><strong>${escapeHTML(employee.name)}</strong><small>${escapeHTML(employee.email)}</small></div></div></td>
          <td>${escapeHTML(employee.department)}</td><td>${escapeHTML(employee.role)}</td>
          <td><span class="status-pill status-${statusClass}">${escapeHTML(employee.status)}</span></td>
          <td>${escapeHTML(formatDate(employee.joined))}</td>
          <td class="action-cell"><button class="action-menu" data-action="edit" data-id="${escapeHTML(employee.id)}" aria-label="Edit ${escapeHTML(employee.name)}" title="Edit employee">✎</button><button class="action-menu" data-action="delete" data-id="${escapeHTML(employee.id)}" aria-label="Delete ${escapeHTML(employee.name)}" title="Delete employee">×</button></td>
        </tr>`;
      }).join("");
    }
    $("#resultCount").textContent = `Showing ${filtered.length} of ${employees.length} employee${employees.length === 1 ? "" : "s"}`;
  }

  function render() {
    renderStats();
    renderDepartmentFilter();
    renderDepartments();
    renderTable();
  }

  function openModal(employee = null) {
    form.reset();
    $("#formError").textContent = "";
    $("#employeeId").value = employee ? employee.id : "";
    $("#modalTitle").textContent = employee ? "Edit employee" : "Add employee";
    $("#saveEmployeeBtn").textContent = employee ? "Save changes" : "Save employee";
    if (employee) {
      $("#employeeName").value = employee.name;
      $("#employeeEmail").value = employee.email;
      $("#employeeDepartment").value = employee.department;
      $("#employeeRole").value = employee.role;
      $("#employeeStatus").value = employee.status;
      $("#employeeJoined").value = employee.joined;
    } else {
      $("#employeeStatus").value = "Active";
      $("#employeeJoined").value = new Date().toISOString().slice(0, 10);
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $("#employeeName").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function csvEscape(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
  }

  function exportCSV() {
    const rows = [["Name", "Email", "Department", "Job title", "Status", "Date joined"],
      ...getFilteredEmployees().map(e => [e.name, e.email, e.department, e.role, e.status, e.joined])];
    const csv = rows.map(row => row.map(csvEscape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "employees.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Employee CSV exported.");
  }

  $("#todayLabel").textContent = new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  $("#addEmployeeBtn").addEventListener("click", () => openModal());
  $("#addEmployeeBtn2").addEventListener("click", () => openModal());
  $("#closeModalBtn").addEventListener("click", closeModal);
  $("#cancelModalBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !modal.hidden) closeModal(); });
  ["searchInput", "departmentFilter", "statusFilter"].forEach(id => $(`#${id}`).addEventListener(id === "searchInput" ? "input" : "change", renderTable));
  $("#clearFiltersBtn").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#departmentFilter").value = "";
    $("#statusFilter").value = "";
    renderTable();
  });
  $("#exportBtn").addEventListener("click", exportCSV);
  $("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    $("#sidebar").classList.remove("open");
  }));

  form.addEventListener("submit", event => {
    event.preventDefault();
    const id = $("#employeeId").value;
    const employee = {
      id: id || makeId(),
      name: $("#employeeName").value.trim(),
      email: $("#employeeEmail").value.trim(),
      department: $("#employeeDepartment").value,
      role: $("#employeeRole").value.trim(),
      status: $("#employeeStatus").value,
      joined: $("#employeeJoined").value
    };
    if (!employee.name || !employee.email || !employee.department || !employee.role || !employee.joined) {
      $("#formError").textContent = "Please complete all required fields.";
      return;
    }
    const duplicate = employees.some(e => e.email.toLowerCase() === employee.email.toLowerCase() && e.id !== id);
    if (duplicate) {
      $("#formError").textContent = "An employee with this email address already exists.";
      return;
    }
    if (id) employees = employees.map(e => e.id === id ? employee : e);
    else employees.push(employee);
    if (!saveEmployees()) return;
    closeModal();
    render();
    showToast(id ? "Employee details updated." : "Employee added successfully.");
  });

  $("#employeeTableBody").addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const employee = employees.find(e => e.id === button.dataset.id);
    if (!employee) return;
    if (button.dataset.action === "edit") openModal(employee);
    if (button.dataset.action === "delete") {
      if (!window.confirm(`Delete ${employee.name} from the employee directory? This cannot be undone.`)) return;
      employees = employees.filter(e => e.id !== employee.id);
      saveEmployees();
      render();
      showToast("Employee deleted.");
    }
  });

  render();
})();
