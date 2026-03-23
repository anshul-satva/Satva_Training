import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Search, Edit2, Trash2, ChevronDown } from "lucide-react";
import {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSearchQuery,
  setFilterStatus,
  setFilterDept,
  openAddModal,
  openEditModal,
  closeModal,
} from "../store/slices/employeeSlice";
import { showToast } from "../store/slices/toastSlice";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Product",
  "Design",
  "HR",
  "Finance",
  "Marketing",
];
const STATUSES = ["All", "Active", "On Leave", "Terminated", "Probation"];
const EMP_TYPES = ["Full-time", "Contract", "Intern"];
const STATUS_OPTS = ["Active", "On Leave", "Terminated", "Probation"];
const GRADES = [
  "Intern",
  "Junior",
  "Mid",
  "Senior",
  "Lead",
  "Principal",
  "Director",
];
const ROLES = [
  "Developer",
  "Designer",
  "Manager",
  "Analyst",
  "HR",
  "Admin",
  "Other",
];
const LOCATIONS = [
  "San Francisco HQ",
  "New York Office",
  "Austin Office",
  "Remote",
];

const EMPTY_FORM = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "Engineering",
  jobTitle: "",
  employmentType: "Full-time",
  reportingManager: "",
  workLocation: "Remote",
  status: "Active",
  dateOfJoining: "",
  contractStart: "",
  contractEnd: "",
  probationEnd: "",
  salary: "",
  band: "L3",
  grade: "Junior",
  role: "Developer",
};

