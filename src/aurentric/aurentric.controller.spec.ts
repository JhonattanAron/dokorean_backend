import { Test, TestingModule } from '@nestjs/testing';
import { AurentricController } from './aurentric.controller';

describe('AurentricController', () => {
  let controller: AurentricController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AurentricController],
    }).compile();

    controller = module.get<AurentricController>(AurentricController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
