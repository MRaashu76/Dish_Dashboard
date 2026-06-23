# Dish Management Dashboard

A real-time dish management dashboard built with React, Node.js, MongoDB, and Socket.io. Features a modern green-themed UI inspired by Eggify, with live updates across all connected clients.

---

## Features

- View all dishes in a responsive card grid
- Add new dishes directly from the UI with image preview
- Toggle published/unpublished status per dish
- Optimistic UI updates — changes feel instant
- Real-time sync via Socket.io — all browser tabs update simultaneously
- Skeleton loading state
- Empty and error states with retry
- Sidebar navigation with live connection indicator
- Filter by All / Published / Unpublished
- Stats bar showing total, published, and unpublished counts
- Graceful server shutdown (SIGINT / SIGTERM)
- Global error handling middleware

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Axios, Socket.io-client

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io

---

## Installation

Clone the repository:

```bash
git clone <repo-url>
cd dish-dashboard
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (already included, adjust as needed):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dish-dashboard
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Seed the database:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | HTTP server port |
| `MONGO_URI` | `mongodb://localhost:27017/dish-dashboard` | MongoDB connection string |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | `development` | Node environment |

### Frontend (optional `frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend API base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | Socket.io server URL |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dishes` | Fetch all dishes |
| `POST` | `/api/dishes` | Add a new dish |
| `PATCH` | `/api/dishes/:dishId` | Toggle published status |
| `GET` | `/health` | Health check |

### GET /api/dishes

Returns an array of all dishes sorted by `dishId`.

```json
[
  {
    "dishId": 1,
    "dishName": "Margherita Pizza",
    "imageUrl": "https://...",
    "isPublished": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

### POST /api/dishes

Creates a new dish and emits a `dishAdded` socket event.

```json
{
  "success": true,
  "data": {
    "dishId": 2,
    "dishName": "Pasta",
    "imageUrl": "data:image/jpeg;base64,...",
    "isPublished": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### PATCH /api/dishes/:dishId

Toggles the `isPublished` field and emits a `dishUpdated` socket event.

```json
{
  "success": true,
  "data": {
    "dishId": 1,
    "dishName": "Margherita Pizza",
    "isPublished": false
  }
}
```

---

## Socket Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `dishUpdated` | Server → All clients | `updatedDish` object | Emitted after every toggle |
| `dishAdded` | Server → All clients | `newDish` object | Emitted when a new dish is added |
| `connect` | Client | — | Socket connected |
| `disconnect` | Client | reason string | Socket disconnected |

---

## Folder Structure

```
dish-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/dishController.js
│   │   ├── models/Dish.js
│   │   ├── routes/dishRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorMiddleware.js
│   │   │   └── notFoundMiddleware.js
│   │   ├── socket/socketHandler.js
│   │   ├── seed/
│   │   │   ├── dishes.json
│   │   │   └── seed.js
│   │   ├── utils/asyncHandler.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/dishApi.js
    │   ├── components/
    │   │   ├── DishCard.jsx
    │   │   ├── Loading.jsx
    │   │   ├── EmptyState.jsx
    │   │   └── ErrorState.jsx
    │   ├── hooks/useSocket.js
    │   ├── pages/Dashboard.jsx
    │   ├── services/socket.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```


## Future Improvements

- Authentication & role-based access control
- Edit / delete dishes via UI
- Image upload with cloud storage (S3 / Cloudinary)
- Pagination or infinite scroll
- Search and category filtering
- Drag-and-drop dish ordering
- Audit log of status changes
- Unit and integration tests (Vitest, Supertest)
- Docker Compose for one-command setup
- CI/CD pipeline

---

## Author

**MRaashu76**
- Email: aashishkumards123@gmail.com

## License

This project is licensed under the [MIT License](LICENSE).
