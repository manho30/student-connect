# 🎓 Student Connect

> **Connect. Share. Help. Learn.**

Student Connect is a student-focused community platform designed to help students connect, share resources, support each other, and discover campus opportunities through **Carpool, Errands, Study, and Activities**.

🚧 **Status:** Innovation Competition Prototype

---

## ✨ Features

### 🚗 Carpool

* Create and manage carpools
* Support **4 or 6 passengers**
* Join or leave a carpool
* View route, departure time, available seats, and cost
* Owner-only editing and cancellation
* Track active and recently completed carpools

### 📦 Errands

* Post an errand request
* Accept errands from other students
* Requester and helper roles
* Release an accepted errand
* Mark errands as completed
* View activity timeline
* Track active and recently completed errands

### 📚 Study

* Create study groups
* Discover available study groups
* Join or leave study groups
* Dedicated list, detail, create, and edit interfaces
* Support scheduled study sessions
* Track active and recently completed study groups

### 📢 Activities

* Promote student activities and campus events
* Publish competitions, workshops, seminars, sports, and other programmes
* Browse activities by category
* View event date, location, registration deadline, and contact information
* Support poster upload and **16:9 poster cropping**
* Owner-only editing and deletion
* No participant, joining, attendance, or capacity management

### 🔐 Authentication

* Firebase Authentication
* Login and logout
* Authenticated user state
* Protected application workflows
* Firebase UID-based ownership checks

---

## 🛠️ Technology

| Category             | Technology                 |
| -------------------- | -------------------------- |
| 🎨 Framework         | Vue 3                      |
| ⚡ Build Tool         | Vite                       |
| 🎨 Styling           | Tailwind CSS               |
| 🧩 UI Library        | Element Plus               |
| 🖼️ Icons            | Flaticon                   |
| 🖼️ Image Processing | Cropper.js                 |
| ☁️ Image Storage     | Cloudinary                 |
| 🔀 Routing           | Vue Router                 |
| 🔐 Authentication    | Firebase Authentication    |
| 🌐 API               | Centralized REST API layer |
| 💻 Language          | JavaScript                 |

> **JavaScript only — no TypeScript.**

---

## 🖥️ Interface

The interface follows a simple and consistent navigation pattern:

```text
List
 ↓
Detail
 ↓
Create / Edit
 ↓
Save
 ↓
Detail
```

### Routes

```text
/login

/carpool
/carpool?id=car_xxxxx
/carpool/new
/carpool/edit?id=car_xxxxx

/errands
/errands?id=err_xxxxx
/errands/new
/errands/edit?id=err_xxxxx

/study
/study?id=std_xxxxx
/study/new
/study/edit?id=std_xxxxx

/activities
/activities?id=act_xxxxx
/activities/new
/activities/edit?id=act_xxxxx

/profile
/admin/statistics
```

The interface is designed to be:

* 📱 Responsive
* 🧭 Easy to navigate
* 🎯 Focused on clear actions
* 🧩 Component-based
* 🎨 Consistent across all modules

---

## 📁 Project Structure

```text
student-connect-front/
├── src/
│   ├── api/
│   │   └── index.js
│   ├── components/
│   │   ├── carpool/
│   │   ├── errands/
│   │   ├── study/
│   │   └── activities/
│   ├── services/
│   │   └── auth.js
│   ├── views/
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── public/
├── package.json
└── vite.config.js
```

---

## 🔌 API Layer

All frontend API communication is centralized in:

```text
src/api/index.js
```

The application uses a single API object:

```js
studentConnect
```

Components and views communicate with the API layer instead of making direct HTTP requests.

Examples:

```js
studentConnect.getAllCarPoolList()
studentConnect.getCarPool(id)
studentConnect.createCarPool(data)
studentConnect.joinCarPool(id)

studentConnect.getAllErrands()
studentConnect.createErrand(data)
studentConnect.acceptErrand(id)

studentConnect.getAllStudyGroups()
studentConnect.createStudyGroup(data)
studentConnect.joinStudyGroup(id)

studentConnect.getAllActivities()
studentConnect.getActivity(id)
studentConnect.createActivity(data)
studentConnect.updateActivity(id, data)
studentConnect.deleteActivity(id)
```

This keeps API communication consistent and makes the frontend easier to maintain.

---

## 🔐 Authentication

Firebase Authentication manages the user's authentication state.

The frontend:

