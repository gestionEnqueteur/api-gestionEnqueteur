import { Test, TestingModule } from '@nestjs/testing';
import { EnqController } from './enq.controller';

describe('EnqController', () => {
  let controller: EnqController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnqController],
    }).compile();

    controller = module.get<EnqController>(EnqController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
