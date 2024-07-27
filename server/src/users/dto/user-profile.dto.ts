import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: '1', description: 'The ID of the user' })
  userId: number;
}
