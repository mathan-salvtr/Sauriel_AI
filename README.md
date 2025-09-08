
# Sauriel Chatbot

A Mental Health Support Chatbot built using **Flask** for the backend and **React (Vite)** with **Tailwind CSS** for the frontend.  
This project demonstrates how to build a full-stack web application for providing real-time support through chat interactions.

## 🌟 Features
- Interactive and user-friendly chatbot interface.
- Real-time messaging powered by Flask API.
- Session management to track conversations.
- Clean and responsive design using Tailwind CSS.
- Easy to run locally and understand.

## 🛠 Technologies Used

**Backend:**  
- Python  
- Flask  
- Flask-Cors  
- Gunicorn

**Frontend:**  
- React (Vite)  
- Tailwind CSS  
- Axios for API requests

**Version Control:**  
- Git & GitHub

## 📂 Folder Structure

```
sauriel-chatbot/
 ├─ backend/ → Flask API code, requirements, configuration
 ├─ frontend/ → React UI components, styling, configuration
 ├─ images/ → Screenshots or images for documentation
 └─ README.md → This documentation file
```

## 🚀 How to Run Locally

### 1. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend server will run at `http://127.0.0.1:5000`.

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

### 3. Access the App

Open your browser and go to `http://localhost:5173` to interact with the chatbot.

## ✅ Future Improvements
✔ Integrate database storage for conversation history  
✔ Add user authentication  
✔ Deploy the app using Render (backend) and Vercel (frontend)  
✔ Improve error handling and user notifications

## 📜 License

This project is licensed under the MIT License.

## 📬 Connect

Feel free to reach out or contribute to this project on [GitHub](https://github.com/mathan-salvtr).
