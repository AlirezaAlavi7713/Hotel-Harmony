import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../css/BookingBar.css";
import "../css/DatePicker.css";

export default function BookingBar() {
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [personnes, setPersonnes] = useState(1);

  const toISO = (d) => d ? d.toISOString().split("T")[0] : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateDebut || !dateFin) return;
    navigate("/rooms", {
      state: {
        date_debut: toISO(dateDebut),
        date_fin: toISO(dateFin),
        personnes,
      },
    });
  };

  return (
    <form className="bookingBar" onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Check-in</label>
        <DatePicker
          selected={dateDebut}
          onChange={(date) => {
            setDateDebut(date);
            if (dateFin && date >= dateFin) setDateFin(null);
          }}
          selectsStart
          startDate={dateDebut}
          endDate={dateFin}
          minDate={today}
          locale={fr}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          className="bookingBar__datepicker"
          calendarClassName="bookingBar__calendar"
          onChangeRaw={(e) => e.preventDefault()}
          required
        />
      </div>

      <div className="field">
        <label className="label">Check-out</label>
        <DatePicker
          selected={dateFin}
          onChange={(date) => setDateFin(date)}
          selectsEnd
          startDate={dateDebut}
          endDate={dateFin}
          minDate={dateDebut ? new Date(dateDebut.getTime() + 86400000) : today}
          locale={fr}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          className="bookingBar__datepicker"
          calendarClassName="bookingBar__calendar"
          onChangeRaw={(e) => e.preventDefault()}
          required
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="personnes">Persone</label>
        <div className="bookingBar__selectWrap">
          <select
            className="bookingBar__select"
            id="personnes"
            value={personnes}
            onChange={(e) => setPersonnes(Number(e.target.value))}
          >
            <option value={1}>1 guest</option>
            <option value={2}>2 guests</option>
            <option value={3}>3 guests</option>
            <option value={4}>4 guests</option>
          </select>
        </div>
      </div>

      <button className="cta" type="submit">
        Search
      </button>
    </form>
  );
}
