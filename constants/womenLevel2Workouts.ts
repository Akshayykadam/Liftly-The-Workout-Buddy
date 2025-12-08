import type { WorkoutDay } from './workouts';

// Women's Level 2: Intermediate - Moderate volume, compound movements, progressive overload
export const WOMEN_LEVEL2_WORKOUTS: WorkoutDay[] = [
    {
        day: 1,
        title: "Glute Focus",
        exercises: [
            {
                name: "Barbell Hip Thrust",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Sit against bench, barbell over hips",
                    "Pad the bar for comfort",
                    "Drive through heels, thrust hips up",
                    "Squeeze glutes at top, lower controlled"
                ],
                dos: [
                    "Keep chin tucked",
                    "Full hip extension at top",
                    "2-second squeeze at top"
                ],
                donts: [
                    "Don't hyperextend spine",
                    "Don't rush the movement",
                    "Don't let bar roll"
                ],
                benefits: [
                    "King of glute exercises",
                    "Builds serious glute strength",
                    "Creates round, lifted glutes"
                ]
            },
            {
                name: "Romanian Deadlift (Barbell)",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Hamstrings, Glutes",
                howToPerform: [
                    "Hold barbell at hip level",
                    "Hinge at hips, pushing butt back",
                    "Lower bar along legs",
                    "Feel hamstring stretch, drive hips forward"
                ],
                dos: [
                    "Keep bar close to body",
                    "Maintain flat back",
                    "Squeeze glutes at top"
                ],
                donts: [
                    "Don't round your back",
                    "Don't bend knees excessively",
                    "Don't go too heavy initially"
                ],
                benefits: [
                    "Builds posterior chain",
                    "Lengthens hamstrings",
                    "Excellent glute developer"
                ]
            },
            {
                name: "Cable Pull-Through",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Glutes, Hamstrings",
                howToPerform: [
                    "Stand facing away from low cable",
                    "Grip rope between legs",
                    "Hinge at hips, feel stretch",
                    "Drive hips forward, squeeze glutes"
                ],
                dos: [
                    "Keep arms relaxed",
                    "Drive with hips, not arms",
                    "Strong glute squeeze at top"
                ],
                donts: [
                    "Don't round your back",
                    "Don't pull with arms",
                    "Don't hyperextend"
                ],
                benefits: [
                    "Great hip hinge practice",
                    "Constant tension on glutes",
                    "Builds mind-muscle connection"
                ]
            },
            {
                name: "Cable Kickback",
                sets: 3,
                reps: "12 each leg",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Attach ankle strap to low cable",
                    "Face machine, slight forward lean",
                    "Kick leg straight back",
                    "Squeeze at top, return controlled"
                ],
                dos: [
                    "Keep leg straight",
                    "Focus on glute squeeze",
                    "Control the entire movement"
                ],
                donts: [
                    "Don't arch excessively",
                    "Don't use momentum",
                    "Don't swing the leg"
                ],
                benefits: [
                    "Isolates glutes perfectly",
                    "Great burnout exercise",
                    "Shapes and lifts glutes"
                ]
            },
            {
                name: "Frog Pump",
                sets: 3,
                reps: "20 to 25",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Lie on back, soles of feet together",
                    "Knees fall out to sides",
                    "Thrust hips up squeezing glutes",
                    "Lower and repeat"
                ],
                dos: [
                    "Keep core engaged",
                    "Squeeze hard at top",
                    "Fast tempo on these"
                ],
                donts: [
                    "Don't use lower back",
                    "Don't rush without squeeze",
                    "Don't let form break down"
                ],
                benefits: [
                    "Maximum glute activation",
                    "Great finisher",
                    "Pump and burn"
                ]
            }
        ]
    },
    {
        day: 2,
        title: "Upper Body Strength",
        exercises: [
            {
                name: "Lat Pulldown (Close Grip)",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Back",
                howToPerform: [
                    "Use close grip V-bar attachment",
                    "Pull to upper chest",
                    "Squeeze lats at bottom",
                    "Return with control"
                ],
                dos: [
                    "Lean back slightly",
                    "Pull elbows down and back",
                    "Feel the lats working"
                ],
                donts: [
                    "Don't swing body",
                    "Don't shrug shoulders",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Builds back width",
                    "Creates V-taper",
                    "Improves posture"
                ]
            },
            {
                name: "Dumbbell Bench Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Chest",
                howToPerform: [
                    "Lie on bench, dumbbells at chest",
                    "Press up until arms extend",
                    "Lower with control",
                    "Light touch to chest and press"
                ],
                dos: [
                    "Keep shoulders pulled back",
                    "Controlled descent",
                    "Full range of motion"
                ],
                donts: [
                    "Don't bounce off chest",
                    "Don't flare elbows too wide",
                    "Don't arch excessively"
                ],
                benefits: [
                    "Tones and lifts chest",
                    "Natural range of motion",
                    "Builds pressing strength"
                ]
            },
            {
                name: "Seated Cable Row",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Back",
                howToPerform: [
                    "Sit with feet on platform",
                    "Pull handles to torso",
                    "Squeeze shoulder blades",
                    "Return with control"
                ],
                dos: [
                    "Keep chest up throughout",
                    "Pull elbows past torso",
                    "Pause at contraction"
                ],
                donts: [
                    "Don't round back",
                    "Don't lean back excessively",
                    "Don't use momentum"
                ],
                benefits: [
                    "Builds back thickness",
                    "Excellent for posture",
                    "Balanced development"
                ]
            },
            {
                name: "Arnold Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Shoulders",
                howToPerform: [
                    "Start with dumbbells at shoulders, palms facing you",
                    "As you press up, rotate palms to face forward",
                    "Press overhead, reverse motion on way down"
                ],
                dos: [
                    "Smooth rotation throughout",
                    "Control the weight",
                    "Full range of motion"
                ],
                donts: [
                    "Don't use momentum",
                    "Don't arch back",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Hits all shoulder heads",
                    "Time under tension",
                    "Sculpts beautiful shoulders"
                ]
            },
            {
                name: "Tricep Overhead Extension (Cable)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Triceps",
                howToPerform: [
                    "Face away from high cable with rope",
                    "Hold rope overhead",
                    "Extend arms forward and up",
                    "Return to stretch position"
                ],
                dos: [
                    "Keep elbows fixed",
                    "Full extension at top",
                    "Feel the stretch"
                ],
                donts: [
                    "Don't move elbows",
                    "Don't use back",
                    "Don't rush"
                ],
                benefits: [
                    "Long head tricep focus",
                    "Tones back of arms",
                    "Great stretch and squeeze"
                ]
            },
            {
                name: "Incline Dumbbell Curl",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Biceps",
                howToPerform: [
                    "Sit on incline bench at 45 degrees",
                    "Let arms hang with dumbbells",
                    "Curl up toward shoulders",
                    "Lower with full stretch"
                ],
                dos: [
                    "Keep elbows back",
                    "Full range of motion",
                    "Squeeze at top"
                ],
                donts: [
                    "Don't swing arms",
                    "Don't bring elbows forward",
                    "Don't rush"
                ],
                benefits: [
                    "Stretches bicep fully",
                    "Builds peak",
                    "Toned arms"
                ]
            }
        ]
    },
    {
        day: 3,
        title: "Legs & Cardio",
        exercises: [
            {
                name: "Goblet Squat",
                sets: 4,
                reps: "12 to 15",
                targetMuscle: "Quads, Glutes",
                howToPerform: [
                    "Hold dumbbell or kettlebell at chest",
                    "Feet shoulder-width, toes slightly out",
                    "Squat down keeping chest up",
                    "Drive through heels to stand"
                ],
                dos: [
                    "Keep weight at chest",
                    "Sit between legs",
                    "Keep knees over toes"
                ],
                donts: [
                    "Don't lean forward",
                    "Don't let knees cave",
                    "Don't round back"
                ],
                benefits: [
                    "Full leg workout",
                    "Great form builder",
                    "Burns calories"
                ]
            },
            {
                name: "Walking Lunges",
                sets: 3,
                reps: "12 each leg",
                targetMuscle: "Quads, Glutes",
                howToPerform: [
                    "Hold dumbbells at sides",
                    "Step forward into lunge",
                    "Lower until back knee near ground",
                    "Step through to next lunge"
                ],
                dos: [
                    "Keep torso upright",
                    "Push through front heel",
                    "Take controlled steps"
                ],
                donts: [
                    "Don't let knee go past toes excessively",
                    "Don't lean forward",
                    "Don't rush"
                ],
                benefits: [
                    "Shapes quads and glutes",
                    "Improves balance",
                    "Functional movement"
                ]
            },
            {
                name: "Leg Extension",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Quads",
                howToPerform: [
                    "Sit on machine with ankles behind pad",
                    "Extend legs until straight",
                    "Squeeze quads at top",
                    "Lower with control"
                ],
                dos: [
                    "Keep back against pad",
                    "Full extension",
                    "Controlled tempo"
                ],
                donts: [
                    "Don't hyperextend knees",
                    "Don't swing",
                    "Don't use too much weight"
                ],
                benefits: [
                    "Isolates quads",
                    "Creates definition",
                    "Great pump"
                ]
            },
            {
                name: "Seated Leg Curl",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Hamstrings",
                howToPerform: [
                    "Sit on machine with legs extended",
                    "Curl legs down and under",
                    "Squeeze hamstrings",
                    "Return with control"
                ],
                dos: [
                    "Keep back against pad",
                    "Full range of motion",
                    "Squeeze at contraction"
                ],
                donts: [
                    "Don't lift hips",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Tones hamstrings",
                    "Balanced leg development",
                    "Prevents injury"
                ]
            },
            {
                name: "Stairmaster",
                sets: 1,
                reps: "15 mins",
                targetMuscle: "Glutes, Cardio",
                howToPerform: [
                    "Step on machine at moderate pace",
                    "Hold rails lightly for balance only",
                    "Take full steps",
                    "Maintain steady rhythm"
                ],
                dos: [
                    "Stay upright",
                    "Push through heels",
                    "Steady pace"
                ],
                donts: [
                    "Don't lean on rails",
                    "Don't take tiny steps",
                    "Don't hunch forward"
                ],
                benefits: [
                    "Great glute work",
                    "Excellent cardio",
                    "Low impact"
                ]
            }
        ]
    },
    {
        day: 4,
        title: "Glutes & Hamstrings",
        exercises: [
            {
                name: "Sumo Deadlift",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Glutes, Inner Thighs, Hamstrings",
                howToPerform: [
                    "Wide stance, toes pointed out",
                    "Grip bar inside legs",
                    "Drive through heels, stand up",
                    "Lower with control"
                ],
                dos: [
                    "Keep chest up",
                    "Push knees out",
                    "Lock out at top"
                ],
                donts: [
                    "Don't round back",
                    "Don't let knees cave",
                    "Don't jerk the bar"
                ],
                benefits: [
                    "Excellent hip and glute builder",
                    "Works inner thighs",
                    "Full body strength"
                ]
            },
            {
                name: "Single Leg Hip Thrust",
                sets: 3,
                reps: "10 each leg",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Set up like regular hip thrust",
                    "Extend one leg out",
                    "Thrust up using single leg",
                    "Squeeze and lower controlled"
                ],
                dos: [
                    "Keep hips level",
                    "Full hip extension",
                    "Strong glute squeeze"
                ],
                donts: [
                    "Don't let hips rotate",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Fixes imbalances",
                    "Intense glute work",
                    "Greater muscle activation"
                ]
            },
            {
                name: "Good Morning",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Hamstrings, Glutes, Lower Back",
                howToPerform: [
                    "Bar on upper back like squat",
                    "Slight knee bend, hinge at hips",
                    "Lower torso until parallel",
                    "Drive hips forward to stand"
                ],
                dos: [
                    "Keep back flat",
                    "Feel hamstring stretch",
                    "Control the movement"
                ],
                donts: [
                    "Don't round back",
                    "Don't go too heavy",
                    "Don't bounce at bottom"
                ],
                benefits: [
                    "Strengthens posterior chain",
                    "Improves deadlift",
                    "Great hamstring stretch"
                ]
            },
            {
                name: "Reverse Hyperextension",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Glutes, Lower Back",
                howToPerform: [
                    "Lie face down on machine or bench",
                    "Hold handles, legs hanging",
                    "Raise legs up and back",
                    "Squeeze glutes, lower controlled"
                ],
                dos: [
                    "Keep upper body still",
                    "Squeeze glutes at top",
                    "Control the descent"
                ],
                donts: [
                    "Don't swing legs",
                    "Don't hyperextend",
                    "Don't use momentum"
                ],
                benefits: [
                    "Decompresses spine",
                    "Builds glutes",
                    "Strengthens lower back"
                ]
            },
            {
                name: "Nordic Curl (Assisted)",
                sets: 3,
                reps: "6 to 8",
                targetMuscle: "Hamstrings",
                howToPerform: [
                    "Kneel with ankles secured",
                    "Slowly lower body forward",
                    "Control descent as long as possible",
                    "Push up with hands to return"
                ],
                dos: [
                    "Keep hips extended",
                    "Fight the descent",
                    "Use hands to assist return"
                ],
                donts: [
                    "Don't bend at hips",
                    "Don't fall forward uncontrolled",
                    "Don't skip warm-up"
                ],
                benefits: [
                    "Incredible hamstring builder",
                    "Eccentric strength",
                    "Prevents injuries"
                ]
            }
        ]
    },
    {
        day: 5,
        title: "Push & Core",
        exercises: [
            {
                name: "Incline Dumbbell Press",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Upper Chest, Shoulders",
                howToPerform: [
                    "Lie on incline bench at 30-45 degrees",
                    "Press dumbbells up",
                    "Lower to chest level",
                    "Press back up"
                ],
                dos: [
                    "Keep shoulder blades pinched",
                    "Full range of motion",
                    "Control the weight"
                ],
                donts: [
                    "Don't bounce",
                    "Don't flare elbows",
                    "Don't arch excessively"
                ],
                benefits: [
                    "Lifts and shapes upper chest",
                    "Creates cleavage line",
                    "Balanced development"
                ]
            },
            {
                name: "Military Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Shoulders",
                howToPerform: [
                    "Hold dumbbells at shoulder height",
                    "Press straight overhead",
                    "Lower with control",
                    "Repeat"
                ],
                dos: [
                    "Keep core tight",
                    "Full lockout at top",
                    "Controlled tempo"
                ],
                donts: [
                    "Don't arch back",
                    "Don't use legs",
                    "Don't rush"
                ],
                benefits: [
                    "Builds strong shoulders",
                    "Improves overhead strength",
                    "Capped shoulder look"
                ]
            },
            {
                name: "Dumbbell Fly",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Chest",
                howToPerform: [
                    "Lie on bench, dumbbells above chest",
                    "Slight bend in elbows",
                    "Lower arms out to sides",
                    "Squeeze chest to bring together"
                ],
                dos: [
                    "Keep elbows slightly bent",
                    "Feel the stretch",
                    "Squeeze at top"
                ],
                donts: [
                    "Don't go too deep",
                    "Don't straighten arms",
                    "Don't use too much weight"
                ],
                benefits: [
                    "Stretches chest",
                    "Creates definition",
                    "Shapes the chest"
                ]
            },
            {
                name: "Cable Lateral Raise",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Side Delts",
                howToPerform: [
                    "Stand sideways to low cable",
                    "Raise arm out to side",
                    "Stop at shoulder height",
                    "Lower with control"
                ],
                dos: [
                    "Lead with elbow",
                    "Constant tension",
                    "Controlled movement"
                ],
                donts: [
                    "Don't go above shoulder",
                    "Don't swing",
                    "Don't shrug"
                ],
                benefits: [
                    "Constant cable tension",
                    "Sculpts side delts",
                    "Makes waist look smaller"
                ]
            },
            {
                name: "Hanging Leg Raise",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Lower Abs",
                howToPerform: [
                    "Hang from bar or use captain's chair",
                    "Raise legs up toward chest",
                    "Roll pelvis up at top",
                    "Lower with control"
                ],
                dos: [
                    "Curl pelvis up",
                    "Control the descent",
                    "Minimize swinging"
                ],
                donts: [
                    "Don't just raise legs",
                    "Don't swing",
                    "Don't use momentum"
                ],
                benefits: [
                    "Targets lower abs",
                    "Flattens tummy",
                    "Core strength"
                ]
            },
            {
                name: "Cable Woodchop",
                sets: 3,
                reps: "12 each side",
                targetMuscle: "Obliques, Core",
                howToPerform: [
                    "Stand sideways to high cable",
                    "Pull cable diagonally across body",
                    "Rotate through torso",
                    "Return with control"
                ],
                dos: [
                    "Rotate from core",
                    "Keep arms relatively straight",
                    "Control throughout"
                ],
                donts: [
                    "Don't pull with arms",
                    "Don't rush",
                    "Don't twist hips"
                ],
                benefits: [
                    "Sculpts waistline",
                    "Rotational strength",
                    "Functional core work"
                ]
            }
        ]
    },
    {
        day: 6,
        title: "Full Body Burn",
        exercises: [
            {
                name: "Trap Bar Deadlift",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Full Body",
                howToPerform: [
                    "Stand inside trap bar",
                    "Grip handles, chest up",
                    "Drive through heels to stand",
                    "Lower with control"
                ],
                dos: [
                    "Keep back flat",
                    "Drive hips forward",
                    "Lock out at top"
                ],
                donts: [
                    "Don't round back",
                    "Don't jerk the weight",
                    "Don't lean forward"
                ],
                benefits: [
                    "Full body strength",
                    "Easier on lower back",
                    "Builds overall power"
                ]
            },
            {
                name: "Push Press",
                sets: 3,
                reps: "8 to 10",
                targetMuscle: "Shoulders, Legs",
                howToPerform: [
                    "Hold dumbbells at shoulders",
                    "Slight dip with legs",
                    "Drive through legs, press overhead",
                    "Lower controlled"
                ],
                dos: [
                    "Use leg drive",
                    "Lock out overhead",
                    "Core tight throughout"
                ],
                donts: [
                    "Don't dip too deep",
                    "Don't lean back",
                    "Don't separate movements"
                ],
                benefits: [
                    "Full body power",
                    "Builds shoulders",
                    "Burns calories"
                ]
            },
            {
                name: "Reverse Lunge to High Knee",
                sets: 3,
                reps: "10 each leg",
                targetMuscle: "Glutes, Quads, Core",
                howToPerform: [
                    "Step back into reverse lunge",
                    "Drive through front heel",
                    "Bring back knee up high",
                    "Repeat same leg then switch"
                ],
                dos: [
                    "Powerful drive up",
                    "Core engaged",
                    "Controlled lunge"
                ],
                donts: [
                    "Don't rush",
                    "Don't lose balance",
                    "Don't skip the squeeze"
                ],
                benefits: [
                    "Glute power",
                    "Cardio element",
                    "Balance improvement"
                ]
            },
            {
                name: "Battle Rope Slams",
                sets: 3,
                reps: "30 seconds",
                targetMuscle: "Full Body, Cardio",
                howToPerform: [
                    "Hold rope ends in each hand",
                    "Raise arms overhead",
                    "Slam ropes down with force",
                    "Repeat rapidly"
                ],
                dos: [
                    "Use whole body",
                    "Stay in athletic stance",
                    "Maintain rhythm"
                ],
                donts: [
                    "Don't just use arms",
                    "Don't hold breath",
                    "Don't stand still"
                ],
                benefits: [
                    "Cardio and strength",
                    "Full body workout",
                    "Great calorie burn"
                ]
            },
            {
                name: "Plank to Push-Up",
                sets: 3,
                reps: "10 total",
                targetMuscle: "Core, Arms, Chest",
                howToPerform: [
                    "Start in forearm plank",
                    "Push up to hand one at a time",
                    "Lower back to forearm one at a time",
                    "Alternate leading arm"
                ],
                dos: [
                    "Keep hips stable",
                    "Engage core throughout",
                    "Alternate which arm leads"
                ],
                donts: [
                    "Don't let hips rock",
                    "Don't rush",
                    "Don't hold breath"
                ],
                benefits: [
                    "Core stability",
                    "Arm toning",
                    "Full body engagement"
                ]
            }
        ]
    }
];
