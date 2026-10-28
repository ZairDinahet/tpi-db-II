const { connect } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;

async function main() {
  await connect();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start the API:', err.message);
  process.exit(1);
});
