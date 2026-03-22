# Admin Dashboard with Protected Routing

## Overview

A complete admin dashboard with API integration and protected routing. Only authenticated users with admin role can access the admin panel.

## Features

✅ **Authentication System**
- Login/Register with JWT tokens
- Role-based access control (Admin/User)
- Protected routes with automatic redirect
- Auth context for global state management

✅ **Protected Admin Routes**
- Dashboard Overview
- User Management
- Content Management
- Audit Logs
- System Health Monitoring

✅ **API Integration**
- RESTful API service layer
- Automatic token injection
- Error handling
- Request/response interceptors

## File Structure

```
frontend/src/
├── components/
│   ├── admin/
│   │   └── AdminLayout.jsx        # Admin sidebar layout
│   └── ProtectedRoute.jsx         # Route protection wrapper
├── context/
│   └── AuthContext.jsx             # Authentication state management
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx     # Overview page
│   │   ├── UserManagement.jsx     # User CRUD operations
│   │   ├── ContentManagement.jsx  # Content approval/rejection
│   │   ├── AuditLogs.jsx          # Activity logging
│   │   └── SystemHealth.jsx       # System metrics
│   ├── LoginPage.jsx               # Login with role-based redirect
│   └── Unauthorized.jsx            # 403 error page
└── services/
    ├── api.js                      # Base API configuration
    ├── authService.js              # Authentication APIs
    └── adminService.js             # Admin-specific APIs
```

## How It Works

### 1. Authentication Flow

```javascript
// User logs in
login(email, password)
  → API call to /api/auth/login
  → Receives { token, user: { role: 'admin' } }
  → Stores in localStorage + AuthContext
  → Redirects to /admin (if admin) or / (if user)
```

### 2. Protected Routes

```javascript
// User tries to access /admin
<ProtectedRoute requireAdmin={true}>
  → Checks localStorage for token
  → Checks user role === 'admin'
  → If fails → Redirect to /login
  → If success → Render AdminLayout
</ProtectedRoute>
```

### 3. API Requests

```javascript
// All API requests automatically include auth headers
api.get('/admin/users')
  → Adds 'Authorization: Bearer <token>'
  → If 401 → Redirect to login
  → Returns response
```

## Usage

### Protected Route Component

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Protect any component
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requireAdmin={false}>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Admin-only route
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout />
    </ProtectedRoute>
  }
/>
```

### Using Auth Context

```jsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();

  return (
    <div>
      <p>Welcome {user.name}</p>
      {isAdmin() && <AdminButton />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making API Calls

```jsx
import { adminService } from '@/services/adminService';

async function loadUsers() {
  try {
    const data = await adminService.getUsers({ page: 1, limit: 10 });
    setUsers(data.users);
  } catch (error) {
    console.error('Failed to load users:', error.message);
  }
}
```

## Environment Setup

Create a `.env` file:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## Backend Requirements

Your backend must provide these endpoints:

### Authentication
- `POST /api/auth/login` - Returns `{ token, user: { id, name, email, role } }`
- `POST /api/auth/register` - Returns `{ token, user }`
- `GET /api/auth/me` - Returns current user
- `POST /api/auth/logout` - Invalidates token

### Admin Endpoints
- `GET /api/admin/dashboard/stats` - Dashboard overview
- `GET /api/admin/users` - List users (with pagination)
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/block` - Block user
- `POST /api/admin/users/:id/unblock` - Unblock user
- `GET /api/admin/content` - List content
- `POST /api/admin/content/:id/approve` - Approve content
- `POST /api/admin/content/:id/reject` - Reject content
- `GET /api/admin/logs` - Audit logs
- `GET /api/admin/system/health` - System health

## Security Features

🔒 **Token-based Authentication**
- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Token validation on protected routes

🔒 **Role-based Access Control**
- Admin routes require `role: 'admin'`
- User role checked on both frontend and backend
- Automatic redirect for unauthorized access

🔒 **Route Protection**
- Unauthenticated users → `/login`
- Non-admin users trying /admin → `/`
- Protects all admin routes and child routes

## Access Control Matrix

| Route | Guest | User | Admin |
|-------|-------|------|-------|
| `/` | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ |
| `/register` | ✅ | ✅ | ✅ |
| `/admin/*` | ❌ → `/login` | ❌ → `/` | ✅ |

## Testing Admin Access

1. **Login as Admin**
   ```javascript
   // Backend should return:
   {
     token: "jwt_token_here",
     user: {
       id: 1,
       name: "Admin User",
       email: "admin@example.com",
       role: "admin"  // ← Important!
     }
   }
   ```

2. **Access Admin Panel**
   - Navigate to `/admin`
   - Should see admin dashboard

3. **Login as Regular User**
   ```javascript
   // Backend should return:
   {
     token: "jwt_token_here",
     user: {
       id: 2,
       name: "Regular User",
       email: "user@example.com",
       role: "user"  // ← Not admin
     }
   }
   ```

4. **Try Accessing Admin Panel**
   - Navigate to `/admin`
   - Should redirect to `/`

## Common Issues

### "Token not found" error
- User is not logged in
- Token expired or invalid
- Check localStorage for 'token' key

### "Access Denied" on /admin
- User role is not 'admin'
- Check localStorage 'user' object
- Verify backend returns correct role

### API calls fail with 401
- Token missing or invalid
- Token expired (implement refresh token)
- Check Authorization header in network tab

## Next Steps

1. Implement refresh token logic
2. Add remember me functionality
3. Add 2FA for admin accounts
4. Implement session timeout
5. Add audit logging for admin actions
6. Add rate limiting on login attempts
