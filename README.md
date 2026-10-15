# MedPulse - Hospital Management System (HMS)

MedPulse is a modern, high-performance Single-Page Application (SPA) designed for hospital administration, patient record keeping, doctor management, appointment scheduling, and automated billing.

---

## 🌟 Key Features

1. **Dashboard Analytics**:
   - Quick overview of key stats: Total Patients, Active Doctors, Appointments Today, and Total Revenue.
   - Admission & Appointment visual chart.
   - Today's appointment queue.

2. **Patient Management**:
   - Register new patients with demographic details and medical history.
   - Search and filter records instantly by patient ID, name, or phone number.
   - Full CRUD support (Create, Read, Edit, Delete).

3. **Doctor Management**:
   - Manage doctor profiles, specialties, contact info, consultation fees, and availability schedules.
   - Interactive card-based display with quick actions.

4. **Appointment Scheduling**:
   - Book appointments linking registered patients with active doctors.
   - Real-time status tracking (Scheduled, Completed, Cancelled).
   - Instant search by doctor or patient name.

5. **Billing & Invoicing**:
   - Automatic bill generation incorporating doctor consultation fees and additional services/lab procedures (e.g., CBC, X-Ray, MRI, Pharmacy, ICU).
   - Professional printable invoice generator.
   - Invoice payment tracking (Pending / Paid status).

6. **Theme & Storage**:
   - Light and Dark mode toggling.
   - Built-in `localStorage` data persistence so records are saved locally across page reloads.

---

## 📁 File Structure

```
hospital billing/
├── index.html        # Main SPA markup, sidebar layout, view panels, and modals
├── style.css         # Styling, design tokens, light/dark themes, print media queries
├── app.js            # Core JavaScript application logic, state manager & seed data
├── hero_banner.png   # Custom dashboard vector banner asset
└── README.md         # Project documentation
```

---

## 🚀 Getting Started

### Option 1: Direct Browser Access
Simply double-click `index.html` or open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server
If you prefer running via a local web server:

```bash
# Using Python
python -m http.server 8080

# Using Node / npx
npx serve
```

Then navigate to `http://localhost:8080` in your web browser.

---

## 🛠️ Built With

- **HTML5**: Semantic layout & structured forms.
- **CSS3**: Custom CSS variables, Flexbox & Grid layouts, Glassmorphism, smooth micro-animations.
- **JavaScript (ES6+)**: Modular state management, dynamic DOM rendering, LocalStorage API.

---

© 2026 MedPulse Inc. All rights reserved.
