module.exports = {
  apps: [
    {
      name: 'koala-koin-toss',
      script: 'node_modules/next/dist/bin/next',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        args: 'dev',
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        args: 'start',
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
