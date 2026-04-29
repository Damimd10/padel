import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  const mockConfigService = {
    getOrThrow: vi.fn((key: string) => {
      if (key === 'BETTER_AUTH_SECRET') return 'test-secret';
      if (key === 'BETTER_AUTH_URL') return 'http://localhost:3000';
      return null;
    }),
  };

  const mockPrismaService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.auth).toBeDefined();
  });
});
