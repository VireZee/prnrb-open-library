// import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';

// @Resolver()
// export class AuthResolver {
//   @Mutation(() => Boolean)
//   async register(
//     @Args('name') name: string,
//     @Args('username') username: string,
//     @Args('email') email: string,
//     @Args('pass') pass: string,
//     @Args('rePass') rePass: string,
//     @Args('show') show: boolean,
//     @Context() context: { res: Res },
//   ): Promise<boolean> {
//     try {
//       const { res } = context;
//       const errs: Record<string, string> = {};

//       const nameErr = validateName(name);
//       const usernameErr = await validateUsername(username);
//       const emailErr = await validateEmail(email);

//       if (nameErr) errs['name'] = nameErr;
//       if (usernameErr) errs['username'] = usernameErr;
//       if (emailErr) errs['email'] = emailErr;
//       if (!pass) errs['pass'] = "Password can't be empty!";
//       if (!show && pass !== rePass) errs['rePass'] = 'Password do not match!';

//       if (Object.keys(errs).length > 0) {
//         graphqlError('Unprocessable Content', 422, errs);
//       }

//       const newUser = new user({
//         photo: Buffer.from(generateSvg(name), 'base64'),
//         name: formatName(name),
//         username: formatUsername(username),
//         email,
//         pass: await hash(pass),
//       });

//       await newUser.save();
//       await generateCode('verify', newUser, false);
//       cookie(newUser, res);

//       return true;
//     } catch (e) {
//       throw e;
//     }
//   }
// }