function FormField({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function EmployeeForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-5 space-y-5">
        <div>
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
            Core Identity
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Employee ID *">
              <input
                className="input"
                value={form.id}
                onChange={(e) => set("id", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Email *">
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
              />
            </FormField>
            <FormField label="First Name *">
              <input
                className="input"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Last Name *">
              <input
                className="input"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Phone">
              <input
                className="input"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </FormField>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
            Employment Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Department *">
              <div className="relative">
                <select
                  className="select pr-8"
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                  required
                >
                  {DEPARTMENTS.filter((d) => d !== "All").map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-3 text-surface-400 pointer-events-none"
                />
              </div>
            </FormField>
            <FormField label="Job Title *">
              <input
                className="input"
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Employment Type *">
              <div className="relative">
                <select
                  className="select pr-8"
                  value={form.employmentType}
                  onChange={(e) => set("employmentType", e.target.value)}
                >
                  {EMP_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-3 text-surface-400 pointer-events-none"
                />
              </div>
            </FormField>
            <FormField label="Employment Status *">
              <div className="relative">
                <select
                  className="select pr-8"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  {STATUS_OPTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-3 text-surface-400 pointer-events-none"
                />
              </div>
            </FormField>
            <FormField label="Reporting Manager">
              <input
                className="input"
                value={form.reportingManager}
                onChange={(e) => set("reportingManager", e.target.value)}
              />
            </FormField>
            <FormField label="Work Location">
              <div className="relative">
                <select
                  className="select pr-8"
                  value={form.workLocation}
                  onChange={(e) => set("workLocation", e.target.value)}
                >
                  {LOCATIONS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-3 text-surface-400 pointer-events-none"
                />
              </div>
            </FormField>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
            HR Data
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Date of Joining *">
              <input
                className="input"
                type="date"
                value={form.dateOfJoining}
                onChange={(e) => set("dateOfJoining", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Contract Start Date">
              <input
                className="input"
                type="date"
                value={form.contractStart}
                onChange={(e) => set("contractStart", e.target.value)}
              />
            </FormField>
            <FormField label="Contract End Date">
              <input
                className="input"
                type="date"
                value={form.contractEnd}
                onChange={(e) => set("contractEnd", e.target.value)}
              />
            </FormField>
            <FormField label="Probation End Date">
              <input
                className="input"
                type="date"
                value={form.probationEnd}
                onChange={(e) => set("probationEnd", e.target.value)}
              />
            </FormField>
            <FormField label="Salary / CTC Band">
              <input
                className="input"
                value={form.salary}
                onChange={(e) => set("salary", e.target.value)}
              />
            </FormField>

            <FormField label="Grade">
              <div className="relative">
                <select
                  className="select pr-8"
                  value={form.grade}
                  onChange={(e) => set("grade", e.target.value)}
                >
                  {GRADES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-3 text-surface-400 pointer-events-none"
                />
              </div>
            </FormField>
            <FormField label="Role / System Role">
              <div className="relative">
                <select
                  className="select pr-8"
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                >
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="absolute right-3 top-3 text-surface-400 pointer-events-none"
                />
              </div>
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-surface-100 dark:border-surface-800">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save Employee
        </button>
      </div>
    </form>
  );
}

export default function Employees() {
  const dispatch = useDispatch();
  const { list, searchQuery, filterStatus, filterDept, selectedId, modalMode } =
    useSelector((s) => s.employee);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = list.filter((e) => {
    const q = searchQuery.toLowerCase();
    const matchQ =
      !q ||
      `${e.firstName} ${e.lastName} ${e.email} ${e.id} ${e.jobTitle}`
        .toLowerCase()
        .includes(q);
    const matchS = filterStatus === "All" || e.status === filterStatus;
    const matchD = filterDept === "All" || e.department === filterDept;
    return matchQ && matchS && matchD;
  });

  const selected = list.find((e) => e.id === selectedId);

  const handleSave = (form) => {
    if (modalMode === "add") {
      dispatch(addEmployee(form));
      dispatch(
        showToast({
          message: `${form.firstName} ${form.lastName} added successfully.`,
          type: "success",
        }),
      );
    } else {
      dispatch(updateEmployee(form));
      dispatch(
        showToast({
          message: `${form.firstName} ${form.lastName} updated successfully.`,
          type: "success",
        }),
      );
    }
    dispatch(closeModal());
  };

  const handleDelete = () => {
    const emp = list.find((e) => e.id === deleteId);
    dispatch(deleteEmployee(deleteId));
    dispatch(
      showToast({
        message: `${emp?.firstName} ${emp?.lastName} removed.`,
        type: "error",
      }),
    );
    setDeleteId(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            All Employees
          </h2>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            {filtered.length} of {list.length} records
          </p>
        </div>
        <button
          onClick={() => dispatch(openAddModal())}
          className="btn-primary self-start sm:self-auto"
        >
          <Plus size={15} />
          Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
          />
          <input
            className="input pl-9"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="select pl-3 pr-8 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => dispatch(setFilterStatus(e.target.value))}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-3 text-surface-400 pointer-events-none"
            />
          </div>
          <div className="relative">
            <select
              className="select pl-3 pr-8 py-2 text-sm"
              value={filterDept}
              onChange={(e) => dispatch(setFilterDept(e.target.value))}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-3 text-surface-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-50 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/30">
                {[
                  "Employee",
                  "Department",
                  "Job Title",
                  "Type",
                  "Location",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-surface-400 dark:text-surface-500"
                  >
                    No employees match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-semibold flex-shrink-0">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-100 whitespace-nowrap">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-surface-400 font-mono">
                            {emp.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-surface-600 dark:text-surface-300 whitespace-nowrap">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-surface-600 dark:text-surface-300 whitespace-nowrap max-w-[160px] truncate">
                      {emp.jobTitle}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge text={emp.employmentType} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-surface-600 dark:text-surface-300 whitespace-nowrap">
                      {emp.workLocation}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge text={emp.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => dispatch(openEditModal(emp.id))}
                          className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/30 text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteId(emp.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-surface-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-sm text-surface-400 dark:text-surface-500">
            No employees match your filters.
          </div>
        ) : (
          filtered.map((emp) => (
            <div key={emp.id} className="card p-4 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-sm font-semibold">
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-xs text-surface-400 font-mono">
                      {emp.id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => dispatch(openEditModal(emp.id))}
                    className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/30 text-surface-400 hover:text-brand-600"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteId(emp.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-surface-400 hover:text-rose-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <span className="text-surface-400">Dept</span>
                  <p className="text-surface-700 dark:text-surface-200 font-medium mt-0.5">
                    {emp.department}
                  </p>
                </div>
                <div>
                  <span className="text-surface-400">Title</span>
                  <p className="text-surface-700 dark:text-surface-200 font-medium mt-0.5 truncate">
                    {emp.jobTitle}
                  </p>
                </div>
                <div>
                  <span className="text-surface-400">Location</span>
                  <p className="text-surface-700 dark:text-surface-200 font-medium mt-0.5">
                    {emp.workLocation}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-surface-400">Status</span>
                  <Badge text={emp.status} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!modalMode}
        onClose={() => dispatch(closeModal())}
        title={modalMode === "add" ? "Add New Employee" : "Edit Employee"}
        size="lg"
      >
        <EmployeeForm
          initial={modalMode === "edit" ? selected : EMPTY_FORM}
          onSave={handleSave}
          onCancel={() => dispatch(closeModal())}
        />
      </Modal>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Employee"
        size="sm"
      >
        <div className="p-5">
          <p className="text-sm text-surface-600 dark:text-surface-300">
            Are you sure you want to remove this employee? This action cannot be
            undone.
          </p>
          <div className="flex items-center justify-end gap-2 mt-5">
            <button onClick={() => setDeleteId(null)} className="btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
