Vaagdevi Exchange Platform
A full-stack web application designed as a peer-to-peer rental marketplace for college students. This platform allows users to list their unused items for rent and browse items posted by others, creating a collaborative and resourceful campus community.
Backend (Render): https://vaagproductsexchangeplateform.onrender.com 
Features
User Authentication: Secure user registration and login system using JWT (JSON Web Tokens).

Product Management: Users can post, view, update, and delete their own product listings.

Dynamic Categories: Browse products across multiple categories including Laptops, Bikes, Cameras, Drafters, and GATE Books.

Search Functionality: Filter products within each category by name.

Rental System: A complete workflow for users to request rentals and for owners to approve or reject them.

Notifications: Users receive notifications for new rental requests and status updates on their rentals.

Responsive Design: A clean, mobile-first user interface that is fully responsive and works on all devices.

Technology Stack
This project is built with a modern and robust technology stack:

Frontend: React.js (Class Components)

Backend: Node.js, Express.js

Database: MySQL with Sequelize ORM

Authentication: JWT (JSON Web Tokens)

Image Handling: Multer for file uploads


Backend Details (/vaagdeviBackend)
The backend is a RESTful API that handles all business logic, data persistence, and user authentication for the platform.

API Endpoints
All endpoints are prefixed with /api.

Authentication (/auth)
Method	Endpoint	Description
POST	/register	Creates a new user account.
POST	/login	Authenticates a user and returns a JWT.


Products (/products)
Method	Endpoint	Description
GET	/	Get all products from every category.
GET	/:category	Get all products from a specific category (e.g., /laptops).
POST	/	Post a new product (requires auth, multipart/form-data).
GET	/me	Get all products posted by the logged-in user (requires auth).
PUT	/:category/:id	Update a product owned by the logged-in user (requires auth).
DELETE	/:category/:id	Delete a product owned by the logged-in user (requires auth).


Rentals (/rentals)
Method	Endpoint	Description
POST	/	Create a new rental request (renter auth required).
GET	/my-listings	Get rental requests for items you own (owner auth required).
GET	/my-rentals	Get items you are renting (renter auth required).
PATCH	/:id/status	Update the status of a rental request (owner auth required).

Setup and Running (Backend)
git clone https://github.com/your-username/your-repo.git
Navigate to the backend directory:
cd vaagdeviBackend
Install dependencies:
npm install



Bash

npm start
