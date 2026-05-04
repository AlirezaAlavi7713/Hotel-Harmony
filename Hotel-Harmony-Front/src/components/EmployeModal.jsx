import { useEffect, useState } from "react";

export default function EmployeModal({
    open,
    mode = "create",
    initial = null,
    loading = false,
    onClose,
    onSubmit,
}) {
    const isEdit = mode === "edit";

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        role: "employe",
        mot_de_passe: "",
    });

    useEffect(() => {
        if (!open) return;
        setForm({
            nom: initial?.nom || "",
            prenom: initial?.prenom || "",
            email: initial?.email || "",
            role: initial?.role || "employe",
            mot_de_passe: "",
        });
    }, [open, initial]);

    if (!open) return null;

    const canSubmit =
        form.prenom.trim().length >= 2 &&
        form.nom.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
        (isEdit ? true : form.mot_de_passe.trim().length >= 6);

    return (
        <div className="modalOverlay" role="dialog" aria-modal="true">
            <div className="modalCard">
                <h2 className="modalTitle">{isEdit ? "Edit employee" : "Add employee"}</h2>

                <div className="modalForm">
                    <label className="modalLabel">First name</label>
                    <input
                        className="modalInput"
                        value={form.prenom}
                        onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))}
                    />

                    <label className="modalLabel">Last name</label>
                    <input
                        className="modalInput"
                        value={form.nom}
                        onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
                    />

                    <label className="modalLabel">Email</label>
                    <input
                        className="modalInput"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    />

                    <label className="modalLabel">Role</label>
                    <div className="modalSelectWrap">
                        <select
                            className="modalInput modalSelect"
                            value={form.role}
                            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                        >
                            <option value="employe">employe</option>
                            <option value="admin">admin</option>
                        </select>
                    </div>

                    <label className="modalLabel">
                        Password {isEdit ? "(leave empty to keep)" : "(min 6 chars)"}
                    </label>
                    <input
                        className="modalInput"
                        type="password"
                        value={form.mot_de_passe}
                        onChange={(e) => setForm((p) => ({ ...p, mot_de_passe: e.target.value }))}
                    />
                </div>

                <div className="modalActions">
                    <button
                        className="modalBtn modalBtn--ghost"
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="modalBtn"
                        type="button"
                        onClick={() => onSubmit(form)}
                        disabled={loading || !canSubmit}
                    >
                        {loading ? "Saving..." : isEdit ? "Save" : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}
