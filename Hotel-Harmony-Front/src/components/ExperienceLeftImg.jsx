import experience1 from "../assets/Reception2.jpg";

export default function ExperienceLeftImage() {
    return (
        <article className="experience__row experience__row--image-right">

            <div className="experience__text">
                <p className="experience__eyebrow">The Atmosphere</p>
                <h2 className="experience__title">
                    A place to slow down and feel at home.
                </h2>

                <p className="experience__p">
                    Every detail has been imagined to create a sense of quiet elegance.
                    Soft light, natural materials and balanced spaces invite you to pause.
                </p>
                <p className="experience__p">
                    Here, time moves differently — mornings are calm,
                    evenings are warm, and every stay feels personal.
                </p>
            </div>

            <div className="experience__media">
                <img
                    src={experience1}
                    alt="Hotel atmosphere"
                    className="experience__img"
                />
            </div>

        </article>
    );
}