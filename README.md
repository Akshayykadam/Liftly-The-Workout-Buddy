# Liftly - Workout & Wellness Tracker

Liftly is a comprehensive React Native mobile application designed to help you track your fitness journey, from strength training to mindfulness.

## Features

### 🏋️‍♂️ Smart Workout Tracking
- **Structured Programs**: 6-day workout cycles tailored to 3 difficulty levels (Beginner, Intermediate, Advanced).
- **Exercise Management**: Detailed exercise lists with sets, reps, and muscle targeting.
- **Schedule Manager**: View your upcoming workout plan and track completions.

### 🧘 Mind & Body
- **Yoga Routines**: Guided sessions for mobility, flexibility, and relaxation (e.g., Neck Release, Hip Flow, Desk Detox).
- **Meditation**: Timed breathing exercises and meditation sessions for focus and sleep.

### 📊 Visual Progress Analytics
- **Weight Tracking**: Log daily weight and track changes over time.
- **Interactive Charts**: Visualize weekly and monthly progress trends with dynamic graphs.
- **Stats Overview**: Monitor average, minimum, and maximum weight stats.

### 👤 Personalization
- **Profile Management**: customizable profile with BMI calculation.
- **Goal Setting**: Set meaningful fitness goals (Weight Loss, Maintenance, Muscle Gain).
- **Step Tracking**: Integrated pedometer to track daily activity levels.
- **Smart Reminders**: Customizable workout notifications to keep you consistent.

## Tech Stack

- **Framework**: React Native with Expo (SDK 50+)
- **Language**: TypeScript
- **Navigation**: Expo Router (v3)
- **State Management**: React Context & Hooks
- **UI Components**: Custom components with `react-native-svg` for charts and `lucide-react-native` for iconography.
- **Persistence**: AsyncStorage for local data saving.
- **Sensors**: `expo-sensors` for step counting.
- **Haptics**: `expo-haptics` for tactile feedback.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

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

3. Start the development server:
   ```bash
   npm start
   ```

### Running on Device

1. Download **Expo Go** from the App Store (iOS) or Google Play (Android).
2. Scan the QR code presented in the terminal.
3. The app will bundle and load on your device.

## Building for Production

Liftly is configured for **EAS Build**.

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android (APK)
eas build --platform android --profile production

# Build for iOS (IPA)
eas build --platform ios --profile production
```

## Project Structure

- `app/`: Expo Router pages and layouts
- `components/`: Reusable UI components (Cards, Modals, Charts)
- `constants/`: Configuration, workout data, and color themes
- `contexts/`: Global state management (User, Workout, Steps)
- `utils/`: Helper functions and notifications logic

---

Built with ❤️ using React Native
