import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { Response } from 'express';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    // private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    try {
      const { username, password } = dto;
      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);
      const user = await this.userRepository.create({
        username,
        password: hashedPass,
      });
      return await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }
  }

  async login(res: Response, username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Пароли не совпадают');
    }

    const jwtPayload: JwtPayload = {
      userId: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '7d',
    });

    res.cookie('jid', refreshToken, {
      httpOnly: true,
    });
    await this.cache.set(refreshToken, user.id, 1000 * 60 * 60 * 24 * 7); // 7 days
    return res.json({ user, accessToken });
  }

  async refresh(token: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    const decoded: JwtPayload = this.jwtService.verify(token);
    if (!decoded) {
      throw new UnauthorizedException();
    }
    // const storedId = await this.cache.get(token);
    // console.log(storedId);
    // if (!storedId) {
    //   throw new UnauthorizedException();
    // }
    // if (+storedId !== decoded.userId) {
    //   throw new UnauthorizedException();
    // }

    //обновление refresh token и запись его в redis(optional)

    const accessToken = this.jwtService.sign({
      userId: decoded.userId,
      username: decoded.username,
    });

    return { accessToken };
  }
  async verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  private async createAccessToken(user: User) {
    return this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      { expiresIn: '15m' },
    );
  }
  private async createRefreshToken(user: User) {
    return this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      { expiresIn: '7d' },
    );
  }
  async sendRefreshToken(res: Response, token: string) {
    res.cookie('jid', token, {
      httpOnly: true,
    });
  }
  async validateUser(payload: JwtPayload): Promise<User> {
    return this.userRepository.findOne({
      where: { username: payload.username },
    });
  }
  async getMe(req) {
    return await this.userRepository.findOne({ where: { id: req.userId } });
  }
}
