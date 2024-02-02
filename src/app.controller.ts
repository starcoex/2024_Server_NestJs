import { Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';
import * as session from 'express-session';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
