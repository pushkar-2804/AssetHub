import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'updateduser@example.com',
    description: 'Updated user email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'Updated user password',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Length(6, 20, { message: 'Password should be between 6 and 20 characters' })
  password?: string;

  @ApiProperty({
    example: 'Updated John Doe',
    description: 'Updated user full name',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
}
