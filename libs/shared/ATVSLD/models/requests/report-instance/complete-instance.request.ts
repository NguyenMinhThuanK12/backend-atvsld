import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteInstanceRequest {
  @IsString()
  @IsNotEmpty()
  fullName: string; // tên người hoàn thành
}
