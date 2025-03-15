const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const coursePurchaseContainer = require("../controllers/coursePurchaseController");

const router = express.Router();

// Create Checkout Session
router.post("/checkout/create-checkout-session", isAuthenticated, coursePurchaseContainer.createCheckoutSession);

// WebHook
router.post("/webhook", express.raw({type : "application/json"}), coursePurchaseContainer.stripeWebhook);

// Purchase Detail Status
router.get("/course/:courseId/detail-with-status", isAuthenticated, coursePurchaseContainer.getCourseDetailWithPurchaseStatus);

// Get All Purchased Course Data
router.get("/", isAuthenticated, coursePurchaseContainer.getAllPurchasedCourse);

module.exports = router;