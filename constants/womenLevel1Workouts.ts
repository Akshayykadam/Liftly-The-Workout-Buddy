import type { WorkoutDay } from './workouts';

// Women's Level 1: Beginner - Lower volume, machine-focused, glute emphasis
export const WOMEN_LEVEL1_WORKOUTS: WorkoutDay[] = [
    {
        day: 1,
        title: "Lower Body & Glutes",
        exercises: [
            {
                name: "Hip Thrust (Machine)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Sit on hip thrust machine with upper back against pad",
                    "Place feet flat on platform hip-width apart",
                    "Drive through heels to lift hips toward ceiling",
                    "Squeeze glutes hard at the top",
                    "Lower with control"
                ],
                dos: [
                    "Keep chin tucked throughout",
                    "Drive through your heels",
                    "Squeeze glutes at top for 1-2 seconds"
                ],
                donts: [
                    "Don't hyperextend your lower back",
                    "Don't rush the movement",
                    "Don't use momentum"
                ],
                benefits: [
                    "Best exercise for glute development",
                    "Safe and beginner-friendly",
                    "Builds a strong posterior chain"
                ]
            },
            {
                name: "Leg Press (Feet High)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Glutes, Hamstrings",
                howToPerform: [
                    "Sit on leg press with back against pad",
                    "Place feet high on platform, shoulder-width",
                    "Lower platform until knees at 90 degrees",
                    "Press through heels to return"
                ],
                dos: [
                    "Keep lower back pressed against pad",
                    "Push through your heels",
                    "Focus on glute activation"
                ],
                donts: [
                    "Don't lock knees at top",
                    "Don't let knees cave inward",
                    "Don't lift hips off pad"
                ],
                benefits: [
                    "High foot placement emphasizes glutes",
                    "Safe for beginners",
                    "Builds lower body strength"
                ]
            },
            {
                name: "Romanian Deadlift (Dumbbell)",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Hamstrings, Glutes",
                howToPerform: [
                    "Hold dumbbells in front of thighs",
                    "Hinge at hips, pushing butt back",
                    "Keep slight bend in knees",
                    "Lower until stretch in hamstrings",
                    "Drive hips forward to return"
                ],
                dos: [
                    "Keep back flat throughout",
                    "Feel stretch in hamstrings",
                    "Squeeze glutes at top"
                ],
                donts: [
                    "Don't round your back",
                    "Don't bend knees too much",
                    "Don't go too heavy initially"
                ],
                benefits: [
                    "Excellent hamstring and glute builder",
                    "Improves hip hinge pattern",
                    "Develops posterior chain"
                ]
            },
            {
                name: "Cable Kickback",
                sets: 2,
                reps: "12 to 15 each leg",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Attach ankle strap to low cable",
                    "Face machine, hold handles for balance",
                    "Kick leg straight back",
                    "Squeeze glute at top",
                    "Return with control"
                ],
                dos: [
                    "Keep core tight",
                    "Focus on the squeeze",
                    "Move slowly and controlled"
                ],
                donts: [
                    "Don't arch lower back excessively",
                    "Don't use momentum",
                    "Don't swing the leg"
                ],
                benefits: [
                    "Isolates each glute individually",
                    "Great for glute activation",
                    "Shapes and tones"
                ]
            },
            {
                name: "Standing Calf Raise",
                sets: 3,
                reps: "15 to 20",
                targetMuscle: "Calves",
                howToPerform: [
                    "Stand on calf raise machine",
                    "Lower heels for stretch",
                    "Rise up on toes as high as possible",
                    "Squeeze at top, lower with control"
                ],
                dos: [
                    "Use full range of motion",
                    "Pause at top and bottom",
                    "Keep legs straight"
                ],
                donts: [
                    "Don't bounce",
                    "Don't rush",
                    "Don't use partial reps"
                ],
                benefits: [
                    "Develops shapely calves",
                    "Improves ankle stability",
                    "Easy to learn"
                ]
            }
        ]
    },
    {
        day: 2,
        title: "Upper Body Tone",
        exercises: [
            {
                name: "Lat Pulldown",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Back",
                howToPerform: [
                    "Sit with thighs under pads",
                    "Grip bar slightly wider than shoulders",
                    "Pull bar to upper chest",
                    "Squeeze shoulder blades together",
                    "Return with control"
                ],
                dos: [
                    "Keep chest up and proud",
                    "Pull elbows down and back",
                    "Focus on back muscles"
                ],
                donts: [
                    "Don't pull behind neck",
                    "Don't swing body",
                    "Don't use too much weight"
                ],
                benefits: [
                    "Builds a toned back",
                    "Creates nice V-taper",
                    "Improves posture"
                ]
            },
            {
                name: "Chest Press Machine",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Chest",
                howToPerform: [
                    "Sit with back flat against pad",
                    "Grip handles at chest level",
                    "Press forward until arms extend",
                    "Return with control"
                ],
                dos: [
                    "Keep shoulders back",
                    "Exhale as you push",
                    "Control the movement"
                ],
                donts: [
                    "Don't lock elbows",
                    "Don't arch your back",
                    "Don't shrug shoulders"
                ],
                benefits: [
                    "Tones chest muscles",
                    "Safe for beginners",
                    "Improves upper body strength"
                ]
            },
            {
                name: "Seated Shoulder Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Shoulders",
                howToPerform: [
                    "Sit on bench with back support",
                    "Hold dumbbells at shoulder height",
                    "Press overhead until arms extend",
                    "Lower with control"
                ],
                dos: [
                    "Keep core tight",
                    "Press in slight arc",
                    "Control the weight"
                ],
                donts: [
                    "Don't arch lower back",
                    "Don't go too heavy",
                    "Don't lock elbows hard"
                ],
                benefits: [
                    "Shapes shoulders beautifully",
                    "Builds upper body strength",
                    "Improves posture"
                ]
            },
            {
                name: "Tricep Pushdown",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Triceps",
                howToPerform: [
                    "Stand at cable machine with rope attachment",
                    "Keep elbows pinned to sides",
                    "Push down until arms straight",
                    "Squeeze triceps, return controlled"
                ],
                dos: [
                    "Keep elbows stationary",
                    "Squeeze at the bottom",
                    "Use controlled movements"
                ],
                donts: [
                    "Don't flare elbows",
                    "Don't lean too far forward",
                    "Don't use momentum"
                ],
                benefits: [
                    "Tones back of arms",
                    "Reduces arm jiggle",
                    "Easy to learn"
                ]
            },
            {
                name: "Dumbbell Bicep Curl",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Biceps",
                howToPerform: [
                    "Stand holding dumbbells at sides",
                    "Curl weights toward shoulders",
                    "Keep elbows fixed",
                    "Lower with control"
                ],
                dos: [
                    "Keep upper arms stationary",
                    "Squeeze biceps at top",
                    "Use full range of motion"
                ],
                donts: [
                    "Don't swing body",
                    "Don't rush",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Tones arms",
                    "Builds bicep definition",
                    "Functional strength"
                ]
            }
        ]
    },
    {
        day: 3,
        title: "Core & Cardio",
        exercises: [
            {
                name: "Incline Treadmill Walk",
                sets: 1,
                reps: "15 mins",
                targetMuscle: "Cardiovascular, Glutes",
                howToPerform: [
                    "Set treadmill to 10-12% incline",
                    "Walk at 3-3.5 mph pace",
                    "Keep hands off rails",
                    "Maintain upright posture"
                ],
                dos: [
                    "Keep chest up",
                    "Swing arms naturally",
                    "Focus on glute activation"
                ],
                donts: [
                    "Don't hold onto rails",
                    "Don't hunch forward",
                    "Don't start too fast"
                ],
                benefits: [
                    "Burns fat effectively",
                    "Activates glutes",
                    "Low impact cardio"
                ]
            },
            {
                name: "Plank",
                sets: 3,
                reps: "30 seconds",
                targetMuscle: "Core",
                howToPerform: [
                    "Get on forearms and toes",
                    "Keep body in straight line",
                    "Engage core and glutes",
                    "Hold position, breathe steadily"
                ],
                dos: [
                    "Keep core tight",
                    "Squeeze glutes",
                    "Breathe normally"
                ],
                donts: [
                    "Don't let hips sag",
                    "Don't pike hips up",
                    "Don't hold breath"
                ],
                benefits: [
                    "Flattens tummy",
                    "Builds core stability",
                    "Improves posture"
                ]
            },
            {
                name: "Dead Bug",
                sets: 3,
                reps: "10 each side",
                targetMuscle: "Core",
                howToPerform: [
                    "Lie on back, arms toward ceiling",
                    "Raise legs with knees at 90 degrees",
                    "Lower opposite arm and leg slowly",
                    "Keep lower back pressed to floor"
                ],
                dos: [
                    "Move slowly and controlled",
                    "Keep back flat on floor",
                    "Breathe throughout"
                ],
                donts: [
                    "Don't arch lower back",
                    "Don't rush",
                    "Don't hold your breath"
                ],
                benefits: [
                    "Safe core exercise",
                    "Protects lower back",
                    "Builds stability"
                ]
            },
            {
                name: "Bicycle Crunches",
                sets: 3,
                reps: "15 each side",
                targetMuscle: "Obliques, Abs",
                howToPerform: [
                    "Lie on back with hands behind head",
                    "Bring one knee toward chest",
                    "Rotate opposite elbow toward knee",
                    "Alternate sides in pedaling motion"
                ],
                dos: [
                    "Twist through your torso",
                    "Keep lower back pressed down",
                    "Move with control"
                ],
                donts: [
                    "Don't pull on neck",
                    "Don't rush",
                    "Don't let back arch"
                ],
                benefits: [
                    "Targets obliques",
                    "Slims waistline",
                    "Effective ab exercise"
                ]
            },
            {
                name: "Glute Bridge",
                sets: 3,
                reps: "15 to 20",
                targetMuscle: "Glutes, Core",
                howToPerform: [
                    "Lie on back with knees bent, feet flat",
                    "Push through heels to lift hips",
                    "Squeeze glutes at top",
                    "Lower with control"
                ],
                dos: [
                    "Drive through heels",
                    "Squeeze glutes hard at top",
                    "Keep core engaged"
                ],
                donts: [
                    "Don't hyperextend",
                    "Don't push through toes",
                    "Don't rush"
                ],
                benefits: [
                    "Activates glutes",
                    "Strengthens core",
                    "Great warm-up movement"
                ]
            }
        ]
    },
    {
        day: 4,
        title: "Glutes & Legs II",
        exercises: [
            {
                name: "Sumo Squat (Dumbbell)",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Glutes, Inner Thighs",
                howToPerform: [
                    "Stand with feet wide, toes pointed out",
                    "Hold dumbbell between legs",
                    "Squat down keeping chest up",
                    "Push through heels to stand"
                ],
                dos: [
                    "Keep knees tracking over toes",
                    "Sit back and down",
                    "Squeeze glutes at top"
                ],
                donts: [
                    "Don't let knees cave in",
                    "Don't lean forward",
                    "Don't round your back"
                ],
                benefits: [
                    "Targets glutes and inner thighs",
                    "Great for leg shaping",
                    "Improves hip mobility"
                ]
            },
            {
                name: "Bulgarian Split Squat",
                sets: 3,
                reps: "10 each leg",
                targetMuscle: "Glutes, Quads",
                howToPerform: [
                    "Place rear foot on bench behind you",
                    "Lower until front thigh is parallel",
                    "Keep torso upright",
                    "Push through front heel to stand"
                ],
                dos: [
                    "Keep front knee over ankle",
                    "Control the descent",
                    "Focus on front leg working"
                ],
                donts: [
                    "Don't lean too far forward",
                    "Don't push off back foot",
                    "Don't rush the movement"
                ],
                benefits: [
                    "Excellent glute builder",
                    "Builds single-leg strength",
                    "Improves balance"
                ]
            },
            {
                name: "Lying Leg Curl",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Hamstrings",
                howToPerform: [
                    "Lie face down on machine",
                    "Curl legs up toward glutes",
                    "Squeeze at the top",
                    "Lower slowly"
                ],
                dos: [
                    "Keep hips pressed down",
                    "Focus on hamstring contraction",
                    "Control the weight"
                ],
                donts: [
                    "Don't lift hips off pad",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Tones back of legs",
                    "Balances quad development",
                    "Prevents injuries"
                ]
            },
            {
                name: "Hip Abductor Machine",
                sets: 3,
                reps: "15 to 20",
                targetMuscle: "Hip Abductors, Glutes",
                howToPerform: [
                    "Sit on machine with pads against outer thighs",
                    "Push legs outward against resistance",
                    "Hold briefly at full extension",
                    "Return with control"
                ],
                dos: [
                    "Sit tall",
                    "Push through full range",
                    "Squeeze at the end"
                ],
                donts: [
                    "Don't lean forward",
                    "Don't use momentum",
                    "Don't release too fast"
                ],
                benefits: [
                    "Shapes outer glutes",
                    "Improves hip stability",
                    "Great for 'side butt'"
                ]
            },
            {
                name: "Hip Adductor Machine",
                sets: 3,
                reps: "15 to 20",
                targetMuscle: "Inner Thighs",
                howToPerform: [
                    "Sit on machine with pads against inner thighs",
                    "Squeeze legs together",
                    "Hold briefly",
                    "Return with control"
                ],
                dos: [
                    "Keep back against pad",
                    "Squeeze through full range",
                    "Move smoothly"
                ],
                donts: [
                    "Don't jerk the weight",
                    "Don't rush",
                    "Don't use too much weight"
                ],
                benefits: [
                    "Tones inner thighs",
                    "Improves hip stability",
                    "Complements outer thigh work"
                ]
            }
        ]
    },
    {
        day: 5,
        title: "Upper Body & Arms",
        exercises: [
            {
                name: "Cable Row",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Back",
                howToPerform: [
                    "Sit at cable row with feet on platform",
                    "Grip handles with arms extended",
                    "Pull handles toward torso",
                    "Squeeze shoulder blades, return controlled"
                ],
                dos: [
                    "Keep chest up",
                    "Squeeze shoulder blades together",
                    "Pull elbows past torso"
                ],
                donts: [
                    "Don't round your back",
                    "Don't lean back too far",
                    "Don't use momentum"
                ],
                benefits: [
                    "Builds a toned back",
                    "Improves posture",
                    "Great for definition"
                ]
            },
            {
                name: "Incline Dumbbell Press",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Upper Chest",
                howToPerform: [
                    "Lie on incline bench at 30-45 degrees",
                    "Hold dumbbells at shoulder level",
                    "Press up until arms extend",
                    "Lower with control"
                ],
                dos: [
                    "Keep back flat on bench",
                    "Press in slight arc",
                    "Control the weight"
                ],
                donts: [
                    "Don't bounce",
                    "Don't flare elbows too wide",
                    "Don't lift hips"
                ],
                benefits: [
                    "Lifts and tones chest",
                    "Creates upper chest definition",
                    "Improves pushing strength"
                ]
            },
            {
                name: "Lateral Raise",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Shoulders",
                howToPerform: [
                    "Stand with dumbbells at sides",
                    "Raise arms out to sides",
                    "Stop at shoulder height",
                    "Lower with control"
                ],
                dos: [
                    "Keep slight bend in elbows",
                    "Lead with elbows",
                    "Use light weight"
                ],
                donts: [
                    "Don't go above shoulder height",
                    "Don't swing body",
                    "Don't shrug shoulders"
                ],
                benefits: [
                    "Creates capped shoulders",
                    "Improves shoulder definition",
                    "Makes waist look smaller"
                ]
            },
            {
                name: "Overhead Tricep Extension",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Triceps",
                howToPerform: [
                    "Hold dumbbell overhead with both hands",
                    "Lower behind head by bending elbows",
                    "Keep upper arms still",
                    "Extend arms back up"
                ],
                dos: [
                    "Keep elbows close to head",
                    "Full range of motion",
                    "Squeeze triceps at top"
                ],
                donts: [
                    "Don't flare elbows out",
                    "Don't arch back",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Tones back of arms",
                    "Targets long head of triceps",
                    "Great for arm definition"
                ]
            },
            {
                name: "Hammer Curl",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Biceps, Forearms",
                howToPerform: [
                    "Hold dumbbells with palms facing each other",
                    "Curl weights toward shoulders",
                    "Keep elbows fixed at sides",
                    "Lower with control"
                ],
                dos: [
                    "Keep wrists straight",
                    "Squeeze at top",
                    "Control the negative"
                ],
                donts: [
                    "Don't swing body",
                    "Don't rush",
                    "Don't move elbows"
                ],
                benefits: [
                    "Builds arm definition",
                    "Strengthens forearms",
                    "Balanced arm development"
                ]
            }
        ]
    },
    {
        day: 6,
        title: "Full Body Sculpt",
        exercises: [
            {
                name: "Goblet Squat",
                sets: 3,
                reps: "12 to 15",
                targetMuscle: "Quads, Glutes",
                howToPerform: [
                    "Hold dumbbell at chest like a goblet",
                    "Stand with feet shoulder-width",
                    "Squat down keeping chest up",
                    "Push through heels to stand"
                ],
                dos: [
                    "Keep weight at chest",
                    "Sit back and down",
                    "Keep knees over toes"
                ],
                donts: [
                    "Don't lean forward",
                    "Don't let knees cave",
                    "Don't round back"
                ],
                benefits: [
                    "Full lower body workout",
                    "Teaches proper squat form",
                    "Burns lots of calories"
                ]
            },
            {
                name: "Push-Up (Modified if needed)",
                sets: 3,
                reps: "10 to 12",
                targetMuscle: "Chest, Triceps, Core",
                howToPerform: [
                    "Start in plank position (or on knees)",
                    "Lower chest toward ground",
                    "Keep body in straight line",
                    "Push back up"
                ],
                dos: [
                    "Keep core engaged",
                    "Lower until chest nearly touches floor",
                    "Full extension at top"
                ],
                donts: [
                    "Don't let hips sag",
                    "Don't flare elbows too wide",
                    "Don't rush"
                ],
                benefits: [
                    "Full upper body workout",
                    "No equipment needed",
                    "Builds functional strength"
                ]
            },
            {
                name: "Dumbbell Row",
                sets: 3,
                reps: "10 to 12 each arm",
                targetMuscle: "Back",
                howToPerform: [
                    "Place one hand and knee on bench",
                    "Hold dumbbell in other hand",
                    "Row dumbbell to hip",
                    "Lower with control"
                ],
                dos: [
                    "Keep back flat",
                    "Pull elbow past torso",
                    "Squeeze back at top"
                ],
                donts: [
                    "Don't rotate torso",
                    "Don't use momentum",
                    "Don't round back"
                ],
                benefits: [
                    "Builds back strength",
                    "Improves posture",
                    "Unilateral work fixes imbalances"
                ]
            },
            {
                name: "Step-Ups",
                sets: 3,
                reps: "10 each leg",
                targetMuscle: "Glutes, Quads",
                howToPerform: [
                    "Stand facing a box or bench",
                    "Step up with one foot",
                    "Drive through heel to stand",
                    "Step down with control"
                ],
                dos: [
                    "Keep chest up",
                    "Push through heel",
                    "Control the descent"
                ],
                donts: [
                    "Don't push off back foot",
                    "Don't lean forward",
                    "Don't rush"
                ],
                benefits: [
                    "Great glute exercise",
                    "Improves balance",
                    "Functional movement"
                ]
            },
            {
                name: "Mountain Climbers",
                sets: 3,
                reps: "20 total",
                targetMuscle: "Core, Cardio",
                howToPerform: [
                    "Start in push-up position",
                    "Drive one knee toward chest",
                    "Quickly switch legs",
                    "Keep hips low"
                ],
                dos: [
                    "Keep core tight",
                    "Move at controlled pace",
                    "Breathe rhythmically"
                ],
                donts: [
                    "Don't let hips pike up",
                    "Don't hold breath",
                    "Don't bounce hips"
                ],
                benefits: [
                    "Burns calories",
                    "Strengthens core",
                    "Cardio and strength combined"
                ]
            }
        ]
    }
];
