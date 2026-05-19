# SmartStock

SmartStock is a mobile inventory and sales management application designed for small business owners.  
The app helps users manage products, track inventory, record sales, and calculate profits in real time through a simple and intuitive mobile interface.

## Overview

Many small businesses still rely on manual inventory tracking or spreadsheets, which can lead to:
- Human error
- Lost inventory data
- Inefficient sales tracking
- Poor inventory visibility

SmartStock solves this problem by providing a mobile-first solution that simplifies inventory management and sales tracking.

---

## Features

- Add, edit, and delete products
- Record sales transactions
- Automatic stock updates after each sale
- Profit calculation system
- Low-stock alerts
- Product image support
- Responsive mobile interface
- Real-time inventory management

---

## Technologies Used

### Frontend
- React Native
- JavaScript

### Database
- SQLite

### Development Tools
- Expo Go
- Visual Studio Code

---

## System Design

SmartStock follows a modular and scalable architecture.

### Main Screens
- Home
- Products
- Sales
- Reports

### Main Components
- ProductItem
- SaleItem
- LowStockBell

### Database Structure

#### Products Table
| Field | Description |
|---|---|
| id | Product ID |
| name | Product name |
| costPrice | Cost price |
| sellingPrice | Selling price |
| stockQty | Current stock quantity |
| imageUri | Product image |

#### Sales Table
| Field | Description |
|---|---|
| productId | Related product |
| qtySold | Quantity sold |
| total | Total sale amount |
| profit | Profit generated |
| createdAt | Transaction date |

---

## Key Functionalities

### Inventory Management
Users can:
- Add products
- Edit products
- Delete products
- Track stock quantities

### Sales System
The application:
- Records sales
- Calculates total sales
- Calculates profit automatically
- Updates inventory instantly

### Alerts
SmartStock includes:
- Low-stock detection
- Inventory monitoring

---

## Installation

### Prerequisites
- Node.js
- Expo Go
- Git
- VS Code

### Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/SmartStock.git
