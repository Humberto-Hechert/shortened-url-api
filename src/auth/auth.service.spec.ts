import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'user@example.com';
      const password = 'password123';
      const user = { id: 1, email, password: 'hashedPassword' };

      mockUserService.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);

      const result = await service.validateUser(email, password);
      expect(result).toEqual({ id: 1, email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const email = 'user@example.com';
      const password = 'password123';

      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'user@example.com';
      const password = 'password123';
      const user = { id: 1, email, password: 'hashedPassword' };

      mockUserService.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, email: 'user@example.com' };
      const accessToken = 'someAccessToken';

      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: accessToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
    });
  });

  describe('validateUserFromRequest', () => {
    it('should return user if token is valid', async () => {
      const token = 'validToken';
      const decodedToken = { sub: 1 };
      const user = { id: 1, email: 'user@example.com' };

      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUserService.findOne.mockResolvedValue(user);

      const result = await service.validateUserFromRequest({
        headers: { authorization: `Bearer ${token}` },
      });

      expect(result).toEqual(user);
      expect(mockJwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      await expect(service.validateUserFromRequest({ headers: {} })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid or expired', async () => {
      const token = 'invalidToken';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        service.validateUserFromRequest({
          headers: { authorization: `Bearer ${token}` },
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const token = 'validToken';
      const decodedToken = { sub: 1 };

      mockJwtService.verify.mockReturnValue(decodedToken);
      mockUserService.findOne.mockResolvedValue(null);

      await expect(
        service.validateUserFromRequest({
          headers: { authorization: `Bearer ${token}` },
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
