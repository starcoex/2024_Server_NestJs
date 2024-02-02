import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProfileInput,
  CreateProfileFileInput,
} from './dto/profile-create.dto';
import { CreateProfileOutput } from './dto/profile-create.dto';
import {
  EditProfileFileInput,
  EditProfileInput,
  EditProfileOutput,
} from './dto/profile-edit.dto';
import {
  GetIdPorofileInput,
  GetIdProfileOutput,
} from './dto/profile-getId-dto';
import { Profile } from './entitles/profile.entity';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { join } from 'path';
import { createWriteStream } from 'fs';
import * as ftp from 'basic-ftp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createProfile(
    createProfileInput: CreateProfileInput,
    createProfileFileInput: CreateProfileFileInput,
    userId: number,
  ): Promise<CreateProfileOutput> {
    try {
      let fileUrl = null;
      if (createProfileFileInput.file) {
        fileUrl = await this.fileUpload(createProfileFileInput.file, userId);
      }
      const newProfile = await this.prisma.profile.create({
        data: {
          bio: createProfileInput.bio,
          avatarUrl: fileUrl,
          user: { connect: { id: userId } },
        },
      });
      return {
        ok: true,
        id: newProfile.id,
        profile: newProfile,
      };
    } catch (error) {
      return {
        ok: false,
      };
    }
  }

  async editProfile(
    editProfileInput: EditProfileInput,
    editProfileFileInput: EditProfileFileInput,
    userId: number,
  ): Promise<EditProfileOutput> {
    try {
      let fileUrl = null;
      if (editProfileFileInput.file) {
        fileUrl = await this.fileUpload(editProfileFileInput.file, userId);
        console.log(fileUrl);
      }

      const userProfile = await this.prisma.profile.findUnique({
        where: { id: editProfileInput.id },
      });
      if (!userProfile) {
        return {
          ok: false,
          error: 'User Profile not found.',
        };
      }
      if (userProfile.userId !== userId) {
        return {
          ok: false,
          error: "You can't edit a profile that you don't own",
        };
      }
      const profileUpdate = await this.prisma.profile.update({
        where: {
          id: userProfile.id,
        },
        data: {
          ...(editProfileFileInput.file && { avatarUrl: fileUrl }),
          bio: editProfileInput.bio,
          user: {
            connect: { id: userProfile.userId },
          },
        },
      });
      return {
        ok: true,
        profile: profileUpdate as Profile,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User Profile not found.',
      };
    }
  }

  async getProfileById({
    id,
  }: GetIdPorofileInput): Promise<GetIdProfileOutput> {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id },
        include: { user: true },
      });
      if (!profile) {
        return {
          ok: false,
          error: 'Profile not found',
        };
      }
      return {
        ok: true,
        id: profile.id,
        profile: profile as Profile,
      };
    } catch (error) {
      return {
        ok: false,
      };
    }
  }

  private async fileUpload(
    file: GraphQLUpload,
    userId: number,
  ): Promise<string> {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
      await client.access({
        host: this.configService.get('FTP_URL'),
        user: this.configService.get('FTP_USER'),
        password: this.configService.get('FTP_PASS'),
        port: 21,
        secure: false,
      });
      await client.ensureDir('ftp/avatar');
      const { filename, createReadStream } = await file;
      const fileDate = file;
      console.log(fileDate);

      const newFilename = `${userId}-${Date.now()}-${filename}`;
      const filePath = join(process.cwd(), 'public/files', newFilename);
      const fileUrl = `${process.env.APP_URL}/public/files/${newFilename}`;
      const ftpReadStream = await client.uploadFrom(
        createReadStream(fileDate),
        newFilename,
      );
      const readStream = createReadStream();
      readStream.pipe(createWriteStream(filePath));
      return fileUrl;
    } catch (error) {}
  }

  async basicFtp(file: string) {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
      const ftpStarcoex = await client.access({
        host: this.configService.get('FTP_URL'),
        user: this.configService.get('FTP_USER'),
        password: this.configService.get('FTP_PASS'),
        port: 21,
        secure: false,
      });
      // await client.ensureDir('ftp/avatar');
      // const cd = await client.cd('ftp/avatar');
      await client.uploadFrom(file, 'imsi.jpeg');
      console.log(await client.list());
    } catch (error) {
      console.log(error);
    }
    client.close();
  }
}
