import { Injectable } from '@nestjs/common'
import { PrismaService } from '@database/prisma.service.js'
import { FormatterService } from '../formatter/formatter.service.js'

@Injectable()
export class ValidationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly formatterService: FormatterService
    ) {}
    validateName(name: string): string | undefined {
        if (!name) return 'Name can\'t be empty!'
        else if (name.length >= 75) return 'Name is too long!'
        return
    }
    async validateUsername(username: string, id?: string): Promise<string | undefined> {
        if (!username) return 'Username can\'t be empty!'
        else if (!/^[\w\d]+$/.test(username)) return 'Username can only contain Latin Alphabets, Numbers, and Underscores!'
        else if (username.length >= 20) return 'Username is too long!'
        else if (await this.prismaService.user.findFirst({
            where: {
                username: this.formatterService.formatUsername(username),
                ...(id && { id: { not: id } })
            }
        })) return 'Username is unavailable!'
        return
    }
    async validateEmail(email: string, id?: string): Promise<string | undefined> {
        if (!email) return "Email can't be empty!"
        else if (!/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return 'Email must be valid!'
        else if (await this.prismaService.user.findFirst({
            where: {
                email,
                googleId: null,
                ...(id && { id: { not: id } })
            }
        })) return 'Email is already registered!'
        else if (await this.prismaService.user.findFirst({
            where: {
                email,
                NOT: { googleId: null },
                ...(id && { id: { not: id } })
            }
        })) return 'Email is already registered using Google!'
        return
    }
}