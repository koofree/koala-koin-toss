/**
 * PM2 ecosystem configuration file
 * Used for process management and deployment
 *
 * Configuration includes:
 * - Development and production environment settings
 * - Process management settings
 * - Memory limits and restart policies
 */
module.exports = {
  apps: [
    {
      name: 'koala-koin-toss', // Process name for PM2
      script: 'node_modules/next/dist/bin/next', // Next.js startup script
      instances: 1, // Number of instances to run
      autorestart: true, // Automatically restart on crash
      watch: false, // Disable file watching
      max_memory_restart: '256M', // Restart if memory exceeds 256MB
      env: {
        args: 'dev', // Development mode arguments
        NODE_ENV: 'development', // Development environment
        PORT: 3001, // Development port
      },
      env_production: {
        args: 'start', // Production mode arguments
        NODE_ENV: 'production', // Production environment
        PORT: 8080, // Production port
      },
    },
  ],
};
