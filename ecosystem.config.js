module.exports = {
  apps: [{
    name: 'calculadora',
    script: 'npm',
    args: 'start',
    cwd: '/home/gelt/apps/calculadora',
    env: {
      NODE_ENV: 'production',
      PORT: 3745,
    },
  }],
}
