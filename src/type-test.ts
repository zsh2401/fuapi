import { z } from 'zod'
import { defineAPI, RetAPI } from './def'
import { implApi } from './server'
import { createAPIClient } from './client'

async function plain() {
  const api = defineAPI({
    path: 'a',
  })
  implApi({
    express: null!,
    api,
    handler: async (req) => {},
  })
  const client = createAPIClient({
    api: api,
  })
  const result: void = await client()
}
async function noArg() {
  const api = defineAPI({
    path: 'a',
    voSchema: z.object({ a: z.string() }),
  })

  implApi({
    express: null!,
    api,
    handler: async (req) => {
      return { a: 'string' }
    },
  })

  const client = createAPIClient({
    api: api,
  })
  const result: { a: string } = await client()
}
async function noRet() {
  const api = defineAPI({
    path: 'a',
    dtoSchema: z.object({ a: z.string() }),
  })
  implApi({
    express: null!,
    api,
    handler: async (req) => {
      const a: string = req.dto.a
      console.log(a)
      // return { a: 3 }
    },
  })
  const client = createAPIClient({
    api: api,
  })
  const result: void = await client({ a: 'a' })
}

async function full() {
  const api = defineAPI({
    path: 'a',
    dtoSchema: z.object({ a: z.string() }),
    voSchema: z.object({ a: z.string() }),
  })

  implApi(null!, api, async (req) => {
    return req.dto
  })
  const client = createAPIClient({
    api: api,
  })
  const result: { a: string } = await client({
    a: 'test',
  })
}
