# Frontend Challenge Submission

**Candidate Name:** Umang Khemka
**Date:** 16th October 2025
**Time Spent:** 4-5 hours

---

## ✅ Completed Features

Mark which features you completed:

### Core Features

- [✅] Day View calendar (time slots 8 AM - 6 PM)
- [✅] Week View calendar (7-day grid)
- [✅] Doctor selector dropdown
- [✅] Appointment rendering with correct positioning
- [✅] Color-coding by appointment type
- [✅] Service layer implementation
- [✅] Custom hooks (headless pattern)
- [✅] Component composition

### Bonus Features (if any)

- [✅] Current time indicator
- [✅] Responsive design (mobile-friendly)
- [ ] Empty states
- [ ] Loading states
- [✅] Error handling
- [ ] Appointment search/filter
- [ ] Dark mode
- [ ] Accessibility improvements
- [ ] Other: ********\_********

---

## 🏗️ Architecture Decisions

### Component Structure

Describe your component hierarchy:

```
Example:
ScheduleView (main container)
├── DoctorSelector (doctor dropdown)
├── DayView (day calendar)
│   ├── TimeSlotRow
│   └── AppointmentCard
└── WeekView (week calendar)
    └── AppointmentCard (reused)
```

**Your structure:**

```
App (root component)
├── LandingPage
│   ├── DoctorFilter (dropdown to select doctor)
│   └── AppointmentList
│       ├── AppointmentCard (reusable for displaying appointment info)
│       └── NoAppointmentsMessage (shown when no results)
│
└── SchedulePage
    ├── DoctorSelector (select doctor to view schedule)
    ├── ViewToggle (switch between Day / Week view)
    ├── DayView
    │   ├── TimeSlotRow
    │   └── AppointmentCard (colored by patient type)
    └── WeekView
        └── AppointmentCard (reused for each slot)

```

**Why did you structure it this way?**

I Structured this components in this heirarchy to achieve clarity, reusablitiy, and seperation of concerns:

- Separation of Pages:
  The app has two clear user flows — viewing/filtering appointments (LandingPage) and viewing a doctor’s schedule (SchedulePage). Splitting them into distinct pages makes the code modular and easy to navigate.

- Reusability of Components:
  Components like AppointmentCard and DoctorSelector are reused in multiple places, which reduces duplication and ensures consistent behavior and styling across the app.

- Maintainability:
  Each component handles a single responsibility:

-> DoctorSelector → controls which doctor’s data to show

AppointmentCard → represents a single appointment

ViewToggle → manages switching between views
This isolation helps debug or enhance specific parts without breaking others.

---

### State Management

**What state management approach did you use?**

- [✅] useState + useEffect only
- [ ] Custom hooks (headless pattern)
- [ ] React Context
- [ ] External library (Redux, Zustand, etc.)
- [✅] Other: useCallBack

**Why did you choose this approach?**

- useState:
  I used useState to manage the dynamic data that has changed during user interaction - for example:
  The selected doctor in dropdown, the current view mode.
- useEffect:
  I used useEffet to handle side effects - logic that runs as a result of state or prop changes.
  example:
  Fetching appointments when doctor is selected with the help of doctot ID,
  Updating filtered results after state updates
- useCallback:
  I used useCallback to optimize performance by memoizing functions that are passed down as props to child components.
  example:
  Without it, those functions would be recreated on every render, causing unnecessary re-renders of components like: AppoinmentCard, DoctorSelector

---

### Service Layer

**How did you structure your data access?**

[Describe your service layer architecture - did you use a class, functions, or something else?]

**What methods did you implement in AppointmentService?**

- [✅] getAppointmentsByDoctor
- [✅] getAppointmentsByDoctorAndDate
- [✅] getAppointmentsByDoctorAndDateRange
- [✅] getPopulatedAppointment
- [✅] getAllDoctors
- [ ] Other: ********\_********

---

### Custom Hooks

**What custom hooks did you create?**

1. `useAppointments` - This custom React hook is responsible for fetching, sorting, and managing appointment data for a specific doctor — depending on the selected date and view (day or week).
   - Purpose:
     - Load a doctor’s appointments (for a single day or week)
     - Handle loading and error states
     - Cache doctor details
     - Refresh data when inputs change (like selected doctor or date)

