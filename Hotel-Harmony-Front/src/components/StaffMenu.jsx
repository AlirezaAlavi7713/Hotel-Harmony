import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/StaffMenu.css";

export default function StaffMenu() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");

    const [open, setOpen] = useState(false);

    return (
        <>
            {open && (
                <div
                    className="menuOverlay"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className="staffMenu">
                <button
                    type="button"
                    className="staffMenu__btn"
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                >
                    Menu ▾
                </button>

                {open && (
                    <div
                        className="staffMenu__dropdown"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={`staffMenu__item ${location.pathname === "/staff" ? "is-active" : ""}`}
                            onClick={() => {
                                setOpen(false);
                                navigate("/staff");
                            }}
                        >
                            Reservations
                        </button>

                        <button
                            type="button"
                            className={`staffMenu__item ${location.pathname === "/staff/messages" ? "is-active" : ""}`}
                            onClick={() => {
                                setOpen(false);
                                navigate("/staff/messages");
                            }}
                        >
                            Messages
                        </button>

                        <button
                            type="button"
                            className={`staffMenu__item ${location.pathname === "/staff/rooms" ? "is-active" : ""}`}
                            onClick={() => {
                                setOpen(false);
                                navigate("/staff/rooms");
                            }}
                        >
                            Rooms
                        </button>

                        {role === "admin" && (
                            <button
                                type="button"
                                className={`staffMenu__item ${location.pathname === "/staff/employees" ? "is-active" : ""}`}
                                onClick={() => {
                                    setOpen(false);
                                    navigate("/staff/employees");
                                }}
                            >
                                Employees
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}