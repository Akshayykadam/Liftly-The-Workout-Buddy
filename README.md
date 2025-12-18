# Liftly - Workout & Wellness Tracker

Liftly is a premium, comprehensive React Native mobile application designed to help you track your fitness journey, from strength training to mindfulness, with seamless Health Connect integration.

## Features

##UI

<img src="https://github.com/user-attachments/assets/613f95c0-d305-4ab2-a2ae-c04c46d2ac77" width="90" />
<img src="https://github.com/user-attachments/assets/5e8e3849-409b-4465-9bfa-5079c02ab909" width="90" />
<img src="https://github.com/user-attachments/assets/57883d41-2fb0-491f-9197-de53966e6acf" width="90" />
<img src="https://github.com/user-attachments/assets/18de48c5-196f-4625-80ae-3a4bd3bb9db4" width="90" />
<img src="https://github.com/user-attachments/assets/4520e1b9-8c80-4985-8a1f-878681c35098" width="90" />
<img src="https://github.com/user-attachments/assets/918c193f-e881-4f8d-9c40-02f5cf9627df" width="90" />
<img src="https://github.com/user-attachments/assets/f8c2d2a0-3e18-48ce-bee6-b09b0dfcca7f" width="90" />
<img src="https://github.com/user-attachments/assets/00165087-39ed-4de5-938a-d7164bdfe8e4" width="90" />


### 🏋️‍♂️ Smart Workout Tracking
- **Structured Programs**: 6-day workout cycles tailored to 3 difficulty levels (Beginner, Intermediate, Advanced).
- **Exercise Management**: Detailed exercise lists with sets, reps, muscle targeting, and "How to View" guides.
- **Smart Completion**: Track exercise progress with haptic feedback and visual completion rings.
- **Rest Day Management**: Dedicated rest day interface with recovery tips.

### 🧘 Mind & Body
- **Yoga Routines**: Guided sessions for mobility, flexibility, and relaxation.
- **Smart Tracking**: Track duration/reps for each pose and mark routines as "Completed Today" with visual indicators.
- **Meditation**: Timed breathing exercises and meditation sessions for focus and sleep.

### 📊 Visual Progress Analytics
- **Heart Rate Trends**: 
    - Interactive line charts visualizing daily heart rate timeline (10-minute smoothing).
    - Detailed min, max, average, and resting heart rate statistics.
    - Animated entry for engaging data visualization.
- **Step Tracking**: Real-time step counting with animated progress bars and daily goal rings.
- **Sleep Analysis**: 
    - Deep dive into sleep stages (Deep, Light, REM) with animated stage bars.
    - Duration trends and sleep score insights.
- **Weight Tracking**: Log daily weight and track changes over time with animated trend lines.

### 🏥 Advanced Health Connect Integration
- **Real-Time Sync**: Background polling ensures your steps and health data are always up-to-date.
- **Platform Native**: Direct integration with **Android Health Connect** for privacy-focused data access.
- **Comprehensive Metrics**:
  - Heart Rate (Granular samples + History)
  - Sleep Quality & Duration
  - Total Calories Burned (Active vs. Resting)
  - Distance & Activity
  - Body Measurements (Weight, Height)

### 👤 Personalization & UI
- **Extended Onboarding**: Comprehensive setup flow collecting fitness level, goals, measurements, and birth year.
- **Premium Design**: Sleek dark mode interface with consistent color theory (Accent Green/Red).
- **Responsive Layouts**: Fixed overflow issues and aligned labels for a polished look on all screen sizes.
- **Profile Management**: Customizable profile with automatic BMI and Age display.
- **Smart Reminders**: Flexible notification system for workout reminders.

## Tech Stack

- **Framework**: React Native with Expo (Dev Client)
- **Language**: TypeScript
- **Navigation**: Expo Router (v6)
- **State Management**: React Context & Hooks (Zustand)
- **UI Components**: 
  - Custom components with `react-native-svg` for complex charts.
  - `lucide-react-native` for consistent iconography.
  - `react-native-reanimated` for smooth UI transitions and graph animations.
- **Health**: `react-native-health-connect` (Android)
- **Haptics**: `expo-haptics` for tactile feedback.
- **Persistence**: AsyncStorage for local data saving.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Android Studio (for Emulator/Device testing)
- Java 17 (Required for Health Connect builds)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/liftly.git
   cd liftly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running on Device (Development Build)

Since this app uses native Health Connect APIs, it **cannot** run in standard Expo Go. You must create a development build:

1. Connect your Android device via USB.
2. Run the android build command:
   ```bash
   npm run android
   ```
3. This will trigger a prebuild and install the development APK on your device.

## Building for Production

Liftly is configured for **EAS Build**.

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android (APK)
eas build --platform android --profile production
```

## Project Structure

- `app/`: Expo Router pages (Tabs: Index, Progress, Health)
- `components/`: Reusable UI components (Charts, Modals, Cards)
- `constants/`: Workouts, Exercises, and Theme Colors
- `contexts/`: Global state (User, Workout, HealthConnect)
- `services/`: Health Connect and Notification services
- `types/`: TypeScript definitions for Health and Workout data

---

Built with ❤️ using React Native
