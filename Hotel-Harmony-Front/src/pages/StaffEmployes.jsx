import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeService from "../services/EmployeService";
import EmployeModal from "../components/EmployeModal";
import ConfirmModal from "../components/ConfirmModal";
import StaffMenu from "../components/StaffMenu";
import "../css/StaffEmployes.css";

export default function StaffEmployees() {
    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");

    useEffect(() => {
        if (role !== "admin") navigate("/staff", { replace: true });
    }, [role, navigate]);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState("all");

    // ✅ toast (success + errors)
    const [toast, setToast] = useState("");
    function showToast(message) {
        setToast(message);

        setTimeout(() => {
            setToast("");
        }, 2500);
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [current, setCurrent] = useState(null);

    const [toDelete, setToDelete] = useState(null);

    async function load() {
        setLoading(true);
        try {
            const res = await EmployeService.getAllEmployes();
            setItems(res.data);
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to load employees");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    const filteredItems = useMemo(() => {
        if (roleFilter === "all") return items;
        return items.filter((item) => item.role === roleFilter);
    }, [items, roleFilter]);

    function openCreate() {
        setModalMode("create");
        setCurrent(null);
        setModalOpen(true);
    }

    function openEdit(emp) {
        setModalMode("edit");
        setCurrent(emp);
        setModalOpen(true);
    }

    async function submit(form) {
        setActionLoading(true);
        try {
            const payload = {
                nom: form.nom?.trim(),
                prenom: form.prenom?.trim(),
                email: form.email?.trim(),
                role: form.role,
            };

            if (modalMode === "create") {
                payload.mot_de_passe = form.mot_de_passe;
                await EmployeService.createEmploye(payload);
                showToast("Employee created ✅");
            } else {
                if (form.mot_de_passe?.trim()) payload.mot_de_passe = form.mot_de_passe;
                await EmployeService.updateEmploye(current.id_employe, payload);
                showToast("Employee updated ✅");
            }

            setModalOpen(false);
            await load();
        } catch (err) {
            showToast(err?.response?.data?.message || "Save failed");
        } finally {
            setActionLoading(false);
        }
    }

    async function confirmDelete() {
        if (!toDelete) return;

        setActionLoading(true);

        try {
            await EmployeService.deleteEmploye(toDelete.id_employe);
            showToast("Employee deleted ✅");
            await load();
        } catch (err) {
            showToast(err?.response?.data?.message || "Delete failed");
        } finally {
            setToDelete(null); // ✅ ferme toujours la modal
            setActionLoading(false);
        }
    }

    return (
        <section className="emp">
            <div className="emp__container">
                <header className="emp__header">
                    <div>
                        <p className="emp__eyebrow">Harmony Hotel</p>
                        <h1 className="emp__title">Employees</h1>
                        <p className="emp__subtitle">Admin only — manage staff accounts.</p>
                    </div>

                    <div className="emp__headerActions">
                        <select
                            className="emp__filter"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">All roles</option>
                            <option value="employe">Employees</option>
                            <option value="admin">Admins</option>
                        </select>

                        <StaffMenu />
                        <button className="emp__btn emp__btn--primary" type="button" onClick={openCreate}>
                            + Add employee
                        </button>
                    </div>
                </header>

                {toast && <p className="emp__toast">{toast}</p>}

                {loading && <p className="emp__muted">Loading...</p>}

                {!loading && items.length === 0 && (
                    <p className="emp__muted">No employees found.</p>
                )}

                {!loading && items.length > 0 && filteredItems.length === 0 && (
                    <p className="emp__muted">No accounts match this role.</p>
                )}

                {!loading && filteredItems.length > 0 && (
                    <div className="emp__list">
                        {filteredItems.map((e) => (
                            <article className="emp__card" key={e.id_employe}>
                                <div className="emp__cardTop">
                                    <p className="emp__name">
                                        {e.prenom} {e.nom}
                                    </p>
                                    <span className={`emp__badge emp__badge--${e.role}`}>{e.role}</span>
                                </div>

                                <p className="emp__meta">{e.email}</p>

                                <div className="emp__actions">
                                    <button className="emp__btn" type="button" onClick={() => openEdit(e)}>
                                        Edit
                                    </button>
                                    <button
                                        className="emp__btn emp__btn--danger"
                                        type="button"
                                        onClick={() => setToDelete(e)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <EmployeModal
                open={modalOpen}
                mode={modalMode}
                initial={current}
                loading={actionLoading}
                onClose={() => setModalOpen(false)}
                onSubmit={submit}
            />

            <ConfirmModal
                open={!!toDelete}
                title="Delete employee"
                message={`Delete ${toDelete?.prenom || ""} ${toDelete?.nom || ""}?`}
                confirmText="Delete"
                cancelText="Cancel"
                loading={actionLoading}
                onClose={() => setToDelete(null)}
                onConfirm={confirmDelete}
            />
        </section>
    );
}
