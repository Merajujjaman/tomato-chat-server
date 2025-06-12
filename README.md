# Backend Chat Application

This is the backend part of the MERN stack real-time chat application using Socket.IO.

## Features

- Real-time messaging using Socket.IO
- MongoDB for data storage
- RESTful API for chat operations
- User authentication (to be implemented)

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd mern-chat-app/backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

### Configuration

- Update the MongoDB connection string in `src/config/db.js` to point to your MongoDB instance.

### Running the Application

1. Start the server:
   ```
   npm start
   ```

2. The server will run on `https://tomato-chat-server-y4uh.onrender.com` (or the port specified in your configuration).

### API Endpoints

- **GET /api/messages**: Retrieve all messages
- **POST /api/messages**: Send a new message

### Socket.IO

The application uses Socket.IO for real-time communication. Ensure that the frontend is set up to connect to the same server.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.