# ContractWise - AI-Powered Contract Analysis SaaS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

ContractWise is a full-stack SaaS prototype designed for intelligent contract management. It allows users to upload their contracts, which are then parsed, analyzed, and stored for natural language querying. The platform provides a business-friendly dashboard to explore insights, assess risk, and manage documents securely with multi-tenant user isolation.

## 🚀 Live Demo

| Service                 | URL                                                                   | Status      |
| ----------------------- | --------------------------------------------------------------------- | ----------- |
| **Frontend Application**| [**https://contractwise.vercel.app/**](https://contractwise.vercel.app/) | ✅ Online   |
| **Backend API Docs** | [**https://contractwise-backend.vercel.app/docs**](https://contractwise-backend.vercel.app/docs) | ✅ Online   |

## ✨ Key Features

* **Secure Authentication**: JWT-based user sign-up and login system ensures that all user data is isolated and protected.
* **Multi-Tenant Architecture**: Every action (upload, query, view) is scoped to the logged-in user.
* **Drag & Drop File Upload**: Easily upload contracts in `PDF`, `TXT`, or `DOCX` format.
* **AI-Powered Parsing & Chunking**: Simulates advanced document processing (mock LlamaCloud) to break down contracts into queryable chunks and generate vector embeddings.
* **Vector Search with RAG**: Utilizes a Retrieval-Augmented Generation (RAG) workflow to query contracts using natural language.
* **Business-Friendly Dashboard**: A clean, responsive interface to view contract metadata, status, risk scores, and AI-generated insights.
* **Detailed Contract View**: Dive deep into contract clauses, risks, and recommendations, with an evidence drawer showing the source snippets.

## 🛠️ Tech Stack

| Area      | Technology                                    |
| --------- | --------------------------------------------- |
| Frontend  | **React**, **Tailwind CSS**, Vite             |
| Backend   | **Python**, **FastAPI** |
| Database  | **Supabase** (PostgreSQL + **pgvector**)      |
| Auth      | **JWT** (JSON Web Tokens)                     |
| Deployment| **Vercel** (Frontend & Backend), **Supabase** (DB) |

## 🗃️ Database Schema

The database schema is designed to support multi-tenancy and efficient vector search. It consists of three main tables: `users`, `documents`, and `chunks`.

**Important:** You need to replace `path/to/your/er_diagram.png` with the actual path to your ER diagram image in your repository.

![ER Diagram](path/to/your/er_diagram.png)

## ⚙️ Getting Started - Local Setup

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

* Node.js (v18 or later)
* Python (v3.9 or later)
* A Supabase account (for the database)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Setup the Backend (`/backend` folder):**

    * Navigate to the backend directory:
        ```sh
        cd backend
        ```
    * Create a Python virtual environment and activate it:
        ```sh
        # For macOS/Linux
        python3 -m venv venv
        source venv/bin/activate

        # For Windows
        python -m venv venv
        .\venv\Scripts\activate
        ```
    * Install the required dependencies:
        ```sh
        pip install -r requirements.txt
        ```
    * Create a `.env` file in the `/backend` directory and add your Supabase credentials and a JWT secret.
        ```env
        # Example .env file for the backend
        DATABASE_URL="your_supabase_connection_string"
        SUPABASE_KEY="your_supabase_anon_key"
        JWT_SECRET_KEY="your_strong_secret_key_for_jwt"
        ALGORITHM="HS256"
        ```
    * Run the backend server:
        ```sh
        uvicorn main:app --reload
        ```
    * The backend will be running at `http://127.0.0.1:8000`.

3.  **Setup the Frontend (`/frontend` folder):**

    * Open a new terminal and navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    * Install the required dependencies:
        ```sh
        npm install
        ```
    * Create a `.env.local` file in the `/frontend` directory and add the backend API URL:
        ```env
        # .env.local file for the frontend
        VITE_API_BASE_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
        ```
    * Run the frontend development server:
        ```sh
        npm run dev
        ```
    * The application will be running at `http://localhost:8081`.
