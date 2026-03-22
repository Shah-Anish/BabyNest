# Quick Start Guide - Testing Protected Admin Routes

## Step 1: Start Your Application

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend (make sure it's running)
cd backend
npm start
```

## Step 2: Test Regular User (No Admin Access)

### Login as Regular User
1. Go to `http://localhost:5173/login`
2. Enter credentials:
   - Email: `parent@childnest.com`
   - Password: `Parent@123`
3. Click "Sign in"
4. You should be redirected to `/` (home page)

### Try Accessing Admin Panel
1. Manually navigate to `http://localhost:5173/admin`
2. You should be **redirected back to `/`** (home page)
3. ✅ Protection working! Regular users cannot access admin panel

## Step 3: Test Admin User (Full Access)

### Login as Admin
1. Logout from regular user account
2. Go to `http://localhost:5173/login`
3. Enter credentials:
   - Email: `admin@childnest.com`
   - Password: `Admin@123`
4. Click "Sign in"
5. You should be redirected to `/admin` (admin dashboard)

### Test Admin Features
1. **Dashboard** - View system stats
2. **User Management** - Block/unblock/delete users
3. **Content Management** - Approve/reject content
4. **Audit Logs** - View activity logs
5. **System Health** - Monitor system metrics

## Step 4: Test Unauthenticated Access

### Without Login
1. Open browser in incognito mode
2. Navigate to `http://localhost:5173/admin`
3. You should be **redirected to `/login`**
4. ✅ Protection working! Must be logged in to access admin

## Debugging Tips

### Check Browser Console

Open DevTools (F12) and check:

**For Regular User:**
```javascript
localStorage.getItem('token')    // Should have a token
localStorage.getItem('user')     // Should have: { role: 'user' }
```

**For Admin User:**
```javascript
localStorage.getItem('token')    // Should have a token
localStorage.getItem('user')     // Should have: { role: 'admin' }
```

### Check Network Tab

When logging in, check the response:
```json
{
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "1",
      "role": "admin"  ← Check this!
    }
  }
}
```

### Common Issues

**Issue: Always redirected to login**
- Solution: Check if token is saved in localStorage
- Solution: Verify backend is returning valid token

**Issue: Admin can't access /admin**
- Solution: Check `user.role` in localStorage
- Solution: Make sure backend returns `role: "admin"`

**Issue: Regular user can access /admin**
- Solution: Clear localStorage and try again
- Solution: Check ProtectedRoute component logic

## Testing Checklist

- [ ] Regular user login works
- [ ] Regular user redirected from /admin to /
- [ ] Admin user login works
- [ ] Admin user can access /admin
- [ ] Unauthenticated user redirected to /login
- [ ] Logout clears localStorage
- [ ] Token included in API requests
- [ ] Protected API endpoints return 403 for non-admin

## Manual Testing Script

```javascript
// Open browser console and run:

// Test 1: Check Auth State
console.table({
  token: !!localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || '{}'),
  isAdmin: JSON.parse(localStorage.getItem('user') || '{}').role === 'admin'
});

// Test 2: Simulate Admin Login
localStorage.setItem('token', 'test-token-123');
localStorage.setItem('user', JSON.stringify({
  id: '1',
  name: 'Test Admin',
  email: 'admin@test.com',
  role: 'admin'
}));
window.location.href = '/admin';

// Test 3: Simulate Regular User Login
localStorage.setItem('token', 'test-token-456');
localStorage.setItem('user', JSON.stringify({
  id: '2',
  name: 'Test User',
  email: 'user@test.com',
  role: 'user'
}));
window.location.href = '/admin';

// Test 4: Clear Auth
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/admin';
```

## Expected Behaviors

| Scenario | Action | Expected Result |
|----------|--------|----------------|
| Guest → `/admin` | Navigate | Redirect to `/login` |
| User (no admin) → `/admin` | Navigate | Redirect to `/` |
| Admin → `/admin` | Navigate | Show admin dashboard |
| Any user → `/login` | Navigate | Show login page |
| Admin → Logout | Click logout | Clear auth, redirect to `/login` |
| User → Block action | Click block user | 403 or hidden button |
| Admin → Block action | Click block user | User blocked successfully |

## Backend Verification

Test your backend endpoints:

```bash
# 1. Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@childnest.com","password":"Admin@123"}'

# Save the token from response

# 2. Test admin endpoint
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return user list

# 3. Test with user token (should fail)
# Login as regular user, get token, then:
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer USER_TOKEN_HERE"

# Should return 403 Forbidden
```

## Success Criteria

✅ All routes properly protected
✅ Role-based access working
✅ Redirects happening correctly
✅ Token persists across page refreshes
✅ Logout clears authentication
✅ API requests include auth headers
✅ Backend validates tokens and roles

## Next: Set Up Real Backend

Now that frontend is ready, implement:
1. `/api/auth/login` endpoint
2. `/api/auth/register` endpoint
3. JWT token generation
4. Admin middleware
5. All admin API endpoints (see ADMIN_SETUP.md)
