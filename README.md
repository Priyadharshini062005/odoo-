# odoo-
<<<<<<< HEAD
# Green Market Place

## Overview
**Green Market Place** is a sustainable product website designed with principles of sustainable web development and user-friendly design. This e-commerce platform not only allows users to explore and purchase sustainable products but also educates them about the product development process. To further its mission of promoting sustainability, the platform features a blog section where users can read and contribute content about sustainability.

A detailed project overview is available in this [video presentation](https://drive.google.com/file/d/1o5LztI5tldneBzAboakmG0Qbwb-ie1sI/view?usp=sharing).

## Key Features
- **E-commerce Functionality**: Browse and purchase sustainable products.
- **Education on Sustainability**: Gain insights into the production process of items.
- **Integrated Blog System**: Read and write articles related to sustainability.
- **Sustainable Web Development Practices**: Designed with eco-friendly web principles.

---
![GMP](https://github.com/user-attachments/assets/06833d04-2f3a-4eec-adbc-c839bada13d3)

---

## Project Structure

The project consists of a **single repository** hosting both backend and frontend codebases.

### 1. **Backend**
- **Framework**: Built on **Express.js**.
- **Database**: Uses **MongoDB** for storing data.
- **Environment Configuration**: The `.env` file must include the following:
  - `MONGO_URI`: Connection string to your MongoDB instance.
  - `JWT_SECRET`: Secret key for signing JSON Web Tokens (JWT).
- **Node.js Version**: The project uses Node.js version `v22.9.0`, specified in the `.nvmrc` file for environment consistency.
- **Code Quality Tools**:
  - **Prettier**: For consistent code formatting.
  - **ESLint**: This is used to identify and fix JavaScript code issues.

### 2. **Frontend**
- **Framework**: Developed using **Next.js**.
- **State Management**: Configured with a **persistent Redux store** using **Thunk** middleware for efficient state management and asynchronous actions.
- **Placement**: The frontend code is located in the `frontend` folder within the repository.

### 3. **Project Structure**

```markdown
green-market-place/
├── bin/                # Application entry point
├── config/             # Configuration files
├── controllers/        # Route controllers
├── frontend/           # Frontend assets
├── middlewares/        # Custom middleware
├── models/             # Mongoose models
├── public/             # Static files (CSS, JS, images)
├── routes/             # Application routes
├── schemas/            # Data schemas
├── swagger/            # API documentation
├── tests/              # Unit and integration tests
├── app.js              # Main application file
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

---

## Installation and Setup

### Prerequisites
- **Node.js - Backend**: Ensure you have `v22.9.0` installed (recommended to use [nvm](https://github.com/nvm-sh/nvm)).
- **Node.js - Frontend**: Ensure you have `v20.18.1` installed (recommended to use [nvm](https://github.com/nvm-sh/nvm)).
- **Git**: For cloning the repository.
- **MongoDB**: A running MongoDB instance (local or cloud).
- **Package Manager**: Either npm or yarn.

### Steps to Run the Project
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:fahad-git/green-market-place.git
   cd green-market-place
   ```

2. **Set Node Version**:
   ```bash
   nvm use
   ```
   If `nvm` is not installed, install Node.js version `v22.9.0` manually.

3. **Install Dependencies**:
   Navigate to the root directory and run:
   ```bash
   npm install
   ```
   Repeat the process in the `frontend` directory:
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment Variables**:
   In the backend root directory, create a `.env` file and configure the following:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database-name>?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key
   ```
   Replace `<username>`, `<password>`, `<database-name>`, and `your-secret-key` with your specific details.

5. **Run the Backend**:
   In the root directory:
   ```bash
   npm start
   ```

6. **Run the Frontend**:
   In the `frontend` directory:
   ```bash
   npm run dev
   ```

7. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000` (default port for Next.js).

---

## Running Unit Tests

### Backend Unit Tests
The backend uses **Jest** and **Supertest** for unit and integration testing. Tests are located in the `tests` directory in the root folder.

1. **Install Testing Dependencies** (if not already installed):
   ```bash
   npm install --save-dev jest supertest

2. **Run Testss**:
   ```bash
   npm test

This executes all test suites and generates a coverage report.

3. **Test Coverage:** To view detailed coverage:
   ```bash
   npm run test:coverage

### Frontend Unit Tests
The frontend uses Jest and React Testing Library for testing components and Redux logic. Tests are located in the `frontend/tests` directory.

1. **Install Testing Dependencies** (if not already installed):
   ```bash
   cd frontend
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   
2. **Run Testss**:
   ```bash
   npm test

This runs all frontend test suites in watch mode (use `--watchAll=false` for CI environments).

3. **Test Coverage:** To view detailed coverage:
   ```bash
   npm run test:coverage

---

<img width="1788" alt="dashboard" src="https://github.com/user-attachments/assets/c6cac0f2-8c8d-4d17-b335-124a6351a77c" />
<img width="1800" alt="product" src="https://github.com/user-attachments/assets/3372ec14-77af-4635-bcf5-4fcc4d08683c" />
<img width="1800" alt="reviews" src="https://github.com/user-attachments/assets/464cf5b7-5b8d-47d8-a978-9e59a73c7846" />


---

## Contributing
We welcome contributions to improve the **Green Market Place**! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "GMP-1234: Add your descriptive message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---

## License
This project is open-source and available under the [MIT License](LICENSE).

---

## Declaration
"This project, **Green Market Place**, was developed as part of the **Specialization in Web Technology** course to fulfil its academic requirements."

=======
# odoo-
>>>>>>> efa79811988540f2204360b103db88e0e62841f5
