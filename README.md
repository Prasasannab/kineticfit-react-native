# KineticFit - On-Demand Health, Fitness & Trainer Booking App (React Native)

[![Expo SDK 51](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native Fabric](https://img.shields.io/badge/React_Native-New_Architecture_Fabric-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-100%25_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MMKV Storage](https://img.shields.io/badge/MMKV-C++_Synchronous-10B981?style=for-the-badge&logo=wechat&logoColor=white)](https://github.com/mrousavy/react-native-mmkv)
[![Apple Pay](https://img.shields.io/badge/Apple_Pay-1--Tap_Checkout-000000?style=for-the-badge&logo=apple&logoColor=white)](https://developer.apple.com/apple-pay/)

Production-grade showcase project engineered for an Upwork Freelancer Portfolio to win high-ticket ($6,000–$18,000) fitness, booking, and MedTech marketplace clients.

Built with **React Native (Expo SDK 51+ with TypeScript)**, featuring the **React Native New Architecture (Fabric & TurboModules)** for 120Hz scrolling, **C++ based MMKV offline-first storage**, **timezone-normalized calendar booking engine**, and **Apple Health-style animated Activity Rings**.

---

## ⚡ Technical Highlights

- **Framework**: Expo SDK 51 / React Native 0.74.5 with New Architecture enabled (`newArchEnabled: true` for iOS & Android)
- **High-Performance Storage**: `react-native-mmkv` (<0.05ms synchronous read/write operations, replacing slow AsyncStorage)
- **Navigation & Routing**: Expo Router v3 (file-based routing with typed routes)
- **Animations & Gestures**: `react-native-reanimated` v3, `react-native-gesture-handler`, `@gorhom/bottom-sheet`
- **Audio & Haptic Cue Engine**: Synthesized acoustic cues + native `expo-haptics` for 3-2-1 countdowns and interval transitions
- **Strict TypeScript**: 100% type coverage, path aliases (`@/*`), strict null checks, zero `any` types
- **Design Tokens & Palette**:
  - Deep Charcoal Dark Slate (`#0F172A`)
  - Electric Amber (`#FF6B00`)
  - Mint Green (`#10B981`)
  - Electric Cyan (`#06B6D4`) & Violet (`#8B5CF6`)

---

## 📁 Scalable Architecture Layout

```
src/
├── app/                  # Expo Router / File-based navigation layout
│   ├── _layout.tsx       # Root layout (GestureHandler, SafeArea, BottomSheet, Theme)
│   └── index.tsx         # Showcase verification dashboard
├── assets/               # High-res app icons, splash screens, favicons
├── components/           # Reusable UI Primitives
│   ├── buttons/          # PrimaryButton, HapticButton (with expo-haptics)
│   ├── cards/            # SurfaceCard, TrainerCard, WorkoutCard
│   ├── calendar/         # HorizontalCalendarStrip, SlotGrid
│   └── feedback/         # StatusBadge, ActivityRings (SVG Animated)
├── features/
│   ├── auth/             # Social authentication
│   ├── trainers/         # Listings, specialties, certifications, reviews, detail modal
│   ├── booking/          # Time-slot engine, calendar, 5-min optimistic lock, Apple Pay checkout
│   ├── workouts/         # Routine guides, interval countdown timer, audio cues, player modal
│   └── progress/         # Activity rings, calories, heart rate
├── services/
│   └── storage/          # MMKV synchronous offline-first engine & helpers
├── theme/                # Design tokens (colors, spacing, radius, typography, shadows)
└── types/                # Strict domain models (Trainer, Slot, Booking, User, Health, Workout)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20 & 26)
- npm or yarn

### Installation
```bash
# Clone repository and enter directory
cd kineticfit-react-native

# Install dependencies
npm install
```

### Development
```bash
# Start Expo development server
npm start

# Run on iOS Simulator (iPhone 16 Pro / New Architecture)
npm run ios

# Run on Android Emulator
npm run android

# Run on Web Preview
npm run web

# Run Strict TypeScript Validation
npm run typecheck
```

---

## 🗺️ Implementation Roadmap

- [x] **Phase 1: Expo SDK 51 Setup, TypeScript & Theme Configuration**
  - Expo SDK 51 initialization with New Architecture (`Fabric` + `TurboModules`)
  - Dark Slate (`#0F172A`), Electric Amber (`#FF6B00`), and Mint Green (`#10B981`) theme system
  - Synchronous `react-native-mmkv` caching engine with fallback adapter
  - Strict TypeScript domain models (`Trainer`, `BookingSlot`, `User`, `Workout`, `Health`)
  - Primitives: `PrimaryButton`, `HapticButton`, `SurfaceCard`, `StatusBadge`
- [x] **Phase 2: Booking Engine & Interactive Calendar**
  - Trainer listings with specialty badges, star ratings, and hourly rates
  - Horizontal scrolling calendar strip with timezone normalization
  - 5-minute optimistic slot locking to eliminate race conditions
  - `@gorhom/bottom-sheet` checkout modal with 1-Tap Apple Pay mock
- [x] **Phase 3: 3D Workout Engine & Animated Activity Rings**
  - Reanimated SVG concentric Activity Rings (Move, Exercise, Stand)
  - Dedicated 3D Biomechanical video stage with form coaching & 0.5x/1.0x/1.5x speed controls
  - Interactive interval countdown timer with work/rest intervals & audio/haptic cues
- [x] **Phase 4: Dual Theme System & Dedicated Notifications**
  - Obsidian Dark & Alabaster Light theme system with dynamic iOS status bar syncing
  - Full Luxury Notifications Screen with category filters & unread badges
- [x] **Phase 5: Production Optimization & Showcase Deliverables**
  - 100% strict TypeScript validation (`npm run typecheck` passes with zero errors)
  - Upwork Case Study & Proposal weapon copy kit ([UPWORK_CASE_STUDY.md](UPWORK_CASE_STUDY.md))
  - Production README with technical badges and architectural defense

---

## 📄 Documentation Links
* [Upwork Portfolio Case Study & Proposal Weapon](UPWORK_CASE_STUDY.md)
* [Master Production Roadmap & Upwork Blueprint](ROADMAP.md)
* [Antigravity Architecture Rules](GEMINI.md)
