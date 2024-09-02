import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import ngrok from 'ngrok'; // Add this line

dotenv.config();

const app = express();
const server = http.createServer(app);
const socketServer = new Server(server, { maxHttpBufferSize: 100 * 1024 * 1024 });

app.use(express.static(path.join(__dirname)));

const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Start ngrok and get the public URL
let ngrokUrl: string;
ngrok.connect({
    authtoken: process.env.NGROK_AUTHTOKEN,
    addr: 3000
}).then((url: string) => {
    ngrokUrl = url;
    console.log(`ngrok tunnel established at ${ngrokUrl}`);
}).catch((err: any) => {
    console.error('Error starting ngrok:', err);
});

// Add this endpoint to serve the ngrok URL
app.get('/ngrok-url', (req, res) => {
    if (ngrokUrl) {
        res.json({ url: ngrokUrl });
    } else {
        res.status(500).json({ error: 'ngrok URL not available' });
    }
});

function handleFileUpload(clientSocket: Socket) {
    let fileWriteStream: fs.WriteStream | null = null;
    let currentFileName = '';

    clientSocket.on('startUpload', (receivedFileName: string) => {
        currentFileName = makeFileNameSafe(receivedFileName);
        fileWriteStream = createFileWriteStream(currentFileName);
        console.log(`Started receiving file: ${currentFileName}`);
    });

    clientSocket.on('uploadChunk', (fileChunk: Buffer, sendResponse) => {
        if (!fileWriteStream) {
            return sendResponse({ message: 'failure', error: 'No file stream open' });
        }
        fileWriteStream.write(fileChunk, (error) => {
            if (error) {
                console.error('Error writing file chunk:', error);
                return sendResponse({ message: 'failure' });
            }
            sendResponse({ message: 'success' });
        });
    });

    clientSocket.on('endUpload', (sendResponse) => {
        if (fileWriteStream) {
            fileWriteStream.end(() => {
                console.log(`Finished receiving file: ${currentFileName}`);
                sendResponse({ message: 'success' });
            });
        }
    });

    clientSocket.on('disconnect', () => {
        if (fileWriteStream) fileWriteStream.close();
        console.log('A user disconnected');
    });
}

function makeFileNameSafe(fileName: string): string {
    return path.basename(fileName.replace(/[^a-zA-Z0-9._-]/g, '_'));
}

function createFileWriteStream(fileName: string): fs.WriteStream {
    return fs.createWriteStream(path.join(uploadFolder, fileName), { flags: 'a' });
}

server.listen(3000, () => {
    console.log('Server is running on port https://localhost:3000');
})

socketServer.on('connection', (clientSocket) => {
    console.log('A user connected');
    handleFileUpload(clientSocket);
});

