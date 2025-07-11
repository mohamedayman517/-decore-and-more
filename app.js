require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const methodOverride = require("method-override");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const favicon = require("serve-favicon");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, "uploads");

// التأكد من وجود مجلد التحميلات
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✅ Created uploads directory at ${uploadDir}`);
}

const httpServer = http.createServer(app);

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : null,
  "https://decore-and-more-production.up.railway.app",
  process.env.BASE_URL,
  // إضافة النطاق الفرعي لـ Railway
  ".up.railway.app"
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // السماح بالطلبات من origins المحددة أو بدون origin (زي Postman أو سيرفر داخلي)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/user", express.static(path.join(__dirname, "user")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60, // 1 hour in seconds
      autoRemove: "native",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // true في بيئة الإنتاج لأن Railway يستخدم HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // مهم جدًا للـ cross-site requests
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
      httpOnly: true,
      // استخدام النطاق من BASE_URL إذا كان موجودًا، وإلا استخدام النطاق الافتراضي لـ Railway
      domain: process.env.NODE_ENV === "production" ? 
        (new URL(process.env.BASE_URL || "https://decore-and-more-production.up.railway.app")).hostname : undefined,
    },
    rolling: true, // Reset expiration on every response
  })
);

// Make session available to all routes
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware to check user role and redirect if needed
app.use((req, res, next) => {
  // Skip for API routes, static files, and specific routes
  const skipPaths = [
    "/login",
    "/logout",
    "/register",
    "/profile",
    "/AdminDashboard",
    "/api",
    "/uploads",
    "/css",
    "/js",
    "/images",
    "/favicon.ico",
  ];

  // Check if the current path should be skipped
  const shouldSkip = skipPaths.some((path) => req.path.startsWith(path));

  // If it's a path we should skip or not a GET request, continue to the next middleware
  if (shouldSkip || req.method !== "GET") {
    return next();
  }

  // If user is logged in and the path is the root path
  if (req.session && req.session.user && req.path === "/") {
    // Redirect engineers to their profile page
    if (req.session.user.role === "Engineer") {
      return res.redirect(`/profile/${req.session.user.id}`);
    }
    // Redirect admins to the admin dashboard
    else if (req.session.user.role === "Admin") {
      return res.redirect("/AdminDashboard");
    }
    // Regular users (role === "user") stay on the home page
  }

  // For all other cases, continue to the next middleware
  next();
});

// Security middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://code.jquery.com",
        "https://cdn.datatables.net",
        "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ...(process.env.NODE_ENV === "development" ? ["http://localhost:35729"] : []),
      ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://cdn.datatables.net",
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://cdn.datatables.net",
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://cdn.datatables.net",
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ],
        connectSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://cdn.datatables.net",
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
          "https://*.up.railway.app",
          process.env.BASE_URL,
          ...(process.env.NODE_ENV === "development" ? ["http://localhost:35729"] : []),
        ],
        fontSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.gstatic.com",
          "https://cdn.datatables.net",
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://cdn.datatables.net",
          "https://cdn.jsdelivr.net/npm/sweetalert2@11",
        ],
      },
    })
  );


// Live reload setup
if (process.env.NODE_ENV === "development") {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "public"));
  app.use(connectLivereload());

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

// Import routes
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const projectRoutes = require("./routes/projectRoutes");
const adminRoutes = require("./routes/adminRoutes");
const indexRoutes = require("./routes/indexRoutes");
const contactRoutes = require("./routes/contactRoutes");
const designersRoutes = require("./routes/designersRoutes");
const profileRoutes = require("./routes/profileRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const favoriteRoutes = require("./routes/FavoriteRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const authRoute = require("./routes/authRoutes");
const packageRoutes = require("./routes/packageRoutes");
const BookingRoutes = require("./routes/BookingRoutes");
const ConfirmationRoutes = require("./routes/confirmationRoutes");
const registerCustomerRoutes = require("./routes/registerCustomerRoutes");

// Use routes
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/", messageRoutes);
app.use("/projects", projectRoutes);
app.use("/packages", packageRoutes);
app.use("/", adminRoutes);
app.use("/", contactRoutes);
app.use("/", designersRoutes);
app.use("/", profileRoutes);
app.use("/", paymentRoutes);
app.use("/", favoriteRoutes);
app.use("/", userProfileRoutes);
app.use("/", authRoute);
app.use("/", BookingRoutes);
app.use("/", ConfirmationRoutes);
app.use("/", registerCustomerRoutes);

// Chat route
app.get("/chat/:userId1?/:userId2?", async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.redirect("/login");
    }

    const { userId1, userId2 } = req.params;

    if (userId1 && userId2) {
      // If both user IDs are provided, render the chat between these users
      res.render("chat", {
        userId1,
        userId2,
        user,
        isEngineer: user.role === "Engineer",
      });
    } else {
      // If no user IDs, render the chat list view
      res.render("chat", {
        user,
        isEngineer: user.role === "Engineer",
      });
    }
  } catch (error) {
    console.error("Error in chat route:", error);
    res.status(500).send("Server error");
  }
});

// Add verification route with default variables
app.get("/verify", (req, res) => {
  res.render("verify", {
    error: null,
    showForm: false,
    engineerId: null,
  });
});

// مسار للبحث عن حالة الطلب من خلال نموذج البحث
app.get("/order-status", async (req, res) => {
  try {
    const { orderId } = req.query;
    
    if (!orderId) {
      return res.redirect('/');
    }
    
    // هنا يمكن إضافة منطق للتحقق من حالة الطلب من قاعدة البيانات
    // مثال: const order = await Order.findById(orderId);
    
    // للتجربة، سنقوم بتوجيه المستخدم إلى صفحة تفاصيل الطلب
    res.redirect(`/order-status/${orderId}`);
  } catch (error) {
    console.error("Error in order status search:", error);
    res.status(500).send("حدث خطأ في الخادم");
  }
});

// إضافة مسار جديد للاستعلام عن حالة الطلبات
app.get("/order-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    // هنا يمكن إضافة منطق للتحقق من حالة الطلب من قاعدة البيانات
    // مثال: const order = await Order.findById(orderId);
    
    res.render("order-status", {
      user: req.session.user,
      orderId,
      // order: order // يمكن تمرير بيانات الطلب للصفحة
    });
  } catch (error) {
    console.error("Error in order status route:", error);
    res.status(500).send("حدث خطأ في الخادم");
  }
});

// Database connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen(port, () => {
      const baseUrl = process.env.BASE_URL || `https://decore-and-more-production.up.railway.app`;
      console.log(
        process.env.NODE_ENV === "development"
          ? `🚀 Server running on http://localhost:${port}`
          : `🚀 Server running on ${baseUrl}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
