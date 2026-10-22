export const ROOT = location.pathname.includes("/pages/") ? "../" : "./";

export const sessions = [
  {
    id: "orientation",
    title: "Simulator Orientation",
    duration: 45,
    difficulty: "Foundation",
    focus: "Controls, scanning and familiarization",
    price: 45,
    image: "simulator.jpg",
    description:
      "Settle into the controls, learn the visual field and complete a guided first scenario.",
  },
  {
    id: "urban",
    title: "Urban Traffic Practice",
    duration: 60,
    difficulty: "Developing",
    focus: "Junctions, observation and space",
    price: 62,
    image: "pedestrian-crossing.jpg",
    description:
      "Rehearse busy junctions, pedestrian awareness and measured gap decisions.",
  },
  {
    id: "highway",
    title: "Highway Awareness",
    duration: 60,
    difficulty: "Developing",
    focus: "Merging, lanes and following distance",
    price: 62,
    image: "highway.jpg",
    description:
      "Build a repeatable sequence for joining, lane choice, spacing and exits.",
  },
  {
    id: "parking",
    title: "Parking & Maneuvering",
    duration: 45,
    difficulty: "All levels",
    focus: "Low-speed control and reference points",
    price: 49,
    image: "parking.jpg",
    description:
      "Repeat precise parking movements and review each attempt without road pressure.",
  },
  {
    id: "hazards",
    title: "Hazard Recognition",
    duration: 60,
    difficulty: "Intermediate",
    focus: "Scanning, anticipation and response",
    price: 68,
    image: "night-road.jpg",
    description:
      "Spot developing risks earlier and choose calm, proportionate responses.",
  },
  {
    id: "assessment",
    title: "Mock Driving Assessment",
    duration: 75,
    difficulty: "Advanced",
    focus: "Independent decisions and review",
    price: 78,
    image: "road-cockpit.jpg",
    description:
      "Complete a structured scenario sequence followed by an evidence-led review.",
  },
];

export const scenarios = {
  city: {
    label: "City Traffic",
    session: "urban",
    focus: "Junction timing · pedestrian awareness",
    duration: "60 min",
    difficulty: "Developing",
    image: "urban-signal.jpg",
    description:
      "Rehearse observation routines and measured decisions across layered urban traffic.",
  },
  highway: {
    label: "Highway Driving",
    session: "highway",
    focus: "Merging · lane discipline · spacing",
    duration: "60 min",
    difficulty: "Developing",
    image: "highway.jpg",
    description:
      "Build a reliable sequence for joining, lane changes, following space and exits.",
  },
  parking: {
    label: "Parking & Maneuvers",
    session: "parking",
    focus: "Reference points · low-speed control",
    duration: "45 min",
    difficulty: "All levels",
    image: "parking.jpg",
    description:
      "Repeat precise maneuvers in a controlled setting and review each attempt.",
  },
  hazards: {
    label: "Hazard Awareness",
    session: "hazards",
    focus: "Scanning · anticipation · response",
    duration: "60 min",
    difficulty: "Intermediate",
    image: "hazard.jpg",
    description:
      "Learn to spot developing risks earlier and choose measured responses.",
  },
};

export const plans = {
  single: {
    title: "Focused Session",
    price: "$62",
    note: "one 60-minute request",
    features: [
      "Choose one scenario",
      "Focused practice note",
      "Progress console access",
    ],
  },
  pack: {
    title: "Four-Session Practice Path",
    price: "$225",
    note: "package enquiry",
    features: [
      "Plan four sessions",
      "Mix training scenarios",
      "Schedule with center follow-up",
    ],
  },
  combined: {
    title: "Simulator + Theory",
    price: "$285",
    note: "combined enquiry",
    features: [
      "Four simulator sessions",
      "All mock-test modes",
      "Readiness analytics",
    ],
  },
};

export const topicDetails = {
  "Road Signs": [
    "road-signs.jpg",
    "Recognize sign shapes, symbols and warning information.",
  ],
  "Right of Way": [
    "urban-signal.jpg",
    "Read junction context and make cautious priority decisions.",
  ],
  "Traffic Awareness": [
    "urban-aerial.jpg",
    "Build an updated picture of road users around you.",
  ],
  "Hazard Perception": [
    "hazard.jpg",
    "Identify developing risks before they become urgent.",
  ],
  "Parking Rules": [
    "city.jpg",
    "Understand visibility, access and low-speed observation.",
  ],
  "Vehicle Basics": [
    "instrument-panel.jpg",
    "Interpret essential vehicle information and control checks.",
  ],
  "Safe Driving Decisions": [
    "roadworks-sign.jpg",
    "Choose measured responses when conditions change.",
  ],
};

export function sessionById(id) {
  return sessions.find((session) => session.id === id) || sessions[0];
}

export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(count) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + count);
  return date;
}
