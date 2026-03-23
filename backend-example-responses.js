// Example backend response for testing protected routing

// ==========================================
// Admin User Login Response
// ==========================================
// POST /api/auth/login
// Body: { email: "admin@babynest.com", password: "Admin@123" }

const adminLoginResponse = {
  success: true,
  message: "Login successful",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "1",
      name: "Admin User",
      email: "admin@babynest.com",
      role: "admin", // ← This is critical for admin access
      avatar: null,
      createdAt: "2026-01-15T10:00:00Z"
    }
  }
};

// ==========================================
// Regular User Login Response
// ==========================================
// POST /api/auth/login
// Body: { email: "parent@babynest.com", password: "Parent@123" }

const userLoginResponse = {
  success: true,
  message: "Login successful",
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "2",
      name: "John Parent",
      email: "parent@babynest.com",
      role: "user", // ← Regular user, no admin access
      avatar: null,
      createdAt: "2026-02-01T10:00:00Z"
    }
  }
};

// ==========================================
// Test Credentials for Development
// ==========================================
const testCredentials = {
  admin: {
    email: "admin@babynest.com",
    password: "Admin@123",
    expectedBehavior: "Can access /admin routes"
  },
  user: {
    email: "parent@babynest.com",
    password: "Parent@123",
    expectedBehavior: "Cannot access /admin routes, redirects to /"
  }
};

// ==========================================
// Backend Middleware Example (Node.js/Express)
// ==========================================

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin Authorization Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Usage in routes
app.get('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
  // Only authenticated admin users can access this
  const users = await User.find();
  res.json({ users });
});

// ==========================================
// Sample Admin Dashboard Stats Response
// ==========================================
// GET /api/admin/dashboard/stats

const dashboardStatsResponse = {
  success: true,
  data: {
    totalUsers: 1250,
    userGrowth: 12.5,
    totalContent: 456,
    contentGrowth: 8.3,
    activeSessions: 89,
    sessionChange: -3.2,
    uptime: "99.9%",
    recentActivity: [
      {
        action: "User registered",
        user: "jane.doe@example.com",
        timestamp: "2026-03-22T10:30:00Z"
      },
      {
        action: "Content published",
        user: "Admin User",
        timestamp: "2026-03-22T09:15:00Z"
      }
    ],
    systemStatus: [
      {
        service: "API Server",
        status: "healthy",
        usage: 45
      },
      {
        service: "Database",
        status: "healthy",
        usage: 62
      },
      {
        service: "Cache Server",
        status: "healthy",
        usage: 38
      }
    ]
  }
};

// ==========================================
// Sample Users List Response
// ==========================================
// GET /api/admin/users?page=1&limit=10

const usersListResponse = {
  success: true,
  data: {
    users: [
      {
        id: "1",
        name: "Admin User",
        email: "admin@babynest.com",
        role: "admin",
        isBlocked: false,
        createdAt: "2026-01-15T10:00:00Z"
      },
      {
        id: "2",
        name: "John Parent",
        email: "parent@babynest.com",
        role: "user",
        isBlocked: false,
        createdAt: "2026-02-01T10:00:00Z"
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "user",
        isBlocked: true,
        createdAt: "2026-02-15T14:30:00Z"
      }
    ],
    totalPages: 5,
    currentPage: 1,
    totalUsers: 50
  }
};

// ==========================================
// MongoDB Schema Example
// ==========================================

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  adminLoginResponse,
  userLoginResponse,
  testCredentials,
  dashboardStatsResponse,
  usersListResponse
};
