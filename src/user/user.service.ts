import { Injectable } from '@nestjs/common';
import { CreateUserInput, CreateUserOutput } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginInput, LoginOutput } from './dto/login-user.dto';
import { JwtService } from '../jwt/jwt.service';
import { User } from './entities/user.entity';
import { ProfileUserInput, ProfileUserOutput } from './dto/profile-user.dto';
import { randomUUID } from 'crypto';
import {
  EditProfileUserInput,
  EditProfileUserOutput,
} from './dto/edit-profile-user.dto';
import { MailerMailService } from 'src/mailer-mail/mailer-mail.service';
import { SearchUserOutput, SerachUserInput } from './dto/search-user.dto';
import { ConfigService } from '@nestjs/config';
import {
  PasswordResetUserInput,
  PasswordResetUserOutput,
} from './dto/password-reset-user.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verity-email.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerMailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findById(id: number): Promise<ProfileUserOutput> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return {
      ok: true,
      user: user as User,
    };
  }

  async verityEmail(
    verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.prisma.verification.findFirst({
        where: { code: verifyEmailInput.code },
      });
      if (verification) {
        await this.prisma.verification.update({
          where: {
            id: verification.id,
          },
          data: {
            user: {
              connect: { id: verification.userId },
              update: { emailVerified: true },
            },
          },
        });
        await this.prisma.verification.delete({
          where: {
            id: verification.id,
          },
        });
        return {
          ok: true,
          id: verification.id,
        };
      }
      return {
        ok: false,
        error: 'Verification not found.',
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Verification not update',
      };
    }
  }

  async profileUser(
    profileUserInput: ProfileUserInput,
  ): Promise<ProfileUserOutput> {
    try {
      const user = await this.findById(profileUserInput.id);
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      return {
        ok: true,
        user: user as any,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User not found.',
      };
    }
  }

  async passwordResetUser(
    passwordResetUserInput: PasswordResetUserInput,
  ): Promise<PasswordResetUserOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: passwordResetUserInput.email },
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      let hashPassword = null;
      if (passwordResetUserInput.password) {
        hashPassword = await bcrypt.hash(passwordResetUserInput.password, 10);
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashPassword,
        },
      });
      return {
        ok: true,
        id: user.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Not found',
      };
    }
  }

  async editProfileUser(
    editProfileUserInput: EditProfileUserInput,
    userId: number,
  ): Promise<EditProfileUserOutput> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      let checkPassword = null;
      const code = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
      if (editProfileUserInput.password) {
        checkPassword = await bcrypt.hash(editProfileUserInput.password, 10);
      }

      if (
        editProfileUserInput.userName !== user.userName ||
        editProfileUserInput.email !== user.email ||
        editProfileUserInput.userName !== user.password
      ) {
        await this.mailerService.sendMailer(
          [editProfileUserInput.email],
          '회원가입',
          'starcoex_account',
          { username: editProfileUserInput.userName, code },
        );
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            userName: editProfileUserInput.userName,
            email: editProfileUserInput.email,
            ...(checkPassword && { password: checkPassword }),
            emailVerified: false,
            verifications: {
              connectOrCreate: { where: { code }, create: { code } },
            },
          },
        });
      }
      return {
        ok: true,
        id: user.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Not Edit user',
      };
    }
  }
  async createUser(
    createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    try {
      const code = `${randomUUID()}${randomUUID()}`.replace(/-/g, '');
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: createUserInput.email },
            { userName: createUserInput.userName },
          ],
        },
      });
      if (existingUser) {
        return {
          ok: false,
          error: 'This usename/email is already taken.',
        };
      }

      let hashPassword = null;
      if (createUserInput.password) {
        hashPassword = await bcrypt.hash(createUserInput.password, 10);
      }
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserInput.email,
          password: hashPassword,
          userName: createUserInput.userName,
          role: createUserInput.role,
          verifications: {
            connectOrCreate: {
              where: {
                code,
              },
              create: {
                code,
              },
            },
          },
        },
      });
      await this.mailerService.sendMailer(
        [createUserInput.email],
        '회원가입',
        'starcoex-account',
        { username: createUserInput.userName, code },
      );
      return {
        ok: true,
        user: newUser as User,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Could't creat user",
      };
    }
  }

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginInput.email },
      });
      if (!user) {
        return {
          ok: false,
          error: 'Access Denied, User not found.',
        };
      }
      const comparePassword = await bcrypt.compare(
        loginInput.password,
        user.password,
      );
      if (!comparePassword) {
        return {
          ok: false,
          error: 'Acess Denied, Wrong password.',
        };
      }
      const token = this.jwtService.accessToken({ id: user.id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User not found.',
      };
    }
  }

  async searchUser(
    serachUserInput: SerachUserInput,
  ): Promise<SearchUserOutput> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            {
              email: {
                startsWith: serachUserInput.query,
                mode: 'insensitive',
              },
            },
          ],
        },
        take: Number(this.configService.get('PAGINATION_NUMBER')),
        skip:
          (serachUserInput.page - 1) *
          Number(this.configService.get('PAGINATION_NUMBER')),
        orderBy: {
          email: 'desc',
        },
      });
      return {
        ok: true,
        users: users as [],
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Searching no User',
      };
    }
  }
}
