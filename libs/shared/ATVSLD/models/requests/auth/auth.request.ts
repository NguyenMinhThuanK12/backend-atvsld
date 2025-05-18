import {
    IsString,
    MinLength,
    Matches,
    IsNumber,
  } from 'class-validator';
  
  export class AuthRequest {

    @IsNumber()
    department_id: number;

    @IsString()
    account: string;
  
    @IsString()
    @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    @Matches(/^\S*$/, { message: 'Mật khẩu không được chứa khoảng trắng' })
    @Matches(/(?=.*[A-Z])/, { message: 'Mật khẩu phải có ít nhất một chữ in hoa' })
    @Matches(/(?=.*[a-z])/, { message: 'Mật khẩu phải có ít nhất một chữ thường' })
    @Matches(/(?=.*[0-9])/, { message: 'Mật khẩu phải có ít nhất một chữ số' })
    @Matches(/(?=.*[\W_])/, { message: 'Mật khẩu phải có ít nhất một ký tự đặc biệt' })
    password: string;
  }
  