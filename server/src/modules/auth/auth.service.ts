// @Injectable()
// export class AuthService {
//   constructor(
//     private prisma: PrismaService,
//     private redis: RedisService,
//   ) {}

//   async register(input: RegisterInput, res: any): Promise<boolean> {
//     const { name, username, email, pass, rePass, show } = input
//     const errs: Record<string, string> = {}


//     const nameErr = validateName(name)
//     const usernameErr = await validateUsername(username)
//     const emailErr = await validateEmail(email)

//     if (nameErr) errs['name'] = nameErr
//     if (usernameErr) errs['username'] = usernameErr
//     if (emailErr) errs['email'] = emailErr
//     if (!pass) errs['pass'] = "Password can't be empty!"
//     if (!show && pass !== rePass) errs['rePass'] = 'Password do not match!'

//     if (Object.keys(errs).length > 0) {
//       graphqlError('Unprocessable Content', 422, errs)
//     }

//     const newUser = await this.prisma.user.create({
//       data: {
//         photo: Buffer.from(generateSvg(name), 'base64'),
//         name: formatName(name),
//         username: formatUsername(username),
//         email,
//         pass: await hash(pass),
//       },
//     })

//     await this.redis.generateCode('verify', newUser.id, false)

//     res.cookie('token', 'TODO-JWT', { httpOnly: true })

//     return true
//   }
// }

// @Injectable()
// export class AuthService {
//   constructor(private readonly prisma: PrismaService) {}

//   async register(input: RegisterInput, res: any): Promise<boolean> {
//     const { name, username, email, pass, rePass, show } = input;
//     const errs: Record<string, string> = {};

//     const nameErr = validateName(name);
//     const usernameErr = await validateUsername(username);
//     const emailErr = await validateEmail(email);

//     if (nameErr) errs['name'] = nameErr;
//     if (usernameErr) errs['username'] = usernameErr;
//     if (emailErr) errs['email'] = emailErr;
//     if (!pass) errs['pass'] = "Password can't be empty!";
//     if (!show && pass !== rePass) errs['rePass'] = 'Password do not match!';

//     if (Object.keys(errs).length > 0) graphqlError('Unprocessable Content', 422, errs);

//     const newUser = await this.prisma.user.create({
//       data: {
//         photo: Buffer.from(generateSvg(name), 'base64'),
//         name: formatName(name),
//         username: formatUsername(username),
//         email,
//         pass: await hash(pass),
//       },
//     });

//     await generateCode('verify', newUser, false);
//     cookie(newUser, res);

//     return true;
//   }
// }
