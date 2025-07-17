import app from './src/app';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
    console.error(`Error occurred: ${err.message}`);
});

export default server;