**How do they demonstrate the headless pattern?**

| Aspect                       | Explanation                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Logic is isolated**        | The hook handles all logic — fetching, sorting, and filtering appointments — completely independent of how the data will be displayed.                                  |
| **UI is flexible**           | Components like `DayView`, `WeekView`, or `AppointmentCard` can consume the hook’s output and render the data however they want (cards, tables, lists, etc.).           |
| **Reusable across contexts** | The same hook works for both the **LandingPage** (doctor filter view) and the **SchedulePage** (calendar view) — showing the same data logic reused with different UIs. |
| **No styling or JSX inside** | The hook returns plain data (`appointments`, `doctor`, `loading`, etc.) and callbacks (`refresh`) — it doesn’t render any UI elements.                                  |
| **Encapsulation of state**   | It hides internal states (`loading`, `error`, etc.) and provides a clean API to the consumer components.                                                                |

---

## 🎨 UI/UX Decisions

### Calendar Rendering

**How did you generate time slots?**

I generated time slots programmatically inside the DayView component using a simple loop:

- The calendar day runs from 8:00 AM to 6:00 PM, divided into 30-minute intervals.
- For each slot, I created a start, end, and a label (formatted time string).
- The slots are stored in an array and then mapped over to render each row dynamically.

```typescript
for (let h = 8; h < 18; h++) {
  for (let m = 0; m < 60; m += 30) {
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    slots.push({ start, end, label });
  }
}
```

**How did you position appointments in time slots?**

Each time slot row displays all appointments that overlap that half-hour window.

```typescript
getAppointmentsForSlot(slot) {
  return appointments.filter((a) => {
    const start = new Date(a.startTime);
    const end = new Date(a.endTime);
    return start < slot.end && end > slot.start;
  });
}
```

- This ensures an appointment appears in every time slot it spans.Inside the JSX, the layout uses Flexbox (flex flex-wrap gap-2) so multiple appointment cards can appear side-by-side if needed.

**How did you handle overlapping appointments?**

Overlapping appointments are handled visually within the same time slot:
- Each slot’s appointment area uses display: flex; flex-wrap: wrap;
- If two appointments overlap in the same time range, both are displayed next to each other instead of stacking.
- Each appointment is color-coded by type (e.g., checkup, consultation, follow-up, procedure) using


```typescript
const typeColor = {
  checkup: 'bg-blue-500 border-blue-600 text-white',
  consultation: 'bg-green-500 border-green-600 text-white',
  'follow-up': 'bg-orange-500 border-orange-600 text-white',
  procedure: 'bg-purple-500 border-purple-600 text-white',
};

```

---

### Responsive Design

**Is your calendar mobile-friendly?**

- [✅] Yes, fully responsive
- [ ] Partially (some responsive elements)
- [ ] No (desktop only)

**What responsive strategies did you use?**

To make the app responsive across different screen sizes, I used Tailwind CSS’s utility-first responsive classes.
- The layout is designed for smaller screens first and enhanced for larger screens using Tailwind’s responsive prefixes (sm:, md:, lg:, xl:).
- Used Flexbox (flex, flex-wrap, justify-between, gap-x, gap-y) to let appointment cards and time slots adjust automatically to available width.
- The main calendar and appointment list containers use w-full and flex-1 to grow or shrink based on screen size.
- The appointment cards use flex-wrap so multiple overlapping appointments stack or wrap naturally on smaller screens.
---

## 🧪 Testing & Quality

### Code Quality

**Did you run these checks?**

- [✅] `npm run lint` - No errors
- [✅] `npm run type-check` - No TypeScript errors
- [✅] `npm run build` - Builds successfully
- [✅] Manual testing - All features work

### Testing Approach

**Did you write any tests?**

- [ ] Yes (describe below)
- [ ] No (ran out of time)

**If yes, what did you test?**

[List what you tested]

---

## 🤔 Assumptions Made

List any assumptions you made while implementing:

1. We have to make 2 roles so assumed that landing page's "Go to Schedule" will take us to doctor's appoinment view page 
2. Instead of using the date-fns we can do it mannually

---

## ⚠️ Known Issues / Limitations

Be honest about any bugs or incomplete features:

