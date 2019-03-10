import test from 'ava'
import fs from '..'

const helloPath = './test/fixtures/hello.txt'
const twitterPath = './test/fixtures/twitter.txt'

test('readFileSync', t => {
  t.is(fs.readFileSync(helloPath, 'utf8'), 'Hello!\n')
})

test('readFile using async/await', async t => {
  t.is(await fs.readFile(helloPath, 'utf8'), 'Hello!\n')
})

test('access using async/await', async t => {
  await t.notThrowsAsync(
    async () => await fs.access(helloPath)
  )
})

test.cb('readFileSync with subscription', t => {
  const unsubscribe = fs.sub(helloPath, action => {
    t.is(action.name, 'readFileSync')
    t.is(action.args[0], helloPath)
    t.is(action.args[1], 'utf8')
    t.end()
  })
  fs.readFileSync(helloPath, 'utf8')
  unsubscribe()
})

test('preventing a file read with a subscription', async t => {
  const errorMsg = 'No distractions!'
  const unsubscribe = fs.sub(twitterPath, async () => {
    throw new Error(errorMsg)
  })
  await t.throwsAsync(async () => await fs.readFile(twitterPath), errorMsg)
  unsubscribe()
})

test('hijacking a file read with a subscription', async t => {
  const unsubscribe = fs.sub(helloPath, () => 'Hola!')
  t.is(await fs.readFile(helloPath, 'utf8'), 'Hola!')
  unsubscribe()
})
