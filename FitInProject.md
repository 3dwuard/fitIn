FitIn track landingpage:

Eduardo: Continue level 2 project (fitness tracker)
    - data (fitness coach)
    - client info (mood, calorie intake)
    - excel spreadsheet math calculations (take from the spreadsheet)


-Coaches:
1.0 Different workouts or sports
1.1 Video Call (Itroduction)  Buffer object (aws) - WEB Sockit (Open live connections) - DataBase to stream?
What technologies i have to build up 
1.2 Calendar
1.3 Messages
1.4 Set the Different Payments for each course deppending.

2.0  Follow up the data teh User shows
2.3  Bring some feed back


-Members/Athlets:
Chose the Sport then the coach
Introduction (Demo) call with the coach 
Chose the Payment option

2.0 They update the excercise (Storage from all the data)
2.1 Show the calories they are eating
2.2 Show their mood and comments


-Pages/Layout:
Section with 2 option coach
User coach information 

Page Coach, Downlup introduction video.
The iscription 

Payment page 
Their banc account for depossit


 or athlete 
 user Information 
 Name 
 Password
 
 goals

 Page Athlete/Information 

 Click the coach option it displays a new page the idrofutcion video 

 Payment Page 
 After deciding the coach they make the payment.


How to do live video calls, life chats, proces and library s that someone is using.

List them out in my document

Give some feedback of behvavor

the model in the floor moodel 


FitTrack app for your Level 3 final project.

---

## 📅 Daily Timeline: June 1 – June 28, 2026

### Week 1: Foundation & Auth (June 1–7)

| Day | Date | Tasks | Deliverable |
|-----|------|-------|--------------|
| **1** | Mon, Jun 1 | – Setup Vite + React + Tailwind CSS<br>– Initialize Express backend (minimal)<br>– Create Supabase project, copy keys<br>– Deploy blank frontend to Vercel (preview) | Project repos, live preview link |
| **2** | Tue, Jun 2 | – Install Supabase client, configure auth<br>– Create login/signup forms (email/password)<br>– Add "Sign in with Google" | Users can sign up/login |
| **3** | Wed, Jun 3 | – Create `profiles` table in Supabase (id, role, name, avatar)<br>– After login, insert profile if new<br>– Role selection page (coach or client) | Role assigned to user |
| **4** | Thu, Jun 4 | – Set up React Router (pages: Landing, Dashboard, CoachStudio, Logger, Profile)<br>– Protected routes (redirect if not logged in) | Routing working |
| **5** | Fri, Jun 5 | – Build Landing page (hero, features, CTA buttons)<br>– Deploy to Vercel production | Live landing page |
| **6** | Sat, Jun 6 | – Client Dashboard layout (basic cards)<br>– Fetch and display user role and name | Dashboard shows user info |
| **7** | Sun, Jun 7 | – Write Supabase RLS policies (users see only own data, coaches see clients they coach)<br>– Test auth and row-level security | Secure data access |

✅ **End of Week 1:** Auth works, roles assigned, landing page live, basic dashboard.

---

### Week 2: Core Workout Features (June 8–14)

| Day | Date | Tasks | Deliverable |
|-----|------|-------|--------------|
| **8** | Mon, Jun 8 | – Design database schema: `workout_plans`, `exercises`, `workout_logs` (SQL migrations)<br>– Run migrations in Supabase SQL editor | Tables created |
| **9** | Tue, Jun 9 | – Coach Studio: form to create a workout plan (title, description, date)<br>– Save plan to Supabase | Coach can create a plan |
| **10**| Wed, Jun 10 | – Add exercises to a plan (dynamic form: name, sets, reps, weight)<br>– Store exercises linked to plan_id | Coach can add exercises |
| **11**| Thu, Jun 11 | – Client Dashboard: fetch and display assigned workout plans<br>– Show exercises with checkboxes or input fields | Client sees their plan |
| **12**| Fri, Jun 12 | – Workout Logger page: log actual sets/reps/weight, duration, calories<br>– Save log to `workout_logs` table | Client can log a workout |
| **13**| Sat, Jun 13 | – Simple progress chart (Recharts) on client dashboard: total volume per day<br>– Use logs data to display line chart | Basic progress visualization |
| **14**| Sun, Jun 14 | – Add "Edit/Delete" plan options for coach<br>– Improve UI/UX (loading states, error messages) | Coach can manage plans |

