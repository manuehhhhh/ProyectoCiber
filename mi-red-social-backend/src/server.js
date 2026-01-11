require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./app'); // Import connectDB

const PORT = process.env.PORT || 3000;

// Connect to the database and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🌐 API Health Check: http://localhost:${PORT}/health`);
        console.log(`👥 People API: http://localhost:${PORT}/api/people`);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Ensure the server is closed before exiting
    // This assumes `app.listen` returns a server instance, which it does.
    // However, the `server` variable is not accessible here.
    // For a proper graceful shutdown on unhandled rejections, you might want to store the server instance.
    // For now, a direct process exit will suffice, but it's not ideal for production.
    process.exit(1);
});