import experience2 from "../assets/Picine.png";

export default function ExperienceRightImage() {
    return (
        <article className="experience__row experience__row--image-left">

            <div className="experience__media">
                <img 
                    src={experience2} 
                    alt="Hotel experience"
                    className="experience__img"
                />
            </div>

            <div className="experience__text">
                <p className="experience__eyebrow">The Experience</p>
                <h2 className="experience__title">
                    Luxury that feels effortless.
                </h2>

                <p className="experience__p">
                    Discreet service, peaceful surroundings and thoughtful comfort
                    shape a stay designed around you.
                </p>
                <p className="experience__p">
                    From arrival to departure, every moment is calm,
                    simple and naturally refined.
                </p>
            </div>

        </article>
    );
}