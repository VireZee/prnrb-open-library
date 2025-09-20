import { Injectable } from '@nestjs/common'
import type { PrismaService } from '@database/prisma.service.js'
import type { FormatterService } from '../formatter/formatter.service.js'

@Injectable()
export class ValidationService {
    constructor(private readonly prisma: PrismaService, private readonly formatterService: FormatterService) {}
    validateName(name: string) {
        if (!name) return 'Name can\'t be empty!'
        else if (name.length >= 75) return 'Name is too long!'
        return
    }
    async validateUsername(username: string, id?: string) {
        if (!username) return 'Username can\'t be empty!'
        else if (!/^[\w\d]+$/.test(username)) return 'Username can only contain Latin Alphabets, Numbers, and Underscores!'
        else if (username.length >= 20) return 'Username is too long!'
        else if (await this.prisma.user.findFirst({
            where: {
                username: this.formatterService.formatUsername(username),
                ...(id && { id: { not: id } })
            }
        })) return 'Username is unavailable!'
        return
    }
    async validateEmail(email: string, id?: string) {
        if (!email) return "Email can't be empty!"
        else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return 'Email must be valid!'
        else if (await this.prisma.user.findFirst({
            where: {
                email,
                googleId: null,
                ...(id && { id: { not: id } })
            }
        })) return 'Email is already registered!'
        else if (await this.prisma.user.findFirst({
            where: {
                email,
                NOT: { googleId: null },
                ...(id && { id: { not: id } })
            }
        })) return 'Email is already registered using Google!'
        return
    }
}