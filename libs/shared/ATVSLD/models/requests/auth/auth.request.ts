import { IsString, Matches, MinLength, IsNumber } from 'class-validator';
import {
  REGEX_PASSWORD,
  REGEX_NO_SPACES,
  REGEX_USERNAME,
} from 'libs/shared/ATVSLD/constants/regex.constant';

export class AuthRequest {
  @IsNumber()
  department_id: number;

  @IsString()
  @Matches(REGEX_USERNAME, {
    message: 'Tài khoản chỉ gồm chữ, số, gạch dưới, từ 3–30 ký tự',
  })
  account: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(REGEX_NO_SPACES, { message: 'Mật khẩu không được chứa khoảng trắng' })
  @Matches(REGEX_PASSWORD, {
    message: 'Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
  })
  password: string;
}
