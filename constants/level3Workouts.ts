import type { WorkoutDay } from './workouts';

// Level 3: Advanced - Higher volume, compound movements, supersets
export const LEVEL3_WORKOUTS: WorkoutDay[] = [
    {
        day: 1,
        title: "Push Power",
        exercises: [
            {
                name: "Barbell Bench Press",
                sets: 4,
                reps: "8 to 12",
                targetMuscle: "Chest",
                howToPerform: [
                    "Lie flat on bench, grip bar slightly wider than shoulders",
                    "Unrack bar and lower to mid-chest",
                    "Press bar up explosively",
                    "Lock out at top and repeat"
                ],
                dos: [
                    "Keep shoulder blades retracted",
                    "Drive feet into floor for stability",
                    "Touch chest on every rep",
                    "Keep wrists straight"
                ],
                donts: [
                    "Don't bounce bar off chest",
                    "Don't flare elbows excessively",
                    "Don't lift hips off bench",
                    "Don't use false grip without spotter"
                ],
                benefits: [
                    "King of chest exercises",
                    "Builds overall pressing strength",
                    "Develops chest, shoulders, and triceps",
                    "Great for progressive overload"
                ]
            },
            {
                name: "Incline Dumbbell Press",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Upper Chest",
                howToPerform: [
                    "Set bench to 30-45 degree incline",
                    "Press dumbbells up from shoulder level",
                    "Bring dumbbells together at top",
                    "Lower controlled to stretch position"
                ],
                dos: [
                    "Keep back flat on bench",
                    "Press in slight arc",
                    "Control eccentric portion",
                    "Squeeze chest at top"
                ],
                donts: [
                    "Don't set incline too high",
                    "Don't bounce at bottom",
                    "Don't let elbows drift back",
                    "Don't use momentum"
                ],
                benefits: [
                    "Targets clavicular head of chest",
                    "Creates full chest development",
                    "Independent arm movement for balance",
                    "Greater range of motion than barbell"
                ]
            },
            {
                name: "Military Press",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Shoulder",
                howToPerform: [
                    "Stand with bar at collar bone height",
                    "Press bar directly overhead",
                    "Lock out at top",
                    "Lower controlled to start"
                ],
                dos: [
                    "Keep core braced tight",
                    "Press in straight line",
                    "Tuck chin slightly as bar passes",
                    "Full lockout each rep"
                ],
                donts: [
                    "Don't lean back excessively",
                    "Don't use leg drive (strict)",
                    "Don't press forward of head",
                    "Don't round lower back"
                ],
                benefits: [
                    "Builds overhead pressing power",
                    "Develops all three deltoid heads",
                    "Improves core stability",
                    "Functional strength for daily life"
                ]
            },
            {
                name: "Dumbbell Lateral Raise (Drop Set)",
                sets: 3,
                reps: "12 + 8 (drop)",
                targetMuscle: "Lateral Deltoid",
                howToPerform: [
                    "Do 12 reps with heavy weight",
                    "Immediately drop to lighter weight",
                    "Complete 8 more reps",
                    "Rest and repeat"
                ],
                dos: [
                    "Lead with elbows",
                    "Keep slight bend in elbows",
                    "Control the tempo",
                    "Take minimal rest during drop"
                ],
                donts: [
                    "Don't swing or use momentum",
                    "Don't raise above shoulder height",
                    "Don't shrug shoulders",
                    "Don't take long rest between drops"
                ],
                benefits: [
                    "Maximizes muscle fatigue",
                    "Builds shoulder width",
                    "Creates muscle pump and metabolic stress",
                    "Efficient time under tension"
                ]
            },
            {
                name: "Weighted Dips",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Chest, Tricep",
                howToPerform: [
                    "Add weight with belt or hold dumbbell",
                    "Lower body until upper arms parallel",
                    "Press back up to lockout",
                    "Keep slight forward lean for chest"
                ],
                dos: [
                    "Lean forward to target chest",
                    "Keep elbows slightly tucked",
                    "Go deep for full range",
                    "Control the descent"
                ],
                donts: [
                    "Don't swing or kip",
                    "Don't go too heavy too soon",
                    "Don't flare elbows wide",
                    "Don't bounce at bottom"
                ],
                benefits: [
                    "Compound chest and tricep builder",
                    "Progressive overload with weight",
                    "Functional pushing strength",
                    "Develops lower chest"
                ]
            },
            {
                name: "Skull Crushers",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Tricep",
                howToPerform: [
                    "Lie on bench with EZ bar overhead",
                    "Lower bar toward forehead",
                    "Extend arms without moving elbows",
                    "Squeeze triceps at top"
                ],
                dos: [
                    "Keep elbows stationary",
                    "Lower slowly with control",
                    "Full extension at top",
                    "Keep upper arms vertical"
                ],
                donts: [
                    "Don't flare elbows out",
                    "Don't let bar drift toward forehead",
                    "Don't use momentum",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Isolates triceps long head",
                    "Builds arm mass",
                    "Improves lockout strength",
                    "Great tricep stretch"
                ]
            },
            {
                name: "Cable Crossover",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Chest",
                howToPerform: [
                    "Stand center of cable station",
                    "Set cables at high position",
                    "Bring arms together in arc motion",
                    "Squeeze chest at center"
                ],
                dos: [
                    "Keep slight bend in elbows",
                    "Focus on chest squeeze",
                    "Control return phase",
                    "Step forward for stretch"
                ],
                donts: [
                    "Don't stand too far forward",
                    "Don't use too much weight",
                    "Don't rush the reps",
                    "Don't round shoulders"
                ],
                benefits: [
                    "Constant tension on chest",
                    "Great for chest isolation",
                    "Perfect finishing exercise",
                    "Develops inner chest definition"
                ]
            }
        ]
    },
    {
        day: 2,
        title: "Pull Power",
        exercises: [
            {
                name: "Weighted Pull-ups",
                sets: 4,
                reps: "6 to 10",
                targetMuscle: "Back, Bicep",
                howToPerform: [
                    "Add weight with belt or hold dumbbell",
                    "Hang with arms fully extended",
                    "Pull chin above bar",
                    "Lower with control"
                ],
                dos: [
                    "Lead with chest toward bar",
                    "Full extension at bottom",
                    "Squeeze lats at top",
                    "Control the negative"
                ],
                donts: [
                    "Don't swing or kip",
                    "Don't use momentum",
                    "Don't do half reps",
                    "Don't add too much weight too soon"
                ],
                benefits: [
                    "Ultimate back builder",
                    "Functional relative strength",
                    "Develops V-taper",
                    "Builds grip strength"
                ]
            },
            {
                name: "Barbell Row",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Back",
                howToPerform: [
                    "Hinge forward holding barbell",
                    "Pull bar to lower chest/upper abs",
                    "Squeeze shoulder blades together",
                    "Lower controlled"
                ],
                dos: [
                    "Keep back flat throughout",
                    "Pull with elbows driving back",
                    "Maintain hip hinge position",
                    "Brace core tight"
                ],
                donts: [
                    "Don't round lower back",
                    "Don't stand up during row",
                    "Don't use momentum",
                    "Don't jerk the weight"
                ],
                benefits: [
                    "Builds thick back muscles",
                    "Develops posterior chain",
                    "Improves deadlift strength",
                    "Enhances posture"
                ]
            },
            {
                name: "Single-Arm Dumbbell Row",
                sets: 3,
                reps: "10 to 12 each",
                targetMuscle: "Lats, Rhomboids",
                howToPerform: [
                    "Place knee and hand on bench",
                    "Row dumbbell to hip",
                    "Squeeze lat at top",
                    "Lower with stretch"
                ],
                dos: [
                    "Keep back flat",
                    "Rotate torso slightly at top",
                    "Full stretch at bottom",
                    "Drive elbow toward ceiling"
                ],
                donts: [
                    "Don't round upper back",
                    "Don't rotate excessively",
                    "Don't use momentum",
                    "Don't let weight drop"
                ],
                benefits: [
                    "Unilateral back training",
                    "Fixes muscle imbalances",
                    "Great lat stretch and contraction",
                    "Core engagement"
                ]
            },
            {
                name: "Meadows Row",
                sets: 3,
                reps: "10 to 12 each",
                targetMuscle: "Lats, Upper Back",
                howToPerform: [
                    "Wedge barbell in corner or landmine",
                    "Stand perpendicular to bar",
                    "Row bar to side of chest",
                    "Lower controlled"
                ],
                dos: [
                    "Stagger stance for stability",
                    "Pull elbow high and back",
                    "Rotate torso slightly",
                    "Squeeze at top"
                ],
                donts: [
                    "Don't stand too far from bar",
                    "Don't use momentum",
                    "Don't round back",
                    "Don't rush the movement"
                ],
                benefits: [
                    "Unique angle for lat development",
                    "Great for upper lat thickness",
                    "Challenging variation",
                    "Developed by John Meadows"
                ]
            },
            {
                name: "Face Pull (Pause Rep)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Rear Deltoid, Rotator Cuff",
                howToPerform: [
                    "Set cable at face height",
                    "Pull rope toward face",
                    "Hold and squeeze for 2 seconds",
                    "Return controlled"
                ],
                dos: [
                    "Keep elbows high",
                    "External rotate at end",
                    "Squeeze rear delts hard",
                    "Use controlled tempo"
                ],
                donts: [
                    "Don't use too much weight",
                    "Don't pull to chest",
                    "Don't rush the pause",
                    "Don't lean back"
                ],
                benefits: [
                    "Improves shoulder health",
                    "Balances pushing movements",
                    "Develops rear delts",
                    "Pause increases time under tension"
                ]
            },
            {
                name: "Barbell Curl",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Bicep",
                howToPerform: [
                    "Stand with barbell, underhand grip",
                    "Curl bar up to shoulder level",
                    "Squeeze biceps at top",
                    "Lower controlled"
                ],
                dos: [
                    "Keep elbows pinned at sides",
                    "Control the negative",
                    "Full range of motion",
                    "Stand tall"
                ],
                donts: [
                    "Don't swing body",
                    "Don't move elbows forward",
                    "Don't use momentum",
                    "Don't lean back"
                ],
                benefits: [
                    "Classic bicep mass builder",
                    "Heavy loading potential",
                    "Builds peak and thickness",
                    "Improves grip strength"
                ]
            },
            {
                name: "Hammer Curl (Cross Body)",
                sets: 3,
                reps: "10 to 12 each",
                targetMuscle: "Brachialis, Bicep",
                howToPerform: [
                    "Hold dumbbell with neutral grip",
                    "Curl across body toward opposite shoulder",
                    "Squeeze at top",
                    "Lower and repeat other side"
                ],
                dos: [
                    "Keep elbow stationary",
                    "Cross fully toward opposite pec",
                    "Control the motion",
                    "Alternate arms"
                ],
                donts: [
                    "Don't swing or use momentum",
                    "Don't rush the movement",
                    "Don't let elbow drift",
                    "Don't use excessive weight"
                ],
                benefits: [
                    "Targets brachialis for arm thickness",
                    "Unique angle for bicep development",
                    "Improves grip and forearm",
                    "Builds arm width"
                ]
            }
        ]
    },
    {
        day: 3,
        title: "Legs: Quad Focus",
        exercises: [
            {
                name: "Barbell Back Squat",
                sets: 4,
                reps: "6 to 10",
                targetMuscle: "Quadriceps, Glutes",
                howToPerform: [
                    "Position bar on upper back",
                    "Unrack and step back",
                    "Squat to parallel or below",
                    "Drive up through heels"
                ],
                dos: [
                    "Keep chest up throughout",
                    "Brace core tight before descent",
                    "Drive knees out over toes",
                    "Full depth each rep"
                ],
                donts: [
                    "Don't let knees cave in",
                    "Don't round lower back",
                    "Don't lean too far forward",
                    "Don't bounce at bottom"
                ],
                benefits: [
                    "King of leg exercises",
                    "Builds overall lower body mass",
                    "Increases testosterone and growth hormone",
                    "Functional strength foundation"
                ]
            },
            {
                name: "Hack Squat",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Quadriceps",
                howToPerform: [
                    "Position on hack squat machine",
                    "Place feet low on platform",
                    "Lower until thighs parallel",
                    "Press up through quads"
                ],
                dos: [
                    "Keep back flat on pad",
                    "Push through balls of feet",
                    "Control the descent",
                    "Full lockout at top"
                ],
                donts: [
                    "Don't let knees track too far forward",
                    "Don't bounce at bottom",
                    "Don't round lower back",
                    "Don't lock knees aggressively"
                ],
                benefits: [
                    "Isolates quads effectively",
                    "Reduces lower back stress",
                    "Great for quad sweep",
                    "Heavy loading potential"
                ]
            },
            {
                name: "Walking Lunges",
                sets: 3,
                reps: "12 each leg",
                targetMuscle: "Quadriceps, Glutes",
                howToPerform: [
                    "Hold dumbbells at sides",
                    "Step forward into lunge",
                    "Drive through front heel",
                    "Step forward with rear leg and repeat"
                ],
                dos: [
                    "Keep torso upright",
                    "Long stride for glute emphasis",
                    "Control each step",
                    "Drive through heel"
                ],
                donts: [
                    "Don't let front knee track over toes excessively",
                    "Don't lean forward",
                    "Don't rush the movement",
                    "Don't take short steps"
                ],
                benefits: [
                    "Unilateral leg development",
                    "Improves balance and coordination",
                    "Functional movement pattern",
                    "Great metabolic stress"
                ]
            },
            {
                name: "Leg Extension (Drop Set)",
                sets: 3,
                reps: "12 + 10 + 8 (drop)",
                targetMuscle: "Quadriceps",
                howToPerform: [
                    "Complete 12 reps at heavy weight",
                    "Drop weight and do 10 reps",
                    "Drop again and do 8 reps",
                    "Minimal rest between drops"
                ],
                dos: [
                    "Squeeze quad at top",
                    "Control the negative",
                    "Quick transitions between drops",
                    "Push through the burn"
                ],
                donts: [
                    "Don't swing weight",
                    "Don't hyperextend knees",
                    "Don't rest too long between drops",
                    "Don't sacrifice form for reps"
                ],
                benefits: [
                    "Maximizes quad exhaustion",
                    "Creates massive pump",
                    "Efficient metabolic stress",
                    "Great finishing exercise"
                ]
            },
            {
                name: "Sissy Squat",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Quadriceps",
                howToPerform: [
                    "Hold onto support for balance",
                    "Rise onto balls of feet",
                    "Lean back while bending knees",
                    "Return to standing"
                ],
                dos: [
                    "Keep hips forward",
                    "Lean back as you descend",
                    "Rise onto toes",
                    "Control throughout"
                ],
                donts: [
                    "Don't let hips shoot back",
                    "Don't go too deep if uncomfortable",
                    "Don't rush",
                    "Don't lose balance"
                ],
                benefits: [
                    "Extreme quad stretch and contraction",
                    "Builds quad sweep",
                    "Old school bodybuilder exercise",
                    "No equipment needed"
                ]
            },
            {
                name: "Standing Calf Raise",
                sets: 4,
                reps: "12 to 15",
                targetMuscle: "Gastrocnemius",
                howToPerform: [
                    "Stand on calf machine platform",
                    "Lower heels for deep stretch",
                    "Rise up on toes as high as possible",
                    "Pause at top and lower"
                ],
                dos: [
                    "Full range of motion",
                    "Pause at top and bottom",
                    "Control the negative",
                    "Squeeze calves hard"
                ],
                donts: [
                    "Don't bounce at bottom",
                    "Don't use partial reps",
                    "Don't bend knees",
                    "Don't rush"
                ],
                benefits: [
                    "Builds calf size and strength",
                    "Targets gastrocnemius",
                    "Improves ankle mobility",
                    "Athletic performance"
                ]
            }
        ]
    },
    {
        day: 4,
        title: "Push Hypertrophy",
        exercises: [
            {
                name: "Dumbbell Bench Press",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Chest",
                howToPerform: [
                    "Lie flat with dumbbells at chest",
                    "Press dumbbells up together",
                    "Lower to deep stretch",
                    "Control each rep"
                ],
                dos: [
                    "Keep shoulder blades retracted",
                    "Let dumbbells touch at top",
                    "Full stretch at bottom",
                    "Keep feet planted"
                ],
                donts: [
                    "Don't bounce dumbbells off chest",
                    "Don't flare elbows too wide",
                    "Don't lift hips",
                    "Don't use momentum"
                ],
                benefits: [
                    "Greater range of motion",
                    "Balances strength between sides",
                    "Develops chest fully",
                    "Shoulder-friendly pressing"
                ]
            },
            {
                name: "Decline Dumbbell Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Lower Chest",
                howToPerform: [
                    "Lie on decline bench",
                    "Press dumbbells up from chest",
                    "Lower to stretch position",
                    "Press back up"
                ],
                dos: [
                    "Keep back flat on bench",
                    "Control the descent",
                    "Touch dumbbells at top",
                    "Full range of motion"
                ],
                donts: [
                    "Don't set decline too steep",
                    "Don't bounce",
                    "Don't let elbows flare excessively",
                    "Don't rush"
                ],
                benefits: [
                    "Targets lower chest",
                    "Complete chest development",
                    "Different angle of stress",
                    "Builds chest fullness"
                ]
            },
            {
                name: "Arnold Press",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Shoulder",
                howToPerform: [
                    "Start with palms facing you at shoulder level",
                    "Rotate palms outward as you press up",
                    "Finish with palms forward at top",
                    "Reverse motion on descent"
                ],
                dos: [
                    "Smooth rotation throughout",
                    "Full lockout at top",
                    "Control the negative",
                    "Keep core tight"
                ],
                donts: [
                    "Don't rush the rotation",
                    "Don't use momentum",
                    "Don't arch back",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Hits all three delt heads",
                    "Developed by Arnold Schwarzenegger",
                    "Greater time under tension",
                    "Unique rotational stress"
                ]
            },
            {
                name: "Cable Lateral Raise",
                sets: 3,
                reps: "12 to 15 each",
                targetMuscle: "Lateral Deltoid",
                howToPerform: [
                    "Stand sideways to low cable",
                    "Raise arm out to side",
                    "Hold at shoulder height",
                    "Lower controlled"
                ],
                dos: [
                    "Lead with elbow",
                    "Keep slight bend in elbow",
                    "Constant tension",
                    "Squeeze at top"
                ],
                donts: [
                    "Don't lean away",
                    "Don't swing",
                    "Don't go above shoulder height",
                    "Don't rush"
                ],
                benefits: [
                    "Constant cable tension",
                    "Great for lateral delt isolation",
                    "Unilateral training",
                    "Better mind-muscle connection"
                ]
            },
            {
                name: "Close-Grip Bench Press",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Tricep, Chest",
                howToPerform: [
                    "Grip bar shoulder-width or narrower",
                    "Lower bar to lower chest",
                    "Press up focusing on triceps",
                    "Full lockout"
                ],
                dos: [
                    "Keep elbows close to body",
                    "Touch lower chest",
                    "Drive through triceps",
                    "Control the negative"
                ],
                donts: [
                    "Don't grip too narrow (wrist strain)",
                    "Don't flare elbows",
                    "Don't bounce bar",
                    "Don't rush"
                ],
                benefits: [
                    "Heavy tricep loading",
                    "Compound movement for arms",
                    "Improves lockout strength",
                    "Builds tricep mass"
                ]
            },
            {
                name: "Overhead Tricep Extension",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Tricep (Long Head)",
                howToPerform: [
                    "Hold dumbbell or cable overhead",
                    "Lower behind head with elbows high",
                    "Extend arms fully",
                    "Squeeze triceps at top"
                ],
                dos: [
                    "Keep elbows pointing up",
                    "Full stretch at bottom",
                    "Control the motion",
                    "Squeeze at top"
                ],
                donts: [
                    "Don't let elbows flare out",
                    "Don't arch back",
                    "Don't use momentum",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Stretches long head fully",
                    "Builds tricep mass",
                    "Improves overhead stability",
                    "Great isolation exercise"
                ]
            },
            {
                name: "Machine Fly (Rest-Pause)",
                sets: 3,
                reps: "15 + 8 + 5",
                targetMuscle: "Chest",
                howToPerform: [
                    "Do 15 reps to near failure",
                    "Rest 15 seconds",
                    "Do more reps to failure",
                    "Rest 15 seconds and repeat"
                ],
                dos: [
                    "Push through the burn",
                    "Count exact rest periods",
                    "Squeeze chest hard",
                    "Maintain form"
                ],
                donts: [
                    "Don't rest too long",
                    "Don't sacrifice form",
                    "Don't give up early",
                    "Don't overstretch shoulders"
                ],
                benefits: [
                    "Maximizes chest fatigue",
                    "Intense finishing technique",
                    "Great pump and metabolic stress",
                    "Time-efficient intensity"
                ]
            }
        ]
    },
    {
        day: 5,
        title: "Legs: Posterior Chain",
        exercises: [
            {
                name: "Romanian Deadlift",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Hamstring, Glutes",
                howToPerform: [
                    "Hold barbell at hips",
                    "Hinge at hips pushing butt back",
                    "Lower bar along legs to mid-shin",
                    "Drive hips forward to stand"
                ],
                dos: [
                    "Keep back flat throughout",
                    "Feel stretch in hamstrings",
                    "Drive through heels",
                    "Squeeze glutes at top"
                ],
                donts: [
                    "Don't round lower back",
                    "Don't bend knees excessively",
                    "Don't look up (keep neck neutral)",
                    "Don't go too low"
                ],
                benefits: [
                    "Primary hamstring builder",
                    "Develops hip hinge pattern",
                    "Strengthens entire posterior chain",
                    "Improves deadlift strength"
                ]
            },
            {
                name: "Bulgarian Split Squat",
                sets: 3,
                reps: "10 to 12 each",
                targetMuscle: "Glutes, Quadriceps",
                howToPerform: [
                    "Place rear foot on bench behind you",
                    "Lower until front thigh parallel",
                    "Drive through front heel",
                    "Return to start"
                ],
                dos: [
                    "Keep torso upright",
                    "Lean slightly forward for glute focus",
                    "Drive through heel",
                    "Full range of motion"
                ],
                donts: [
                    "Don't let front knee cave",
                    "Don't lean too far forward",
                    "Don't rush the movement",
                    "Don't push off back foot"
                ],
                benefits: [
                    "Unilateral glute and quad builder",
                    "Improves balance and stability",
                    "Addresses muscle imbalances",
                    "Intense without heavy weights"
                ]
            },
            {
                name: "Lying Leg Curl",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Hamstring",
                howToPerform: [
                    "Lie face down on leg curl machine",
                    "Curl legs up toward glutes",
                    "Squeeze hamstrings at top",
                    "Lower with control"
                ],
                dos: [
                    "Keep hips pressed down",
                    "Full contraction at top",
                    "Slow negative",
                    "Point toes down"
                ],
                donts: [
                    "Don't lift hips off pad",
                    "Don't swing weight",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Isolates hamstrings effectively",
                    "Builds hamstring mass",
                    "Reduces injury risk",
                    "Great for knee health"
                ]
            },
            {
                name: "Glute Bridge (Barbell)",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Sit with back against bench, barbell over hips",
                    "Drive hips up until body is straight",
                    "Squeeze glutes hard at top",
                    "Lower controlled"
                ],
                dos: [
                    "Drive through heels",
                    "Chin tucked at top",
                    "Pause and squeeze at top",
                    "Full hip extension"
                ],
                donts: [
                    "Don't hyperextend lower back",
                    "Don't push through toes",
                    "Don't rush",
                    "Don't use too much weight initially"
                ],
                benefits: [
                    "Primary glute builder",
                    "Heavy loading for glutes",
                    "Improves hip extension power",
                    "Athletic performance"
                ]
            },
            {
                name: "Good Morning",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Hamstring, Lower Back",
                howToPerform: [
                    "Place barbell on upper back",
                    "Hinge at hips keeping back flat",
                    "Lower torso until parallel or slightly below",
                    "Return to standing"
                ],
                dos: [
                    "Keep back flat throughout",
                    "Slight bend in knees",
                    "Feel hamstring stretch",
                    "Control the motion"
                ],
                donts: [
                    "Don't round lower back",
                    "Don't go too heavy",
                    "Don't lock knees straight",
                    "Don't look up at bottom"
                ],
                benefits: [
                    "Strengthens entire posterior chain",
                    "Improves hip hinge",
                    "Great for lower back strength",
                    "Transfers to deadlift and squat"
                ]
            },
            {
                name: "Seated Calf Raise",
                sets: 4,
                reps: "15 to 20",
                targetMuscle: "Soleus",
                howToPerform: [
                    "Sit on calf raise machine",
                    "Lower heels for deep stretch",
                    "Press up on balls of feet",
                    "Squeeze and lower controlled"
                ],
                dos: [
                    "Full range of motion",
                    "Pause at top and bottom",
                    "Slow controlled tempo",
                    "Focus on soleus contraction"
                ],
                donts: [
                    "Don't bounce",
                    "Don't use partial reps",
                    "Don't rush",
                    "Don't let knees lift off pad"
                ],
                benefits: [
                    "Targets soleus muscle",
                    "Complete calf development",
                    "Improves ankle stability",
                    "Endurance benefits"
                ]
            }
        ]
    },
    {
        day: 6,
        title: "Arms & Core Intensity",
        exercises: [
            {
                name: "Preacher Curl",
                sets: 4,
                reps: "10 to 12",
                targetMuscle: "Bicep (Short Head)",
                howToPerform: [
                    "Sit at preacher bench with arms on pad",
                    "Curl bar up toward shoulders",
                    "Squeeze at top",
                    "Lower with full stretch"
                ],
                dos: [
                    "Keep upper arms flat on pad",
                    "Full extension at bottom",
                    "Control the negative",
                    "Squeeze biceps hard"
                ],
                donts: [
                    "Don't lift elbows off pad",
                    "Don't swing body",
                    "Don't use momentum",
                    "Don't hyperextend at bottom"
                ],
                benefits: [
                    "Isolates biceps completely",
                    "Develops bicep peak",
                    "No momentum possible",
                    "Great stretch and contraction"
                ]
            },
            {
                name: "Incline Dumbbell Curl",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Bicep (Long Head)",
                howToPerform: [
                    "Lie back on incline bench (45 degrees)",
                    "Let arms hang with dumbbells",
                    "Curl up toward shoulders",
                    "Lower with control"
                ],
                dos: [
                    "Let arms stretch at bottom",
                    "Keep elbows back",
                    "Control the motion",
                    "Squeeze at top"
                ],
                donts: [
                    "Don't swing body",
                    "Don't bring elbows forward",
                    "Don't rush",
                    "Don't use heavy weights initially"
                ],
                benefits: [
                    "Maximizes long head stretch",
                    "Builds bicep peak",
                    "Great stretch under load",
                    "Isolates biceps effectively"
                ]
            },
            {
                name: "Tricep Dip (Weighted)",
                sets: 4,
                reps: "8 to 10",
                targetMuscle: "Tricep",
                howToPerform: [
                    "Use parallel bars or bench",
                    "Add weight with belt or hold dumbbell",
                    "Lower until upper arms parallel",
                    "Press up to lockout"
                ],
                dos: [
                    "Keep body vertical for tricep focus",
                    "Elbows close to body",
                    "Full lockout each rep",
                    "Control descent"
                ],
                donts: [
                    "Don't lean forward (less tricep)",
                    "Don't flare elbows",
                    "Don't bounce at bottom",
                    "Don't rush"
                ],
                benefits: [
                    "Heavy compound tricep exercise",
                    "Builds overall tricep mass",
                    "Improves pressing strength",
                    "Functional movement"
                ]
            },
            {
                name: "Reverse Grip Pushdown",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Tricep (Medial Head)",
                howToPerform: [
                    "Stand at cable with underhand grip",
                    "Keep elbows at sides",
                    "Push down until arms straight",
                    "Return controlled"
                ],
                dos: [
                    "Keep elbows pinned",
                    "Squeeze at bottom",
                    "Control the motion",
                    "Stand tall"
                ],
                donts: [
                    "Don't let elbows move",
                    "Don't lean forward",
                    "Don't use momentum",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Targets medial head uniquely",
                    "Complete tricep development",
                    "Constant cable tension",
                    "Great finishing exercise"
                ]
            },
            {
                name: "Hanging Leg Raise",
                sets: 4,
                reps: "12 to 15",
                targetMuscle: "Lower Abs",
                howToPerform: [
                    "Hang from pull-up bar",
                    "Raise legs up to horizontal or higher",
                    "Lower with control",
                    "Avoid swinging"
                ],
                dos: [
                    "Keep core tight",
                    "Control the descent",
                    "Go as high as possible",
                    "Breathe steadily"
                ],
                donts: [
                    "Don't swing",
                    "Don't use momentum",
                    "Don't drop legs quickly",
                    "Don't arch back"
                ],
                benefits: [
                    "Intense lower ab exercise",
                    "Builds core strength",
                    "Improves grip strength",
                    "Develops six-pack definition"
                ]
            },
            {
                name: "Cable Crunch",
                sets: 3,
                reps: "15 to 20",
                targetMuscle: "Abdominal",
                howToPerform: [
                    "Kneel at cable machine with rope",
                    "Hold rope at sides of head",
                    "Crunch down bringing elbows to knees",
                    "Return controlled"
                ],
                dos: [
                    "Focus on ab contraction",
                    "Curl spine, don't just bow",
                    "Exhale as you crunch",
                    "Squeeze abs hard"
                ],
                donts: [
                    "Don't pull with arms",
                    "Don't sit back on heels",
                    "Don't use momentum",
                    "Don't go too fast"
                ],
                benefits: [
                    "Progressive ab training",
                    "Great for ab development",
                    "Loaded spinal flexion",
                    "Builds thick abs"
                ]
            },
            {
                name: "Plank (Weighted)",
                sets: 3,
                reps: "45 to 60 sec",
                targetMuscle: "Full Core",
                howToPerform: [
                    "Get in plank position on forearms",
                    "Have partner place plate on back",
                    "Hold position with tension",
                    "Breathe steadily"
                ],
                dos: [
                    "Keep body in straight line",
                    "Squeeze abs and glutes",
                    "Don't let hips sag or pike",
                    "Breathe normally"
                ],
                donts: [
                    "Don't hold breath",
                    "Don't let hips drop",
                    "Don't look up",
                    "Don't start with too much weight"
                ],
                benefits: [
                    "Advanced core stability",
                    "Full core engagement",
                    "Progressive overload for abs",
                    "Functional strength"
                ]
            },
            {
                name: "Russian Twist (Weighted)",
                sets: 3,
                reps: "20 total",
                targetMuscle: "Obliques",
                howToPerform: [
                    "Sit holding weight with feet elevated",
                    "Rotate torso side to side",
                    "Touch weight to floor each side",
                    "Keep abs engaged"
                ],
                dos: [
                    "Keep feet off floor",
                    "Rotate from core, not arms",
                    "Control the motion",
                    "Breathe steadily"
                ],
                donts: [
                    "Don't just move arms",
                    "Don't drop feet",
                    "Don't rush",
                    "Don't round back"
                ],
                benefits: [
                    "Builds rotational core strength",
                    "Develops obliques",
                    "Athletic core training",
                    "Functional movement pattern"
                ]
            }
        ]
    }
];
