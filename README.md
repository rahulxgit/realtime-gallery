# 📸 Real-Time Gallery Interaction App  
Real-time multi-user gallery with emoji and comment interactions  
Built as part of the FotoOwl React Internship Assignment

---

## 🚀 Overview
This project is a **real-time collaborative gallery** where multiple users can:
- Browse fresh images from **Unsplash**
- React with emojis
- Comment on any image
- See all changes update instantly across browser tabs/devices  
- View a real-time **global activity feed**

It demonstrates:
- Real-time state syncing
- React fundamentals
- Reading + applying documentation
- Clean UI and smart React architecture

---

## 🧰 Tech Stack
| Layer | Technology |
|------|------------|
| Frontend | React + Vite |
| Styling | TailwindCSS |
| Real-Time Sync | InstantDB |
| State Management | Zustand |
| Async Data Fetching | React Query |
| Deployment | Vercel |
| API | Unsplash Images API |

---

## 🛠 Setup Instructions

### 1️⃣ Clone the repository
```sh
git clone https://github.com/rahulxgit/realtime-gallery.git
cd realtime-gallery


2️⃣ Install dependencies
npm install

3️⃣ Create .env file

Add environment variables:

VITE_UNSPLASH_KEY=your_unsplash_api_key
VITE_INSTANT_APP_ID=your_instantdb_app_id

4️⃣ Run the development server
npm run dev

5️⃣ Open in browser
http://localhost:5173

🌐 Live Demo (Deployed Link)

👉 https://realtime-gallery-tau.vercel.app/

(Will update after deployment)

🔌 API Handling Strategy
🔹 Unsplash API

Uses the public Search Photos API to fetch images

Returns paginated results

Wrapped in clean async fetchImages(query) function

Fetched data is cached using React Query

Error + loading states handled in UI

🔹 InstantDB Real-Time Sync

Used for:

Emoji reactions (❤️ 😂 👍)

Comments per image

Global activity feed

InstantDB provides:

.new() writes for storing interactions

.useQuery() hooks for real-time sync

This ensures:
✔ Multiple users see updates instantly
✔ UI state stays consistent without manual refresh

🗄 InstantDB Schema & Usage
📁 images collection
Field	Type	Description
url	string	Unsplash image URL
reactions	object	{emoji: count} pairs
comments	list	{user, text, ts} objects
📁 activity collection
Field	Type	Description
type	string	"reaction" or "comment"
imageId	string	Which image the action belongs to
message	string	Human readable text for the feed
username	string	Random pseudo-identity
ts	timestamp	Server timestamp

Listeners update:

Feed Section (global updates)

Image Modal (target image only)

🧩 Key React Decisions
✔ Component Architecture

GalleryGrid.jsx → Displays all images

ImageCard.jsx → Shows emoji options + opens modal

ImageModal.jsx → Comments + reactions in detail

ActivityFeed.jsx → Real-time list of all interactions

✔ Zustand for App State

Controls modal open/close

Stores selected image ID

Keeps UI state simple and global

✔ React Query for API Interaction

Handles loading + caching of Unsplash results

Avoids unnecessary network calls

✔ Hooks for Real-Time Logic

useRealtimeImage.js listens to DB changes

Automatically refreshes UI when data changes

✔ UI Decisions

Clean, minimal layout

Desktop-first design

Emoji row is visible without clicking extra menus

😮 Real-Time Demonstration

Open two browser tabs:

Tab A → Add 😍
Tab B → Instantly sees update ✓

Add a comment in tab B
→ Appears in tab A without refresh ✓

🧠 Challenges Faced & How I Solved Them
🧩 Challenge 1 — Structuring real-time data

Issue: Images need reactions & comments AND a global feed
Fix:
Separated into two collections

images (per-image state)

activity (global event logging)

🧩 Challenge 2 — Updating UI without flickering

Fix:

Used state stores (Zustand)

Memoized expensive handlers with useCallback

🧩 Challenge 3 — Understanding new tech (InstantDB)

Fix:

Read docs carefully

Started with simple schema and built up

Verified behavior with multiple tabs open

🧩 Challenge 4 — Keeping logic clean

Solution:

Split components by domain

Move DB calls into helper modules

Avoid prop drilling with global stores

✨ Improvements With More Time

If I could continue building this app, I would add:

Full user accounts (email/login)

Emoji picker component instead of hard-coded reactions

Ability to delete your own emojis/comments

Infinite scrolling & category search

Image upload by users

UI animations for feed updates

Optimistic updates + offline mode

🧑‍💻 Author

Rahul Kumar
Full-stack Web Developer
React • Node.js • MongoDB • DSA
GitHub: https://github.com/rahulxgit
LinkedIn: https://linkedin.com/in/rahulxnit

📩 Submission Checklist (Completed)

✔ Live deployed app
✔ GitHub repository
✔ Real-time multi-user behavior
✔ Clean readable UI
✔ Meets assignment requirements
✔ Detailed README (this file 💙)

🌟 Thank you FotoOwl Team!
Excited to showcase my skills & grow through this internship opportunity 🚀

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
