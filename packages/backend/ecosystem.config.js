module.exports = {
  apps : [{
    name: "matrix-backend",
    script: "dist/main.js",

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    min_uptime: "10s",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
    }
  }]
};