✅ **End of Week 2:** Coaches create plans, clients log workouts, basic chart works.

---

### Week 3: Social & Coaching Tools (June 15–21)

| Day | Date | Tasks | Deliverable |
|-----|------|-------|--------------|
| **15**| Mon, Jun 15 | – Create `chats` and `messages` tables in Supabase<br>– Enable Supabase Realtime for messages table | Chat schema ready |
| **16**| Tue, Jun 16 | – Build chat interface (list of conversations, message input)<br>– Subscribe to new messages via Realtime | Real-time messaging works |
| **17**| Wed, Jun 17 | – Add "Schedule Video Call" button on chat or dashboard<br>– Backend endpoint (Express on Railway) to generate Daily.co room URL<br>– Store call details in `calls` table | Coach can schedule a call |
| **18**| Thu, Jun 18 | – Client side: show upcoming calls, join button opens Daily.co iframe<br>– Test call flow | Video call scheduling & joining |
| **19**| Fri, Jun 19 | – Supabase Storage bucket for progress media<br>– RLS policy: client can upload only their own files, coach can view client’s files | Secure upload ready |
| **20**| Sat, Jun 20 | – Client Logger: add image/video upload button<br>– Display uploaded media on client dashboard and coach studio | Media upload works |
| **21**| Sun, Jun 21 | – Coach can view client's media and leave text feedback<br>– Store feedback in `workout_logs` or separate `feedbacks` table | Coach feedback loop |

✅ **End of Week 3:** Chat, video calls, media upload & feedback all functional.

---

### Week 4: Polish, Payments & Deployment (June 22–28)

| Day | Date | Tasks | Deliverable |
|-----|------|-------|--------------|
| **22**| Mon, Jun 22 | – Integrate Conekta or Stripe (subscribe or one-time purchase)<br> – Use webhook to update user's role or access after payment | Payment flow (test mode) |
| **23**| Tue, Jun 23 | – Add notifications (toast for new messages, plan updates)<br> – Use simple React context or local state | User feedback improved |
| **24**| Wed, Jun 24 | – Responsive design check (mobile, tablet)<br> – Fix CSS bugs, ensure all pages look clean | Fully responsive |
| **25**| Thu, Jun 25 | – Write README.md (setup instructions, features, tech stack)<br> – Add inline comments for clarity | Easy-to-understand code |
| **26**| Fri, Jun 26 | – Final testing on staging (Vercel + Railway)<br> – Fix any critical bugs | Stable staging version |
| **27**| Sat, Jun 27 | – Deploy to production (Vercel frontend, Railway backend)<br> – Set environment variables, ensure all APIs work | Live production app |
| **28**| Sun, Jun 28 | – Final project video walkthrough (record screen)<br> – Submit to your Level 3 instructor | Project completed! 🚀 |

---

## ✨ Key Principles for an Awesome Project

- **Keep code simple** – use functional components, custom hooks for Supabase calls, avoid over-engineering.
- **Intuitive UI** – consistent buttons, clear labels, loading spinners, error toasts.
- **Easy for others to understand** – comment complex logic, name variables clearly, split files logically (components/, pages/, hooks/, utils/).
- **Test each day** – after every task, manually test that feature.
- **Commit to GitHub daily** – you'll have a perfect history for your portfolio.

---

## 🧰 Minimal Folder Structure (Copy-Paste Friendly)

```
fitrack/
├── frontend/ (Vite + React)
│   ├── src/
│   │   ├── components/ (Button, Chat, WorkoutCard)
│   │   ├── pages/ (Landing, Dashboard, CoachStudio, Logger, Profile)
│   │   ├── hooks/ (useAuth, useSupabase)
│   │   ├── utils/ (supabaseClient.js)
│   │   └── App.jsx
│   └── .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── backend/ (Express on Railway)
│   ├── routes/ (daily.js, calls.js, webhooks.js)
│   ├── server.js
│   └── .env (SUPABASE_SERVICE_KEY, DAILY_API_KEY)
└── README.md
```

You have a clear daily roadmap. Stick to it, and by June 28 you'll have a **professional, functional, and impressive final project**. Good luck! 💪


