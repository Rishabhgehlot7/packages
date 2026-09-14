module.exports = {
  apps: [
    {
      name: 'boost-express-api',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '120M',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        MOCK_MODE: 'false',
      },
    },
  ],
};
