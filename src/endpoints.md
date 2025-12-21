🔐 AUTH ENDPOINTS

Base: /api/v1/auth

POST /api/v1/auth/register

Register a new user.

POST /api/v1/auth/login

Login user and return JWT.

👤 USER ENDPOINTS

Base: /api/v1/users

GET /api/v1/users/me

Get logged-in user's profile.

PUT /api/v1/users/me

Update user profile (name, phone).

PUT /api/v1/users/change-password

Change password.

POST /api/v1/users/address

Add a new address.

PUT /api/v1/users/address/:addressId

Update an existing address.

DELETE /api/v1/users/address/:addressId

Delete an address.

DELETE /api/v1/users/delete-account

Delete user account.

🛍️ PRODUCT ENDPOINTS

Base: /api/v1/products

POST /api/v1/products (Admin Only)

Create a new product (supports image upload).

GET /api/v1/products

Get all products
Supports:

search

category filter

brand filter

price range

sorting

pagination

GET /api/v1/products/:productId

Get single product details.

PUT /api/v1/products/:productId (Admin Only)

Update product details.

DELETE /api/v1/products/:productId (Admin Only)

Delete a product.

🗂️ CATEGORY ENDPOINTS

Base: /api/v1/categories

POST /api/v1/categories (Admin Only)

Create a category.

GET /api/v1/categories

Get all categories.

GET /api/v1/categories/:id

Get single category.

PUT /api/v1/categories/:id (Admin Only)

Update category.

DELETE /api/v1/categories/:id (Admin Only)

Delete category (blocked if products exist).

🏷️ BRAND ENDPOINTS

Base: /api/v1/brands

POST /api/v1/brands (Admin Only)

Create a brand.

GET /api/v1/brands

Get all brands.

GET /api/v1/brands/:id

Get single brand.

PUT /api/v1/brands/:id (Admin Only)

Update brand.

DELETE /api/v1/brands/:id (Admin Only)

Delete brand (blocked if products exist).

🛒 CART ENDPOINTS

Base: /api/v1/cart
(All routes require authentication)

GET /api/v1/cart

Get logged-in user's cart.

POST /api/v1/cart

Add product to cart or increase quantity.

PUT /api/v1/cart/items/:itemId

Update cart item quantity
(quantity = 0 removes item).

DELETE /api/v1/cart/items/:itemId

Remove item from cart.

DELETE /api/v1/cart

Clear entire cart.

POST /api/v1/cart/apply-coupon

Apply coupon to cart.

POST /api/v1/cart/apply-shipping

Apply shipping method to cart.

🎟️ COUPON ENDPOINTS

Base: /api/v1/coupons

POST /api/v1/coupons (Admin Only)

Create coupon.

GET /api/v1/coupons

Get all active coupons.

GET /api/v1/coupons/:id

Get single coupon.

PUT /api/v1/coupons/:id (Admin Only)

Update coupon.

DELETE /api/v1/coupons/:id (Admin Only)

Delete coupon.

🚚 SHIPPING METHOD ENDPOINTS

Base: /api/v1/shipping-methods

POST /api/v1/shipping-methods (Admin Only)

Create shipping method.

GET /api/v1/shipping-methods

Get all active shipping methods.

GET /api/v1/shipping-methods/:id

Get single shipping method.

PUT /api/v1/shipping-methods/:id (Admin Only)

Update shipping method.

DELETE /api/v1/shipping-methods/:id (Admin Only)

Delete shipping method.
