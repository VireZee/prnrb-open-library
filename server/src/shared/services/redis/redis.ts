import { createClient } from 'redis'
export const Redis = {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
        const client = createClient({
            socket: {
                host: process.env['REDIS_HOST'],
                port: Number(process.env['REDIS_PORT'])
            },
            password: process.env['REDIS_PASS']!
        })
        await client.connect()
        return client
    }
}