import path from 'path';
const Fixtures = require('node-mongodb-fixtures');

function loadFixtures(mongoUrl: string) {
  const fixtures = new Fixtures({
    dir: path.join(__dirname + '/../../../tests/fixtures'),
    mute: false,
  });
  fixtures
    .connect(mongoUrl)
    .then(() => fixtures.unload())
    .then(() => fixtures.load())
    .catch((e) => console.error(e))
    .finally(() => fixtures.disconnect());
}

export { loadFixtures };
