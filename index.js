import fs from 'fs'
import Subpub from '@ianwalter/subpub'

const subpub = new Subpub()
const proxy = new Proxy(fs, {
  get (target, name) {
    const prop = target[name]

    if (name !== 'sub' && typeof prop === 'function') {
      return (...args) => {
        const subs = subpub.getSubs(args[0])
        let results
        if (subs && subs.length) {
          results = Promise.all(subpub.pub(args[0], { name, args }))
        }

        if (name.includes('Sync')) {
          return prop.apply(target, args)
        } else {
          return new Promise(async (resolve, reject) => {
            try {
              if (results) {
                resolve((await results).find(result => result !== undefined))
              } else {
                prop.apply(target, args.concat((err, data) => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve(data)
                  }
                }))
              }
            } catch (err) {
              reject(err)
            }
          })
        }
      }
    }

    return prop
  }
})

proxy.sub = subpub.sub.bind(subpub)

export default proxy
