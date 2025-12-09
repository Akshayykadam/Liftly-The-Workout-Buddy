export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  targetMuscle: string;
  howToPerform: string[];
  dos: string[];
  donts: string[];
  benefits: string[];
  image?: any;
}

export interface WorkoutDay {
  day: number;
  title: string;
  exercises: Exercise[];
}

export const WORKOUTS: WorkoutDay[] = [
  {
    day: 1,
    title: "Upper Body",
    exercises: [
      {
        name: "Seated Row",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Back",
        howToPerform: [
          "Sit on the rowing machine with feet firmly on footrests",
          "Grab the handles with arms fully extended",
          "Pull handles toward your torso, squeezing shoulder blades together",
          "Keep elbows close to body and back straight",
          "Slowly return to starting position with controlled movement"
        ],
        dos: [
          "Keep your chest up and shoulders back throughout",
          "Exhale as you pull, inhale as you release",
          "Focus on squeezing your back muscles",
          "Maintain a neutral spine position"
        ],
        donts: [
          "Don't round your back or lean too far forward",
          "Avoid using momentum or jerky movements",
          "Don't lock your elbows at full extension",
          "Never shrug your shoulders during the pull"
        ],
        benefits: [
          "Builds thick, strong back muscles (lats, rhomboids, traps)",
          "Improves posture and reduces back pain",
          "Enhances pulling strength for daily activities",
          "Helps balance pushing exercises like bench press"
        ],
        image: require('@/assets/images/exercises/dumbbell_row.png')
      },
      {
        name: "Lat Pulldown (Supine Grip)",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Back",
        howToPerform: [
          "Sit at lat pulldown machine with thighs secured under pad",
          "Grip bar with palms facing you (underhand), hands shoulder-width apart",
          "Pull bar down to upper chest while leaning slightly back",
          "Squeeze shoulder blades together at bottom",
          "Slowly return bar to starting position with control"
        ],
        dos: [
          "Keep chest lifted and core engaged",
          "Pull elbows down and back, not just hands",
          "Control the weight on both up and down phases",
          "Breathe out as you pull down"
        ],
        donts: [
          "Don't pull the bar behind your neck",
          "Avoid excessive swinging or using momentum",
          "Don't let shoulders shrug up toward ears",
          "Never release the weight too quickly"
        ],
        benefits: [
          "Develops wide, V-shaped back",
          "Strengthens lats, biceps, and mid-back",
          "Improves pull-up performance",
          "Enhances shoulder stability and health"
        ]
      },
      {
        name: "Shrugs",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Trapezius",
        howToPerform: [
          "Stand with feet hip-width apart holding dumbbells at sides",
          "Keep arms straight and shoulders relaxed",
          "Lift shoulders straight up toward ears as high as possible",
          "Hold peak contraction for 1 second",
          "Lower shoulders back down with control"
        ],
        dos: [
          "Focus on moving shoulders straight up and down",
          "Keep neck neutral, don't tilt head",
          "Squeeze traps hard at the top",
          "Use a weight that allows full range of motion"
        ],
        donts: [
          "Don't roll shoulders forward or backward",
          "Avoid bending elbows or using arms to lift",
          "Don't let head drop forward",
          "Never use momentum to bounce the weight"
        ],
        benefits: [
          "Builds impressive trap muscles for upper back definition",
          "Improves shoulder stability and posture",
          "Strengthens neck support muscles",
          "Enhances grip strength"
        ]
      },
      {
        name: "Dumbbell Flat Bench Press",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Chest",
        howToPerform: [
          "Lie on flat bench with dumbbells held at chest level",
          "Plant feet firmly on floor, shoulder blades squeezed",
          "Press dumbbells up until arms are fully extended",
          "Keep dumbbells aligned over mid-chest",
          "Lower dumbbells with control until elbows reach 90 degrees"
        ],
        dos: [
          "Maintain natural arch in lower back",
          "Keep wrists straight and stable",
          "Press dumbbells slightly inward at top",
          "Exhale on the press, inhale on descent"
        ],
        donts: [
          "Don't bounce dumbbells off chest",
          "Avoid flaring elbows out too wide (keep at 45 degrees)",
          "Don't lift hips off bench",
          "Never lock elbows aggressively at top"
        ],
        benefits: [
          "Develops full, thick chest muscles",
          "Allows greater range of motion than barbell",
          "Improves muscle balance (each side works independently)",
          "Builds pressing power for daily activities"
        ]
      },
      {
        name: "Pec Dec Fly",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Chest",
        howToPerform: [
          "Sit on pec dec with back flat against pad",
          "Place forearms on pads with elbows at shoulder height",
          "Grip handles lightly, chest up and core engaged",
          "Bring arms together in front of chest in hugging motion",
          "Squeeze chest hard, then slowly return to stretch position"
        ],
        dos: [
          "Keep slight bend in elbows throughout",
          "Focus on chest contraction, not arm movement",
          "Maintain upright posture with shoulders back",
          "Control the weight during the stretch phase"
        ],
        donts: [
          "Don't let shoulders roll forward",
          "Avoid overextending at the back position",
          "Don't use momentum to swing weight",
          "Never strain shoulders or force the stretch"
        ],
        benefits: [
          "Isolates and defines inner chest",
          "Improves chest peak contraction ability",
          "Safer for shoulders than traditional flys",
          "Great for chest development and muscle detail"
        ],
        image: require('@/assets/images/exercises/machine_chest_fly.png')
      },
      {
        name: "Dumbbell Overhead Press",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Shoulder",
        howToPerform: [
          "Stand or sit with dumbbells at shoulder height, palms forward",
          "Keep core tight and back neutral",
          "Press dumbbells overhead until arms fully extend",
          "Bring dumbbells together slightly at top",
          "Lower with control back to shoulder level"
        ],
        dos: [
          "Keep core engaged to protect lower back",
          "Press dumbbells in slight arc, not straight up",
          "Look straight ahead, not up",
          "Breathe out as you press up"
        ],
        donts: [
          "Don't arch back excessively",
          "Avoid pressing dumbbells too far forward or back",
          "Don't lock elbows hard at top",
          "Never use momentum from legs (unless doing push press)"
        ],
        benefits: [
          "Builds strong, rounded shoulder caps",
          "Improves overhead strength and stability",
          "Engages core for full-body stability",
          "Develops functional pressing power"
        ],
        image: require('@/assets/images/exercises/shoulder_press.png')
      },
      {
        name: "Lateral Raises",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Shoulder",
        howToPerform: [
          "Stand with dumbbells at sides, palms facing in",
          "Keep slight bend in elbows throughout",
          "Raise arms out to sides until parallel with floor",
          "Lead with elbows, not hands",
          "Lower dumbbells slowly back to starting position"
        ],
        dos: [
          "Keep torso still and core engaged",
          "Focus on raising elbows, not dumbbells",
          "Use controlled tempo, 2 seconds up and down",
          "Keep wrists neutral or slightly tilted forward"
        ],
        donts: [
          "Don't swing or use momentum",
          "Avoid raising arms above shoulder height",
          "Don't shrug shoulders during raise",
          "Never use weight too heavy for control"
        ],
        benefits: [
          "Creates width and definition in shoulders",
          "Isolates lateral deltoid for shoulder caps",
          "Improves shoulder stability and mobility",
          "Enhances upper body aesthetics"
        ]
      },
      {
        name: "Back Extension",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Back",
        howToPerform: [
          "Position yourself on back extension machine, ankles secured",
          "Cross arms over chest or behind head",
          "Lower upper body forward by bending at hips",
          "Keep back straight as you lower",
          "Raise torso back up until body forms straight line"
        ],
        dos: [
          "Engage core and glutes throughout",
          "Move in controlled, smooth motion",
          "Keep neck neutral in line with spine",
          "Focus on using lower back muscles"
        ],
        donts: [
          "Don't hyperextend at the top",
          "Avoid rounding the back during movement",
          "Don't go too fast or use momentum",
          "Never crane neck up or down"
        ],
        benefits: [
          "Strengthens lower back (erector spinae)",
          "Improves posture and reduces back pain",
          "Protects spine during daily activities",
          "Enhances core stability and deadlift performance"
        ]
      },
      {
        name: "Dumbbell Curl",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Bicep",
        howToPerform: [
          "Stand with dumbbells at sides, palms facing forward",
          "Keep elbows close to torso throughout",
          "Curl dumbbells up toward shoulders",
          "Squeeze biceps hard at top",
          "Lower dumbbells slowly to starting position"
        ],
        dos: [
          "Keep upper arms stationary",
          "Maintain slight lean forward for balance",
          "Squeeze biceps at peak contraction",
          "Control the weight on the way down"
        ],
        donts: [
          "Don't swing body or use momentum",
          "Avoid moving elbows forward during curl",
          "Don't let dumbbells drop quickly",
          "Never arch back to lift weight"
        ],
        benefits: [
          "Builds bicep size and peak",
          "Develops arm strength for pulling movements",
          "Improves grip strength",
          "Enhances arm definition and shape"
        ]
      },
      {
        name: "Cable Pushdown",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Tricep",
        howToPerform: [
          "Stand facing cable machine with rope or bar attachment",
          "Grip attachment with hands close together",
          "Keep elbows tucked at sides, forearms at 90 degrees",
          "Push attachment down until arms fully extend",
          "Squeeze triceps, then return with control"
        ],
        dos: [
          "Keep elbows pinned to sides throughout",
          "Lean slightly forward from hips",
          "Focus on tricep contraction at bottom",
          "Use full range of motion"
        ],
        donts: [
          "Don't let elbows flare out or move forward",
          "Avoid using shoulders or back to push",
          "Don't lean too far forward",
          "Never release weight too quickly"
        ],
        benefits: [
          "Isolates and defines triceps",
          "Builds arm thickness and horseshoe shape",
          "Improves lockout strength for pressing",
          "Constant tension for muscle growth"
        ],
        image: require('@/assets/images/exercises/tricep_pushdown.png')
      }
    ]
  },
  {
    day: 2,
    title: "Lower Body",
    exercises: [
      {
        name: "Squats",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Quadriceps, Glutes, Hamstring",
        howToPerform: [
          "Stand with feet shoulder-width apart, toes slightly out",
          "Keep chest up and core tight",
          "Lower body by bending knees and hips simultaneously",
          "Descend until thighs are at least parallel to floor",
          "Drive through heels to return to standing position"
        ],
        dos: [
          "Keep knees tracking over toes",
          "Maintain neutral spine throughout",
          "Breathe in going down, out coming up",
          "Focus on sitting back into the squat"
        ],
        donts: [
          "Don't let knees cave inward",
          "Avoid rounding the back",
          "Don't let heels lift off floor",
          "Never bounce at the bottom"
        ],
        benefits: [
          "King of leg exercises - builds overall lower body mass",
          "Strengthens quads, glutes, hamstrings, and core",
          "Improves functional strength for daily life",
          "Boosts metabolism and hormone production"
        ],
        image: require('@/assets/images/exercises/squat.png')
      },
      {
        name: "Static Lunges / Leg Extension",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Quadriceps, Glutes, Hamstring",
        howToPerform: [
          "For lunges: Stand in split stance, front foot flat, back heel up",
          "Lower back knee toward floor, keeping front knee over ankle",
          "Front thigh should reach parallel to floor",
          "Push through front heel to return to starting position",
          "For leg extension: Sit on machine, extend legs until straight"
        ],
        dos: [
          "Keep torso upright and core engaged",
          "Ensure front knee doesn't pass toes excessively",
          "Drive through heel of front foot",
          "Maintain balance throughout movement"
        ],
        donts: [
          "Don't let front knee collapse inward",
          "Avoid leaning too far forward",
          "Don't rush the movement",
          "Never let back knee slam into floor"
        ],
        benefits: [
          "Isolates each leg to fix muscle imbalances",
          "Improves balance and stability",
          "Builds quad strength and definition",
          "Enhances athletic performance and jumping"
        ],
        image: require('@/assets/images/exercises/lunges.png')
      },
      {
        name: "Leg Press",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Quadriceps, Glutes, Hamstring",
        howToPerform: [
          "Sit on leg press machine with back flat against pad",
          "Place feet shoulder-width apart on platform",
          "Release safety handles and lower platform",
          "Lower until knees reach about 90 degrees",
          "Press through heels to extend legs back to start"
        ],
        dos: [
          "Keep lower back pressed against pad",
          "Place feet high on platform to target glutes",
          "Breathe out as you press up",
          "Use full range of motion safely"
        ],
        donts: [
          "Don't lock knees at top of movement",
          "Avoid letting lower back round or lift off pad",
          "Don't go too deep if it causes back rounding",
          "Never bounce the weight at bottom"
        ],
        benefits: [
          "Safely loads high weight on legs",
          "Builds quad and glute mass effectively",
          "Reduces stress on lower back vs squats",
          "Excellent for leg strength and hypertrophy"
        ],
        image: require('@/assets/images/exercises/leg_press.png')
      },
      {
        name: "Standing Calf",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Calf",
        howToPerform: [
          "Stand on calf raise machine with shoulders under pads",
          "Place balls of feet on platform, heels hanging off",
          "Lower heels as far as comfortable for stretch",
          "Rise up on toes as high as possible",
          "Squeeze calves at top, then lower with control"
        ],
        dos: [
          "Use full range of motion for maximum growth",
          "Pause at top and bottom of movement",
          "Keep legs straight but not locked",
          "Focus on calf muscle contraction"
        ],
        donts: [
          "Don't bounce at bottom of movement",
          "Avoid bending knees during raise",
          "Don't rush the reps",
          "Never use excessive weight that compromises form"
        ],
        benefits: [
          "Develops size and definition in calves",
          "Strengthens lower leg for running and jumping",
          "Improves ankle stability and mobility",
          "Enhances athletic performance"
        ],
        image: require('@/assets/images/exercises/calf_raise_machine.png')
      },
      {
        name: "Seated Calf",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Calf",
        howToPerform: [
          "Sit on seated calf machine with knees under pads",
          "Place balls of feet on platform, heels off edge",
          "Release weight and lower heels for deep stretch",
          "Raise heels by pressing through balls of feet",
          "Squeeze calves at top before lowering"
        ],
        dos: [
          "Emphasize the stretch at bottom position",
          "Contract calves hard at peak",
          "Use controlled tempo throughout",
          "Focus on mind-muscle connection"
        ],
        donts: [
          "Don't bounce or use momentum",
          "Avoid partial range of motion",
          "Don't let pads lift off knees",
          "Never sacrifice form for weight"
        ],
        benefits: [
          "Targets soleus muscle (lower calf)",
          "Complements standing calf raises",
          "Builds calf thickness and mass",
          "Improves lower leg endurance"
        ],
        image: require('@/assets/images/exercises/seated_calf_raise.png')
      },
      {
        name: "Leg Curl",
        sets: 3,
        reps: "15 to 20",
        targetMuscle: "Hamstring",
        howToPerform: [
          "Lie face down on leg curl machine, ankles under pad",
          "Grip handles for stability",
          "Curl legs up toward glutes",
          "Squeeze hamstrings hard at peak contraction",
          "Lower weight slowly with full control"
        ],
        dos: [
          "Keep hips pressed down into pad",
          "Focus on hamstring contraction",
          "Use full range of motion",
          "Control both lifting and lowering phases"
        ],
        donts: [
          "Don't lift hips off pad during curl",
          "Avoid using momentum or swinging",
          "Don't let weight drop quickly",
          "Never arch back excessively"
        ],
        benefits: [
          "Isolates and strengthens hamstrings",
          "Reduces risk of hamstring injuries",
          "Improves knee joint stability",
          "Balances quad development for leg symmetry"
        ],
        image: require('@/assets/images/exercises/lying_leg_curl.png')
      }
    ]
  },
  {
    day: 3,
    title: "Cardio",
    exercises: [
      {
        name: "12 mins treadmill",
        sets: 1,
        reps: "1 min walk / 1 min run",
        targetMuscle: "Cardiovascular",
        howToPerform: [
          "Start with 2-minute warm-up walk at comfortable pace",
          "Alternate between 1 minute walking and 1 minute running",
          "Walking: 3-4 mph at moderate pace",
          "Running: 6-7 mph or comfortable jogging speed",
          "Complete 6 intervals total (12 minutes)"
        ],
        dos: [
          "Maintain upright posture throughout",
          "Land mid-foot, not on heels or toes",
          "Keep arms swinging naturally",
          "Stay hydrated during workout"
        ],
        donts: [
          "Don't hold onto treadmill rails while running",
          "Avoid looking down at feet",
          "Don't overstride or pound heavily",
          "Never skip warm-up or cool-down"
        ],
        benefits: [
          "Improves cardiovascular endurance",
          "Burns calories and aids fat loss",
          "Increases stamina and lung capacity",
          "HIIT format boosts metabolism for hours"
        ],
        image: require('@/assets/images/exercises/treadmill_walk.png')
      },
      {
        name: "15 mins elliptical",
        sets: 1,
        reps: "15 mins",
        targetMuscle: "Cardiovascular",
        howToPerform: [
          "Step onto elliptical and grip handles",
          "Begin with slow warm-up for 2 minutes",
          "Gradually increase resistance and pace",
          "Maintain steady, smooth rhythm",
          "Push and pull handles while pedaling"
        ],
        dos: [
          "Keep shoulders back and core engaged",
          "Distribute weight evenly on pedals",
          "Use full range of motion",
          "Vary resistance to challenge yourself"
        ],
        donts: [
          "Don't lean heavily on handles",
          "Avoid bouncing up and down",
          "Don't pedal backwards entire time (vary direction)",
          "Never lock knees during movement"
        ],
        benefits: [
          "Low-impact cardio - easy on joints",
          "Works both upper and lower body",
          "Improves cardiovascular health",
          "Burns significant calories with less stress"
        ]
      },
      {
        name: "15 mins cycle",
        sets: 1,
        reps: "15 mins",
        targetMuscle: "Cardiovascular",
        howToPerform: [
          "Adjust seat so knee is slightly bent at bottom of pedal stroke",
          "Start with light resistance for warm-up",
          "Gradually increase resistance to moderate level",
          "Maintain steady cadence of 60-80 RPM",
          "Keep upper body relaxed and stable"
        ],
        dos: [
          "Keep core engaged and back neutral",
          "Pedal in smooth, circular motion",
          "Adjust resistance to maintain target heart rate",
          "Breathe deeply and rhythmically"
        ],
        donts: [
          "Don't bounce in the seat",
          "Avoid gripping handlebars too tightly",
          "Don't pedal with just toes (use full foot)",
          "Never set resistance so high you can't maintain form"
        ],
        benefits: [
          "Excellent low-impact cardio option",
          "Strengthens legs and glutes",
          "Improves cardiovascular fitness",
          "Great for active recovery and endurance"
        ],
        image: require('@/assets/images/exercises/stationary_bike.png')
      },
      {
        name: "Jumping jacks",
        sets: 3,
        reps: "1 min",
        targetMuscle: "Full Body",
        howToPerform: [
          "Stand with feet together, arms at sides",
          "Jump while spreading legs shoulder-width apart",
          "Simultaneously raise arms overhead",
          "Jump back to starting position",
          "Maintain steady, rhythmic pace for 1 minute"
        ],
        dos: [
          "Land softly on balls of feet",
          "Keep core engaged throughout",
          "Maintain upright posture",
          "Breathe steadily throughout set"
        ],
        donts: [
          "Don't land heavily on heels",
          "Avoid locking knees on landing",
          "Don't let shoulders hunch forward",
          "Never hold your breath"
        ],
        benefits: [
          "Full body warm-up and cardio blast",
          "Improves coordination and agility",
          "Elevates heart rate quickly",
          "Burns calories and improves endurance"
        ],
        image: require('@/assets/images/exercises/jumping_jacks.png')
      },
      {
        name: "Mountain climbers",
        sets: 3,
        reps: "1 min",
        targetMuscle: "Core, Cardiovascular",
        howToPerform: [
          "Start in high plank position, hands under shoulders",
          "Drive right knee toward chest",
          "Quickly switch, bringing left knee to chest",
          "Continue alternating legs in running motion",
          "Keep hips level and core tight"
        ],
        dos: [
          "Maintain straight line from head to heels",
          "Keep shoulders directly over wrists",
          "Land softly on balls of feet",
          "Breathe continuously throughout"
        ],
        donts: [
          "Don't let hips pike up or sag down",
          "Avoid rounding shoulders forward",
          "Don't twist torso side to side",
          "Never hold breath or go too fast to maintain form"
        ],
        benefits: [
          "Intense core and cardio combination",
          "Burns high calories in short time",
          "Improves core stability and coordination",
          "Builds shoulder and arm endurance"
        ]
      },
      {
        name: "Forward crunches (machine)",
        sets: 3,
        reps: "20",
        targetMuscle: "Abdominal",
        howToPerform: [
          "Sit on ab crunch machine with back against pad",
          "Grip handles and place arms/elbows on pads",
          "Curl torso forward using ab muscles",
          "Squeeze abs hard at peak contraction",
          "Return slowly to starting position"
        ],
        dos: [
          "Focus on ab contraction, not arm pulling",
          "Exhale as you crunch forward",
          "Keep movement slow and controlled",
          "Use full range of motion"
        ],
        donts: [
          "Don't pull with arms to complete rep",
          "Avoid using momentum or jerking",
          "Don't hold breath during exercise",
          "Never rush through reps"
        ],
        benefits: [
          "Isolates and strengthens abs effectively",
          "Builds core strength and definition",
          "Safer for neck than floor crunches",
          "Progressive resistance for ab development"
        ]
      },
      {
        name: "Leg raises (parallel bar)",
        sets: 3,
        reps: "20",
        targetMuscle: "Abdominal",
        howToPerform: [
          "Grip parallel bars and lift body, supporting on forearms",
          "Keep back against pad if available",
          "Start with legs hanging straight down",
          "Raise legs up to 90 degrees or higher",
          "Lower legs slowly with full control"
        ],
        dos: [
          "Keep core tight throughout movement",
          "Control the descent - don't drop legs",
          "Breathe out as you raise legs",
          "Keep shoulders stable and down"
        ],
        donts: [
          "Don't swing or use momentum",
          "Avoid arching back during raise",
          "Don't shrug shoulders up to ears",
          "Never let legs drop quickly"
        ],
        benefits: [
          "Targets lower abs intensely",
          "Builds functional core strength",
          "Improves hip flexor flexibility",
          "Develops six-pack definition"
        ]
      },
      {
        name: "Twisting crunches",
        sets: 3,
        reps: "20",
        targetMuscle: "Internal / External Obliques",
        howToPerform: [
          "Lie on back with knees bent, hands behind head",
          "Lift shoulder blades off ground",
          "Rotate torso, bringing right elbow toward left knee",
          "Return to center, then rotate opposite direction",
          "Continue alternating in controlled rhythm"
        ],
        dos: [
          "Focus on rotating torso, not pulling neck",
          "Keep lower back pressed to floor",
          "Exhale during each twist",
          "Move with control and intention"
        ],
        donts: [
          "Don't pull on neck with hands",
          "Avoid lifting lower back off floor",
          "Don't rush or use momentum",
          "Never hold breath during set"
        ],
        benefits: [
          "Sculpts and defines obliques (side abs)",
          "Improves rotational core strength",
          "Enhances waist definition and shape",
          "Functional for twisting movements in life"
        ]
      },
      {
        name: "Plank",
        sets: 3,
        reps: "1 min",
        targetMuscle: "Full Core",
        howToPerform: [
          "Start on forearms and toes in plank position",
          "Keep body in straight line from head to heels",
          "Engage core, glutes, and legs",
          "Hold position without movement",
          "Breathe steadily throughout hold"
        ],
        dos: [
          "Keep neck neutral, look at floor",
          "Squeeze abs and glutes tight",
          "Maintain straight body line",
          "Focus on quality hold over duration"
        ],
        donts: [
          "Don't let hips sag toward floor",
          "Avoid piking hips up in air",
          "Don't hold breath",
          "Never let shoulders collapse forward"
        ],
        benefits: [
          "Ultimate core stability exercise",
          "Strengthens entire core, shoulders, and back",
          "Improves posture and reduces back pain",
          "Functional strength for everyday activities"
        ],
        image: require('@/assets/images/exercises/plank.png')
      }
    ]
  },
  {
    day: 4,
    title: "Upper Body",
    exercises: []
  },
  {
    day: 5,
    title: "Lower Body",
    exercises: []
  },
  {
    day: 6,
    title: "Cardio",
    exercises: []
  }
];

WORKOUTS[3].exercises = WORKOUTS[0].exercises;
WORKOUTS[4].exercises = WORKOUTS[1].exercises;
WORKOUTS[5].exercises = WORKOUTS[2].exercises;
