import { Test, TestingModule } from '@nestjs/testing';
import { MesuresController } from './mesures.controller';
import { MesuresService } from './mesures.service';

describe('MesuresController', () => {
  let controller: MesuresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MesuresController],
      providers: [MesuresService],
    }).compile();

    controller = module.get<MesuresController>(MesuresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
