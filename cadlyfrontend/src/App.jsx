import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   API
========================================================= */

const API_URL = "http://127.0.0.1:5000";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("acadely_token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================================================
   ICONS
========================================================= */

const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),

  academic: (
    <svg viewBox="0 0 24 24">
      <path d="M3 10l9-5 9 5-9 5-9-5Z" />
      <path d="M6 12.5V17c3 2 9 2 12 0v-4.5" />
      <path d="M21 10v6" />
    </svg>
  ),

  book: (
    <svg viewBox="0 0 24 24">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 19h16" />
    </svg>
  ),

  users: (
    <svg viewBox="0 0 24 24">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M18 15c1.8.7 3 2.1 3 4" />
    </svg>
  ),

  student: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 21c.5-4 2.8-6 7-6s6.5 2 7 6" />
      <path d="M8 12h8" />
    </svg>
  ),

  calendar: (
    <svg viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  ),

  clock: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),

  building: (
    <svg viewBox="0 0 24 24">
      <path d="M4 21V5l8-3 8 3v16" />
      <path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2M10 21v-3h4v3" />
    </svg>
  ),

  flask: (
    <svg viewBox="0 0 24 24">
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
      <path d="M7 16h10" />
    </svg>
  ),

  settings: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2.6v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6V11h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V4h2.6v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.6h-.2a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  ),

  check: (
    <svg viewBox="0 0 24 24">
      <path d="m5 12 4 4L19 6" />
    </svg>
  ),

  close: (
    <svg viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),

  plus: (
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),

  edit: (
    <svg viewBox="0 0 24 24">
      <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
      <path d="m13.5 7.5 3 3" />
    </svg>
  ),

  trash: (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  ),

  refresh: (
    <svg viewBox="0 0 24 24">
      <path d="M20 11a8 8 0 0 0-14.8-4L3 10" />
      <path d="M3 5v5h5" />
      <path d="M4 13a8 8 0 0 0 14.8 4L21 14" />
      <path d="M21 19v-5h-5" />
    </svg>
  ),

  search: (
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  ),

  bell: (
    <svg viewBox="0 0 24 24">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  ),

  logout: (
    <svg viewBox="0 0 24 24">
      <path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" />
    </svg>
  ),

  menu: (
    <svg viewBox="0 0 24 24">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
};

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    title: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        icon: Icons.dashboard,
      },
    ],
  },
  {
    title: "Academic Management",
    items: [
      {
        key: "academic-years",
        label: "Academic Years",
        icon: Icons.calendar,
      },
      {
        key: "departments",
        label: "Departments",
        icon: Icons.building,
      },
      {
        key: "sections",
        label: "Sections",
        icon: Icons.academic,
      },
      {
        key: "programs",
        label: "Programs",
        icon: Icons.academic,
      },
      {
        key: "classes",
        label: "Classes",
        icon: Icons.book,
      },
      {
        key: "divisions",
        label: "Divisions",
        icon: Icons.users,
      },
      {
        key: "batches",
        label: "Batches",
        icon: Icons.student,
      },
      {
        key: "courses",
        label: "Courses",
        icon: Icons.book,
      },
      {
        key: "course-allocation",
        label: "Course Allocation",
        icon: Icons.academic,
      },
      {
        key: "timetable",
        label: "Timetable",
        icon: Icons.calendar,
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        key: "faculty",
        label: "Faculty",
        icon: Icons.users,
      },
      {
        key: "students",
        label: "Students",
        icon: Icons.student,
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        key: "classrooms",
        label: "Classrooms",
        icon: Icons.building,
      },
      {
        key: "laboratories",
        label: "Laboratories",
        icon: Icons.flask,
      },
      {
        key: "time-slots",
        label: "Time Slots",
        icon: Icons.clock,
      },
    ],
  },
  {
    title: "Requests",
    items: [
      {
        key: "faculty-approvals",
        label: "Faculty Approvals",
        icon: Icons.check,
      },
      {
        key: "faculty-availability",
        label: "Faculty Availability",
        icon: Icons.clock,
      },
      {
        key: "faculty-leaves",
        label: "Leave Requests",
        icon: Icons.calendar,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "settings",
        label: "Settings",
        icon: Icons.settings,
      },
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.users)) return data.users;
  return [];
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function displayDate(value) {
  if (!value) return "—";
  return String(value).slice(0, 10);
}

function displayTime(value) {
  if (!value) return "—";
  return String(value).slice(0, 5);
}

function idValue(value) {
  return value === "" || value === null || value === undefined
    ? null
    : Number(value);
}

/* =========================================================
   COMMON UI
========================================================= */

function PageHeader({ title, description, action }) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">Acadely ERP</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>

      {action && <div className="header-actions">{action}</div>}
    </div>
  );
}

