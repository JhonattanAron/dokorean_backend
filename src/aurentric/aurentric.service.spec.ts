import { Test, TestingModule } from '@nestjs/testing';
import { AurentricService } from './aurentric.service';

describe('AurentricService', () => {
  let service: AurentricService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AurentricService],
    }).compile();

    service = module.get<AurentricService>(AurentricService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
