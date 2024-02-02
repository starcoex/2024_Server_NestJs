import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verity-email.dto';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  // async verityEmail(
  //   verifyEmailInput: VerifyEmailInput,
  // ): Promise<VerifyEmailOutput> {
  //   try {
  //     const verification = await this.prisma.verification.findFirst({
  //       where: { code: verifyEmailInput.code },
  //       include: { user: true },
  //     });
  //     // if (verification) {
  //     //   await this.prisma.verification.update({
  //     //     where: {
  //     //       id: verification.id,
  //     //     },
  //     //     data: {
  //     //       user: {
  //     //         connect: { id: verification.userId },
  //     //         update: { emailVerified: true },
  //     //       },
  //     //     },
  //     //   });
  //     //   await this.prisma.verification.delete({
  //     //     where: {
  //     //       id: verification.id,
  //     //     },
  //     //   });
  //     //   return {
  //     //     ok: true,
  //     //     id: verification.id,
  //     //   };
  //     // }
  //     await this.prisma.verification.update({
  //       where: {
  //         id: verification.id,
  //       },
  //       data: {
  //         user: {
  //           connect: { id: verification.userId },
  //           update: { emailVerified: true },
  //         },
  //       },
  //     });
  //     await this.prisma.verification.delete({
  //       where: {
  //         id: verification.id,
  //       },
  //     });
  //     return {
  //       ok: true,
  //       id: verification.id,
  //     };
  //     // return {
  //     //   ok: false,
  //     //   error: 'Verification not found.',
  //     // };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error: 'Verification not update',
  //     };
  //   }
  // }
}
