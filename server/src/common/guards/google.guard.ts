import { Injectable, type ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    override getAuthenticateOptions(context: ExecutionContext): { scope: string[], state: string, prompt: string } {
        const req = context.switchToHttp().getRequest()
        const state = req.path.split('/').pop()
        return {
            scope: ['profile', 'email'],
            state,
            prompt: 'select_account'
        }
    }
}