import type { WorkoutDay } from './workouts';

// Women's Level 3: Advanced - High volume, intensity techniques, challenging exercises
export const WOMEN_LEVEL3_WORKOUTS: WorkoutDay[] = [
    {
        day: 1,
        title: "Glute Hypertrophy",
        exercises: [
            {
                name: "Barbell Hip Thrust",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Upper back on bench, barbell over hips",
                    "Drive through heels, full hip extension",
                    "3-second squeeze at top",
                    "Controlled 3-second descent"
                ],
                dos: [
                    "Heavy weight with perfect form",
                    "Full range of motion",
                    "Pause at top every rep"
                ],
                donts: [
                    "Don't sacrifice form for weight",
                    "Don't hyperextend spine",
                    "Don't rush through reps"
                ],
                benefits: [
                    "Maximum glute growth",
                    "Builds serious strength",
                    "Creates rounded, lifted glutes"
                ]
            },
            {
                name: "B-Stance Hip Thrust",
                sets: 3,
                reps: "10 each side",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Set up for hip thrust",
                    "Stagger feet - working leg flat, other on heel",
                    "Focus weight through working leg",
                    "Thrust up, squeeze, lower controlled"
                ],
                dos: [
                    "80% weight on working leg",
                    "Strong glute squeeze",
                    "Keep hips level"
                ],
                donts: [
                    "Don't rotate hips",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Unilateral glute focus",
                    "Fixes imbalances",
                    "Intense activation"
                ]
            },
            {
                name: "Romanian Deadlift (Deficit)",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Hamstrings, Glutes",
                howToPerform: [
                    "Stand on small platform (2-3 inches)",
                    "Hold barbell, hinge at hips",
                    "Lower past normal range",
                    "Drive hips forward to stand"
                ],
                dos: [
                    "Feel deep hamstring stretch",
                    "Keep back flat",
                    "Squeeze glutes at top"
                ],
                donts: [
                    "Don't round back ever",
                    "Don't go too heavy initially",
                    "Don't lose core engagement"
                ],
                benefits: [
                    "Increased range of motion",
                    "Greater muscle stretch",
                    "Advanced hamstring development"
                ]
            },
            {
                name: "Cable Hip Abduction",
                sets: 3,
                reps: "15 each leg",
                targetMuscle: "Glute Medius",
                howToPerform: [
                    "Attach cable to ankle",
                    "Stand sideways to machine",
                    "Raise leg out to side against resistance",
                    "Return controlled"
                ],
                dos: [
                    "Keep supporting leg straight",
                    "Feel the side of glute burning",
                    "Control both directions"
                ],
                donts: [
                    "Don't lean body",
                    "Don't swing leg",
                    "Don't use momentum"
                ],
                benefits: [
                    "Shapes outer glutes",
                    "Creates shelf look",
                    "Hip stability"
                ]
            },
            {
                name: "Hip Thrust 21s",
                sets: 2,
                reps: "21 total",
                targetMuscle: "Glutes",
                howToPerform: [
                    "7 reps bottom half only",
                    "7 reps top half only",
                    "7 reps full range",
                    "No rest between phases"
                ],
                dos: [
                    "Use lighter weight",
                    "Squeeze hard on top half",
                    "Fight through the burn"
                ],
                donts: [
                    "Don't stop between sets",
                    "Don't rush",
                    "Don't give up"
                ],
                benefits: [
                    "Intense time under tension",
                    "Maximum pump",
                    "Muscle growth stimulus"
                ]
            }
        ]
    },
    {
        day: 2,
        title: "Upper Body Power",
        exercises: [
            {
                name: "Weighted Pull-Up (or Assisted)",
                sets: 4,
                reps: "6 to 8",
                targetMuscle: "Back, Biceps",
                howToPerform: [
                    "Grip bar slightly wider than shoulders",
                    "Pull up until chin over bar",
                    "Lower with 3-second count",
                    "Full arm extension at bottom"
                ],
                dos: [
                    "Full range of motion",
                    "Control the descent",
                    "Lead with chest"
                ],
                donts: [
                    "Don't swing or kip",
                    "Don't use momentum",
                    "Don't shorten range"
                ],
                benefits: [
                    "Ultimate back builder",
                    "Functional strength",
                    "Toned arms"
                ]
            },
            {
                name: "Barbell Row",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Back",
                howToPerform: [
                    "Hinge at hips, barbell hanging",
                    "Pull bar to lower chest",
                    "Squeeze shoulder blades together",
                    "Lower with control"
                ],
                dos: [
                    "Keep back flat",
                    "Pull elbows past torso",
                    "Pause at top"
                ],
                donts: [
                    "Don't use momentum",
                    "Don't round back",
                    "Don't jerk the weight"
                ],
                benefits: [
                    "Builds back thickness",
                    "Improves posture",
                    "Strength foundation"
                ]
            },
            {
                name: "Push-Up (Weighted or Deficit)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Chest, Triceps",
                howToPerform: [
                    "Hands on push-up handles or plates",
                    "Lower chest below hands",
                    "Push up explosively",
                    "Weight plate on back optional"
                ],
                dos: [
                    "Full range of motion",
                    "Core tight throughout",
                    "Explosive push"
                ],
                donts: [
                    "Don't sag hips",
                    "Don't flare elbows excessively",
                    "Don't rush"
                ],
                benefits: [
                    "Functional chest strength",
                    "Deep stretch",
                    "Core engagement"
                ]
            },
            {
                name: "Single Arm Dumbbell Row",
                sets: 3,
                reps: "10 each arm",
                targetMuscle: "Back",
                howToPerform: [
                    "One hand on bench, other holds dumbbell",
                    "Row dumbbell past hip",
                    "Squeeze lat hard",
                    "Lower with control"
                ],
                dos: [
                    "Drive elbow high",
                    "Pause at top",
                    "Full stretch at bottom"
                ],
                donts: [
                    "Don't rotate torso",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Unilateral focus",
                    "Fixes imbalances",
                    "Deep contraction"
                ]
            },
            {
                name: "Dumbbell Pullover",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Lats, Chest",
                howToPerform: [
                    "Lie across bench, hips below surface",
                    "Hold dumbbell overhead with both hands",
                    "Lower behind head with slight bend",
                    "Pull back over chest"
                ],
                dos: [
                    "Feel the lat stretch",
                    "Keep hips down",
                    "Controlled motion"
                ],
                donts: [
                    "Don't bend elbows too much",
                    "Don't go too heavy",
                    "Don't arch excessively"
                ],
                benefits: [
                    "Expands ribcage",
                    "Hits lats and chest",
                    "Unique movement pattern"
                ]
            },
            {
                name: "Face Pull (High Rep)",
                sets: 3,
                reps: "20",
                targetMuscle: "Rear Delts, Upper Back",
                howToPerform: [
                    "Cable at face height with rope",
                    "Pull toward face, spread rope",
                    "External rotate at end",
                    "Hold squeeze briefly"
                ],
                dos: [
                    "High and wide elbows",
                    "External rotation",
                    "Squeeze rear delts"
                ],
                donts: [
                    "Don't pull too low",
                    "Don't use momentum",
                    "Don't skip them"
                ],
                benefits: [
                    "Shoulder health",
                    "Posture improvement",
                    "Rear delt development"
                ]
            }
        ]
    },
    {
        day: 3,
        title: "Legs & HIIT",
        exercises: [
            {
                name: "Front Squat",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Quads, Core",
                howToPerform: [
                    "Bar on front delts, elbows high",
                    "Squat down keeping torso upright",
                    "Drive through heels to stand",
                    "Full depth if mobility allows"
                ],
                dos: [
                    "Keep elbows high",
                    "Chest up throughout",
                    "Full depth squat"
                ],
                donts: [
                    "Don't let elbows drop",
                    "Don't lean forward",
                    "Don't round upper back"
                ],
                benefits: [
                    "Quad-dominant squat",
                    "Core strength",
                    "Upright posture"
                ]
            },
            {
                name: "Bulgarian Split Squat",
                sets: 3,
                reps: "10 each leg",
                targetMuscle: "Glutes, Quads",
                howToPerform: [
                    "Rear foot elevated on bench",
                    "Lower until front thigh parallel",
                    "Keep torso upright",
                    "Drive through front heel"
                ],
                dos: [
                    "Lean slightly forward for glutes",
                    "Control the descent",
                    "Push through heel"
                ],
                donts: [
                    "Don't push off back foot",
                    "Don't lose balance",
                    "Don't rush"
                ],
                benefits: [
                    "Unilateral leg strength",
                    "Glute emphasis",
                    "Balance improvement"
                ]
            },
            {
                name: "Leg Press (Narrow Stance)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Quads",
                howToPerform: [
                    "Feet together on low platform",
                    "Lower platform deep",
                    "Press through balls of feet",
                    "Don't lock out fully"
                ],
                dos: [
                    "Deep range of motion",
                    "Constant tension",
                    "Feel the quad burn"
                ],
                donts: [
                    "Don't lock knees",
                    "Don't lift hips",
                    "Don't rush"
                ],
                benefits: [
                    "Quad isolation",
                    "Teardrop muscle focus",
                    "Leg definition"
                ]
            },
            {
                name: "Glute Ham Raise",
                sets: 3,
                reps: "8 to 10",
                targetMuscle: "Hamstrings, Glutes",
                howToPerform: [
                    "Secure ankles on GHR pad",
                    "Start perpendicular to floor",
                    "Lower body forward under control",
                    "Use hamstrings to pull back up"
                ],
                dos: [
                    "Keep hips extended",
                    "Use hamstrings, not back",
                    "Full range of motion"
                ],
                donts: [
                    "Don't bend at hips",
                    "Don't use momentum",
                    "Don't skip warm-up"
                ],
                benefits: [
                    "Ultimate hamstring exercise",
                    "Builds strength and size",
                    "Injury prevention"
                ]
            },
            {
                name: "Bike Sprints",
                sets: 8,
                reps: "20 sec on / 40 sec rest",
                targetMuscle: "Cardio, Legs",
                howToPerform: [
                    "Max effort 20-second sprint",
                    "40 seconds light pedaling rest",
                    "Repeat 8 rounds",
                    "High resistance setting"
                ],
                dos: [
                    "True max effort on sprints",
                    "Active recovery",
                    "Push through"
                ],
                donts: [
                    "Don't pace yourself",
                    "Don't skip intervals",
                    "Don't stop completely"
                ],
                benefits: [
                    "Fat burning",
                    "Cardiovascular fitness",
                    "Leg endurance"
                ]
            }
        ]
    },
    {
        day: 4,
        title: "Posterior Chain",
        exercises: [
            {
                name: "Conventional Deadlift",
                sets: 5,
                reps: "5",
                targetMuscle: "Full Posterior Chain",
                howToPerform: [
                    "Feet hip-width, bar over midfoot",
                    "Grip bar, chest up, back flat",
                    "Drive through heels, stand up",
                    "Lower with control"
                ],
                dos: [
                    "Keep bar close to body",
                    "Lock out with glutes",
                    "Brace core hard"
                ],
                donts: [
                    "Don't round back ever",
                    "Don't bounce the bar",
                    "Don't lean back excessively"
                ],
                benefits: [
                    "Full body strength",
                    "Posterior chain development",
                    "Metabolic boost"
                ]
            },
            {
                name: "Single Leg Romanian Deadlift",
                sets: 3,
                reps: "10 each leg",
                targetMuscle: "Hamstrings, Glutes",
                howToPerform: [
                    "Stand on one leg, dumbbell opposite hand",
                    "Hinge at hip, back leg extending back",
                    "Touch dumbbell toward floor",
                    "Drive hip forward to stand"
                ],
                dos: [
                    "Keep back flat",
                    "Squeeze glute at top",
                    "Control balance"
                ],
                donts: [
                    "Don't round back",
                    "Don't rotate hips",
                    "Don't rush"
                ],
                benefits: [
                    "Balance and stability",
                    "Unilateral strength",
                    "Glute focus"
                ]
            },
            {
                name: "45° Back Extension (Weighted)",
                sets: 4,
                reps: "12 to 15",
                targetMuscle: "Lower Back, Glutes, Hamstrings",
                howToPerform: [
                    "Hold plate at chest",
                    "Lower torso toward floor",
                    "Raise back up to parallel",
                    "Squeeze glutes at top"
                ],
                dos: [
                    "Full range of motion",
                    "Pause at top",
                    "Control throughout"
                ],
                donts: [
                    "Don't hyperextend",
                    "Don't swing",
                    "Don't go too heavy initially"
                ],
                benefits: [
                    "Strengthens lower back",
                    "Glute and hamstring work",
                    "Prevents back issues"
                ]
            },
            {
                name: "Stiff Leg Deadlift (Dumbbell)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Hamstrings",
                howToPerform: [
                    "Hold dumbbells in front of thighs",
                    "Keep legs nearly straight",
                    "Lower until deep hamstring stretch",
                    "Drive hips forward to stand"
                ],
                dos: [
                    "Keep legs stiff but not locked",
                    "Feel the stretch",
                    "Slow negative"
                ],
                donts: [
                    "Don't bend knees much",
                    "Don't round back",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Maximum hamstring stretch",
                    "Lengthens muscles",
                    "Improves flexibility"
                ]
            },
            {
                name: "Banded Hip Thrust (Burnout)",
                sets: 2,
                reps: "25 to 30",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Band around knees, bodyweight hip thrust",
                    "Push knees out against band",
                    "Fast but controlled reps",
                    "Keep constant tension"
                ],
                dos: [
                    "Push knees out whole time",
                    "Quick tempo",
                    "Chase the burn"
                ],
                donts: [
                    "Don't let knees cave",
                    "Don't stop at burn",
                    "Don't lose form"
                ],
                benefits: [
                    "Glute activation",
                    "Finishes off glutes",
                    "Burns and pumps"
                ]
            }
        ]
    },
    {
        day: 5,
        title: "Upper Body Sculpt",
        exercises: [
            {
                name: "Close Grip Bench Press",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Triceps, Chest",
                howToPerform: [
                    "Hands shoulder-width on bar",
                    "Lower bar to lower chest",
                    "Push back up",
                    "Keep elbows close to body"
                ],
                dos: [
                    "Elbows at 45 degrees",
                    "Full lockout",
                    "Controlled descent"
                ],
                donts: [
                    "Don't flare elbows",
                    "Don't bounce off chest",
                    "Don't grip too narrow"
                ],
                benefits: [
                    "Tricep strength",
                    "Chest development",
                    "Arm toning"
                ]
            },
            {
                name: "Chin-Up",
                sets: 3,
                reps: "8 to 10",
                targetMuscle: "Biceps, Back",
                howToPerform: [
                    "Underhand grip, hands shoulder-width",
                    "Pull up until chin over bar",
                    "Lower with control",
                    "Full extension at bottom"
                ],
                dos: [
                    "Full range of motion",
                    "Control the negative",
                    "Use full body tension"
                ],
                donts: [
                    "Don't swing",
                    "Don't use momentum",
                    "Don't shorten range"
                ],
                benefits: [
                    "Bicep builder",
                    "Back width",
                    "Functional strength"
                ]
            },
            {
                name: "Dumbbell Z Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Shoulders, Core",
                howToPerform: [
                    "Sit on floor, legs extended",
                    "No back support",
                    "Press dumbbells overhead",
                    "Lower with control"
                ],
                dos: [
                    "Keep core super tight",
                    "Maintain upright posture",
                    "Full lockout"
                ],
                donts: [
                    "Don't lean back",
                    "Don't round back",
                    "Don't rush"
                ],
                benefits: [
                    "Pure shoulder strength",
                    "Core engagement",
                    "No cheating possible"
                ]
            },
            {
                name: "Tricep Dip",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Triceps",
                howToPerform: [
                    "Support body on parallel bars",
                    "Lower until upper arms parallel",
                    "Push back up to lockout",
                    "Stay slightly forward for chest"
                ],
                dos: [
                    "Keep elbows close",
                    "Full range of motion",
                    "Control the negative"
                ],
                donts: [
                    "Don't swing",
                    "Don't go too deep initially",
                    "Don't flare elbows"
                ],
                benefits: [
                    "Builds tricep strength",
                    "Upper body mass",
                    "Functional pushing"
                ]
            },
            {
                name: "Cable Curl (Drop Set)",
                sets: 3,
                reps: "10, 10, 10",
                targetMuscle: "Biceps",
                howToPerform: [
                    "10 reps at heavy weight",
                    "Drop weight immediately, 10 more",
                    "Drop again, final 10",
                    "No rest between drops"
                ],
                dos: [
                    "Strict form throughout",
                    "Quick weight drops",
                    "Fight through fatigue"
                ],
                donts: [
                    "Don't rest between drops",
                    "Don't swing body",
                    "Don't give up"
                ],
                benefits: [
                    "Maximum muscle breakdown",
                    "Incredible pump",
                    "Arm growth"
                ]
            },
            {
                name: "Reverse Fly (Incline)",
                sets: 3,
                reps: "15",
                targetMuscle: "Rear Delts",
                howToPerform: [
                    "Lie face down on incline bench",
                    "Hold light dumbbells",
                    "Raise arms out to sides",
                    "Squeeze rear delts, lower controlled"
                ],
                dos: [
                    "Keep slight bend in elbows",
                    "Squeeze at top",
                    "Light weight, high reps"
                ],
                donts: [
                    "Don't use momentum",
                    "Don't go too heavy",
                    "Don't shrug shoulders"
                ],
                benefits: [
                    "Rear delt definition",
                    "Shoulder balance",
                    "Posture improvement"
                ]
            }
        ]
    },
    {
        day: 6,
        title: "Athletic Conditioning",
        exercises: [
            {
                name: "Box Jump",
                sets: 4,
                reps: "8",
                targetMuscle: "Legs, Power",
                howToPerform: [
                    "Stand facing box",
                    "Squat slightly, swing arms",
                    "Explode up onto box",
                    "Step down, reset"
                ],
                dos: [
                    "Land softly",
                    "Stand fully on box",
                    "Reset each rep"
                ],
                donts: [
                    "Don't jump off box",
                    "Don't rush",
                    "Don't land too hard"
                ],
                benefits: [
                    "Explosive power",
                    "Athletic development",
                    "Glute activation"
                ]
            },
            {
                name: "Kettlebell Swing",
                sets: 4,
                reps: "15",
                targetMuscle: "Glutes, Hamstrings, Core",
                howToPerform: [
                    "Hinge at hips, kettlebell between legs",
                    "Drive hips forward explosively",
                    "Kettlebell swings to shoulder height",
                    "Control the descent, repeat"
                ],
                dos: [
                    "Power comes from hips",
                    "Arms are just hooks",
                    "Squeeze glutes at top"
                ],
                donts: [
                    "Don't use arms to lift",
                    "Don't round back",
                    "Don't squat the swing"
                ],
                benefits: [
                    "Cardio and strength",
                    "Glute power",
                    "Full body conditioning"
                ]
            },
            {
                name: "Sled Push",
                sets: 4,
                reps: "40 meters",
                targetMuscle: "Full Body",
                howToPerform: [
                    "Grip sled handles low",
                    "Lean into sled at 45 degrees",
                    "Drive legs alternating",
                    "Push for full distance"
                ],
                dos: [
                    "Stay low",
                    "Drive through balls of feet",
                    "Arms locked out"
                ],
                donts: [
                    "Don't stand too upright",
                    "Don't take short steps",
                    "Don't stop mid-push"
                ],
                benefits: [
                    "Leg burn",
                    "Cardio conditioning",
                    "No eccentric stress"
                ]
            },
            {
                name: "Burpee",
                sets: 3,
                reps: "12",
                targetMuscle: "Full Body, Cardio",
                howToPerform: [
                    "Drop to push-up position",
                    "Perform push-up",
                    "Jump feet toward hands",
                    "Jump up with arms overhead"
                ],
                dos: [
                    "Full push-up",
                    "Explosive jump",
                    "Land softly"
                ],
                donts: [
                    "Don't skip push-up",
                    "Don't sacrifice form",
                    "Don't hold breath"
                ],
                benefits: [
                    "Full body conditioning",
                    "Cardio endurance",
                    "Calorie burn"
                ]
            },
            {
                name: "Dead Hang",
                sets: 3,
                reps: "30 to 45 sec",
                targetMuscle: "Grip, Shoulders",
                howToPerform: [
                    "Hang from bar with overhand grip",
                    "Relax shoulders slightly",
                    "Hold as long as possible",
                    "Rest and repeat"
                ],
                dos: [
                    "Grip hard",
                    "Breathe normally",
                    "Fight to hold on"
                ],
                donts: [
                    "Don't swing",
                    "Don't hold breath",
                    "Don't give up early"
                ],
                benefits: [
                    "Grip strength",
                    "Shoulder health",
                    "Spinal decompression"
                ]
            }
        ]
    }
];