function StatusBadge({
  active,
  trueText = "Active",
  falseText = "Inactive",
}) {
  return (
    <span className={`status-badge ${active ? "success" : "muted"}`}>
      <span className="status-dot" />
      {active ? trueText : falseText}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{Icons.book}</div>
      <strong>No records found</strong>
      <p>{message}</p>
    </div>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <button className="icon-button" onClick={onClose}>
            {Icons.close}
          </button>
        </div>

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

function FormField({ field, value, onChange }) {
  const type = field.type || "text";

  if (type === "checkbox") {
    return (
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label
      className={`form-field ${field.fullWidth ? "full-width" : ""}`}
    >
      <span>
        {field.label}
        {field.required && <b> *</b>}
      </span>

      {type === "select" ? (
        <select
          value={value ?? ""}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
        >
          {!field.required && <option value="">Select...</option>}

          {field.required && field.placeholder && (
            <option value="">{field.placeholder}</option>
          )}

          {field.options?.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value ?? ""}
          required={field.required}
          placeholder={field.placeholder || ""}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function FormActions({
  onCancel,
  loading = false,
  submitText = "Save",
}) {
  return (
    <div className="modal-actions full-width">
      <button
        type="button"
        className="secondary-button"
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </button>

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </button>
    </div>
  );
}

/* =========================================================
   GENERIC CRUD
========================================================= */

function GenericCrudPage({
  title,
  description,
  endpoint,
  idField,
  createLabel = "Add",
  columns,
  fields,
  normalizeForm,
  renderCell,
}) {
  const emptyForm = useMemo(() => {
    const result = {};

    fields.forEach((field) => {
      result[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : "";
    });

    return result;
  }, [fields]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  async function load() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(endpoint);
      setItems(asArray(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [endpoint]);

  useEffect(() => {
    if (!editing && !modalOpen) {
      setForm(emptyForm);
    }
  }, [emptyForm, editing, modalOpen]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    const next = {};

    fields.forEach((field) => {
      let value = item[field.name];

      if (value === null || value === undefined) {
        value =
          field.defaultValue !== undefined ? field.defaultValue : "";
      }

      next[field.name] = value;
    });

    setEditing(item);
    setForm(next);
    setError("");
    setModalOpen(true);
  }

  async function save(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = normalizeForm ? normalizeForm(form) : form;

      if (editing) {
        await apiRequest(`${endpoint}/${editing[idField]}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest(endpoint, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (
      !window.confirm(
        `Delete this ${title.toLowerCase().replace(/s$/, "")}?`
      )
    ) {
      return;
    }

    try {
      await apiRequest(`${endpoint}/${item[idField]}`, {
        method: "DELETE",
      });

      await load();
    } catch (err) {
      window.alert(err.message);
    }
  }

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;

    const query = search.toLowerCase();

    return columns.some((column) =>
      String(item[column.key] ?? "")
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button className="primary-button" onClick={openCreate}>
            {Icons.plus}
            {createLabel}
          </button>
        }
      />

      {error && !modalOpen && <div className="page-error">{error}</div>}

      <div className="content-card">
        <div className="card-toolbar">
          <div className="table-search">
            {Icons.search}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>

          <button className="secondary-button" onClick={load}>
            {Icons.refresh}
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState message={`No ${title.toLowerCase()} available.`} />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item[idField]}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {renderCell
                          ? renderCell(item, column)
                          : displayValue(item[column.key])}
                      </td>
                    ))}

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button"
                          title="Edit"
                          onClick={() => openEdit(item)}
                        >
                          {Icons.edit}
                        </button>

                        <button
                          className="small-icon-button danger"
                          title="Delete"
                          onClick={() => remove(item)}
                        >
                          {Icons.trash}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={editing ? `Edit ${title}` : createLabel}
          subtitle={
            editing
              ? "Update the selected record."
              : "Enter the required information."
          }
          onClose={() => {
            if (!saving) {
              setModalOpen(false);
              setError("");
            }
          }}
        >
          <form className="form-grid" onSubmit={save}>
            {fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    [field.name]: value,
                  }))
                }
              />
            ))}

            {error && (
              <div className="form-error full-width">{error}</div>
            )}

            <FormActions
              onCancel={() => {
                if (!saving) {
                  setModalOpen(false);
                  setError("");
                }
              }}
              loading={saving}
              submitText={editing ? "Save Changes" : "Create"}
            />
          </form>
        </Modal>
      )}
    </>
  );
}

/* =========================================================
   ACADEMIC YEARS
========================================================= */

function AcademicYearsPage() {
  return (
    <GenericCrudPage
      title="Academic Years"
      description="Manage academic years used throughout the ERP."
      endpoint="/api/academic-years"
      idField="academic_year_id"
      createLabel="Add Academic Year"
      columns={[
        { key: "academic_year", label: "Academic Year" },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "is_active", label: "Status" },
      ]}
      fields={[
        {
          name: "academic_year",
          label: "Academic Year",
          required: true,
          placeholder: "2026-27",
        },
        {
          name: "start_date",
          label: "Start Date",
          type: "date",
          required: true,
        },
        {
          name: "end_date",
          label: "End Date",
          type: "date",
          required: true,
        },
        {
          name: "is_active",
          label: "Active",
          type: "checkbox",
          defaultValue: false,
        },
      ]}
      normalizeForm={(form) => ({
        academic_year: form.academic_year,
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: Boolean(form.is_active),
      })}
      renderCell={(item, column) => {
        if (column.key === "start_date") {
          return displayDate(item.start_date);
        }

        if (column.key === "end_date") {
          return displayDate(item.end_date);
        }

        if (column.key === "is_active") {
          return <StatusBadge active={item.is_active} />;
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   DEPARTMENTS
========================================================= */

function DepartmentsPage({ faculty }) {
  return (
    <GenericCrudPage
      title="Departments"
      description="Manage academic departments and their HOD assignment."
      endpoint="/api/departments"
      idField="department_id"
      createLabel="Add Department"
      columns={[
        { key: "department_name", label: "Department" },
        { key: "department_description", label: "Description" },
        { key: "hod_id", label: "HOD" },
      ]}
      fields={[
        {
          name: "department_name",
          label: "Department Name",
          required: true,
        },
        {
          name: "department_description",
          label: "Description",
          fullWidth: true,
        },
        {
          name: "hod_id",
          label: "Head of Department",
          type: "select",
          options: faculty.map((item) => ({
            value: item.faculty_id,
            label: item.faculty_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        department_name: form.department_name,
        department_description:
          form.department_description || null,
        hod_id: idValue(form.hod_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "hod_id") {
          return (
            faculty.find(
              (x) => Number(x.faculty_id) === Number(item.hod_id)
            )?.faculty_name || "Not assigned"
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   SECTIONS
========================================================= */

function SectionsPage() {
  return (
    <GenericCrudPage
      title="Sections"
      description="Manage academic sections."
      endpoint="/api/sections"
      idField="section_id"
      createLabel="Add Section"
      columns={[
        { key: "section_name", label: "Section" },
      ]}
      fields={[
        {
          name: "section_name",
          label: "Section Name",
          required: true,
        },
      ]}
    />
  );
}

/* =========================================================
   PROGRAMS
========================================================= */

function ProgramsPage({ departments, sections }) {
  return (
    <GenericCrudPage
      title="Programs"
      description="Manage academic programs and sanctioned intake."
      endpoint="/api/programs"
      idField="program_id"
      createLabel="Add Program"
      columns={[
        { key: "program_name", label: "Program" },
        { key: "program_level", label: "Level" },
        { key: "program_duration", label: "Duration" },
        { key: "sanction_intake", label: "Intake" },
        { key: "section_id", label: "Section" },
        { key: "department_id", label: "Department" },
      ]}
      fields={[
        {
          name: "program_name",
          label: "Program Name",
          required: true,
          placeholder: "B.Sc. Computer Science",
        },
        {
          name: "section_id",
          label: "Section",
          type: "select",
          required: true,
          options: sections.map((x) => ({
            value: x.section_id,
            label: x.section_name,
          })),
        },
        {
          name: "department_id",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((x) => ({
            value: x.department_id,
            label: x.department_name,
          })),
        },
        {
          name: "program_duration",
          label: "Duration (Years)",
          type: "number",
        },
        {
          name: "program_level",
          label: "Program Level",
          type: "select",
          options: [
            { value: "Undergraduate", label: "Undergraduate" },
            { value: "Postgraduate", label: "Postgraduate" },
            { value: "Diploma", label: "Diploma" },
          ],
        },
        {
          name: "sanction_intake",
          label: "Sanction Intake",
          type: "number",
        },
        {
          name: "sanction_division",
          label: "Sanction Divisions",
          type: "number",
        },
      ]}
      normalizeForm={(form) => ({
        program_name: form.program_name,
        section_id: Number(form.section_id),
        department_id: Number(form.department_id),
        program_duration: idValue(form.program_duration),
        program_level: form.program_level || null,
        sanction_intake: idValue(form.sanction_intake),
        sanction_division: idValue(form.sanction_division),
      })}
      renderCell={(item, column) => {
        if (column.key === "section_id") {
          return (
            sections.find(
              (x) => Number(x.section_id) === Number(item.section_id)
            )?.section_name || item.section_id
          );
        }

        if (column.key === "department_id") {
          return (
            departments.find(
              (x) =>
                Number(x.department_id) === Number(item.department_id)
            )?.department_name || item.department_id
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   CLASSES
========================================================= */

function ClassesPage({ programs, departments }) {
  return (
    <GenericCrudPage
      title="Classes"
      description="Manage classes belonging to academic programs."
      endpoint="/api/classes"
      idField="class_id"
      createLabel="Add Class"
      columns={[
        { key: "class_name", label: "Class" },
        { key: "program_id", label: "Program" },
        { key: "department_id", label: "Department" },
      ]}
      fields={[
        {
          name: "class_name",
          label: "Class Name",
          required: true,
          placeholder: "S.Y. B.Sc. CS",
        },
        {
          name: "program_id",
          label: "Program",
          type: "select",
          required: true,
          options: programs.map((x) => ({
            value: x.program_id,
            label: x.program_name,
          })),
        },
        {
          name: "department_id",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((x) => ({
            value: x.department_id,
            label: x.department_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        class_name: form.class_name,
        program_id: Number(form.program_id),
        department_id: Number(form.department_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "program_id") {
          return (
            programs.find(
              (x) => Number(x.program_id) === Number(item.program_id)
            )?.program_name || item.program_id
          );
        }

        if (column.key === "department_id") {
          return (
            departments.find(
              (x) =>
                Number(x.department_id) === Number(item.department_id)
            )?.department_name || item.department_id
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   DIVISIONS
========================================================= */

function DivisionsPage({
  classes,
  programs,
  sections,
  departments,
}) {
  return (
    <GenericCrudPage
      title="Divisions"
      description="Manage academic divisions used for timetables and allocations."
      endpoint="/api/divisions"
      idField="division_id"
      createLabel="Add Division"
      columns={[
        { key: "division_name", label: "Division" },
        { key: "class_id", label: "Class" },
        { key: "program_id", label: "Program" },
        { key: "section_id", label: "Section" },
        { key: "department_id", label: "Department" },
      ]}
      fields={[
        {
          name: "division_name",
          label: "Division Name",
          required: true,
          placeholder: "A",
        },
        {
          name: "class_id",
          label: "Class",
          type: "select",
          required: true,
          options: classes.map((x) => ({
            value: x.class_id,
            label: x.class_name,
          })),
        },
        {
          name: "program_id",
          label: "Program",
          type: "select",
          required: true,
          options: programs.map((x) => ({
            value: x.program_id,
            label: x.program_name,
          })),
        },
        {
          name: "section_id",
          label: "Section",
          type: "select",
          required: true,
          options: sections.map((x) => ({
            value: x.section_id,
            label: x.section_name,
          })),
        },
        {
          name: "department_id",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((x) => ({
            value: x.department_id,
            label: x.department_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        division_name: form.division_name,
        class_id: Number(form.class_id),
        program_id: Number(form.program_id),
        section_id: Number(form.section_id),
        department_id: Number(form.department_id),
      })}
      renderCell={(item, column) => {
        const maps = {
          class_id: classes,
          program_id: programs,
          section_id: sections,
          department_id: departments,
        };

        const names = {
          class_id: "class_name",
          program_id: "program_name",
          section_id: "section_name",
          department_id: "department_name",
        };

        if (maps[column.key]) {
          return (
            maps[column.key].find(
              (x) => Number(x[column.key]) === Number(item[column.key])
            )?.[names[column.key]] || item[column.key]
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   BATCHES
========================================================= */

function BatchesPage({
  divisions,
  classes,
  programs,
  sections,
  departments,
}) {
  return (
    <GenericCrudPage
      title="Batches"
      description="Manage practical batches within divisions."
      endpoint="/api/batches"
      idField="batch_id"
      createLabel="Add Batch"
      columns={[
        { key: "batch_name", label: "Batch" },
        { key: "division_id", label: "Division" },
        { key: "class_id", label: "Class" },
        { key: "program_id", label: "Program" },
        { key: "section_id", label: "Section" },
      ]}
      fields={[
        {
          name: "batch_name",
          label: "Batch Name",
          required: true,
          placeholder: "A1",
        },
        {
          name: "division_id",
          label: "Division",
          type: "select",
          required: true,
          options: divisions.map((x) => ({
            value: x.division_id,
            label: `Division ${x.division_name}`,
          })),
        },
        {
          name: "class_id",
          label: "Class",
          type: "select",
          required: true,
          options: classes.map((x) => ({
            value: x.class_id,
            label: x.class_name,
          })),
        },
        {
          name: "program_id",
          label: "Program",
          type: "select",
          required: true,
          options: programs.map((x) => ({
            value: x.program_id,
            label: x.program_name,
          })),
        },
        {
          name: "section_id",
          label: "Section",
          type: "select",
          required: true,
          options: sections.map((x) => ({
            value: x.section_id,
            label: x.section_name,
          })),
        },
        {
          name: "department_id",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((x) => ({
            value: x.department_id,
            label: x.department_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        batch_name: form.batch_name,
        division_id: Number(form.division_id),
        class_id: Number(form.class_id),
        program_id: Number(form.program_id),
        section_id: Number(form.section_id),
        department_id: Number(form.department_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "division_id") {
          return (
            divisions.find(
              (x) =>
                Number(x.division_id) === Number(item.division_id)
            )?.division_name || item.division_id
          );
        }

        if (column.key === "class_id") {
          return (
            classes.find(
              (x) => Number(x.class_id) === Number(item.class_id)
            )?.class_name || item.class_id
          );
        }

        if (column.key === "program_id") {
          return (
            programs.find(
              (x) => Number(x.program_id) === Number(item.program_id)
            )?.program_name || item.program_id
          );
        }

        if (column.key === "section_id") {
          return (
            sections.find(
              (x) => Number(x.section_id) === Number(item.section_id)
            )?.section_name || item.section_id
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   COURSES
========================================================= */

function CoursesPage({
  classes,
  programs,
  sections,
  departments,
}) {
  return (
    <GenericCrudPage
      title="Courses"
      description="Manage subjects and their academic structure."
      endpoint="/api/courses"
      idField="course_id"
      createLabel="Add Course"
      columns={[
        { key: "course_name", label: "Course" },
        { key: "course_type", label: "Type" },
        { key: "course_credit", label: "Credits" },
        { key: "weekly_hours", label: "Weekly Hours" },
        { key: "class_id", label: "Class" },
      ]}
      fields={[
        {
          name: "course_name",
          label: "Course Name",
          required: true,
        },
        {
          name: "course_type",
          label: "Course Type",
          type: "select",
          options: [
            { value: "Theory", label: "Theory" },
            { value: "Practical", label: "Practical" },
            {
              value: "Theory + Practical",
              label: "Theory + Practical",
            },
          ],
        },
        {
          name: "course_credit",
          label: "Credits",
          type: "number",
        },
        {
          name: "course_hours",
          label: "Course Hours",
          type: "number",
        },
        {
          name: "weekly_hours",
          label: "Weekly Hours",
          type: "number",
        },
        {
          name: "class_id",
          label: "Class",
          type: "select",
          required: true,
          options: classes.map((x) => ({
            value: x.class_id,
            label: x.class_name,
          })),
        },
        {
          name: "program_id",
          label: "Program",
          type: "select",
          required: true,
          options: programs.map((x) => ({
            value: x.program_id,
            label: x.program_name,
          })),
        },
        {
          name: "section_id",
          label: "Section",
          type: "select",
          required: true,
          options: sections.map((x) => ({
            value: x.section_id,
            label: x.section_name,
          })),
        },
        {
          name: "department_id",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((x) => ({
            value: x.department_id,
            label: x.department_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        course_name: form.course_name,
        course_type: form.course_type || null,
        course_credit: idValue(form.course_credit),
        course_hours: idValue(form.course_hours),
        weekly_hours: idValue(form.weekly_hours),
        class_id: Number(form.class_id),
        program_id: Number(form.program_id),
        section_id: Number(form.section_id),
        department_id: Number(form.department_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "class_id") {
          return (
            classes.find(
              (x) => Number(x.class_id) === Number(item.class_id)
            )?.class_name || item.class_id
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   FACULTY
========================================================= */

function FacultyPage({ departments }) {
  return (
    <GenericCrudPage
      title="Faculty"
      description="Manage faculty members and their department information."
      endpoint="/api/faculty"
      idField="faculty_id"
      createLabel="Add Faculty"
      columns={[
        { key: "faculty_name", label: "Faculty" },
        { key: "faculty_email", label: "Email" },
        { key: "faculty_designation", label: "Designation" },
        { key: "faculty_type", label: "Type" },
        { key: "department_id", label: "Department" },
      ]}
      fields={[
        {
          name: "faculty_name",
          label: "Faculty Name",
          required: true,
        },
        {
          name: "faculty_email",
          label: "Email",
          type: "email",
          required: true,
        },
        {
          name: "faculty_designation",
          label: "Designation",
        },
        {
          name: "faculty_qualification",
          label: "Qualification",
        },
        {
          name: "mobile_number",
          label: "Mobile Number",
        },
        {
          name: "faculty_photo",
          label: "Photo URL",
        },
        {
          name: "faculty_type",
          label: "Faculty Type",
          type: "select",
          options: [
            { value: "Permanent", label: "Permanent" },
            { value: "Contract", label: "Contract" },
            { value: "Visiting", label: "Visiting" },
            { value: "Guest", label: "Guest" },
          ],
        },
        {
          name: "department_id",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((x) => ({
            value: x.department_id,
            label: x.department_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        faculty_name: form.faculty_name,
        faculty_email: form.faculty_email,
        faculty_designation: form.faculty_designation || null,
        faculty_qualification: form.faculty_qualification || null,
        mobile_number: form.mobile_number || null,
        faculty_photo: form.faculty_photo || null,
        faculty_type: form.faculty_type || null,
        department_id: Number(form.department_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "department_id") {
          return (
            departments.find(
              (x) =>
                Number(x.department_id) === Number(item.department_id)
            )?.department_name || item.department_id
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   STUDENTS
========================================================= */

function StudentsPage({
  academicYears,
  programs,
  classes,
  divisions,
  batches,
}) {
  return (
    <GenericCrudPage
      title="Students"
      description="Manage student records and academic placement."
      endpoint="/api/students"
      idField="student_id"
      createLabel="Add Student"
      columns={[
        { key: "student_name", label: "Student" },
        { key: "roll_number", label: "Roll Number" },
        { key: "student_email", label: "Email" },
        { key: "program_id", label: "Program" },
        { key: "class_id", label: "Class" },
        { key: "division_id", label: "Division" },
        { key: "batch_id", label: "Batch" },
      ]}
      fields={[
        {
          name: "student_name",
          label: "Student Name",
          required: true,
        },
        {
          name: "student_email",
          label: "Email",
          type: "email",
        },
        {
          name: "mobile_number",
          label: "Mobile Number",
        },
        {
          name: "roll_number",
          label: "Roll Number",
        },
        {
          name: "academic_year_id",
          label: "Academic Year",
          type: "select",
          required: true,
          options: academicYears.map((x) => ({
            value: x.academic_year_id,
            label: x.academic_year,
          })),
        },
        {
          name: "program_id",
          label: "Program",
          type: "select",
          required: true,
          options: programs.map((x) => ({
            value: x.program_id,
            label: x.program_name,
          })),
        },
        {
          name: "class_id",
          label: "Class",
          type: "select",
          required: true,
          options: classes.map((x) => ({
            value: x.class_id,
            label: x.class_name,
          })),
        },
        {
          name: "division_id",
          label: "Division",
          type: "select",
          required: true,
          options: divisions.map((x) => ({
            value: x.division_id,
            label: `Division ${x.division_name}`,
          })),
        },
        {
          name: "batch_id",
          label: "Batch",
          type: "select",
          options: batches.map((x) => ({
            value: x.batch_id,
            label: x.batch_name,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        student_name: form.student_name,
        student_email: form.student_email || null,
        mobile_number: form.mobile_number || null,
        roll_number: form.roll_number || null,
        academic_year_id: Number(form.academic_year_id),
        program_id: Number(form.program_id),
        class_id: Number(form.class_id),
        division_id: Number(form.division_id),
        batch_id: idValue(form.batch_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "program_id") {
          return (
            programs.find(
              (x) => Number(x.program_id) === Number(item.program_id)
            )?.program_name || item.program_id
          );
        }

        if (column.key === "class_id") {
          return (
            classes.find(
              (x) => Number(x.class_id) === Number(item.class_id)
            )?.class_name || item.class_id
          );
        }

        if (column.key === "division_id") {
          const division = divisions.find(
            (x) =>
              Number(x.division_id) === Number(item.division_id)
          );

          return division
            ? `Division ${division.division_name}`
            : item.division_id;
        }

        if (column.key === "batch_id") {
          return (
            batches.find(
              (x) => Number(x.batch_id) === Number(item.batch_id)
            )?.batch_name || "—"
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   COURSE ALLOCATION
========================================================= */

function CourseAllocationPage({
  courses,
  faculty,
  divisions,
  batches,
  academicYears,
}) {
  return (
    <GenericCrudPage
      title="Course Allocations"
      description="Assign courses to faculty members and divisions."
      endpoint="/api/course-allocations"
      idField="allocation_id"
      createLabel="Add Allocation"
      columns={[
        { key: "course_id", label: "Course" },
        { key: "faculty_id", label: "Faculty" },
        { key: "division_id", label: "Division" },
        { key: "batch_id", label: "Batch" },
        { key: "academic_year_id", label: "Academic Year" },
      ]}
      fields={[
        {
          name: "course_id",
          label: "Course",
          type: "select",
          required: true,
          options: courses.map((x) => ({
            value: x.course_id,
            label: x.course_name,
          })),
        },
        {
          name: "faculty_id",
          label: "Faculty",
          type: "select",
          required: true,
          options: faculty.map((x) => ({
            value: x.faculty_id,
            label: x.faculty_name,
          })),
        },
        {
          name: "division_id",
          label: "Division",
          type: "select",
          required: true,
          options: divisions.map((x) => ({
            value: x.division_id,
            label: `Division ${x.division_name}`,
          })),
        },
        {
          name: "batch_id",
          label: "Batch",
          type: "select",
          options: batches.map((x) => ({
            value: x.batch_id,
            label: x.batch_name,
          })),
        },
        {
          name: "academic_year_id",
          label: "Academic Year",
          type: "select",
          required: true,
          options: academicYears.map((x) => ({
            value: x.academic_year_id,
            label: x.academic_year,
          })),
        },
      ]}
      normalizeForm={(form) => ({
        course_id: Number(form.course_id),
        faculty_id: Number(form.faculty_id),
        division_id: Number(form.division_id),
        batch_id: idValue(form.batch_id),
        academic_year_id: Number(form.academic_year_id),
      })}
      renderCell={(item, column) => {
        if (column.key === "course_id") {
          return (
            courses.find(
              (x) => Number(x.course_id) === Number(item.course_id)
            )?.course_name || item.course_id
          );
        }

        if (column.key === "faculty_id") {
          return (
            faculty.find(
              (x) => Number(x.faculty_id) === Number(item.faculty_id)
            )?.faculty_name || item.faculty_id
          );
        }

        if (column.key === "division_id") {
          const division = divisions.find(
            (x) =>
              Number(x.division_id) === Number(item.division_id)
          );

          return division
            ? `Division ${division.division_name}`
            : item.division_id;
        }

        if (column.key === "batch_id") {
          return (
            batches.find(
              (x) => Number(x.batch_id) === Number(item.batch_id)
            )?.batch_name || "Full Division"
          );
        }

        if (column.key === "academic_year_id") {
          return (
            academicYears.find(
              (x) =>
                Number(x.academic_year_id) ===
                Number(item.academic_year_id)
            )?.academic_year || item.academic_year_id
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   FACULTY AVAILABILITY
========================================================= */

function FacultyAvailabilityPage({ faculty }) {
  return (
    <GenericCrudPage
      title="Faculty Availability"
      description="Define when faculty members are available for timetable scheduling."
      endpoint="/api/faculty-availability"
      idField="availability_id"
      createLabel="Add Availability"
      columns={[
        { key: "faculty_id", label: "Faculty" },
        { key: "day", label: "Day" },
        { key: "start_time", label: "Start" },
        { key: "end_time", label: "End" },
        { key: "is_available", label: "Status" },
      ]}
      fields={[
        {
          name: "faculty_id",
          label: "Faculty",
          type: "select",
          required: true,
          options: faculty.map((x) => ({
            value: x.faculty_id,
            label: x.faculty_name,
          })),
        },
        {
          name: "day",
          label: "Day",
          type: "select",
          required: true,
          options: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => ({
            value: day,
            label: day,
          })),
        },
        {
          name: "start_time",
          label: "Start Time",
          type: "time",
          required: true,
        },
        {
          name: "end_time",
          label: "End Time",
          type: "time",
          required: true,
        },
        {
          name: "is_available",
          label: "Available",
          type: "checkbox",
          defaultValue: true,
        },
      ]}
      normalizeForm={(form) => ({
        faculty_id: Number(form.faculty_id),
        day: form.day,
        start_time: form.start_time,
        end_time: form.end_time,
        is_available: Boolean(form.is_available),
      })}
      renderCell={(item, column) => {
        if (column.key === "faculty_id") {
          return (
            faculty.find(
              (x) => Number(x.faculty_id) === Number(item.faculty_id)
            )?.faculty_name || item.faculty_id
          );
        }

        if (column.key === "start_time") {
          return displayTime(item.start_time);
        }

        if (column.key === "end_time") {
          return displayTime(item.end_time);
        }

        if (column.key === "is_available") {
          return (
            <StatusBadge
              active={item.is_available}
              trueText="Available"
              falseText="Unavailable"
            />
          );
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   FACULTY LEAVES
========================================================= */

function FacultyLeavesPage({ faculty }) {
  return (
    <GenericCrudPage
      title="Faculty Leaves"
      description="Manage faculty leave records used by timetable validation."
      endpoint="/api/faculty-leaves"
      idField="leave_id"
      createLabel="Add Leave"
      columns={[
        { key: "faculty_id", label: "Faculty" },
        { key: "leave_date", label: "Date" },
        { key: "start_time", label: "Start" },
        { key: "end_time", label: "End" },
        { key: "reason", label: "Reason" },
      ]}
      fields={[
        {
          name: "faculty_id",
          label: "Faculty",
          type: "select",
          required: true,
          options: faculty.map((x) => ({
            value: x.faculty_id,
            label: x.faculty_name,
          })),
        },
        {
          name: "leave_date",
          label: "Leave Date",
          type: "date",
          required: true,
        },
        {
          name: "start_time",
          label: "Start Time",
          type: "time",
          required: true,
        },
        {
          name: "end_time",
          label: "End Time",
          type: "time",
          required: true,
        },
        {
          name: "reason",
          label: "Reason",
          fullWidth: true,
        },
      ]}
      normalizeForm={(form) => ({
        faculty_id: Number(form.faculty_id),
        leave_date: form.leave_date,
        start_time: form.start_time,
        end_time: form.end_time,
        reason: form.reason || null,
      })}
      renderCell={(item, column) => {
        if (column.key === "faculty_id") {
          return (
            faculty.find(
              (x) => Number(x.faculty_id) === Number(item.faculty_id)
            )?.faculty_name || item.faculty_id
          );
        }

        if (column.key === "leave_date") {
          return displayDate(item.leave_date);
        }

        if (
          column.key === "start_time" ||
          column.key === "end_time"
        ) {
          return displayTime(item[column.key]);
        }

        return displayValue(item[column.key]);
      }}
    />
  );
}

/* =========================================================
   CLASSROOMS
========================================================= */

function ClassroomsPage() {
  return (
    <GenericCrudPage
      title="Classrooms"
      description="Manage classrooms available for timetable scheduling."
      endpoint="/api/classrooms"
      idField="classroom_id"
      createLabel="Add Classroom"
      columns={[
        { key: "classroom_name", label: "Classroom" },
        { key: "building_name", label: "Building" },
        { key: "capacity", label: "Capacity" },
        { key: "classroom_type", label: "Type" },
      ]}
      fields={[
        {
          name: "classroom_name",
          label: "Classroom Name",
          required: true,
        },
        {
          name: "building_name",
          label: "Building",
        },
        {
          name: "capacity",
          label: "Capacity",
          type: "number",
        },
        {
          name: "classroom_type",
          label: "Classroom Type",
          type: "select",
          options: [
            { value: "Classroom", label: "Classroom" },
            { value: "Seminar Hall", label: "Seminar Hall" },
          ],
        },
      ]}
      normalizeForm={(form) => ({
        classroom_name: form.classroom_name,
        building_name: form.building_name || null,
        capacity: idValue(form.capacity),
        classroom_type: form.classroom_type || null,
      })}
    />
  );
}

/* =========================================================
   LABORATORIES
========================================================= */

function LaboratoriesPage() {
  return (
    <GenericCrudPage
      title="Laboratories"
      description="Manage laboratories available for practical sessions."
      endpoint="/api/laboratories"
      idField="laboratory_id"
      createLabel="Add Laboratory"
      columns={[
        { key: "laboratory_name", label: "Laboratory" },
        { key: "building_name", label: "Building" },
        { key: "capacity", label: "Capacity" },
        { key: "laboratory_type", label: "Type" },
      ]}
      fields={[
        {
          name: "laboratory_name",
          label: "Laboratory Name",
          required: true,
        },
        {
          name: "building_name",
          label: "Building",
        },
        {
          name: "capacity",
          label: "Capacity",
          type: "number",
        },
        {
          name: "laboratory_type",
          label: "Laboratory Type",
        },
      ]}
      normalizeForm={(form) => ({
        laboratory_name: form.laboratory_name,
        building_name: form.building_name || null,
        capacity: idValue(form.capacity),
        laboratory_type: form.laboratory_type || null,
      })}
    />
  );
}

/* =========================================================
   TIME SLOTS
========================================================= */

function TimeSlotsPage() {
  return (
    <GenericCrudPage
      title="Time Slots"
      description="Manage timetable slots used for lectures and practicals."
      endpoint="/api/time-slots"
      idField="time_slot_id"
      createLabel="Add Time Slot"
      columns={[
        { key: "slot_name", label: "Slot" },
        { key: "start_time", label: "Start" },
        { key: "end_time", label: "End" },
        { key: "slot_type", label: "Type" },
      ]}
      fields={[
        {
          name: "slot_name",
          label: "Slot Name",
          required: true,
          placeholder: "09:00 - 10:00",
        },
        {
          name: "start_time",
          label: "Start Time",
          type: "time",
          required: true,
        },
        {
          name: "end_time",
          label: "End Time",
          type: "time",
          required: true,
        },
        {
          name: "slot_type",
          label: "Slot Type",
          type: "select",
          required: true,
          options: [
            { value: "lecture", label: "Lecture" },
            { value: "practical", label: "Practical" },
            { value: "break", label: "Break" },
          ],
        },
      ]}
    />
  );
}

/* =========================================================
   FACULTY APPROVALS
========================================================= */

function FacultyApprovalsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/auth/pending-users");
      setUsers(asArray(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    try {
      await apiRequest(`/api/auth/users/${id}/approve`, {
        method: "PATCH",
      });

      await load();
    } catch (err) {
      window.alert(err.message);
    }
  }

  async function reject(id) {
    if (!window.confirm("Reject this account?")) return;

    try {
      await apiRequest(`/api/auth/users/${id}/reject`, {
        method: "PATCH",
      });

      await load();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <>
      <PageHeader
        title="Faculty Approvals"
        description="Review and approve pending faculty accounts."
        action={
          <button className="secondary-button" onClick={load}>
            {Icons.refresh}
            Refresh
          </button>
        }
      />

      {error && <div className="page-error">{error}</div>}

      <div className="content-card">
        {loading ? (
          <LoadingState />
        ) : users.length === 0 ? (
          <EmptyState message="There are no pending account requests." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Faculty ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td>
                      <strong>{user.username}</strong>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                    <td>{user.faculty_id || "—"}</td>

                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-button"
                          onClick={() => approve(user.user_id)}
                        >
                          {Icons.check}
                          Approve
                        </button>

                        <button
                          className="reject-button"
                          onClick={() => reject(user.user_id)}
                        >
                          {Icons.close}
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* =========================================================
   TIMETABLE
========================================================= */

function TimetablePage({
  academicYears,
  divisions,
  batches,
  courses,
  faculty,
  classrooms,
  laboratories,
  timeSlots,
  allocations,
}) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    academic_year_id: "",
    allocation_id: "",
    day: "Monday",
    time_slot_id: "",
    division_id: "",
    batch_id: "",
    classroom_id: "",
    laboratory_id: "",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  async function loadTimetable() {
    if (!selectedYear || !selectedDivision) {
      setEntries([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        `/api/timetables/division/${selectedDivision}?academic_year_id=${selectedYear}`
      );

      setEntries(asArray(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTimetable();
  }, [selectedYear, selectedDivision]);

  function openCreate() {
    setEditing(null);

    setForm({
      academic_year_id: selectedYear,
      allocation_id: "",
      day: "Monday",
      time_slot_id: "",
      division_id: selectedDivision,
      batch_id: "",
      classroom_id: "",
      laboratory_id: "",
    });

    setError("");
    setModalOpen(true);
  }

  function openEdit(entry) {
    setEditing(entry);

    setForm({
      academic_year_id: entry.academic_year_id,
      allocation_id: entry.allocation_id,
      day: entry.day,
      time_slot_id: entry.time_slot_id,
      division_id: entry.division_id,
      batch_id: entry.batch_id || "",
      classroom_id: entry.classroom_id || "",
      laboratory_id: entry.laboratory_id || "",
    });

    setError("");
    setModalOpen(true);
  }

  const selectedAllocation = allocations.find(
    (x) =>
      Number(x.allocation_id) === Number(form.allocation_id)
  );

  const selectedCourse = courses.find(
    (x) =>
      Number(x.course_id) === Number(selectedAllocation?.course_id)
  );

  const isPractical = String(
    selectedCourse?.course_type || ""
  )
    .toLowerCase()
    .includes("practical");

  const filteredAllocations = allocations.filter(
    (allocation) =>
      Number(allocation.academic_year_id) ===
        Number(form.academic_year_id) &&
      Number(allocation.division_id) === Number(form.division_id)
  );

  const filteredBatches = batches.filter(
    (batch) =>
      Number(batch.division_id) === Number(form.division_id)
  );

  const filteredSlots = timeSlots
    .filter((slot) => {
      if (slot.slot_type === "break") return false;

      if (!selectedCourse) return true;

      if (isPractical) {
        return slot.slot_type === "practical";
      }

      return slot.slot_type === "lecture";
    })
    .sort((a, b) =>
      String(a.start_time).localeCompare(String(b.start_time))
    );

  function selectAllocation(value) {
    const allocation = allocations.find(
      (x) => Number(x.allocation_id) === Number(value)
    );

    const course = courses.find(
      (x) => Number(x.course_id) === Number(allocation?.course_id)
    );

    const practical = String(course?.course_type || "")
      .toLowerCase()
      .includes("practical");

    setForm((current) => ({
      ...current,
      allocation_id: value,
      time_slot_id: "",
      classroom_id: practical ? "" : current.classroom_id,
      laboratory_id: practical ? current.laboratory_id : "",
    }));
  }

  async function saveTimetable(e) {
    e.preventDefault();

    if (!form.classroom_id && !form.laboratory_id) {
      setError("Select either a classroom or laboratory.");
      return;
    }

    if (form.classroom_id && form.laboratory_id) {
      setError(
        "Select only one resource: classroom OR laboratory."
      );
      return;
    }

    try {
      setError("");

      const payload = {
        academic_year_id: Number(form.academic_year_id),
        allocation_id: Number(form.allocation_id),
        day: form.day,
        time_slot_id: Number(form.time_slot_id),
        division_id: Number(form.division_id),
        batch_id: form.batch_id
          ? Number(form.batch_id)
          : null,
        classroom_id: form.classroom_id
          ? Number(form.classroom_id)
          : null,
        laboratory_id: form.laboratory_id
          ? Number(form.laboratory_id)
          : null,
      };

      if (editing) {
        await apiRequest(
          `/api/timetables/${editing.timetable_id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        await apiRequest("/api/timetables", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      await loadTimetable();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteEntry(id) {
    if (!window.confirm("Delete this timetable entry?")) {
      return;
    }

    try {
      await apiRequest(`/api/timetables/${id}`, {
        method: "DELETE",
      });

      await loadTimetable();
    } catch (err) {
      window.alert(err.message);
    }
  }

  async function generateTimetable() {
    if (!selectedYear) {
      window.alert("Select an academic year first.");
      return;
    }

    try {
      setGenerating(true);

      const data = await apiRequest("/api/timetables/generate", {
        method: "POST",
        body: JSON.stringify({
          academic_year_id: Number(selectedYear),
          days,
        }),
      });

      window.alert(
        `Timetable generation completed.\n\nCreated: ${
          data.created_count ?? 0
        }\nSkipped: ${data.skipped_count ?? 0}`
      );

      await loadTimetable();
    } catch (err) {
      window.alert(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const slots = [...timeSlots].sort((a, b) =>
    String(a.start_time).localeCompare(String(b.start_time))
  );

  function getEntry(day, slotId) {
    return entries.filter(
      (entry) =>
        entry.day === day &&
        Number(entry.time_slot_id) === Number(slotId)
    );
  }

  return (
    <>
      <PageHeader
        title="Timetable"
        description="View, generate and manually manage division timetables."
        action={
          <>
            <button
              className="secondary-button"
              onClick={generateTimetable}
              disabled={generating}
            >
              {Icons.refresh}
              {generating ? "Generating..." : "Generate"}
            </button>

            <button
              className="primary-button"
              onClick={openCreate}
              disabled={!selectedYear || !selectedDivision}
            >
              {Icons.plus}
              Add Entry
            </button>
          </>
        }
      />

      {error && !modalOpen && (
        <div className="page-error">{error}</div>
      )}

      <div className="filter-card">
        <label>
          <span>Academic Year</span>

          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedDivision("");
              setEntries([]);
            }}
          >
            <option value="">Select academic year</option>

            {academicYears.map((year) => (
              <option
                key={year.academic_year_id}
                value={year.academic_year_id}
              >
                {year.academic_year}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Division</span>

          <select
            value={selectedDivision}
            onChange={(e) =>
              setSelectedDivision(e.target.value)
            }
          >
            <option value="">Select division</option>

            {divisions.map((division) => (
              <option
                key={division.division_id}
                value={division.division_id}
              >
                Division {division.division_name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="content-card timetable-card">
        {!selectedYear || !selectedDivision ? (
          <EmptyState message="Select an academic year and division to view the timetable." />
        ) : loading ? (
          <LoadingState />
        ) : (
          <div className="timetable-wrapper">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>Time</th>

                  {days.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.time_slot_id}>
                    <td className="time-cell">
                      <strong>{slot.slot_name}</strong>

                      <small>
                        {displayTime(slot.start_time)} -{" "}
                        {displayTime(slot.end_time)}
                      </small>
                    </td>

                    {days.map((day) => {
                      const cellEntries = getEntry(
                        day,
                        slot.time_slot_id
                      );

                      return (
                        <td
                          key={`${day}-${slot.time_slot_id}`}
                        >
                          {cellEntries.length === 0 ? (
                            <span className="free-cell">
                              Free
                            </span>
                          ) : (
                            <div className="timetable-cell-list">
                              {cellEntries.map((entry) => (
                                <div
                                  className="timetable-entry"
                                  key={entry.timetable_id}
                                >
                                  <strong>
                                    {entry.course_name}
                                  </strong>

                                  <span>
                                    {entry.faculty_name ||
                                      "Faculty"}
                                  </span>

                                  <span>
                                    {entry.batch_name
                                      ? `Batch ${entry.batch_name}`
                                      : "Full Division"}
                                  </span>

                                  <span>
                                    {entry.classroom_name ||
                                      entry.laboratory_name ||
                                      "Resource"}
                                  </span>

                                  <div className="entry-actions">
                                    <button
                                      onClick={() =>
                                        openEdit(entry)
                                      }
                                      title="Edit"
                                    >
                                      {Icons.edit}
                                    </button>

                                    <button
                                      onClick={() =>
                                        deleteEntry(
                                          entry.timetable_id
                                        )
                                      }
                                      title="Delete"
                                    >
                                      {Icons.trash}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={
            editing
              ? "Edit Timetable Entry"
              : "Add Timetable Entry"
          }
          subtitle="The backend validates faculty, resource and division conflicts."
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
        >
          <form className="form-grid" onSubmit={saveTimetable}>
            <FormField
              field={{
                name: "academic_year_id",
                label: "Academic Year",
                type: "select",
                required: true,
                options: academicYears.map((x) => ({
                  value: x.academic_year_id,
                  label: x.academic_year,
                })),
              }}
              value={form.academic_year_id}
              onChange={(value) =>
                setForm((f) => ({
                  ...f,
                  academic_year_id: value,
                  allocation_id: "",
                  time_slot_id: "",
                }))
              }
            />

            <FormField
              field={{
                name: "division_id",
                label: "Division",
                type: "select",
                required: true,
                options: divisions.map((x) => ({
                  value: x.division_id,
                  label: `Division ${x.division_name}`,
                })),
              }}
              value={form.division_id}
              onChange={(value) =>
                setForm((f) => ({
                  ...f,
                  division_id: value,
                  allocation_id: "",
                  batch_id: "",
                  time_slot_id: "",
                }))
              }
            />

            <FormField
              field={{
                name: "allocation_id",
                label: "Course Allocation",
                type: "select",
                required: true,
                options: filteredAllocations.map((x) => {
                  const course = courses.find(
                    (c) =>
                      Number(c.course_id) === Number(x.course_id)
                  );

                  const teacher = faculty.find(
                    (f) =>
                      Number(f.faculty_id) ===
                      Number(x.faculty_id)
                  );

                  return {
                    value: x.allocation_id,
                    label: `${course?.course_name || x.course_id} — ${
                      teacher?.faculty_name || x.faculty_id
                    }`,
                  };
                }),
              }}
              value={form.allocation_id}
              onChange={selectAllocation}
            />

            <FormField
              field={{
                name: "day",
                label: "Day",
                type: "select",
                required: true,
                options: days.map((day) => ({
                  value: day,
                  label: day,
                })),
              }}
              value={form.day}
              onChange={(value) =>
                setForm((f) => ({ ...f, day: value }))
              }
            />

            <FormField
              field={{
                name: "time_slot_id",
                label: "Time Slot",
                type: "select",
                required: true,
                options: filteredSlots.map((x) => ({
                  value: x.time_slot_id,
                  label: `${x.slot_name} (${x.slot_type})`,
                })),
              }}
              value={form.time_slot_id}
              onChange={(value) =>
                setForm((f) => ({
                  ...f,
                  time_slot_id: value,
                }))
              }
            />

            <FormField
              field={{
                name: "batch_id",
                label: "Batch",
                type: "select",
                options: filteredBatches.map((x) => ({
                  value: x.batch_id,
                  label: x.batch_name,
                })),
              }}
              value={form.batch_id}
              onChange={(value) =>
                setForm((f) => ({
                  ...f,
                  batch_id: value,
                }))
              }
            />

            {!isPractical && (
              <FormField
                field={{
                  name: "classroom_id",
                  label: "Classroom",
                  type: "select",
                  options: classrooms.map((x) => ({
                    value: x.classroom_id,
                    label: x.classroom_name,
                  })),
                }}
                value={form.classroom_id}
                onChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    classroom_id: value,
                    laboratory_id: "",
                  }))
                }
              />
            )}

            {isPractical && (
              <FormField
                field={{
                  name: "laboratory_id",
                  label: "Laboratory",
                  type: "select",
                  options: laboratories.map((x) => ({
                    value: x.laboratory_id,
                    label: x.laboratory_name,
                  })),
                }}
                value={form.laboratory_id}
                onChange={(value) =>
                  setForm((f) => ({
                    ...f,
                    laboratory_id: value,
                    classroom_id: "",
                  }))
                }
              />
            )}

            {error && (
              <div className="form-error full-width">
                {error}
              </div>
            )}

            <FormActions
              onCancel={() => {
                setModalOpen(false);
                setError("");
              }}
              submitText={editing ? "Save Changes" : "Create Entry"}
            />
          </form>
        </Modal>
      )}
    </>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ user, onNavigate }) {
  const [stats, setStats] = useState({
    faculty: 0,
    students: 0,
    courses: 0,
    divisions: 0,
    pending: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const results = await Promise.allSettled([
          apiRequest("/api/faculty"),
          apiRequest("/api/students"),
          apiRequest("/api/courses"),
          apiRequest("/api/divisions"),
          apiRequest("/api/auth/pending-users"),
        ]);

        setStats({
          faculty:
            results[0].status === "fulfilled"
              ? asArray(results[0].value).length
              : 0,
          students:
            results[1].status === "fulfilled"
              ? asArray(results[1].value).length
              : 0,
          courses:
            results[2].status === "fulfilled"
              ? asArray(results[2].value).length
              : 0,
          divisions:
            results[3].status === "fulfilled"
              ? asArray(results[3].value).length
              : 0,
          pending:
            results[4].status === "fulfilled"
              ? asArray(results[4].value).length
              : 0,
        });
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <>
      <div className="welcome-section">
        <div>
          <span className="eyebrow">Department overview · {new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</span>
          <h1>Good to see you, {user?.username || "HOD"}.</h1>
          <p>
            Your department at a glance. Keep academic planning, people and
            resources moving from one workspace.
          </p>
        </div>

        <div className="welcome-date">
          <span>Workspace status</span>
          <strong><i className="workspace-live-dot" />Academic operations</strong>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Faculty"
          value={loading ? "—" : stats.faculty}
          icon={Icons.users}
          text="Faculty members"
        />
        <StatCard
          title="Students"
          value={loading ? "—" : stats.students}
          icon={Icons.student}
          text="Student records"
        />
        <StatCard
          title="Courses"
          value={loading ? "—" : stats.courses}
          icon={Icons.book}
          text="Academic courses"
        />
        <StatCard
          title="Divisions"
          value={loading ? "—" : stats.divisions}
          icon={Icons.academic}
          text="Academic divisions"
        />
      </div>

      <div className="dashboard-grid">
        <div className="content-card">
          <div className="card-heading">
            <div>
              <h2>Academic Planning</h2>
              <p>Manage the main academic workflow.</p>
            </div>
          </div>

          <div className="planning-list">
            <PlanningRow
              number="01"
              title="Academic Structure"
              text="Academic years, programs, classes, divisions and batches"
            />
            <PlanningRow
              number="02"
              title="Course Management"
              text="Courses, faculty assignments and course allocations"
            />
            <PlanningRow
              number="03"
              title="Timetable Planning"
              text="Create, review and adjust academic schedules"
            />
            <PlanningRow
              number="04"
              title="Faculty Operations"
              text="Approvals, availability and leave requests"
            />
          </div>
          <div className="dashboard-actions">
            <button className="dashboard-action" onClick={() => onNavigate("academic-years")}>
              <span className="dashboard-action-icon">{Icons.calendar}</span>
              <span><strong>Academic years</strong><small>Set up your term structure</small></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
            <button className="dashboard-action" onClick={() => onNavigate("timetable")}>
              <span className="dashboard-action-icon">{Icons.clock}</span>
              <span><strong>Open timetable</strong><small>Build and review schedules</small></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
          </div>
        </div>

        <div className="content-card">
          <div className="card-heading">
            <div>
              <h2>Pending Actions</h2>
              <p>Items requiring HOD attention.</p>
            </div>
          </div>

          <div className="planning-list">
            <PlanningRow
              number="01"
              title="Faculty approvals"
              text={`${loading ? "—" : stats.pending} pending account request${stats.pending === 1 ? "" : "s"}`}
            />
            <button className="planning-row planning-row-button" onClick={() => onNavigate("course-allocation")}>
              <span className="planning-number">02</span>
              <span className="planning-row-copy"><strong>Course allocation</strong><span>Review faculty and course assignments</span></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
            <button className="planning-row planning-row-button" onClick={() => onNavigate("timetable")}>
              <span className="planning-number">03</span>
              <span className="planning-row-copy"><strong>Timetable</strong><span>Review the current academic schedule</span></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, text }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function PlanningRow({ number, title, text }) {
  return (
    <div className="planning-row">
      <span className="planning-number">{number}</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Review your Acadely department workspace and access information."
      />

      <div className="content-card settings-panel">
        <div className="settings-row">
          <div>
            <strong>Application</strong>
            <p>Acadely Academic ERP</p>
          </div>
          <span className="role-badge">ACADEMIC ERP</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Department</strong>
            <p>Computer Science</p>
          </div>
          <span className="role-badge">CS</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Access level</strong>
            <p>Head of Department</p>
          </div>
          <span className="role-badge">HOD</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Academic planning</strong>
            <p>Manage structure, courses, faculty, resources and timetables.</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   LOGIN
========================================================= */

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = data?.token || data?.access_token;
      const user = data?.user || data;

      if (!token) {
        throw new Error("Login token was not returned by the server.");
      }

      const nextRole = String(user?.role || "").toUpperCase();

      if (!["HOD", "FACULTY", "STUDENT"].includes(nextRole)) {
        throw new Error("Invalid account role returned by the server.");
      }

      localStorage.setItem("acadely_token", token);
      localStorage.setItem("acadely_user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>Acadely</strong>
            <span>Academic ERP</span>
          </div>
        </div>

        <div className="login-brand-content">
          <span className="eyebrow">Acadely Portal</span>
          <h1>Academic planning, organised.</h1>
          <p>
            A single workspace for HODs, faculty and students to manage
            academic structure, timetables, resources and department activity.
          </p>
        </div>

        <div className="login-footer">
          Acadely Academic Planning System
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="mobile-brand">
            <div className="brand-mark">A</div>
            <div>
              <strong>Acadely</strong>
              <span>Academic ERP</span>
            </div>
          </div>

          <span className="eyebrow">Sign in</span>
          <h2>Welcome back</h2>
          <p className="login-description">
            Use your authorised Acadely account to continue.
          </p>

          <form onSubmit={submit}>
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   FACULTY OVERVIEW PAGE
========================================================= */

function FacultyOverviewPage({
  user,
  allocations = [],
  availability = [],
  leaves = [],
  courses = [],
  divisions = [],
  loading = false,
}) {
  const safeAllocations = Array.isArray(allocations) ? allocations : [];
  const safeAvailability = Array.isArray(availability) ? availability : [];
  const safeLeaves = Array.isArray(leaves) ? leaves : [];
  const safeCourses = Array.isArray(courses) ? courses : [];
  const safeDivisions = Array.isArray(divisions) ? divisions : [];

  const availableCount = safeAvailability.filter(
    (item) => item?.is_available
  ).length;

  const weeklyHours = safeAllocations.reduce((total, allocation) => {
    const course = safeCourses.find(
      (item) =>
        Number(item?.course_id) === Number(allocation?.course_id)
    );

    return total + Number(course?.weekly_hours || 0);
  }, 0);

  function getCourse(courseId) {
    return safeCourses.find(
      (item) => Number(item?.course_id) === Number(courseId)
    );
  }

  function getCourseName(courseId) {
    const course = getCourse(courseId);
    return course?.course_name || "Course";
  }

  function getCourseCode(courseId) {
    const course = getCourse(courseId);

    return (
      course?.course_code ||
      course?.code ||
      String(courseId || "—")
    );
  }

  function getDivisionName(divisionId) {
    const division = safeDivisions.find(
      (item) =>
        Number(item?.division_id) === Number(divisionId)
    );

    return division?.division_name || "Division";
  }

  function navigateFaculty(page) {
    window.dispatchEvent(
      new CustomEvent("faculty-nav", {
        detail: page,
      })
    );
  }

  return (
    <>
      {/* =====================================================
          WELCOME SECTION
      ===================================================== */}

      <div className="welcome-section">
        <div>
          <span className="eyebrow">
            Faculty workspace ·{" "}
            {new Intl.DateTimeFormat("en", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }).format(new Date())}
          </span>

          <h1>
            Welcome, {user?.username || "Faculty"}.
          </h1>

          <p>
            Manage your teaching assignments, availability,
            timetable and leave requests from one place.
          </p>
        </div>

        <div className="welcome-date">
          <span>Role</span>

          <strong>
            <i className="workspace-live-dot" />
            Faculty
          </strong>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="stats-grid">

        <StatCard
          title="My Courses"
          value={
            loading
              ? "—"
              : safeAllocations.length
          }
          icon={Icons.academic}
          text="Assigned courses"
        />

        <StatCard
          title="Weekly Workload"
          value={
            loading
              ? "—"
              : `${weeklyHours} hrs`
          }
          icon={Icons.clock}
          text="Teaching hours"
        />

        <StatCard
          title="Availability"
          value={
            loading
              ? "—"
              : availableCount
          }
          icon={Icons.clock}
          text="Available slots"
        />

        <StatCard
          title="Leave Requests"
          value={
            loading
              ? "—"
              : safeLeaves.length
          }
          icon={Icons.calendar}
          text="Leave records"
        />

      </div>

      {/* =====================================================
          MAIN DASHBOARD GRID
      ===================================================== */}

      <div className="dashboard-grid">

        {/* =================================================
            MY COURSES
        ================================================= */}

        <div className="content-card">

          <div className="card-heading">
            <div>
              <h2>My Courses</h2>

              <p>
                Courses currently assigned to you.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => navigateFaculty("courses")}
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading your courses...
            </div>
          ) : safeAllocations.length === 0 ? (
            <div className="empty-state">
              <strong>No courses assigned</strong>

              <p>
                Your assigned courses will appear here
                once the HOD allocates them.
              </p>
            </div>
          ) : (
            <div className="planning-list">

              {safeAllocations
                .slice(0, 5)
                .map((allocation) => {
                  const course = getCourse(
                    allocation?.course_id
                  );

                  return (
                    <div
                      key={
                        allocation?.allocation_id ||
                        `${allocation?.course_id}-${allocation?.division_id}`
                      }
                      className="planning-row"
                    >

                      <span className="planning-number">
                        {getCourseCode(
                          allocation?.course_id
                        )}
                      </span>

                      <span className="planning-row-copy">
                        <strong>
                          {getCourseName(
                            allocation?.course_id
                          )}
                        </strong>

                        <span>
                          {getDivisionName(
                            allocation?.division_id
                          )}
                        </span>
                      </span>

                      <span className="course-hours">
                        {course?.weekly_hours || 0} hrs/week
                      </span>

                    </div>
                  );
                })}

            </div>
          )}

        </div>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="content-card">

          <div className="card-heading">
            <div>
              <h2>Quick Actions</h2>

              <p>
                Common faculty actions.
              </p>
            </div>
          </div>

          <div className="planning-list">

            <button
              className="planning-row planning-row-button"
              onClick={() => navigateFaculty("courses")}
            >
              <span className="planning-number">
                A
              </span>

              <span className="planning-row-copy">
                <strong>
                  My Courses
                </strong>

                <span>
                  Review your teaching assignments
                </span>
              </span>

              <span className="dashboard-action-arrow">
                →
              </span>
            </button>

            <button
              className="planning-row planning-row-button"
              onClick={() =>
                navigateFaculty("availability")
              }
            >
              <span className="planning-number">
                B
              </span>

              <span className="planning-row-copy">
                <strong>
                  Availability
                </strong>

                <span>
                  Update your available time slots
                </span>
              </span>

              <span className="dashboard-action-arrow">
                →
              </span>
            </button>

            <button
              className="planning-row planning-row-button"
              onClick={() =>
                navigateFaculty("timetable")
              }
            >
              <span className="planning-number">
                C
              </span>

              <span className="planning-row-copy">
                <strong>
                  Timetable
                </strong>

                <span>
                  Review your teaching schedule
                </span>
              </span>

              <span className="dashboard-action-arrow">
                →
              </span>
            </button>

            <button
              className="planning-row planning-row-button"
              onClick={() =>
                navigateFaculty("leaves")
              }
            >
              <span className="planning-number">
                D
              </span>

              <span className="planning-row-copy">
                <strong>
                  Leave Requests
                </strong>

                <span>
                  Submit and track your leaves
                </span>
              </span>

              <span className="dashboard-action-arrow">
                →
              </span>
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          FACULTY WORKFLOW
      ===================================================== */}

      <div className="content-card faculty-workflow-card">

        <div className="card-heading">

          <div>
            <h2>Faculty Workflow</h2>

            <p>
              Keep your academic work organised.
            </p>
          </div>

        </div>

        <div className="planning-list">

          <PlanningRow
            number="01"
            title="Course allocation"
            text="Review the courses and divisions assigned to you."
          />

          <PlanningRow
            number="02"
            title="Faculty availability"
            text="Keep your available teaching slots updated."
          />

          <PlanningRow
            number="03"
            title="Timetable"
            text="Check when and where your classes are scheduled."
          />

          <PlanningRow
            number="04"
            title="Leave requests"
            text="Submit and track your leave schedules."
          />

        </div>

      </div>
    </>
  );
}


/* =========================================================
   FACULTY PROFILE PAGE
========================================================= */

function FacultyProfilePage({ user }) {
  return (
    <>
      <PageHeader
        title="My Profile"
        description="Your faculty account and details."
      />

      <div className="content-card settings-panel">

        <div className="settings-row">
          <div>
            <strong>Full name</strong>
            <p>
              {user?.username || "Faculty member"}
            </p>
          </div>

          <span className="role-badge">
            FACULTY
          </span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Email</strong>

            <p>
              {user?.email || "Not available"}
            </p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>Faculty ID</strong>

            <p>
              {user?.faculty_id || "Not assigned"}
            </p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>Access type</strong>

            <p>
              Faculty dashboard
            </p>
          </div>
        </div>

      </div>
    </>
  );
}


/* =========================================================
   FACULTY DASHBOARD
========================================================= */

function FacultyDashboard({ user, onLogout }) {

  const [activePage, setActivePage] =
    useState("dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [globalSearch, setGlobalSearch] =
    useState("");

  const [academicYears, setAcademicYears] =
    useState([]);

  const [divisions, setDivisions] =
    useState([]);

  const [batches, setBatches] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [faculty, setFaculty] =
    useState([]);

  const [classrooms, setClassrooms] =
    useState([]);

  const [laboratories, setLaboratories] =
    useState([]);

  const [timeSlots, setTimeSlots] =
    useState([]);

  const [allocations, setAllocations] =
    useState([]);

  const [availability, setAvailability] =
    useState([]);

  const [leaves, setLeaves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* =====================================================
     LOAD FACULTY DATA
  ===================================================== */

  async function loadFacultyData() {

    try {

      setLoading(true);

      const results = await Promise.all([
        apiRequest("/api/academic-years"),
        apiRequest("/api/divisions"),
        apiRequest("/api/batches"),
        apiRequest("/api/courses"),
        apiRequest("/api/faculty"),
        apiRequest("/api/classrooms"),
        apiRequest("/api/laboratories"),
        apiRequest("/api/time-slots"),
        apiRequest("/api/course-allocations"),
        apiRequest("/api/faculty-availability"),
        apiRequest("/api/faculty-leaves"),
      ]);

      setAcademicYears(
        asArray(results[0])
      );

      setDivisions(
        asArray(results[1])
      );

      setBatches(
        asArray(results[2])
      );

      setCourses(
        asArray(results[3])
      );

      setFaculty(
        asArray(results[4])
      );

      setClassrooms(
        asArray(results[5])
      );

      setLaboratories(
        asArray(results[6])
      );

      setTimeSlots(
        asArray(results[7])
      );

      setAllocations(
        asArray(results[8])
      );

      setAvailability(
        asArray(results[9])
      );

      setLeaves(
        asArray(results[10])
      );

    } catch (error) {

      console.error(
        "Failed to load faculty dashboard data:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadFacultyData();

  }, [user?.faculty_id]);


  /* =====================================================
     FACULTY NAVIGATION EVENT
  ===================================================== */

  useEffect(() => {

    const handler = (event) => {

      if (event?.detail) {
        setActivePage(event.detail);
      }

    };

    window.addEventListener(
      "faculty-nav",
      handler
    );

    return () => {

      window.removeEventListener(
        "faculty-nav",
        handler
      );

    };

  }, []);


  /* =====================================================
     SIDEBAR NAVIGATION
  ===================================================== */

  const facultyNavigation = [

    {
      title: "Overview",

      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          icon: Icons.dashboard,
        },
      ],
    },

    {
      title: "Academic",

      items: [
        {
          key: "courses",
          label: "My Courses",
          icon: Icons.book,
        },

        {
          key: "timetable",
          label: "Timetable",
          icon: Icons.calendar,
        },
      ],
    },

    {
      title: "Faculty",

      items: [
        {
          key: "availability",
          label: "Availability",
          icon: Icons.clock,
        },

        {
          key: "leaves",
          label: "Leave Requests",
          icon: Icons.calendar,
        },

        {
          key: "profile",
          label: "My Profile",
          icon: Icons.users,
        },
      ],
    },

  ];


  /* =====================================================
     CURRENT PAGE LABEL
  ===================================================== */

  const currentLabel =
    facultyNavigation
      .flatMap((group) => group.items)
      .find(
        (item) =>
          item.key === activePage
      )?.label || "Dashboard";


  /* =====================================================
     RENDER PAGE
  ===================================================== */

  function renderPage() {

    const facultyProfile =
      faculty.find(
        (member) =>
          Number(member?.faculty_id) ===
          Number(user?.faculty_id)
      ) || {
        faculty_id: user?.faculty_id,
        faculty_name:
          user?.username || "Faculty",
        faculty_email:
          user?.email || "",
      };


    const myAllocations =
      allocations.filter(
        (allocation) =>
          Number(allocation?.faculty_id) ===
          Number(user?.faculty_id)
      );


    const myAvailability =
      availability.filter(
        (slot) =>
          Number(slot?.faculty_id) ===
          Number(user?.faculty_id)
      );


    const myLeaves =
      leaves.filter(
        (item) =>
          Number(item?.faculty_id) ===
          Number(user?.faculty_id)
      );


    switch (activePage) {

      /* =================================================
         DASHBOARD
      ================================================= */

      case "dashboard":

        return (
          <FacultyOverviewPage
            user={user}
            allocations={myAllocations}
            availability={myAvailability}
            leaves={myLeaves}
            courses={courses}
            divisions={divisions}
            loading={loading}
          />
        );


      /* =================================================
         MY COURSES
      ================================================= */

      case "courses":

        return (
          <CourseAllocationPage
            courses={courses}
            faculty={
              facultyProfile
                ? [facultyProfile]
                : []
            }
            divisions={divisions}
            batches={batches}
            academicYears={academicYears}
          />
        );


      /* =================================================
         AVAILABILITY
      ================================================= */

      case "availability":

        return (
          <FacultyAvailabilityPage
            faculty={
              facultyProfile
                ? [facultyProfile]
                : []
            }
          />
        );


      /* =================================================
         LEAVE REQUESTS
      ================================================= */

      case "leaves":

        return (
          <FacultyLeavesPage
            faculty={
              facultyProfile
                ? [facultyProfile]
                : []
            }
          />
        );


      /* =================================================
         TIMETABLE
      ================================================= */

      case "timetable":

        return (
          <TimetablePage
            academicYears={academicYears}
            divisions={divisions}
            batches={batches}
            courses={courses}
            faculty={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            timeSlots={timeSlots}
            allocations={allocations}
          />
        );


      /* =================================================
         PROFILE
      ================================================= */

      case "profile":

        return (
          <FacultyProfilePage
            user={user}
          />
        );


      /* =================================================
         DEFAULT
      ================================================= */

      default:

        return (
          <FacultyOverviewPage
            user={user}
            allocations={myAllocations}
            availability={myAvailability}
            leaves={myLeaves}
            courses={courses}
            divisions={divisions}
            loading={loading}
          />
        );
    }
  }


  /* =====================================================
     DASHBOARD UI
  ===================================================== */

  return (

    <div className="erp-layout">

      {/* =================================================
          MOBILE SIDEBAR OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="sidebar-brand">

          <div className="brand-mark">
            A
          </div>

          <div>
            <strong>
              Acadely
            </strong>

            <span>
              Faculty Portal
            </span>
          </div>

        </div>


        {/* NAVIGATION */}

        <div className="sidebar-scroll">

          {facultyNavigation.map(
            (group) => (

              <div
                className="nav-group"
                key={group.title}
              >

                <div className="nav-group-title">
                  {group.title}
                </div>

                {group.items.map(
                  (item) => (

                    <button
                      key={item.key}
                      className={`nav-item ${
                        activePage === item.key
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {

                        setActivePage(
                          item.key
                        );

                        setSidebarOpen(
                          false
                        );

                      }}
                    >

                      <span className="nav-icon">
                        {item.icon}
                      </span>

                      <span>
                        {item.label}
                      </span>

                    </button>

                  )
                )}

              </div>

            )
          )}

        </div>


        {/* =================================================
            SIDEBAR USER
        ================================================= */}

        <div className="sidebar-user">

          <div className="avatar">
            {(
              user?.username || "F"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="sidebar-user-info">

            <strong>
              {user?.username || "Faculty"}
            </strong>

            <span>
              Faculty
            </span>

          </div>

          <button
            className="logout-button"
            onClick={onLogout}
            title="Logout"
          >
            {Icons.logout}
          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN AREA
      ================================================= */}

      <main className="main-area">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="mobile-menu-button"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              {Icons.menu}
            </button>

            <div className="breadcrumbs">

              <span>
                Acadely
              </span>

              <b>
                /
              </b>

              <strong>
                {currentLabel}
              </strong>

            </div>

          </div>


          {/* =================================================
              TOPBAR RIGHT
          ================================================= */}

          <div className="topbar-right">

            <div className="topbar-search">

              {Icons.search}

              <input
                value={globalSearch}
                onChange={(event) =>
                  setGlobalSearch(
                    event.target.value
                  )
                }
                placeholder="Search..."
              />

            </div>


            <button
              className="notification-button"
              title="Notifications"
            >
              {Icons.bell}
              <span />
            </button>


            <div className="topbar-profile">

              <div className="avatar">

                {(
                  user?.username || "F"
                )
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <strong>
                  {user?.username || "Faculty"}
                </strong>

                <span>
                  Faculty
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="page-content">

          {renderPage()}

        </section>

      </main>

    </div>
  );
}

/* =========================================================
   STUDENT DASHBOARD SHELL
========================================================= */

function StudentOverviewPage({ user, student, loading }) {
  return (
    <>
      <div className="welcome-section">
        <div>
          <span className="eyebrow">Student workspace · {new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</span>
          <h1>Hello, {user?.username || "Student"}.</h1>
          <p>
            Track your academic progress, timetable and study workflow from this student portal.
          </p>
        </div>

        <div className="welcome-date">
          <span>Student</span>
          <strong><i className="workspace-live-dot" />Portal</strong>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="Roll Number" value={loading ? "—" : student?.roll_number || "—"} icon={Icons.student} text="Student record" />
        <StatCard title="Program" value={loading ? "—" : student?.program_name || "—"} icon={Icons.academic} text="Academic program" />
        <StatCard title="Division" value={loading ? "—" : student?.division_name || "—"} icon={Icons.users} text="Current division" />
      </div>

      <div className="dashboard-grid">
        <div className="content-card">
          <div className="card-heading">
            <div>
              <h2>Student workflow</h2>
              <p>Keep your academic journey updated.</p>
            </div>
          </div>

          <div className="planning-list">
            <PlanningRow number="01" title="Timetable" text="Review your lecture and practical schedule." />
            <PlanningRow number="02" title="Courses" text="Check the subjects assigned for your class." />
            <PlanningRow number="03" title="Attendance" text="View attendance trends and updates." />
            <PlanningRow number="04" title="Marks" text="Monitor academic performance and assessment status." />
          </div>
        </div>

        <div className="content-card">
          <div className="card-heading">
            <div>
              <h2>Academic summary</h2>
              <p>At a glance.</p>
            </div>
          </div>

          <div className="planning-list">
            <button className="planning-row planning-row-button" onClick={() => window.dispatchEvent(new CustomEvent("student-nav", { detail: "timetable" }))}>
              <span className="planning-number">A</span>
              <span className="planning-row-copy"><strong>Timetable</strong><span>Open weekly schedule</span></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
            <button className="planning-row planning-row-button" onClick={() => window.dispatchEvent(new CustomEvent("student-nav", { detail: "courses" }))}>
              <span className="planning-number">B</span>
              <span className="planning-row-copy"><strong>Courses</strong><span>View assigned academic subjects</span></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
            <button className="planning-row planning-row-button" onClick={() => window.dispatchEvent(new CustomEvent("student-nav", { detail: "marks" }))}>
              <span className="planning-number">C</span>
              <span className="planning-row-copy"><strong>Marks</strong><span>Check evaluation results</span></span>
              <span className="dashboard-action-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StudentProfilePage({ user, student }) {
  return (
    <>
      <PageHeader title="My Profile" description="Your student account information." />

      <div className="content-card settings-panel">
        <div className="settings-row">
          <div>
            <strong>Student name</strong>
            <p>{student?.student_name || user?.username || "Student"}</p>
          </div>
          <span className="role-badge">STUDENT</span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Email</strong>
            <p>{student?.student_email || user?.email || "Not available"}</p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>Roll number</strong>
            <p>{student?.roll_number || "Not assigned"}</p>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>Academic details</strong>
            <p>{student?.program_name || "Program"} · {student?.division_name || "Division"}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function StudentDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [student, setStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadStudentData() {
    try {
      setLoading(true);

      const [studentsData, academicYearsData, divisionsData, batchesData, coursesData, facultyData, classroomsData, labsData, timeSlotsData, allocationsData] = await Promise.all([
        apiRequest("/api/students"),
        apiRequest("/api/academic-years"),
        apiRequest("/api/divisions"),
        apiRequest("/api/batches"),
        apiRequest("/api/courses"),
        apiRequest("/api/faculty"),
        apiRequest("/api/classrooms"),
        apiRequest("/api/laboratories"),
        apiRequest("/api/time-slots"),
        apiRequest("/api/course-allocations"),
      ]);

      const studentList = asArray(studentsData);
      const currentStudent = studentList.find((item) => Number(item.student_id) === Number(user?.student_id)) || null;

      setStudents(studentList);
      setStudent(currentStudent);
      setAcademicYears(asArray(academicYearsData));
      setDivisions(asArray(divisionsData));
      setBatches(asArray(batchesData));
      setCourses(asArray(coursesData));
      setFaculty(asArray(facultyData));
      setClassrooms(asArray(classroomsData));
      setLaboratories(asArray(labsData));
      setTimeSlots(asArray(timeSlotsData));
      setAllocations(asArray(allocationsData));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudentData();
  }, [user?.student_id]);

  useEffect(() => {
    const handler = (event) => {
      setActivePage(event.detail);
    };

    window.addEventListener("student-nav", handler);
    return () => window.removeEventListener("student-nav", handler);
  }, []);

  const studentNavigation = [
    { title: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: Icons.dashboard }] },
    { title: "Academic", items: [{ key: "timetable", label: "Timetable", icon: Icons.calendar }, { key: "courses", label: "Courses", icon: Icons.book }, { key: "marks", label: "Marks", icon: Icons.check }] },
    { title: "Student", items: [{ key: "attendance", label: "Attendance", icon: Icons.clock }, { key: "materials", label: "Study Material", icon: Icons.book }, { key: "profile", label: "My Profile", icon: Icons.student }] },
  ];

  const currentLabel = studentNavigation.flatMap((group) => group.items).find((item) => item.key === activePage)?.label || "Dashboard";

  function renderPage() {
    const selectedDivision = student?.division_id
      ? Number(student.division_id)
      : divisions[0]?.division_id;

    const selectedYear = academicYears[0]?.academic_year_id || "";

    switch (activePage) {
      case "dashboard":
        return <StudentOverviewPage user={user} student={student} loading={loading} />;
      case "timetable":
        return (
          <TimetablePage
            academicYears={academicYears}
            divisions={divisions}
            batches={batches}
            courses={courses}
            faculty={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            timeSlots={timeSlots}
            allocations={allocations}
          />
        );
      case "courses":
        return (
          <div className="content-card">
            <PageHeader title="My Courses" description="Current academic subjects assigned to your class." />
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Type</th>
                    <th>Credits</th>
                    <th>Faculty</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations
                    .filter((item) => Number(item.division_id) === Number(selectedDivision))
                    .map((allocation) => {
                      const course = courses.find((item) => Number(item.course_id) === Number(allocation.course_id));
                      const teacher = faculty.find((item) => Number(item.faculty_id) === Number(allocation.faculty_id));

                      return (
                        <tr key={allocation.allocation_id}>
                          <td>{course?.course_name || allocation.course_id}</td>
                          <td>{course?.course_type || "—"}</td>
                          <td>{course?.course_credit || "—"}</td>
                          <td>{teacher?.faculty_name || allocation.faculty_id}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "marks":
        return (
          <div className="content-card">
            <PageHeader title="Marks" description="Academic performance overview." />
            <EmptyState message="Marks dashboard is ready for integration with the assessment module." />
          </div>
        );
      case "attendance":
        return (
          <div className="content-card">
            <PageHeader title="Attendance" description="Attendance records and performance summary." />
            <EmptyState message="Attendance tracking will be connected to the attendance module soon." />
          </div>
        );
      case "materials":
        return (
          <div className="content-card">
            <PageHeader title="Study Material" description="Course notes and academic resources." />
            <EmptyState message="Study material and notices module is currently under development." />
          </div>
        );
      case "profile":
        return <StudentProfilePage user={user} student={student} />;
      default:
        return <StudentOverviewPage user={user} student={student} loading={loading} />;
    }
  }

  return (
    <div className="erp-layout">
      {sidebarOpen && <div className="mobile-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>Acadely</strong>
            <span>Student Portal</span>
          </div>
        </div>

        <div className="sidebar-scroll">
          {studentNavigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">{group.title}</div>
              {group.items.map((item) => (
                <button key={item.key} className={`nav-item ${activePage === item.key ? "active" : ""}`} onClick={() => { setActivePage(item.key); setSidebarOpen(false); }}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-user">
          <div className="avatar">{(user?.username || "S").charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <strong>{user?.username || "Student"}</strong>
            <span>Student</span>
          </div>
          <button className="logout-button" onClick={onLogout} title="Logout">{Icons.logout}</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button" onClick={() => setSidebarOpen(true)}>{Icons.menu}</button>
            <div className="breadcrumbs">
              <span>Acadely</span>
              <b>/</b>
              <strong>{currentLabel}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              {Icons.search}
              <input value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Search..." />
            </div>

            <button className="notification-button" title="Notifications">
              {Icons.bell}
              <span />
            </button>

            <div className="topbar-profile">
              <div className="avatar">{(user?.username || "S").charAt(0).toUpperCase()}</div>
              <div>
                <strong>{user?.username || "Student"}</strong>
                <span>Student</span>
              </div>
            </div>
          </div>
        </header>

        <section className="page-content">{renderPage()}</section>
      </main>
    </div>
  );
}

/* =========================================================
   HOD DASHBOARD SHELL
========================================================= */

function HODDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const [academicYears, setAcademicYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [allocations, setAllocations] = useState([]);

  async function loadReferenceData() {
    const requests = [
      ["academicYears", "/api/academic-years"],
      ["departments", "/api/departments"],
      ["sections", "/api/sections"],
      ["programs", "/api/programs"],
      ["classes", "/api/classes"],
      ["divisions", "/api/divisions"],
      ["batches", "/api/batches"],
      ["courses", "/api/courses"],
      ["faculty", "/api/faculty"],
      ["classrooms", "/api/classrooms"],
      ["laboratories", "/api/laboratories"],
      ["timeSlots", "/api/time-slots"],
      ["allocations", "/api/course-allocations"],
    ];

    const results = await Promise.all(
      requests.map(async ([key, endpoint]) => {
        try {
          const data = await apiRequest(endpoint);

          return [
            key,
            asArray(data),
          ];
        } catch {
          return [key, []];
        }
      })
    );

    const values = Object.fromEntries(results);

    setAcademicYears(values.academicYears);
    setDepartments(values.departments);
    setSections(values.sections);
    setPrograms(values.programs);
    setClasses(values.classes);
    setDivisions(values.divisions);
    setBatches(values.batches);
    setCourses(values.courses);
    setFaculty(values.faculty);
    setClassrooms(values.classrooms);
    setLaboratories(values.laboratories);
    setTimeSlots(values.timeSlots);
    setAllocations(values.allocations);
  }

  useEffect(() => {
    loadReferenceData();
  }, []);

  function navigate(key) {
    setActivePage(key);
    setGlobalSearch("");
    setSidebarOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("acadely_token");
    localStorage.removeItem("acadely_user");
    onLogout();
  }

  const currentLabel =
    navigation
      .flatMap((group) => group.items)
      .find((item) => item.key === activePage)?.label ||
    "Dashboard";

  function renderPage() {
    switch (activePage) {
      case "dashboard":
        return <Dashboard user={user} onNavigate={navigate} />;

      case "academic-years":
        return <AcademicYearsPage />;

      case "departments":
        return <DepartmentsPage faculty={faculty} />;

      case "sections":
        return <SectionsPage />;

      case "programs":
        return (
          <ProgramsPage
            departments={departments}
            sections={sections}
          />
        );

      case "classes":
        return (
          <ClassesPage
            programs={programs}
            departments={departments}
          />
        );

      case "divisions":
        return (
          <DivisionsPage
            classes={classes}
            programs={programs}
            sections={sections}
            departments={departments}
          />
        );

      case "batches":
        return (
          <BatchesPage
            divisions={divisions}
            classes={classes}
            programs={programs}
            sections={sections}
            departments={departments}
          />
        );

      case "courses":
        return (
          <CoursesPage
            classes={classes}
            programs={programs}
            sections={sections}
            departments={departments}
          />
        );

      case "course-allocation":
        return (
          <CourseAllocationPage
            courses={courses}
            faculty={faculty}
            divisions={divisions}
            batches={batches}
            academicYears={academicYears}
          />
        );

      case "faculty":
        return <FacultyPage departments={departments} />;

      case "students":
        return (
          <StudentsPage
            academicYears={academicYears}
            programs={programs}
            classes={classes}
            divisions={divisions}
            batches={batches}
          />
        );

      case "classrooms":
        return <ClassroomsPage />;

      case "laboratories":
        return <LaboratoriesPage />;

      case "time-slots":
        return <TimeSlotsPage />;

      case "faculty-availability":
        return (
          <FacultyAvailabilityPage faculty={faculty} />
        );

      case "faculty-leaves":
        return <FacultyLeavesPage faculty={faculty} />;

      case "faculty-approvals":
        return <FacultyApprovalsPage />;

      case "timetable":
        return (
          <TimetablePage
            academicYears={academicYears}
            divisions={divisions}
            batches={batches}
            courses={courses}
            faculty={faculty}
            classrooms={classrooms}
            laboratories={laboratories}
            timeSlots={timeSlots}
            allocations={allocations}
          />
        );

      case "settings":
        return <SettingsPage />;

      default:
        return <Dashboard user={user} />;
    }
  }

  return (
    <div className="erp-layout">
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="brand-mark">A</div>

          <div>
            <strong>Acadely</strong>
            <span>Academic ERP</span>
          </div>
        </div>

        <div className="sidebar-scroll">
          {navigation.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-group-title">
                {group.title}
              </div>

              {group.items.map((item) => (
                <button
                  key={item.key}
                  className={`nav-item ${
                    activePage === item.key ? "active" : ""
                  }`}
                  onClick={() => navigate(item.key)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-user">
          <div className="avatar">
            {(user?.username || "H")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.username || "HOD"}</strong>
            <span>Head of Department</span>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
            title="Logout"
          >
            {Icons.logout}
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              {Icons.menu}
            </button>

            <div className="breadcrumbs">
              <span>Acadely</span>
              <b>/</b>
              <strong>{currentLabel}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search">
              {Icons.search}

              <input
                value={globalSearch}
                onChange={(e) =>
                  setGlobalSearch(e.target.value)
                }
                placeholder="Search..."
              />
            </div>

            <button
              className="notification-button"
              title="Notifications"
            >
              {Icons.bell}
              <span />
            </button>

            <div className="topbar-profile">
              <div className="avatar">
                {(user?.username || "H")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>{user?.username || "HOD"}</strong>
                <span>HOD</span>
              </div>
            </div>
          </div>
        </header>

        <section className="page-content">
          {renderPage()}
        </section>
      </main>
    </div>
  );
}
/* =========================================================
   ROOT APP
========================================================= */

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem("acadely_token");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me");
        const currentUser = data?.user || data;

        // Accept all supported roles
        if (
          currentUser?.role !== "HOD" &&
          currentUser?.role !== "FACULTY" &&
          currentUser?.role !== "STUDENT"
        ) {
          throw new Error("Invalid role");
        }

        setUser(currentUser);

        localStorage.setItem(
          "acadely_user",
          JSON.stringify(currentUser)
        );
      } catch {
        localStorage.removeItem("acadely_token");
        localStorage.removeItem("acadely_user");
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAuthentication();
  }, []);

  if (checkingAuth) {
    return (
      <div className="auth-loading">
        <div className="brand-mark">A</div>
        <div className="spinner" />
        <span>Loading Acadely...</span>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Faculty
  if (user.role === "FACULTY") {
    return (
      <FacultyDashboard
        user={user}
        onLogout={() => setUser(null)}
      />
    );
  }

  // Student
  if (user.role === "STUDENT") {
    return (
      <StudentDashboard
        user={user}
        onLogout={() => setUser(null)}
      />
    );
  }

  // HOD
  return (
    <HODDashboard
      user={user}
      onLogout={() => setUser(null)}
    />
  );
}