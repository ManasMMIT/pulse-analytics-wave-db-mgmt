module.exports = {
  apps: [
    {
      name: 'Polaris',
      script: 'node -r ts-node/register --max-old-space-size=6000 ./src/backend',
    },
  ]
}
