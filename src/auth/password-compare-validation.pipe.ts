import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordCompareValidationPipe implements PipeTransform<any> {
  async transform(dto: any, { metatype }: ArgumentMetadata) {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException({
        message: [{
          constraints: {
            password_confirmation: 'Passwords do not match.'
          }
        }]
      });
    }

    return dto;
  }
}
