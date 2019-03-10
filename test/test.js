import test from 'ava'
import fs from '..'

test('reading a file using async/await', async t => {
  t.is(await fs.readFile('./test/fixtures/hello.txt', 'utf8'), 'Hello!\n')
})
