// Contollers
// Home
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");

// Customers
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");

// Admin
const adminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");

// MiddleWares
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

module.exports = initRoutes = (app) => {
    // Home Routes
    app.get("/", homeController().index);

    // Cart Routes
    app.get("/cart", cartController().index);

    // Login Routes
    app.get("/login", guest, authController().login);
    app.post("/login", authController().postLogin);

    app.get("/register", guest, authController().register);
    app.post("/register", authController().postRegister);
    app.post("/logout", authController().logout);

    app.post("/update-cart", cartController().update);

    // Customers Routes
    app.post("/orders", auth, orderController().store);
    app.get("/customer/orders", auth, orderController().index);
    app.get("/customer/orders/:id", auth, orderController().show);

    // Admin Routes
    app.get("/admin/orders", admin, adminOrderController().index);
    app.post("/admin/orders/status", admin, statusController().update);
};
