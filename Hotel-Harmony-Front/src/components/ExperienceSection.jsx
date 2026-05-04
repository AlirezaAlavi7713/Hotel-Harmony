import ExperienceLeftImage from "./ExperienceLeftImg";
import ExperienceRightImage from "./ExperienceRightImg";
import "../css/Experience.css";

export default function ExperienceSection() {
    return (
        <section className="experience">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "4vh", fontWeight: "bold", marginTop: "10vh" }}>
                <p>Where comfort meets quiet luxury</p>
            </div>
            <div className="experience__inner">
            <ExperienceLeftImage />
            <ExperienceRightImage />
            </div>
        </section>
    );
}
