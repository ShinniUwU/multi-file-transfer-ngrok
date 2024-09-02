# Multi-File Transfer with ngrok

This project is a multi-file transfer application built using Socket.IO and Express, with secure tunneling provided by ngrok. It enables users to upload multiple files to a server with efficient chunked transfers and real-time status updates.

## Key Features

- **Multi-file upload**: Supports uploading multiple files simultaneously.
- **Chunked file transfer**: Handles large files by splitting them into manageable chunks.
- **Real-time upload status**: Provides live feedback on the upload progress.
- **Secure tunneling**: Leverages ngrok to securely expose your local server to the internet.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [ngrok](https://ngrok.com/)

## Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/multi-file-transfer-ngrok.git
   cd multi-file-transfer-ngrok
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up ngrok authentication**:
   Create a `.env` file in the root directory and add your ngrok authtoken:
   ```plaintext
   NGROK_AUTHTOKEN=your_ngrok_authtoken_here
   ```

4. **Start the server**:
   ```sh
   npm start
   ```

5. **Expose your server with ngrok**:
   In a new terminal, run:
   ```sh
   ngrok http 3000
   ```

## Usage

1. **Access the application**:
   Open your web browser and navigate to the URL provided by ngrok (e.g., `http://<your-ngrok-id>.ngrok.io`).

2. **Upload files**:
   Select the files you wish to upload and monitor the real-time status updates displayed on the web page.

## Project Structure

```
multi-file-transfer-ngrok/
├── src/
│   ├── index.ts         # Server logic
│   └── index.html       # Frontend interface
├── .env                 # Environment variables
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Dependencies

This project relies on the following npm packages:

- `axios`
- `dotenv`
- `express`
- `fs`
- `http`
- `ngrok`
- `socket.io`
- `typescript`

### Development Dependencies

- `@types/express`
- `@types/node`

## License

This project is licensed under the [MIT License](./LICENSE).
### .env File
Create a `.env` file in the root directory of your project with the following content:

```
NGROK_AUTHTOKEN=your_ngrok_authtoken_here
```
