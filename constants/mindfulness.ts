
export interface MeditationSession {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    color: string;
    benefits: string[];
}

export interface YogaPose {
    name: string;
    instructions: string[];
    avoid: string;
    benefits: string;
    image?: any;
    duration: string;
}

export interface YogaRoutine {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    difficulty: 'Beginner' | 'Intermediate';
    poses: YogaPose[];
    color: string;
}

export const MEDITATIONS: MeditationSession[] = [
    {
        id: 'quick-calm',
        title: 'Quick Calm',
        description: 'A short pause to reset your mind.',
        duration: 3,
        color: '#4CC9F0',
        benefits: ['Reduces immediate stress', 'Improves clarity', 'Lowers heart rate']
    },
    {
        id: 'deep-focus',
        title: 'Deep Focus',
        description: 'Prepare your mind for deep work.',
        duration: 5,
        color: '#4361EE',
        benefits: ['Enhances concentration', 'Clears mental clutter', 'Boosts productivity']
    },
    {
        id: 'sleep-ease',
        title: 'Sleep Ease',
        description: 'Unwind and prepare for rest.',
        duration: 10,
        color: '#7209B7',
        benefits: ['Relaxes muscles', 'Calms racing thoughts', 'Promotes better sleep']
    }
];

export const YOGA_ROUTINES: YogaRoutine[] = [
    {
        id: 'morning-stretch',
        title: 'Morning Stretch',
        description: 'Wake up your body with gentle movements.',
        duration: 10,
        difficulty: 'Beginner',
        color: '#FFB703',
        poses: [
            {
                name: 'Cat-Cow',
                instructions: ['Start on hands and knees', 'Inhale, arch your back (Cow)', 'Exhale, round your spine (Cat)'],
                avoid: 'Overarching the lower back if it hurts',
                benefits: 'Warms up the spine',
                image: require('@/assets/images/yoga/cat_cow.png'),
                duration: '10 rounds'
            },
            {
                name: 'Child\'s Pose',
                instructions: ['Kneel and sit back on your heels', 'Reach arms forward', 'Rest forehead on the floor'],
                avoid: 'Forcing hips down if knees hurt',
                benefits: 'Gently stretches hips and back',
                image: require('@/assets/images/yoga/childs_pose.png'),
                duration: '1 minute'
            }
        ]
    },
    {
        id: 'desk-detox',
        title: 'Desk Detox',
        description: 'Counteract the effects of sitting all day.',
        duration: 15,
        difficulty: 'Beginner',
        color: '#FB8500',
        poses: [
            {
                name: 'Standing Forward Fold',
                instructions: ['Stand feet hip-width apart', 'Hinge at hips', 'Let head hang heavy'],
                avoid: 'Locking knees',
                benefits: 'Relieves tension in neck and back',
                image: require('@/assets/images/yoga/standing_forward_fold.png'),
                duration: '5-10 breaths'
            },
            {
                name: 'Chest Opener',
                instructions: ['Clasp hands behind back', 'Straighten arms', 'Lift chest'],
                avoid: 'Jutting ribs forward',
                benefits: 'Opens tight shoulders',
                image: require('@/assets/images/yoga/chest_opener.png'),
                duration: '30 seconds'
            }
        ]
    },
    {
        id: 'neck-release',
        title: 'Neck Release',
        description: 'Relieve tension from tech neck and stress.',
        duration: 5,
        difficulty: 'Beginner',
        color: '#2EC4B6',
        poses: [
            {
                name: 'Neck Rolls',
                instructions: ['Sit up straight', 'Gently drop chin to chest', 'Roll ear to shoulder, then back, then other side'],
                avoid: 'Crunching the neck backwards too hard',
                benefits: 'Relieves cervical tension',
                image: require('@/assets/images/yoga/neck_rolls.png'),
                duration: '5 each way'
            },
            {
                name: 'Ear to Shoulder',
                instructions: ['Drop right ear to right shoulder', 'Extend left arm out to side', 'Hold for deep stretch'],
                avoid: 'Lifting shoulder to ear',
                benefits: 'Stretches side of neck',
                image: require('@/assets/images/yoga/ear_to_shoulder.png'),
                duration: '30 sec/side'
            }
        ]
    },
    {
        id: 'upper-back-stretch',
        title: 'Upper Back Stretch',
        description: 'Open up the thoracic spine specifically.',
        duration: 8,
        difficulty: 'Beginner',
        color: '#E71D36',
        poses: [
            {
                name: 'Thread the Needle',
                instructions: ['Start on all fours', 'Reach right arm under left', 'Rest shoulder on floor'],
                avoid: 'Putting too much weight on the head',
                benefits: 'Twists and releases upper back',
                image: require('@/assets/images/yoga/thread_the_needle.png'),
                duration: '1 minute/side'
            },
            {
                name: 'Eagle Arms',
                instructions: ['Cross right arm under left', 'Wrap forearms', 'Lift elbows to shoulder height'],
                avoid: 'Hunching shoulders',
                benefits: 'Opens space between shoulder blades',
                image: require('@/assets/images/yoga/eagle_arms.png'),
                duration: '45 sec/side'
            }
        ]
    },
    {
        id: 'hip-flow',
        title: 'Hip Flexibility',
        description: 'Undo tight hips from sitting or running.',
        duration: 12,
        difficulty: 'Intermediate',
        color: '#8338EC',
        poses: [
            {
                name: 'Pigeon Pose',
                instructions: ['Bring right knee forward behind right wrist', 'Extend left leg back', 'Fold forward if comfortable'],
                avoid: 'Knee pain - stay upright or use figure 4 instead',
                benefits: 'Deep hip opener',
                image: require('@/assets/images/yoga/pigeon_pose.png'),
                duration: '2 minutes/side'
            },
            {
                name: 'Butterfly Pose',
                instructions: ['Sit with soles of feet together', 'Let knees fall open', 'Hold ankles and lengthen spine'],
                avoid: 'Forcing knees down',
                benefits: 'Stretches inner thighs and hips',
                image: require('@/assets/images/yoga/butterfly_pose.png'),
                duration: '2 minutes'
            }
        ]
    },
    {
        id: 'shoulder-opener',
        title: 'Shoulder Opener',
        description: 'Increase mobility in tight shoulders.',
        duration: 8,
        difficulty: 'Beginner',
        color: '#3A86FF',
        poses: [
            {
                name: 'Puppy Pose',
                instructions: ['Start on all fours', 'Walk hands forward', 'Melt chest toward floor while keeping hips high'],
                avoid: ' collapsing lower back',
                benefits: 'Deep shoulder and chest stretch',
                image: require('@/assets/images/yoga/puppy_pose.png'),
                duration: '1 minute'
            },
            {
                name: 'Cow Face Arms',
                instructions: ['Reach right arm up and back', 'Reach left arm behind and up', 'Try to clasp fingers'],
                avoid: 'Jutting head forward',
                benefits: 'Mobility for shoulders and triceps',
                image: require('@/assets/images/yoga/cow_face_arms.png'),
                duration: '45 sec/side'
            }
        ]
    },
    {
        id: 'full-relaxation',
        title: 'Full Body Relaxation',
        description: 'Gentle flow to wind down completely.',
        duration: 15,
        difficulty: 'Beginner',
        color: '#06D6A0',
        poses: [
            {
                name: 'Reclined Butterfly',
                instructions: ['Lie on back', 'Soles of feet together, knees open', 'Rest hands on belly'],
                avoid: 'Strain in hips - use pillows under knees',
                benefits: 'Passive hip opening and relaxation',
                image: require('@/assets/images/yoga/reclined_butterfly.png'),
                duration: '3-5 minutes'
            },
            {
                name: 'Savasana',
                instructions: ['Lie flat on back', 'Arms by sides, palms up', 'Close eyes and relax completely'],
                avoid: 'Fall asleep if you don\'t mean to!',
                benefits: 'Total nervous system reset',
                image: require('@/assets/images/yoga/savasana.png'),
                duration: '5+ minutes'
            }
        ]
    },
    {
        id: 'office-stretch',
        title: 'Quick Office Stretch',
        description: 'Do this right at your desk.',
        duration: 5,
        difficulty: 'Beginner',
        color: '#FF9F1C',
        poses: [
            {
                name: 'Seated Spinal Twist',
                instructions: ['Sit sideways in chair', 'Hold back of chair', 'Twist gently toward chair back'],
                avoid: 'Forcing the twist',
                benefits: 'Mobilizes spine',
                image: require('@/assets/images/yoga/seated_spinal_twist.png'),
                duration: '5 breaths/side'
            },
            {
                name: 'Wrist Relief',
                instructions: ['Extend arm forward, palm up', 'Gently pull fingers back with other hand', 'Switch to palm down'],
                avoid: 'Hyperextending',
                benefits: 'Relieves typing strain',
                image: require('@/assets/images/yoga/wrist_relief.png'),
                duration: '30 sec/hand'
            }
        ]
    }
];
