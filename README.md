# Student Connect Frontend

Frontend repository for the **Student Connect** web application — a lightweight student-to-student platform inspired by *kereta sapu* for campus carpooling, peer errands, and collaborative study groups.

---

## Tech Stack

* **Vue 3** (Composition API, `<script setup>`)
* **Vite**
* **Vue Router**
* **Tailwind CSS**
* **Element Plus**
* **Flaticon UI Icons**

> **Note:** Strictly JavaScript only. No backend, database, or server files are included in this frontend repository.

---

## Page & Routing Architecture

Each core feature provides dedicated screens for **Listing**, **Detail**, **Create**, and **Edit**:

### 1. Carpool Routes

| Route | View / Component | Description |
|---|---|---|
| `/carpool` | `CarpoolView.vue` (`CarpoolList.vue`) | Carpool listing with search, filtering, and seat capacity status |
| `/carpool?id=xxxxxxx` | `CarpoolView.vue` (`CarpoolDetail.vue`) | Full ride details, departure timeline, passenger list, join/leave actions |
| `/carpool/new` | `CarpoolFormView.vue` | Create a new student carpool ride |
| `/carpool/edit?id=xxxxxxx` | `CarpoolFormView.vue` | Edit departure, cost, or capacity of an existing carpool |

### 2. Student Errands Routes

| Route | View / Component | Description |
|---|---|---|
| `/errands` | `ErrandsView.vue` (`ErrandList.vue`) | Errand tasks feed with category filtering (Food, Parcel, Printing, Stationery) |
| `/errands?id=xxxxxxx` | `ErrandsView.vue` (`ErrandDetail.vue`) | Detailed instructions, venue spot, deadline, helper status, accept/complete actions |
| `/errands/new` | `ErrandFormView.vue` | Post a new student errand request |
| `/errands/edit?id=xxxxxxx` | `ErrandFormView.vue` | Edit an existing uncompleted errand request |

### 3. Study Groups Routes

| Route | View / Component | Description |
|---|---|---|
| `/study` | `StudyGroupsView.vue` (`StudyGroupList.vue`) | Study groups listing with search by subject and open slot filters |
| `/study?id=xxxxxxx` | `StudyGroupsView.vue` (`StudyGroupDetail.vue`) | Agenda, revision topics, meeting pod location, members list, join/leave actions |
| `/study/new` | `StudyFormView.vue` | Create a new study group pod |
| `/study/edit?id=xxxxxxx` | `StudyFormView.vue` | Edit schedule, maximum members, or description of a study group |

---

## Centralized API Layer

All HTTP communication with the backend is strictly centralized through `src/api/index.js`:

```javascript
import studentConnect from '@/api'
```

Vue components and views must never invoke `fetch()` or `axios()` directly.

### Available API Methods

#### Carpool
* `studentConnect.getAllCarPoolList()` — Fetch all carpools
* `studentConnect.getCarPool(id)` — Fetch a single carpool by ID
* `studentConnect.createCarPool(data)` — Create a new carpool ride
* `studentConnect.updateCarPool(id, data)` — Update an existing carpool
* `studentConnect.joinCarPool(id, data)` — Join a carpool ride
* `studentConnect.leaveCarPool(id, data)` — Leave a carpool ride

#### Errands
* `studentConnect.getAllErrands()` — Fetch all student errands
* `studentConnect.getErrand(id)` — Fetch a single errand by ID
* `studentConnect.createErrand(data)` — Post a new errand
* `studentConnect.updateErrand(id, data)` — Update an existing errand
* `studentConnect.acceptErrand(id, data)` — Accept an open errand
* `studentConnect.completeErrand(id)` — Mark an errand as completed

#### Study Groups
* `studentConnect.getAllStudyGroups()` — Fetch all study groups
* `studentConnect.getStudyGroup(id)` — Fetch a single study group by ID
* `studentConnect.createStudyGroup(data)` — Create a new study group
* `studentConnect.updateStudyGroup(id, data)` — Update an existing study group
* `studentConnect.joinStudyGroup(id, data)` — Join a study pod
* `studentConnect.leaveStudyGroup(id, data)` — Leave a study pod

#### Authentication
* `studentConnect.login(data)` — Student authentication
* `studentConnect.register(data)` — Student account registration

---

## Environment Configuration

Configure the backend server URL in your `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

When `VITE_API_URL` is set, all API requests are dispatched directly to the backend service. When running standalone without a backend, mock persistence automatically activates in local storage.

---

## Development & Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
