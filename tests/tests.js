const { test } = require('@ianwalter/bff')
const fs = require('..')

const helloPath = './tests/fixtures/hello.txt'
const twitterPath = './tests/fixtures/twitter.txt'

test('readFileSync', ({ expect }) => {
  expect(fs.readFileSync(helloPath, 'utf8')).toBe('Hello!\n')
})

test('readFile using async/await', async ({ expect }) => {
  expect(await fs.readFile(helloPath, 'utf8')).toBe('Hello!\n')
})

test('readFileSync with subscription', ({ expect }) => {
  return new Promise(resolve => {
    const unsubscribe = fs.sub(helloPath, action => {
      expect(action.name).toBe('readFileSync')
      expect(action.args[0]).toBe(helloPath)
      expect(action.args[1]).toBe('utf8')
      resolve()
    })
    fs.readFileSync(helloPath, 'utf8')
    unsubscribe()
  })
})

test('preventing a file read with a subscription', ({ expect }) => {
  const errorMsg = 'No distractions!'
  const unsubscribe = fs.sub(twitterPath, async () => {
    throw new Error(errorMsg)
  })
  const promise = expect(fs.readFile(twitterPath)).rejects.toThrow(errorMsg)
  unsubscribe()
  return promise
})

test('hijacking a file read with a subscription', async ({ expect }) => {
  const unsubscribe = fs.sub(helloPath, () => 'Hola!')
  expect(await fs.readFile(helloPath, 'utf8')).toBe('Hola!')
  unsubscribe()
})
