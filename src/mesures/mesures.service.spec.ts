import { Test, TestingModule } from '@nestjs/testing';
import { MesuresService } from './mesures.service';

describe('MesuresService', () => {
  let service: MesuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MesuresService],
    }).compile();

    service = module.get<MesuresService>(MesuresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
