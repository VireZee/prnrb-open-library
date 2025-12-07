import { Injectable } from '@nestjs/common'
import { PrismaService } from '@infrastructure/database/prisma.service.js'
import { FormatterService } from '@shared/utils/services/formatter.service.js'

@Injectable()
export class MiscService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly formatterService: FormatterService
    ) {}
    generateAvatar(name: string): string {
        const initials = name.split(' ').map(w => w.charAt(0).toUpperCase()).slice(0, 5).join('')
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
                <circle cx="256" cy="256" r="256" fill="#000" />
                <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Times New Roman" font-size="128" fill="white">${initials}</text>
            </svg>
        `
        return Buffer.from(svg).toString('base64')
    }
    async generateUniqueUsername(base: string): Promise<string> {
        let username = this.formatterService.formatUsername(base)
        let suffix = 0
        while (await this.prismaService.user.findFirst({ where: { username } })) {
            username = this.formatterService.formatUsername(base) + suffix
            suffix++
        }
        return username
    }
}