import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './users/schemas/users.schema';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  const mockUser = {
    username: 'testuser',
    password: 'hashedpassword',
    role: 'user',
    save: jest.fn(),
  };

  beforeEach(async () => {
    const mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt'),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw InternalServerErrorException if user exists', async () => {
      userModel.findOne.mockResolvedValue(mockUser);
      await expect(
        service.register('testuser', 'password', 'user'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should throw ConflictException if user not found', async () => {
      userModel.findOne.mockResolvedValue(null);
      await expect(service.login('testuser', 'password')).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
