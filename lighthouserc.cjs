module.exports = {
  ci: {
    collect: {
      staticDistDir: '.',
      url: ['http://127.0.0.1:8000/'],
      startServerCommand: 'npx http-server -p 8000 -c-1',
      startServerReadyPattern: 'Available on',
      startServerReadyTimeout: 30000,
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage --headless=new',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
