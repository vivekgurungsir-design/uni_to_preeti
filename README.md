# Nepali Preeti <-> Unicode Translation Website

A modern, high-accuracy bidirectional converter between **Devanagari Unicode** and **Preeti Font (ASCII)** built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## ✨ Features

- **Bidirectional Conversion**:
  - **Nepali Unicode → Preeti Font**: Standard Devanagari Unicode transformed into classic Preeti layout ASCII glyphs.
  - **Preeti Font → Nepali Unicode**: Legacy Preeti text converted back to clean standard Devanagari Unicode.
- **Accurate Complex Glyph Handling**:
  - Full support for **I-kar (ि)** repositioning (before consonant in Preeti, after consonant in Unicode).
  - Proper **Reph (र्)** handling (`{` in Preeti placed before the consonant cluster in Devanagari).
  - Retroflex and regular **R-Akar (्र)** combinations (e.g. `प्र`, `ट्र`, `ठ्र`, `ग्र`, `भ्र`).
  - Compound conjuncts: `क्ष`, `त्र`, `ज्ञ`, `श्र`, `द्व`, `द्द`, `द्य`, `द्म`, `त्त`, आदि।
  - Nepali numbers (`०, १, २, ३, ४, ५, ६, ७, ८, ९` ↔ `), !, @, #, $, %, ^, &, *, (`).
- **Auto-Detection (स्वचालित पहिचान)**:
  - Automatically identifies whether your input is Devanagari Unicode or Preeti ASCII and sets the conversion direction in real time.
- **Interactive Virtual Preeti Keyboard**:
  - Full visual QWERTY layout with Preeti & Devanagari key legends and a **Shift toggle**.
  - Click any key to type directly into the input area.
- **Preeti Cheatsheet & Keymap Guide**:
  - Searchable categorized reference table for Vowels (स्वर), Consonants (व्यञ्जन), Vowel Signs (मात्रा), Conjuncts (संयुक्त वर्ण), Numbers (अङ्क), and Symbols (चिह्न).
- **Accuracy Benchmark Suite (शुद्धता परीक्षण)**:
  - 10+ standard complex test cases (`नेपाल`, `संविधान`, `प्रविधि`, `अन्तर्राष्ट्रिय`, `दृष्टिकोण`, `विद्यार्थी`) that you can verify and inject into the editor with one click.
- **Supabase Cloud Sync & Local Storage Fallback**:
  - Save converted text snippets with custom titles and tags.
  - Star / favorite translations.
  - Public shareable URLs (`/share/[id]`).
  - Feedback & inaccuracy reporting table (`feedback_reports`).
  - Seamless offline / LocalStorage mode when Supabase is not yet configured.
- **Text Tools**:
  - Word count, character count, and line count statistics.
  - "सफा गर्नुहोस्" (Text normalizer) to fix whitespace and punctuation spacing.
  - Font size controls (`A-` / `A+`).
  - One-click copy with toast feedback.
  - Download as `.txt` file.
  - Upload text file `.txt` directly into editor.
  - Preeti font visual rendering preview.
  - Dark Mode and Light Mode support.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase (Optional, recommended)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Run the SQL migration in `supabase/schema.sql` inside your **Supabase Dashboard → SQL Editor** to create the tables (`saved_translations`, `feedback_reports`, `custom_dictionary`) with Row Level Security (RLS) enabled.

> **Note**: Even without Supabase credentials, the app operates 100% locally using browser `localStorage`!

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
├── public/                     # Static assets and fonts
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind directives & font styles
│   │   ├── layout.tsx          # Root layout & Devanagari font loader
│   │   ├── page.tsx            # Main application page
│   │   └── share/[id]/page.tsx # Public shared translation view
│   ├── components/
│   │   ├── Navbar.tsx          # Top navbar, mode toggle, status
│   │   ├── TranslatorPane.tsx  # Dual-pane real-time translation engine
│   │   ├── VirtualKeyboard.tsx # Interactive on-screen Preeti keyboard
│   │   ├── PreetiCheatSheetModal.tsx # Searchable keymap guide
│   │   ├── SavedSnippetsDrawer.tsx   # History & saved translation manager
│   │   ├── SupabaseConfigModal.tsx   # Supabase status & migration assistant
│   │   ├── ShareModal.tsx      # Public shareable link generator
│   │   ├── FeedbackModal.tsx   # Inaccuracy report & feedback form
│   │   ├── AccuracyVerifier.tsx# Complex word accuracy test suite
│   │   └── Footer.tsx          # Footer with shortcuts & DTP guidance
│   ├── lib/
│   │   ├── converter.ts        # Pure TypeScript bidirectional translation algorithms
│   │   ├── preeti-keyboard-layout.ts # Keyboard row definitions & cheatsheet database
│   │   └── supabase.ts         # Supabase client with local storage fallback
│   └── types/
│       └── database.ts         # Supabase TypeScript schema definitions
├── supabase/
│   └── schema.sql              # Database DDL with RLS policies
├── tailwind.config.ts          # Tailwind styling configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## 🛠️ Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Font Rendering**: Noto Sans Devanagari, Mukta, and Preeti font fallback