1. [Issue 1 - e.g., "Week view doesn't handle overlapping appointments well"]
2. [Issue 2]
3. [etc.]

---

## 🚀 Future Improvements

What would you add/improve given more time?

1. Integrate WebSockets (e.g., Socket.IO) so that any new appointment or cancellation is reflected immediately across all users without refreshing the page.
2. Allow users to drag and drop appointments within the calendar to quickly reschedule.
3. Send email or push notifications to patients and doctors for upcoming appointments or schedule changes.
4. Add filters by appointment type, patient type, or time range, and search by patient name or ID for quicker access.


---

## 💭 Challenges & Learnings

### Biggest Challenge

What was the most challenging part of this project?

1. Identifying overlaps: Multiple appointments could occur in the same time slot or span across several slots.
2. Displaying overlapping appointments side-by-side while keeping the layout responsive required careful use of Flexbox and flex-wrap.
3. AppointmentCard had to be completely reusable across LandingPage, DayView, and WeekView, while handling different visual contexts and data.

### What Did You Learn?

Did you learn anything new while building this?

1. To understand the things i have to build from the code i have been given with comments.
2. To built the calendar in which appoinment cards can be inserted and are reusable.

### What Are You Most Proud Of?

What aspect of your implementation are you most proud of?

1. Successfully implementing a dynamic calendar that correctly handles overlapping appointments, different patient types (with color coding), and day/week views.
2. Creating a reusable and headless data hook (useAppointments) that works across multiple pages without duplicating logic.
3. Building a responsive and visually clear UI that works well on mobile and desktop screens.

---

## 🎯 Trade-offs

### Time vs. Features

**Where did you spend most of your time?**

- [✅] Architecture/planning
- [✅] Day view implementation
- [✅] Week view implementation
- [ ] Styling/polish
- [ ] Refactoring
- [ ] Other: ********\_********

**What did you prioritize and why?**

1. I prioritized functionality and reusability over styling because the core purpose of the app is to display appointments accurately and efficiently.
2. I prioritized the Architecture planning time to keep the flow as wanted.

### Technical Trade-offs

**What technical trade-offs did you make?**

Example: "I chose to use a simple array filter for appointments instead of implementing a more efficient data structure because..."

- I used to bit confused about using the these libraries for dates, hours, minutes, etc.
but this challenge helped me overcome that

---

## 📚 Libraries & Tools Used

### Third-Party Libraries

Did you use any additional libraries beyond what was provided?

**Calendar/UI Libraries:**

- [ ] react-big-calendar
- [ ] FullCalendar
- [ ] shadcn/ui
- [ ] Radix UI
- [ ] Headless UI
- [ ] Other: ********\_********

**Utility Libraries:**

- [ ] lodash
- [ ] ramda
- [ ] Other: ********\_********

**Why did you choose these libraries?**

[Explain your library selection and how they helped]

---

### AI Tools & Documentation

**AI Coding Assistants:**

- [ ] GitHub Copilot
- [ ] ChatGPT
- [✅] Claude
- [ ] Other: ********\_********

**How did you use AI tools?**

- I used claude for when there were issues regarding styling was not getting applied of my tailwindcss classes.
- And for debugging the overlapping appoinment cause my code not displaying it properly. 

**Documentation & Resources:**

- [✅] React documentation
- [✅] Next.js documentation
- [ ] date-fns documentation
- [✅] TypeScript documentation
- [✅] Tailwind CSS documentation
- [ ] Library-specific documentation
- [ ] Stack Overflow / GitHub Issues
- [ ] Other: ********\_********

---

## 📝 Additional Notes

Any other comments or information you'd like to share?

[Your notes]

---

## ✨ Screenshots (Optional)

If you'd like, you can add screenshots of your implementation here.

<img width="1017" height="858" alt="image" src="https://github.com/user-attachments/assets/baf5d3dc-5035-4850-b184-7f19859c0d44" />

<img width="1571" height="901" alt="image" src="https://github.com/user-attachments/assets/038fd81e-9825-43f1-baec-53964c258125" />

<img width="1582" height="910" alt="image" src="https://github.com/user-attachments/assets/ba354abb-ecac-4304-93a1-b4a07888de70" />




---

**Thank you for your submission! We'll review it and get back to you soon.**
