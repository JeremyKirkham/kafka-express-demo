import app from "./app";

// The port the express app will listen on
const port: number = 3000;

/**
 * Start Express server.
 */
const server = // Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});

export default server;