* Handles login and logout
* Maintains the current authenticated user
* Obtains Firebase ID tokens when communicating with protected APIs
* Uses the authenticated user's UID for frontend ownership checks
* Protects authenticated application workflows

Sensitive authentication credentials are not hard-coded into the application.

---

## 🧭 Application Modules

```text
Student Connect
│
├── 🚗 Carpool
│   ├── Listing
│   ├── Detail
│   ├── Create
│   └── Edit
│
├── 📦 Errands
│   ├── Listing
│   ├── Detail
│   ├── Create
│   └── Edit
│
├── 📚 Study
│   ├── Listing
│   ├── Detail
│   ├── Create
│   └── Edit
│
└── 📢 Activities
    ├── Listing
    ├── Detail
    ├── Create
    └── Edit
```

Each module is organized into reusable Vue components and views.

### Activity Module

Activities are designed as a **promotion and discovery system** rather than a participation-management system.

Activities can contain:

* Title
* Category
* Description
* Event date
* Registration deadline
* Location
* Contact information
* Poster

Supported categories include:

* Competition
* Sports
* Club & Society
* Volunteer
* Workshop
* Seminar
* Cultural
* Other

Activities do **not** include:

* Joining or leaving
* Participant lists
* Capacity management
* Attendance tracking
* Team management

---

## 📊 Activity Lifecycle

Activities follow a simple lifecycle:

```text
Open
 │
 ├── Event / registration deadline reached
 │       ↓
 │    Expired
 │
 ├── Owner completes activity
 │       ↓
 │    Completed
 │
 └── Owner cancels activity
         ↓
      Cancelled
```

The activity listing separates records into:

```text
Currently Active
↓
Open activities

Archive
↓
Recently inactive activities
```

Archived activities remain accessible through historical records.

---

## 📖 Documentation

The frontend documentation covers:

* 🎯 Project overview and objectives
* 🖥️ Interface and navigation
* 🧩 Component structure
* 🛣️ Vue Router configuration
* 🔌 API integration
* 🔐 Authentication
* 🚗 Carpool workflows
* 📦 Errand workflows
* 📚 Study workflows
* 📢 Activity workflows
* 🖼️ Activity poster upload and cropping
* 🧪 Testing checklist
* ⚙️ Environment configuration
* 🚀 Development and deployment

---

## 🚀 Getting Started

### Requirements

* Node.js
* npm

### Installation

```bash
git clone <repository-url>
cd student-connect-front
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The production files will be generated in:

```text
dist/
```

---

## ⚙️ Environment

Create a `.env` file for environment-specific configuration.

Example:

```env
VITE_API_URL=http://localhost:3001/api

VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=student_connect_activities
```

Environment variables containing application configuration should be managed separately from source code.

> Cloudinary uses an **unsigned upload preset** for activity poster uploads. API secrets must never be exposed in the frontend.

---

## 🧪 Development

Before submitting changes, verify:

* [ ] Login and logout work
* [ ] Routes work correctly
* [ ] Carpool create/edit/join/leave flows work
* [ ] Errand create/edit/accept/release/complete flows work
* [ ] Study create/edit/join/leave flows work
* [ ] Activity create/edit/delete flows work
* [ ] Activity poster upload works
* [ ] Activity poster crop maintains **16:9** ratio
* [ ] Activity archive behaviour works correctly
* [ ] Ownership restrictions work
* [ ] Mobile layout remains usable
* [ ] Production build succeeds

---

## 📊 Project Status

| Module                     | Status        |
| -------------------------- | ------------- |
| 🔐 Authentication          | ✅ Implemented |
| 🚗 Carpool                 | ✅ Implemented |
| 📦 Errands                 | ✅ Implemented |
| 📚 Study                   | ✅ Implemented |
| 📢 Activities              | ✅ Implemented |
| 🖥️ Responsive UI          | ✅ Implemented |
| 🔌 API Integration         | ✅ Implemented |
| 🖼️ Activity Poster Upload | ✅ Implemented |
| 🧪 Testing                 | 🚧 Ongoing    |

---

## 👥 Attribution

| Role                          | Contributor |
| ----------------------------- | ----------- |
| 👨‍💻 **Author / Developer**  | **Manho**   |
| 🧪 **QA / Quality Assurance** | **BX Tan**  |

---

## 📄 License

This project is developed as an **innovation competition prototype**.

---

<div align="center">

### 🎓 Student Connect

**Connect. Share. Help. Learn.**

Built for students, by students.

</div>
