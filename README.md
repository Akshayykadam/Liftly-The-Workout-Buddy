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

### 🏥 Life Profile & Health Connect
- **Comprehensive Health Dashboard**: A dedicated view for all your vital stats.
- **Platform Integration**: Seamlessly syncs with **Android Health Connect**.
- **Metrics Tracked**:
  - Total Calories Burned (Active + Resting)
  - Sleep Duration & Sessions
  - Heart Rate Monitoring
  - Distance Covered
  - Hydration Logging
  - Body Metrics (Weight, Height, BMI)

### 👤 Personalization
- **Profile Management**: Customizable profile with BMI calculation and goal setting.
- **Smart Reminders**: Flexible notification system for workout reminders (by day and time).
- **Step Tracking**: Visual daily step goals with progress rings.

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
