# 🍽️ Restaurant Management System

A full-stack Restaurant Management System designed to manage restaurant operations such as menu management, customer orders, authentication, and role-based dashboards for **Admin, Chef, and Customer**.

The project contains a modern web application built with **Next.js, React, TypeScript, and Tailwind/CSS**, along with a C-based restaurant management program.

---

## 📌 Project Overview

The Restaurant Management System provides different interfaces and functionalities for different users:

* 👨‍💼 **Admin** – Manage and monitor the restaurant system
* 👨‍🍳 **Chef** – View and manage customer orders
* 👤 **Customer** – Browse menu and place orders
* 🔐 **Authentication** – User login and role-based access
* 🍔 **Menu Management** – Store and retrieve restaurant menu items
* 🧾 **Order Management** – Create and manage customer orders
* 💾 **Data Storage** – JSON-based data storage for users, menu, and orders

---

## ✨ Features

### 👨‍💼 Admin Dashboard

* View restaurant information
* Manage restaurant data
* Monitor users and orders
* Access administrative functionality

### 👨‍🍳 Chef Dashboard

* View incoming orders
* Check order details
* Manage order status
* Monitor customer orders

### 👤 Customer Dashboard

* Browse restaurant menu
* View food items
* Place orders
* View order information

### 🔐 Authentication

The system provides authentication functionality through an API route.

Users can log in according to their role and access the appropriate dashboard.

### 🍔 Menu API

The menu API provides menu-related operations.

Example endpoint:

```text
/api/menu
```

### 🧾 Orders API

The orders API handles restaurant orders.

Example endpoint:

```text
/api/orders
```

### 👥 Authentication API

Authentication is handled through:

```text
/api/auth
```

---

## 🛠️ Technologies Used

### Frontend

* Next.js
* React
* TypeScript
* HTML
* CSS

### Backend

* Next.js API Routes
* Node.js

### Data Storage

* JSON files

### Other

* Git
* GitHub
* VS Code

### C Component

The project also contains a C-based restaurant management program:

```text
Restaurant_management_system.c
```

---

## 📂 Project Structure

```text
Restaurant-Management-System/
│
├── web-ui/
│   ├── data/
│   │   ├── menu.json
│   │   ├── orders.json
│   │   └── users.json
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── chef/
│   │   │   ├── customer/
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   ├── menu/
│   │   │   │   └── orders/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   └── lib/
│   │       └── data.ts
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── Restaurant_management_system.c
├── orders.txt
├── users.txt
├── without_color.c
├── with_color
└── without_color
```

---

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/zhasan557/Restaurant-Management-System.git
```

### 2. Open the Project

```bash
cd Restaurant-Management-System
```

### 3. Go to the Web Application

```bash
cd web-ui
```

### 4. Install Dependencies

Make sure you have **Node.js** and **npm** installed.

Then run:

```bash
npm install
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## 🖥️ Running the C Program

To compile the C program:

```bash
gcc Restaurant_management_system.c -o restaurant
```

Then run:

```bash
./restaurant
```

On macOS/Linux, you can also compile and run:

```bash
gcc Restaurant_management_system.c -o restaurant && ./restaurant
```

---

## 🔌 API Endpoints

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| GET    | `/api/menu`   | Retrieve menu items   |
| POST   | `/api/menu`   | Add menu information  |
| GET    | `/api/orders` | Retrieve orders       |
| POST   | `/api/orders` | Create an order       |
| POST   | `/api/auth`   | Handle authentication |

> Available methods may depend on the current implementation of each API route.

---

## 👤 User Roles

| Role     | Main Responsibility           |
| -------- | ----------------------------- |
| Admin    | Manage and monitor the system |
| Chef     | Manage and process orders     |
| Customer | Browse menu and place orders  |

---

## 💾 Data Files

The web application uses JSON files for basic data storage.

### `menu.json`

Stores restaurant menu information.

### `orders.json`

Stores customer order information.

### `users.json`

Stores user-related information.

---

## 🎯 Project Objectives

The main objectives of this project are:

1. Develop a simple restaurant management system.
2. Provide separate interfaces for Admin, Chef, and Customer.
3. Implement authentication and role-based access.
4. Manage restaurant menu items.
5. Manage customer orders.
6. Provide REST-style API endpoints.
7. Practice full-stack web development using Next.js.
8. Demonstrate software development and version control using Git and GitHub.

---

## 🔮 Future Improvements

The system can be extended with:

* 🗄️ MySQL/PostgreSQL database integration
* 💳 Online payment integration
* 📦 Inventory management
* 📊 Sales and revenue analytics
* 📱 Mobile-responsive improvements
* 🔔 Real-time order notifications
* 🔐 Secure password hashing
* 👥 Advanced user management
* 🧾 Invoice generation
* ☁️ Cloud deployment

---

## 📸 Screenshots

Screenshots of the application can be added here.

Example:

```text
screenshots/
├── homepage.png
├── admin-dashboard.png
├── chef-dashboard.png
└── customer-dashboard.png
```

---

## 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git add .
git commit -m "Add new feature"
```

5. Push the branch.

```bash
git push origin feature/new-feature
```

6. Open a Pull Request.

---

## 📄 License

This project is developed for educational and academic purposes.

---

## 👨‍💻 Author

**MD Zahid Hasan**

Software Engineering Student
Daffodil International University

GitHub: [@zhasan557](https://github.com/zhasan557)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
