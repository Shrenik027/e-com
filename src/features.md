1. User Model

The User model enables all customer and account-related features within the e-commerce API. It supports user registration, login, authentication using JWT tokens, and secure password management. Users can manage their profiles, update personal details, change passwords, and recover accounts using email verification or password reset flows. This model also supports roles such as admin or customer, enabling access control for different parts of the system. Additionally, it allows users to track orders, manage their cart and wishlist, and interact with reviews.

2. Product Model

The Product model provides the ability to create, update, and manage the entire product catalog. It supports detailed product descriptions, pricing, discounts, images, stock management, and product attributes like size or color. Users can browse and filter products through search, category, brand, rating, and price ranges. The model also powers features such as showing related products, featured items, and bestsellers. It integrates with reviews to compute average ratings and supports admin functionalities for inventory and product lifecycle management.

3. Category Model

The Category model organizes products into logical groups, allowing users to browse items easily. Admins can create, update, and delete categories, including parent–child hierarchies for multi-level navigation. The model enhances filtering, search, and SEO-friendly browsing by showing products belonging to a category. It also supports uploading category images or banners for marketing sections like featured collections.

4. Brand Model

The Brand model helps classify products by manufacturers or brand names. Admins can add new brands, update brand details, and attach logos. Users can filter products by brand and view all products under a specific brand. This model supports branding sections like “Top Brands,” improves product discovery, and offers better categorization in the store.

5. Coupon Model

The Coupon model powers all discount and promotional features during checkout. Admins can create coupon codes with percentage or fixed discounts, set minimum purchase limits, assign expiry dates, and track usage per customer. During checkout, the API validates the coupon, calculates applicable discounts, and ensures that coupons are not misused. This model helps run marketing campaigns and improves customer acquisition and retention.

6. Payment Model

The Payment model handles all transaction-related data for orders. It stores payment intent IDs, transaction receipts, payment status (success, failed, refunded), and gateway information (Stripe, Razorpay, PayPal, etc.). This model ensures secure and reliable payment processing, verifies gateway responses, and links payments directly to orders. It also supports admin reporting, reconciliation, and viewing customer payment history.

7. Review Model

The Review model allows customers to submit ratings and feedback on purchased products. It enables writing, editing, and deleting reviews, uploading review images, and ensuring that only verified buyers can review a product. The API uses this model to calculate the product’s average rating and provide rating distributions. Reviews help improve trust, social proof, and overall product discoverability.

8. Order Model

The Order model manages the full ordering lifecycle, from checkout to delivery. It stores ordered items, shipping details, applied coupons, selected shipping methods, and payment information. Order statuses such as pending, confirmed, shipped, delivered, or cancelled help both users and admins track order progress. This model supports features like order history, admin dashboards, revenue tracking, refunds, cancellations, and returns.

9. Cart Model

The Cart model supports real-time cart functionality for users. It tracks selected products, quantities, and price calculations. Users can add items, remove them, or update the quantity. The cart automatically adjusts for stock changes, applies coupons, and syncs between sessions when the user logs in. This model forms the foundation for checkout and smooth user shopping experience.

10. Wishlist Model

The Wishlist model allows users to save products they are interested in purchasing later. Users can add or remove products and move items directly from the wishlist into the cart. This model enhances user engagement, provides insights into user preferences, and helps generate personalized recommendations and marketing campaigns.

11. Shipping Method Model

The Shipping Method model manages all delivery options available in the store, such as standard, express, or free shipping. Admins can create and update shipping methods along with pricing rules. During checkout, the system calculates the appropriate shipping cost and assigns the selected method to the order. This model ensures a flexible and customizable delivery experience for customers.
