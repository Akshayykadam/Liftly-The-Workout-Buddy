import type { WorkoutDay } from './workouts';

// Level 1: Beginner - Lower volume, simpler exercises, machine-focused
export const LEVEL1_WORKOUTS: WorkoutDay[] = [
    {
        day: 1,
        title: "Upper Body Basics",
        exercises: [
            {
                name: "Machine Chest Press",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Chest",
                howToPerform: [
                    "Sit on the machine with back flat against pad",
                    "Grip handles at chest level with elbows bent",
                    "Press handles forward until arms are extended",
                    "Slowly return to starting position"
                ],
                dos: [
                    "Keep your back flat against the pad",
                    "Exhale as you push, inhale as you return",
                    "Move in a controlled manner"
                ],
                donts: [
                    "Don't lock your elbows at full extension",
                    "Don't arch your back off the pad",
                    "Don't use momentum"
                ],
                benefits: [
                    "Great for learning pressing movement pattern",
                    "Safe and stable for beginners",
                    "Builds foundational chest strength"
                ],
                image: require('@/assets/images/exercises/machine_chest_press.png')
            },
            {
                name: "Assisted Pull-up Machine",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Back",
                howToPerform: [
                    "Kneel on the pad or stand on the platform",
                    "Grip handles overhead with palms facing away",
                    "Set appropriate counterweight assistance",
                    "Pull yourself up until chin is above handles",
                    "Lower with control"
                ],
                dos: [
                    "Keep core engaged throughout",
                    "Focus on pulling with your back muscles",
                    "Use full range of motion"
                ],
                donts: [
                    "Don't swing or use momentum",
                    "Don't shrug shoulders up",
                    "Don't rush the movement"
                ],
                benefits: [
                    "Builds pull-up strength progressively",
                    "Strengthens lats and biceps",
                    "Great stepping stone to unassisted pull-ups"
                ],
                image: require('@/assets/images/exercises/assisted_pullup_machine.png')
            },
            {
                name: "Dumbbell Shoulder Press (Seated)",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Shoulder",
                howToPerform: [
                    "Sit on bench with back support, dumbbells at shoulder height",
                    "Press dumbbells overhead until arms extend",
                    "Lower back to shoulder level with control"
                ],
                dos: [
                    "Keep core tight for stability",
                    "Press in a slight arc",
                    "Breathe out as you press up"
                ],
                donts: [
                    "Don't arch your lower back excessively",
                    "Don't lock elbows aggressively",
                    "Don't use weights too heavy to control"
                ],
                benefits: [
                    "Builds shoulder strength and stability",
                    "Seated position provides back support",
                    "Develops overhead pressing foundation"
                ],
                image: require('@/assets/images/exercises/shoulder_press.png')
            },
            {
                name: "Cable Bicep Curl",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Bicep",
                howToPerform: [
                    "Stand facing cable machine with straight bar attachment",
                    "Grip bar with underhand grip, arms extended",
                    "Curl bar up toward shoulders",
                    "Lower with control"
                ],
                dos: [
                    "Keep elbows fixed at your sides",
                    "Squeeze biceps at the top",
                    "Control the weight in both directions"
                ],
                donts: [
                    "Don't swing your body",
                    "Don't move your elbows forward",
                    "Don't let the weight drop"
                ],
                benefits: [
                    "Constant tension throughout movement",
                    "Builds bicep strength and definition",
                    "Easy to control and adjust weight"
                ],
                image: require('@/assets/images/exercises/cable_bicep_curl.png')
            },
            {
                name: "Tricep Pushdown",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Tricep",
                howToPerform: [
                    "Stand at cable machine with rope or bar attachment",
                    "Grip attachment with elbows at 90 degrees",
                    "Push down until arms are straight",
                    "Return with control"
                ],
                dos: [
                    "Keep elbows pinned to your sides",
                    "Squeeze triceps at the bottom",
                    "Maintain upright posture"
                ],
                donts: [
                    "Don't flare elbows out",
                    "Don't lean too far forward",
                    "Don't use momentum"
                ],
                benefits: [
                    "Isolates triceps effectively",
                    "Safe for beginners",
                    "Builds arm strength"
                ],
                image: require('@/assets/images/exercises/tricep_pushdown.png')
            }
        ]
    },
    {
        day: 2,
        title: "Lower Body Basics",
        exercises: [
            {
                name: "Leg Press Machine",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Quadriceps, Glutes",
                howToPerform: [
                    "Sit on leg press with back against pad",
                    "Place feet shoulder-width on platform",
                    "Lower platform until knees at 90 degrees",
                    "Press back up without locking knees"
                ],
                dos: [
                    "Keep lower back pressed against pad",
                    "Push through your heels",
                    "Breathe out as you press"
                ],
                donts: [
                    "Don't lock knees at top",
                    "Don't let knees cave inward",
                    "Don't go too deep causing back to round"
                ],
                benefits: [
                    "Safe way to build leg strength",
                    "Reduces stress on lower back",
                    "Great for building quad and glute strength"
                ],
                image: require('@/assets/images/exercises/leg_press.png')
            },
            {
                name: "Leg Extension",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Quadriceps",
                howToPerform: [
                    "Sit on machine with ankles behind pad",
                    "Extend legs until straight",
                    "Hold briefly at top",
                    "Lower with control"
                ],
                dos: [
                    "Keep back against pad",
                    "Focus on quad contraction",
                    "Move slowly and controlled"
                ],
                donts: [
                    "Don't swing or use momentum",
                    "Don't hyperextend knees",
                    "Don't use excessive weight"
                ],
                benefits: [
                    "Isolates quadriceps effectively",
                    "Great for building quad definition",
                    "Easy to learn and perform"
                ],
                image: require('@/assets/images/exercises/leg_extension.png')
            },
            {
                name: "Lying Leg Curl",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Hamstring",
                howToPerform: [
                    "Lie face down on machine with ankles under pad",
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
                    "Don't let weight drop quickly"
                ],
                benefits: [
                    "Strengthens hamstrings",
                    "Prevents muscle imbalances",
                    "Reduces injury risk"
                ],
                image: require('@/assets/images/exercises/lying_leg_curl.png')
            },
            {
                name: "Calf Raise (Machine)",
                sets: 2,
                reps: "15 to 20",
                targetMuscle: "Calf",
                howToPerform: [
                    "Stand on calf machine platform",
                    "Lower heels for a stretch",
                    "Rise up on toes as high as possible",
                    "Lower with control"
                ],
                dos: [
                    "Use full range of motion",
                    "Pause at top and bottom",
                    "Keep legs straight"
                ],
                donts: [
                    "Don't bounce at bottom",
                    "Don't rush the reps",
                    "Don't bend your knees"
                ],
                benefits: [
                    "Develops calf size and strength",
                    "Improves ankle stability",
                    "Easy to perform and progress"
                ],
                image: require('@/assets/images/exercises/calf_raise_machine.png')
            },
            {
                name: "Glute Kickback (Machine)",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Glutes",
                howToPerform: [
                    "Stand at machine holding handles",
                    "Place foot on platform behind you",
                    "Push leg back in a controlled arc",
                    "Return to start slowly"
                ],
                dos: [
                    "Keep core engaged",
                    "Squeeze glute at top",
                    "Maintain steady pace"
                ],
                donts: [
                    "Don't arch your back",
                    "Don't use momentum",
                    "Don't twist your hips"
                ],
                benefits: [
                    "Targets glutes directly",
                    "Great for building lower body shape",
                    "Beginner-friendly movement"
                ],
                image: require('@/assets/images/exercises/glute_kickback_machine.png')
            }
        ]
    },
    {
        day: 3,
        title: "Light Cardio & Core",
        exercises: [
            {
                name: "Treadmill Walk (Incline)",
                sets: 1,
                reps: "10 mins",
                targetMuscle: "Cardiovascular",
                howToPerform: [
                    "Set treadmill to 5-10% incline",
                    "Walk at a brisk pace (3-4 mph)",
                    "Maintain steady pace for 10 minutes",
                    "Keep upright posture"
                ],
                dos: [
                    "Keep hands off rails",
                    "Maintain good posture",
                    "Breathe deeply and rhythmically"
                ],
                donts: [
                    "Don't hold onto rails",
                    "Don't hunch forward",
                    "Don't start too fast"
                ],
                benefits: [
                    "Excellent low-impact cardio",
                    "Burns calories effectively",
                    "Good for cardiovascular health"
                ],
                image: require('@/assets/images/exercises/treadmill_walk.png')
            },
            {
                name: "Stationary Bike",
                sets: 1,
                reps: "10 mins",
                targetMuscle: "Cardiovascular",
                howToPerform: [
                    "Adjust seat to proper height",
                    "Begin pedaling at moderate resistance",
                    "Maintain steady cadence",
                    "Keep upper body relaxed"
                ],
                dos: [
                    "Keep core engaged",
                    "Pedal smoothly",
                    "Stay hydrated"
                ],
                donts: [
                    "Don't bounce in seat",
                    "Don't grip handlebars too tight",
                    "Don't set resistance too high"
                ],
                benefits: [
                    "Low impact on joints",
                    "Improves cardiovascular fitness",
                    "Great for active recovery"
                ],
                image: require('@/assets/images/exercises/stationary_bike.png')
            },
            {
                name: "Dead Bug",
                sets: 2,
                reps: "10 each side",
                targetMuscle: "Core",
                howToPerform: [
                    "Lie on back with arms toward ceiling",
                    "Raise legs with knees at 90 degrees",
                    "Lower opposite arm and leg slowly",
                    "Return and repeat other side"
                ],
                dos: [
                    "Keep lower back pressed to floor",
                    "Move slowly and controlled",
                    "Breathe steadily"
                ],
                donts: [
                    "Don't arch your lower back",
                    "Don't rush the movement",
                    "Don't hold your breath"
                ],
                benefits: [
                    "Builds core stability",
                    "Beginner-friendly ab exercise",
                    "Protects lower back"
                ],
                image: require('@/assets/images/exercises/dead_bug.png')
            },
            {
                name: "Bird Dog",
                sets: 2,
                reps: "10 each side",
                targetMuscle: "Core, Back",
                howToPerform: [
                    "Start on hands and knees",
                    "Extend opposite arm and leg straight",
                    "Hold briefly, then return",
                    "Repeat other side"
                ],
                dos: [
                    "Keep spine neutral",
                    "Move slowly",
                    "Focus on balance"
                ],
                donts: [
                    "Don't arch or round back",
                    "Don't rush",
                    "Don't twist hips"
                ],
                benefits: [
                    "Improves core stability",
                    "Great for lower back health",
                    "Develops coordination"
                ],
                image: require('@/assets/images/exercises/bird_dog.png')
            },
            {
                name: "Glute Bridge",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Glutes, Core",
                howToPerform: [
                    "Lie on back with knees bent, feet flat",
                    "Push through heels to lift hips",
                    "Squeeze glutes at top",
                    "Lower with control"
                ],
                dos: [
                    "Keep core tight",
                    "Drive through heels",
                    "Pause at top"
                ],
                donts: [
                    "Don't hyperextend",
                    "Don't push through toes",
                    "Don't rush"
                ],
                benefits: [
                    "Strengthens glutes and core",
                    "Good for hip mobility",
                    "Safe and effective"
                ],
                image: require('@/assets/images/exercises/glute_bridge.png')
            }
        ]
    },
    {
        day: 4,
        title: "Upper Body Basics II",
        exercises: [
            {
                name: "Machine Shoulder Press",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Shoulder",
                howToPerform: [
                    "Sit with back against pad",
                    "Grip handles at shoulder height",
                    "Press up until arms extend",
                    "Lower controlled"
                ],
                dos: [
                    "Keep back flat",
                    "Breathe out as you press",
                    "Control the motion"
                ],
                donts: [
                    "Don't arch back",
                    "Don't lock elbows hard",
                    "Don't use momentum"
                ],
                benefits: [
                    "Safe shoulder strengthening",
                    "Stable and controlled",
                    "Great for beginners"
                ],
                image: require('@/assets/images/exercises/shoulder_press.png')
            },
            {
                name: "Lat Pulldown (Wide Grip)",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Back",
                howToPerform: [
                    "Sit with thighs under pads",
                    "Grip bar wider than shoulders",
                    "Pull bar to upper chest",
                    "Return controlled"
                ],
                dos: [
                    "Keep chest up",
                    "Pull elbows down and back",
                    "Squeeze shoulder blades"
                ],
                donts: [
                    "Don't pull behind neck",
                    "Don't swing body",
                    "Don't shrug shoulders"
                ],
                benefits: [
                    "Develops back width",
                    "Beginner-friendly pull movement",
                    "Builds toward pull-ups"
                ],
                image: require('@/assets/images/exercises/lat_pulldown.png')
            },
            {
                name: "Machine Row",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Back",
                howToPerform: [
                    "Sit at machine with chest against pad",
                    "Grip handles with arms extended",
                    "Pull handles toward you",
                    "Squeeze and return slowly"
                ],
                dos: [
                    "Keep chest on pad",
                    "Squeeze shoulder blades",
                    "Control the motion"
                ],
                donts: [
                    "Don't lean back",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Builds back thickness",
                    "Safe and stable",
                    "Great for posture"
                ],
                image: require('@/assets/images/exercises/dumbbell_row.png')
            },
            {
                name: "Incline Dumbbell Press",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Upper Chest",
                howToPerform: [
                    "Lie on incline bench at 30-45 degrees",
                    "Hold dumbbells at shoulder level",
                    "Press up until arms extend",
                    "Lower controlled"
                ],
                dos: [
                    "Keep back flat on bench",
                    "Press in slight arc",
                    "Control the weight"
                ],
                donts: [
                    "Don't bounce or jerk",
                    "Don't flare elbows too wide",
                    "Don't lift hips"
                ],
                benefits: [
                    "Targets upper chest",
                    "Balanced chest development",
                    "Functional pressing strength"
                ],
                image: require('@/assets/images/exercises/incline_dumbbell_press.png')
            },
            {
                name: "Face Pull",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Rear Deltoid, Upper Back",
                howToPerform: [
                    "Set cable at face height with rope",
                    "Grip rope with thumbs toward you",
                    "Pull toward face, spreading rope",
                    "Return controlled"
                ],
                dos: [
                    "Keep elbows high",
                    "Squeeze rear delts",
                    "Stand tall"
                ],
                donts: [
                    "Don't pull to chest",
                    "Don't lean back too far",
                    "Don't use too much weight"
                ],
                benefits: [
                    "Great for shoulder health",
                    "Improves posture",
                    "Balances push exercises"
                ],
                image: require('@/assets/images/exercises/face_pull.png')
            }
        ]
    },
    {
        day: 5,
        title: "Lower Body Basics II",
        exercises: [
            {
                name: "Goblet Squat",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Quadriceps, Glutes",
                howToPerform: [
                    "Hold dumbbell at chest like a goblet",
                    "Stand with feet shoulder-width",
                    "Squat down keeping chest up",
                    "Return to standing"
                ],
                dos: [
                    "Keep weight at chest",
                    "Sit back and down",
                    "Keep knees over toes"
                ],
                donts: [
                    "Don't round back",
                    "Don't let knees cave",
                    "Don't lean forward"
                ],
                benefits: [
                    "Teaches proper squat form",
                    "Great for leg strength",
                    "Beginner-friendly squat variant"
                ],
                image: require('@/assets/images/exercises/squat.png')
            },
            {
                name: "Step-Ups",
                sets: 2,
                reps: "10 each leg",
                targetMuscle: "Quadriceps, Glutes",
                howToPerform: [
                    "Stand facing a box or bench",
                    "Step up with one foot",
                    "Drive through heel to stand up",
                    "Step down and repeat"
                ],
                dos: [
                    "Keep chest up",
                    "Drive through the heel",
                    "Control the descent"
                ],
                donts: [
                    "Don't push off back foot",
                    "Don't lean forward",
                    "Don't rush"
                ],
                benefits: [
                    "Unilateral leg strength",
                    "Improves balance",
                    "Functional movement"
                ],
                image: require('@/assets/images/exercises/step_ups.png')
            },
            {
                name: "Hip Abductor Machine",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Hip Abductors, Glutes",
                howToPerform: [
                    "Sit on machine with pads against outer thighs",
                    "Push legs outward against resistance",
                    "Hold briefly",
                    "Return controlled"
                ],
                dos: [
                    "Sit tall with back supported",
                    "Push through the full range",
                    "Control the return"
                ],
                donts: [
                    "Don't lean forward",
                    "Don't use momentum",
                    "Don't release too fast"
                ],
                benefits: [
                    "Strengthens hip muscles",
                    "Improves hip stability",
                    "Helps prevent knee issues"
                ],
                image: require('@/assets/images/exercises/hip_abductor_machine.png')
            },
            {
                name: "Hip Adductor Machine",
                sets: 2,
                reps: "12 to 15",
                targetMuscle: "Hip Adductors",
                howToPerform: [
                    "Sit on machine with pads against inner thighs",
                    "Squeeze legs together",
                    "Hold briefly",
                    "Return controlled"
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
                    "Strengthens inner thighs",
                    "Improves hip stability",
                    "Balances leg development"
                ],
                image: require('@/assets/images/exercises/hip_adductor_machine.png')
            },
            {
                name: "Seated Calf Raise",
                sets: 2,
                reps: "15 to 20",
                targetMuscle: "Soleus",
                howToPerform: [
                    "Sit on machine with knees under pad",
                    "Lower heels for stretch",
                    "Push up on balls of feet",
                    "Squeeze calves and lower"
                ],
                dos: [
                    "Use full range of motion",
                    "Pause at top and bottom",
                    "Control the movement"
                ],
                donts: [
                    "Don't bounce",
                    "Don't rush",
                    "Don't use partial reps"
                ],
                benefits: [
                    "Targets lower calf muscle",
                    "Completes calf development",
                    "Improves ankle stability"
                ],
                image: require('@/assets/images/exercises/seated_calf_raise.png')
            }
        ]
    },
    {
        day: 6,
        title: "Full Body & Recovery",
        exercises: [
            {
                name: "Machine Chest Fly",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Chest",
                howToPerform: [
                    "Sit on pec deck with arms on pads",
                    "Bring arms together in front",
                    "Squeeze chest at center",
                    "Return to stretch controlled"
                ],
                dos: [
                    "Keep slight bend in elbows",
                    "Focus on chest squeeze",
                    "Control the stretch"
                ],
                donts: [
                    "Don't overstretch",
                    "Don't use momentum",
                    "Don't rush"
                ],
                benefits: [
                    "Isolates chest muscles",
                    "Safe for beginners",
                    "Great chest finisher"
                ],
                image: require('@/assets/images/exercises/machine_chest_fly.png')
            },
            {
                name: "Dumbbell Romanian Deadlift",
                sets: 2,
                reps: "10 to 12",
                targetMuscle: "Hamstring, Glutes",
                howToPerform: [
                    "Hold dumbbells in front of thighs",
                    "Hinge at hips pushing butt back",
                    "Lower dumbbells along legs",
                    "Stand back up squeezing glutes"
                ],
                dos: [
                    "Keep back flat",
                    "Slight bend in knees",
                    "Feel stretch in hamstrings"
                ],
                donts: [
                    "Don't round your back",
                    "Don't bend knees too much",
                    "Don't go too heavy"
                ],
                benefits: [
                    "Strengthens posterior chain",
                    "Improves hip hinge pattern",
                    "Great for hamstring development"
                ],
                image: require('@/assets/images/exercises/dumbbell_romanian_deadlift.png')
            },
            {
                name: "Plank",
                sets: 2,
                reps: "20-30 sec",
                targetMuscle: "Core",
                howToPerform: [
                    "Get on forearms and toes",
                    "Keep body in straight line",
                    "Hold position",
                    "Breathe steadily"
                ],
                dos: [
                    "Keep core tight",
                    "Don't let hips sag",
                    "Breathe normally"
                ],
                donts: [
                    "Don't hold breath",
                    "Don't pike hips up",
                    "Don't look up"
                ],
                benefits: [
                    "Builds core stability",
                    "Strengthens entire core",
                    "Functional fitness"
                ],
                image: require('@/assets/images/exercises/plank.png')
            },
            {
                name: "Stretching Routine",
                sets: 1,
                reps: "5 mins",
                targetMuscle: "Full Body",
                howToPerform: [
                    "Hold each stretch for 30 seconds",
                    "Include hamstrings, quads, chest, shoulders",
                    "Breathe deeply into each stretch",
                    "Don't bounce, hold steady"
                ],
                dos: [
                    "Stretch to mild discomfort",
                    "Breathe deeply",
                    "Hold each stretch"
                ],
                donts: [
                    "Don't bounce",
                    "Don't push to pain",
                    "Don't rush"
                ],
                benefits: [
                    "Improves flexibility",
                    "Aids recovery",
                    "Reduces injury risk"
                ],
                image: require('@/assets/images/exercises/stretching_routine.png')
            },
            {
                name: "Foam Rolling",
                sets: 1,
                reps: "5 mins",
                targetMuscle: "Full Body",
                howToPerform: [
                    "Roll major muscle groups",
                    "Spend 30-60 seconds per area",
                    "Apply moderate pressure",
                    "Focus on tight spots"
                ],
                dos: [
                    "Roll slowly",
                    "Breathe through tender spots",
                    "Cover all major muscles"
                ],
                donts: [
                    "Don't roll directly on joints",
                    "Don't hold breath",
                    "Don't rush"
                ],
                benefits: [
                    "Releases muscle tension",
                    "Improves recovery",
                    "Enhances flexibility"
                ]
            }
        ]
    }
];
