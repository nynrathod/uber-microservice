import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupAuthDto): Promise<UserResponseDto> {
    const { firstName, lastName, email, password } = signupDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: 'ERR_001',
          message: 'User already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async signin(loginDto: LoginAuthDto): Promise<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    accessToken: string;
  }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          errorCode: 'ERR_002',
          message: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          errorCode: 'ERR_003',
          message: 'Invalid credentials',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      accessToken,
    };
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
