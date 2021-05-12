import { Test, TestingModule } from '@nestjs/testing';

describe('module init', () => {
  let module: TestingModule;
  let app;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
    }).compile();
  });
});
