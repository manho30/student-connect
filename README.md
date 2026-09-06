# 🎓 Student Connect

> **Connect. Share. Help. Learn.**

Student Connect is a student-focused community platform designed to help students connect, share resources, and support each other through **Carpool, Errands, and Study**.

🚧 **Status:** Innovation Competition Prototype

---

## ✨ Features

### 🚗 Carpool

* Create and manage carpools
* Support **4 or 6 passengers**
* Join or leave a carpool
* View route, departure time, available seats, and cost
* Owner-only editing and cancellation

### 📦 Errands

* Post an errand request
* Accept errands from other students
* Requester and helper roles
* Release an accepted errand
* Mark errands as completed
* View activity timeline

### 📚 Study

* Create study activities
* Discover available study activities
* Join study activities
* Dedicated list, detail, create, and edit interfaces

### 🔐 Authentication

* Firebase Authentication
* Login and logout
* Authenticated user state
* Protected application workflows

---

## 🛠️ Technology

| Category          | Technology                 |
| ----------------- | -------------------------- |
| 🎨 Framework      | Vue 3                      |
| ⚡ Build Tool      | Vite                       |
| 🎨 Styling        | Tailwind CSS               |
| 🧩 UI Library     | Element Plus               |
| 🖼️ Icons         | Flaticon                   |
| 🔀 Routing        | Vue Router                 |
| 🔐 Authentication | Firebase Authentication    |
| 🌐 API            | Centralized REST API layer |
| 💻 Language       | JavaScript                 |

> **JavaScript only — no TypeScript.**

---

## 🖥️ Interface

The interface follows a simple and consistent navigation pattern:

```text id="8s5x4e"
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

```text id="j3x9k1"
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
```

The interface is designed to be:

* 📱 Responsive
* 🧭 Easy to navigate
* 🎯 Focused on clear actions
* 🧩 Component-based
* 🎨 Consistent across all modules

---

## 📁 Project Structure

```text id="g8v2mk"
student-connect-front/
├── src/
│   ├── api/
│   │   └── index.js
│   ├── components/
│   │   ├── carpool/
│   │   ├── errands/
│   │   └── study/
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

```text id="p8y1qz"
src/api/index.js
```

The application uses a single API object:

```js id="2f9r1a"
studentConnect
```

Components and views communicate with the API layer instead of making direct HTTP requests.

Example:

```js id="q7m3vc"
studentConnect.getAllCarPoolList()
studentConnect.getCarPool(id)
studentConnect.createCarPool(data)
studentConnect.joinCarPool(id)
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

Sensitive authentication credentials are not hard-coded into the application.

---

## 🧭 Application Modules

```text id="z5k2qx"
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
└── 📚 Study
    ├── Listing
    ├── Detail
    ├── Create
    └── Edit
```

Each module is organized into reusable Vue components and views.

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
* 🧪 Testing checklist
* ⚙️ Environment configuration
* 🚀 Development and deployment

---

## 🚀 Getting Started

### Requirements

* Node.js
* npm

### Installation

```bash id="r4m7nx"
git clone <repository-url>
cd student-connect-front
npm install
```

### Development

```bash id="v9c2la"
npm run dev
```

### Production Build

```bash id="b6t1wp"
npm run build
```

The production files will be generated in:

```text id="e3k8mz"
dist/
```

---

## ⚙️ Environment

Create a `.env` file for environment-specific configuration.

Example:

```env id="n5q8cx"
VITE_API_URL=http://localhost:3001/api
```

Environment variables containing application configuration should be managed separately from source code.

---

## 🧪 Development

Before submitting changes, verify:

* [ ] Login and logout work
* [ ] Routes work correctly
* [ ] Carpool create/edit/join/leave flows work
* [ ] Errand create/edit/accept/release/complete flows work
* [ ] Study flows work
* [ ] Ownership restrictions work
* [ ] Mobile layout remains usable
* [ ] Production build succeeds

---

## 📊 Project Status

| Module             | Status            |
| ------------------ | ----------------- |
| 🔐 Authentication  | ✅ Implemented     |
| 🚗 Carpool         | ✅ Implemented     |
| 📦 Errands         | ✅ Implemented     |
| 📚 Study           | 🚧 In Development |
| 🖥️ Responsive UI  | ✅ Implemented     |
| 🔌 API Integration | ✅ Implemented     |
| 🧪 Testing         | 🚧 Ongoing        |

---

## 👥 Attribution

| Role                          | Contributor  |
| ----------------------------- |--------------|
| 👨‍💻 **Author / Developer**  | **Manho**    |
| 🧪 **QA / Quality Assurance** | **BX Tan**   |

---

## 📄 License

This project is developed as an **innovation competition prototype**.

---

<div align="center">

### 🎓 Student Connect

**Connect. Share. Help. Learn.**

Built for students, by students.

</div>
