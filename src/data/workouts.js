export const WORKOUT_PLAN = [
  {
    id: "day1",
    label: "Day 1",
    name: "Chest & Triceps",
    color: "#e63946",
    emoji: "🔴",
    exercises: [
      { id: "db-chest-press",        name: "Dumbbell Chest Press",          muscle: "Chest",   defaultSets: 3 },
      { id: "incline-bench",         name: "Incline Bench Press",           muscle: "Chest",   defaultSets: 3 },
      { id: "cable-high-low",        name: "Cable High to Lows",            muscle: "Chest",   defaultSets: 3 },
      { id: "pec-fly",               name: "Pec Fly",                       muscle: "Chest",   defaultSets: 3 },
      { id: "tricep-pushdown-d1",    name: "Tricep Pushdown",               muscle: "Triceps", defaultSets: 3 },
      { id: "jm-press-d1",           name: "JM Press",                      muscle: "Triceps", defaultSets: 3 },
      { id: "cross-body-tricep-d1",  name: "Cross Body Tricep Extension",   muscle: "Triceps", defaultSets: 3, note: "Track per arm" },
      { id: "dips-d1",               name: "Dips",                          muscle: "Triceps", defaultSets: 3 },
    ]
  },
  {
    id: "day2",
    label: "Day 2",
    name: "Back & Biceps",
    color: "#f77f00",
    emoji: "🟠",
    exercises: [
      { id: "lat-pulldown",          name: "Lat Pulldown",                  muscle: "Back",    defaultSets: 3 },
      { id: "chest-supported-row",   name: "Chest Supported Row",           muscle: "Back",    defaultSets: 3 },
      { id: "seated-row",            name: "Seated Row",                    muscle: "Back",    defaultSets: 3 },
      { id: "pull-ups",              name: "Pull Ups",                      muscle: "Back",    defaultSets: 3 },
      { id: "lat-pullover",          name: "Lat Pullover",                  muscle: "Back",    defaultSets: 3 },
      { id: "preacher-curls-d1",     name: "Preacher Curls",                muscle: "Biceps",  defaultSets: 3 },
      { id: "bayesian-curls-d1",     name: "Bayesian Curls",                muscle: "Biceps",  defaultSets: 3 },
      { id: "hammer-curls-d1",       name: "Hammer Curls",                  muscle: "Biceps",  defaultSets: 3 },
    ]
  },
  {
    id: "day3",
    label: "Day 3",
    name: "Shoulders",
    color: "#fcbf49",
    emoji: "🟡",
    exercises: [
      { id: "german-raises",         name: "German Raises",                        muscle: "Shoulders", defaultSets: 3 },
      { id: "lateral-raises-d2",     name: "Lateral Raises",                       muscle: "Shoulders", defaultSets: 3, note: "Track per arm" },
      { id: "shoulder-press-d3",     name: "Shoulder Press",                       muscle: "Shoulders", defaultSets: 3 },
      { id: "cable-lateral-raises",  name: "Cable Single Arm Lateral Raises",      muscle: "Shoulders", defaultSets: 3 },
      { id: "cable-front-raises",    name: "Cable Front Raises",                   muscle: "Shoulders", defaultSets: 3 },
      { id: "cable-rear-delts",      name: "Cable Rear Delts",                     muscle: "Shoulders", defaultSets: 3 },
    ]
  },
  {
    id: "day4",
    label: "Day 4",
    name: "Legs",
    color: "#2dc653",
    emoji: "🟢",
    exercises: [
      { id: "leg-press",             name: "Leg Press",                            muscle: "Quads",      defaultSets: 3 },
      { id: "leg-extension-d4",      name: "Leg Extension",                        muscle: "Quads",      defaultSets: 3 },
      { id: "romanian-deadlift",     name: "Romanian Deadlifts",                   muscle: "Hamstrings", defaultSets: 3 },
      { id: "leg-curls-d4",          name: "Leg Curls",                            muscle: "Hamstrings", defaultSets: 3 },
      { id: "abductor-in",           name: "Abductor Machine (pushing in)",        muscle: "Glutes",     defaultSets: 2 },
      { id: "abductor-out",          name: "Abductor Machine (pushing out)",       muscle: "Glutes",     defaultSets: 2 },
      { id: "calf-raises-d4",        name: "Calf Raises",                          muscle: "Calves",     defaultSets: 3 },
    ]
  },
  {
    id: "day5",
    label: "Day 5",
    name: "Upper (Biceps & Triceps)",
    color: "#4361ee",
    emoji: "🔵",
    exercises: [
      { id: "preacher-curls-d5",     name: "Preacher Curls",                       muscle: "Biceps",  defaultSets: 3 },
      { id: "bayesian-curls-d5",     name: "Bayesian Curls",                       muscle: "Biceps",  defaultSets: 3 },
      { id: "hammer-curls-d5",       name: "Hammer Curls",                         muscle: "Biceps",  defaultSets: 3 },
      { id: "tricep-pushdown",       name: "Tricep Pushdown",                      muscle: "Triceps", defaultSets: 3 },
      { id: "jm-press",              name: "JM Press",                             muscle: "Triceps", defaultSets: 3 },
      { id: "cross-body-tricep",     name: "Cross Body Tricep Extension",          muscle: "Triceps", defaultSets: 3, note: "Track per arm" },
      { id: "dips",                  name: "Dips",                                 muscle: "Triceps", defaultSets: 3 },
    ]
  },
  {
    id: "day6",
    label: "Day 6",
    name: "Lower (Legs)",
    color: "#7b2d8b",
    emoji: "🟣",
    exercises: [
      { id: "squats",                name: "Squats",                               muscle: "Quads",      defaultSets: 3 },
      { id: "leg-extension-d6",      name: "Leg Extension",                        muscle: "Quads",      defaultSets: 3 },
      { id: "leg-curls-d6",          name: "Leg Curls",                            muscle: "Hamstrings", defaultSets: 3 },
      { id: "abductor-d6",           name: "Abductor Machine",                     muscle: "Glutes",     defaultSets: 3 },
      { id: "calf-raises-d6",        name: "Calf Raises",                          muscle: "Calves",     defaultSets: 3 },
    ]
  }
];

export const getStorageKey = (date) => `lifts_${date}`;
export const getPRKey = (exerciseId) => `pr_${exerciseId}`;

export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getToday = () => formatDate(new Date());
