import * as faker from 'faker';
import * as flagsmith from 'flagsmith-nodejs';
import { Test, TestingModule } from '@nestjs/testing';
import { IFlags, ITraits, IUserIdentity } from 'flagsmith-nodejs';

import { FlagsmithService } from './flagsmith.service';
import { FLAGSMITH_INSTANCE_TOKEN } from './flagsmith.constant';

describe('FlagsmithService', () => {
  let service: FlagsmithService;
  let booleanResult: boolean;
  let traitResult: ITraits;
  let flagResult: IFlags;
  let identityResult: IUserIdentity;

  const flagsmithMock: Partial<typeof flagsmith> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsmithService,
        {
          provide: FLAGSMITH_INSTANCE_TOKEN,
          useValue: flagsmithMock,
        },
      ],
    }).compile();

    service = module.get<FlagsmithService>(FlagsmithService);

    booleanResult = faker.datatype.boolean();
    traitResult = {};
    flagResult = {};
    identityResult = {
      flags: { enabled: faker.datatype.boolean() },
      traits: {},
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check if feature exists', complete => {
    flagsmithMock.hasFeature = jest
      .fn()
      .mockImplementationOnce(async () => booleanResult);

    service.hasFeature(faker.datatype.string()).subscribe({
      next: v => {
        expect(typeof v).toBe('boolean');
        expect(v).toEqual(booleanResult);
      },
      complete,
    });
  });

  it('should get value', complete => {
    flagsmithMock.getValue = jest
      .fn()
      .mockImplementationOnce(async () => booleanResult);

    service.getValue(faker.datatype.string()).subscribe({
      next: v => {
        expect(typeof v).toBe('boolean');
        expect(v).toEqual(booleanResult);
      },
      complete,
    });
  });

  it('should get trait', complete => {
    flagsmithMock.getTrait = jest
      .fn()
      .mockImplementationOnce(async () => traitResult);

    service
      .getTrait(faker.datatype.string(), faker.datatype.string())
      .subscribe({
        next: v => {
          expect(typeof v).toBe('object');
          expect(v).toEqual(traitResult);
        },
        complete,
      });
  });

  it('should get flags', complete => {
    flagsmithMock.getFlags = jest
      .fn()
      .mockImplementationOnce(async () => flagResult);

    service.getFlags().subscribe({
      next: v => {
        expect(typeof v).toBe('object');
        expect(v).toEqual(flagResult);
      },
      complete,
    });
  });

  it('should get flags for user', complete => {
    flagsmithMock.getFlagsForUser = jest
      .fn()
      .mockImplementationOnce(async () => flagResult);

    service.getFlagsForUser(faker.datatype.string()).subscribe({
      next: v => {
        expect(typeof v).toBe('object');
        expect(v).toEqual(flagResult);
      },
      complete,
    });
  });

  it('should get user identity', complete => {
    flagsmithMock.getUserIdentity = jest
      .fn()
      .mockImplementationOnce(async () => identityResult);

    service.getUserIdentity(faker.datatype.string()).subscribe({
      next: v => {
        expect(typeof v).toBe('object');
        expect(v).toEqual(identityResult);
      },
      complete,
    });
  });

  it('should set traits', complete => {
    flagsmithMock.setTrait = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(identityResult));

    service
      .setTrait(
        faker.datatype.string(),
        faker.datatype.string(),
        faker.random.arrayElement<string | boolean | number>([
          faker.datatype.string(),
          faker.datatype.boolean(),
          faker.datatype.number(),
        ]),
      )
      .subscribe({
        next: v => {
          expect(typeof v).toBe('object');
          expect(v).toEqual(identityResult);
        },
        complete,
      });
  });
});
