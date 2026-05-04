export default function ConfirmModal({
    open,
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onClose,
}) {
    if (!open) return null;

    return (
        <div className="modalOverlay" role="dialog" aria-modal="true">
            <div className="modalCard">
                <h2 className="modalTitle">{title}</h2>
                <p className="modalText">{message}</p>

                <div className="modalActions">
                    <button className="modalBtn modalBtn--ghost" type="button" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </button>

                    <button className="modalBtn modalBtn--danger" type="button" onClick={onConfirm} disabled={loading}>
                        {loading ? "Working..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}