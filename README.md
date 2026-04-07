# 🚀 VibeBuilder: Premium AI Website Generator

**VibeBuilder** is a high-performance, AI-driven platform that generates stunning, responsive websites in seconds. Built on the cutting edge of Next.js 16 and Groq Llama-3.3, it offers real-time streaming generation and professional design vibes.

## ✨ Features

- **⚡ Instant AI Streaming**: Watch your website code get generated live in the browser.
- **🎨 Design Vibes**: Choose between **Sleek**, **Glassmorphic**, or **Brutalist** design systems.
- **📱 Responsive Preview**: Toggle between Desktop and Mobile views instantly.
- **🖼️ Asset Integration**: Upload logos and integrate them into your designs via Cloudinary.
- **📦 Code Export**: Copy-paste live code or download a complete ZIP project bundle.
- **🔒 Secure Auth**: Google Login integration with user-specific sites tracking.
- **💎 Admin Dashboard**: track all users, site generations, and site analytics.

## 🛠️ Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 & Framer Motion
- **AI**: Groq SDK + Vercel AI SDK
- **Database**: MongoDB (Mongoose)
- **Auth**: NextAuth.js
- **Media**: Cloudinary

## 🚀 Getting Started

1. **Clone and Install**:
```bash
git clone https://github.com/hadeedhussainmemon/VibeBuilder.git
cd VibeBuilder
npm install
```

2. **Configure Environment**:
Rename `.env.example` (or create `.env.local`) and add your keys:
- `GROQ_API_KEY`
- `MONGODB_URI`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

3. **Run Dev**:
```bash
npm run dev
```

## 🌍 Deployment

The easiest way to deploy is with **Vercel**:
1. Connect your GitHub repository.
2. Add your environment variables in the Vercel dashboard.
3. Fix your Google Redirect URI to match your Vercel deployment URL.

---
Built with ❤️ by [Hadeed Hussain](https://github.com/hadeedhussainmemon)
