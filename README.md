# Liftly - Workout & Wellness Tracker

Liftly is a premium, comprehensive React Native mobile application designed to help you track your fitness journey, from strength training to mindfulness, with seamless Health Connect integration.

## Features

### 🏋️‍♂️ Smart Workout Tracking
- **Structured Programs**: 6-day workout cycles tailored to 3 difficulty levels (Beginner, Intermediate, Advanced).
- **Exercise Management**: Detailed exercise lists with sets, reps, muscle targeting, and "How to View" guides.
- **Smart Completion**: Track exercise progress with haptic feedback and visual completion rings.
- **Rest Day Management**: Dedicated rest day interface with recovery tips.

### 🧘 Mind & Body
- **Yoga Routines**: Guided sessions for mobility, flexibility, and relaxation (e.g., Neck Release, Hip Flow, Desk Detox).
- **Meditation**: Timed breathing exercises and meditation sessions for focus and sleep.

### 📊 Visual Progress Analytics
- **Heart Rate Trends**: Interactive line charts visualizing daily min, max, and resting heart rate history.
- **Step Tracking**: Real-time step counting with daily goals and progress rings.
- **Sleep Analysis**: Deep dive into sleep stages (Deep, Light, REM) and duration trends.
- **Weight Tracking**: Log daily weight and track changes over time with trend lines.

### 🏥 Advanced Health Connect Integration
- **Real-Time Sync**: Background polling ensures your steps and health data are always up-to-date.
- **Platform Native**: Direct integration with **Android Health Connect** for privacy-focused data access.
- **Comprehensive Metrics**:
  - Heart Rate (Resting & Active)
  - Sleep Quality & Duration
  - Total Calories Burned
  - Distance & Activity
  - Body Measurements (Weight, Height)

### 👤 Personalization & UI
- **Premium Design**: Sleek dark mode interface with consistent color theory (Accent Green/Red).
- **Profile Management**: Customizable profile with automatic BMI calculation.
- **Smart Reminders**: Flexible notification system for workout reminders.
- **Interactive Modals**: Polished animations for goal setting and achievements.

## Tech Stack

- **Framework**: React Native with Expo (Dev Client)
- **Language**: TypeScript
- **Navigation**: Expo Router (v3)
- **State Management**: React Context & Hooks
- **UI Components**: 
  - Custom components with `react-native-svg` for complex charts.
  - `lucide-react-native` for consistent iconography.
  - Polished with `react-native-reanimated`.
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
