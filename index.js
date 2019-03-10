import fs from 'fs'

const proxy = new Proxy(fs, {
  get (target, name) {
    const prop = target[name]

    if (typeof prop === 'function' && !name.includes('Sync')) {
      return (...args) => new Promise((resolve, reject) => {
        const callback = (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        }

        prop.apply(target, args.concat(callback))
      })
    }

    return prop
  }
})

export default proxy
