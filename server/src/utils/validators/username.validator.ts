import type { PrismaService } from 'prisma/prisma.service.js'
import usernameFormatter from '@utils/formatters/username.formatter.js'
export default async (prisma: PrismaService, username: string, id?: string) => {
    if (!username) return "Username can't be empty!"
    else if (!/^[\w\d]+$/.test(username)) return 'Username can only contain Latin Alphabets, Numbers, and Underscores!'
    else if (username.length >= 20) return 'Username is too long!'
    else if (await prisma.user.findFirst({
        where: {
            username: usernameFormatter(username),
            ...(id && { id: { not: id } })
        }
    })) return 'Username is unavailable!'
    return
}