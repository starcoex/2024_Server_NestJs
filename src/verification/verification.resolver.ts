import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verity-email.dto';
import { VerificationService } from './verification.service';

@Resolver()
export class VerificationResolver {
  constructor(private readonly verificationService: VerificationService) {}

  // @Mutation(() => VerifyEmailOutput)
  // verifyEmail(
  //   @Args('input') verifyEmailInput: VerifyEmailInput,
  // ): Promise<VerifyEmailOutput> {
  //   return this.verificationService.verityEmail(verifyEmailInput);
  // }
}
