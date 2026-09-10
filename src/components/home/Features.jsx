import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";

const FEATURES = [
  {
    icon: <AiFillFileText />,
    title: "Read or listen",
    sub: "Save time by getting the core ideas from the best books.",
  },
  {
    icon: <AiFillBulb />,
    title: "Find your next read",
    sub: "Explore book lists and personalized recommendations.",
  },
  {
    icon: <AiFillAudio />,
    title: "Briefcasts",
    sub: "Gain valuable insights from briefcasts",
  },
];

const HEADINGS_ONE = [
  "Enhance your knowledge",
  "Achieve greater success",
  "Improve your health",
  "Develop better parenting skills",
  "Increase happiness",
  "Be the best version of yourself!",
];

const HEADINGS_TWO = [
  "Expand your learning",
  "Accomplish your goals",
  "Strengthen your vitality",
  "Become a better caregiver",
  "Improve your mood",
  "Maximize your abilities",
];

const STATS_ONE = [
  { number: "93%", body: <>of Summarist members <b>significantly increase</b> reading frequency.</> },
  { number: "96%", body: <>of Summarist members <b>establish better</b> habits.</> },
  { number: "90%", body: <>have made <b>significant positive</b> change to their lives.</> },
];

const STATS_TWO = [
  {
    number: "91%",
    body: (
      <>
        of Summarist members <b>report feeling more productive</b> after
        incorporating the service into their daily routine.
      </>
    ),
  },
  {
    number: "94%",
    body: (
      <>
        of Summarist members have <b>noticed an improvement</b> in their overall
        comprehension and retention of information.
      </>
    ),
  },
  {
    number: "88%",
    body: (
      <>
        of Summarist members <b>feel more informed</b> about current events and
        industry trends since using the platform.
      </>
    ),
  },
];

export default function Features() {
  return (
    <section id="features">
      <div className="container">
        <div className="row">
          <div className="section__title">Understand books in few minutes</div>

          <div className="features__wrapper">
            {FEATURES.map((feature) => (
              <div className="features" key={feature.title}>
                <div className="features__icon">{feature.icon}</div>
                <div className="features__title">{feature.title}</div>
                <div className="features__sub--title">{feature.sub}</div>
              </div>
            ))}
          </div>

          <div className="statistics__wrapper">
            <div className="statistics__content--header">
              {HEADINGS_ONE.map((heading) => (
                <div className="statistics__heading" key={heading}>
                  {heading}
                </div>
              ))}
            </div>
            <div className="statistics__content--details">
              {STATS_ONE.map((stat) => (
                <Stat key={stat.number} {...stat} />
              ))}
            </div>
          </div>

          <div className="statistics__wrapper">
            <div className="statistics__content--details statistics__content--details-second">
              {STATS_TWO.map((stat) => (
                <Stat key={stat.number} {...stat} />
              ))}
            </div>
            <div className="statistics__content--header statistics__content--header-second">
              {HEADINGS_TWO.map((heading) => (
                <div className="statistics__heading" key={heading}>
                  {heading}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, body }) {
  return (
    <div className="statistics__data">
      <div className="statistics__data--number">{number}</div>
      <div className="statistics__data--title">{body}</div>
    </div>
  );
}
