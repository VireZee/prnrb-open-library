// import { Resolver, Mutation, Args, Context } from '@nestjs/graphql'
// import { AuthService } from './auth.service'
// import { RegisterInput } from './dto/register.input'

// @Resolver()
// export class AuthResolver {
//   constructor(private readonly authService: AuthService) {}

//   @Mutation(() => Boolean)
//   async register(
//     @Args('input') input: RegisterInput,
//     @Context() context: any,
//   ): Promise<boolean> {
//     return this.authService.register(input, context.res);
//   }
// }
