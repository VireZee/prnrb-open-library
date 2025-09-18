import type { PrismaService } from 'prisma/prisma.service.js'
export default async (prisma: PrismaService, email: string, id?: string) => {
    if (!email) return "Email can't be empty!"
    else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return 'Email must be valid!'
    else if (await prisma.user.findFirst({
        where: {
            email,
            googleId: null,
            ...(id && { id: { not: id } })
        }
    })) return 'Email is already registered!'
    else if (await prisma.user.findFirst({
        where: {
            email,
            NOT: { googleId: null },
            ...(id && { id: { not: id } })
        }
    })) return 'Email is already registered using Google!'
    return
}