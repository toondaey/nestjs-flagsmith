import * as nock from 'nock';
import * as faker from 'faker';
import { Test, TestingModule } from '@nestjs/testing';

import { FlagsmithService } from '../../lib';
import { TestModule } from '../src/test.module';
import { ExistingModule } from '../src/existing.module';

describe('flagsmith integration', () => {
  let module: TestingModule;
  let service: FlagsmithService;
  describe('module init', () => {
    describe('register', () => {
      it("should initialize with 'register(...params)'", async () => {
        module = await Test.createTestingModule({
          imports: [TestModule.withRegister()],
        }).compile();

        service = await module.get<FlagsmithService>(
          FlagsmithService,
        );

        expect(service).not.toBeUndefined();
      });
    });

    describe('registerAsync', () => {
      it("should initialize with 'registerAsync(...params)' using 'useFactory(...params)'", async () => {
        module = await Test.createTestingModule({
          imports: [TestModule.withUseFactory()],
        }).compile();

        service = module.get<FlagsmithService>(FlagsmithService);

        expect(service).not.toBeUndefined();
      });

      it("should initialize with 'registerAsync(...params)' using 'useClass'", async () => {
        module = await Test.createTestingModule({
          imports: [TestModule.withUseClass()],
        }).compile();

        service = module.get<FlagsmithService>(FlagsmithService);

        expect(service).not.toBeUndefined();
      });

      it("should initialize with 'registerAsync(...params)' using 'useExisting'", async () => {
        module = await Test.createTestingModule({
          imports: [TestModule.withUseExisting(), ExistingModule],
        }).compile();

        service = module.get<FlagsmithService>(FlagsmithService);

        expect(service).not.toBeUndefined();
      });
    });
  });

  describe('app', () => {
    let url: string;
    let userId: string;
    let key: string;
    let enabled: boolean;
    let feature_state_value: string | number | boolean | undefined;

    beforeEach(async () => {
      module = await Test.createTestingModule({
        imports: [
          TestModule.withRegister((url = faker.internet.url())),
        ],
      }).compile();

      service = module.get<FlagsmithService>(FlagsmithService);
    });

    afterEach(async () => {
      nock.cleanAll();
    });

    describe('hasFeature()', () => {
      it('should get with key', complete => {
        key = 'key';
        enabled = faker.datatype.boolean();

        nock(url)
          .get('/flags/')
          .reply(200, [
            {
              feature: {
                name: key,
              },
              enabled,
              feature_state_value,
            },
          ]);

        service.hasFeature(key).subscribe({
          next: result => {
            expect(typeof result).toEqual('boolean');
            expect(result).toBe(enabled);
          },
          complete,
        });
      });

      it('should get with key and userId', complete => {
        key = 'key';
        userId = 'userId';
        enabled = faker.datatype.boolean();

        nock(url)
          .get('/identities/')
          .query({ identifier: userId })
          .reply(200, {
            flags: [
              {
                feature: {
                  name: key,
                },
                enabled,
                feature_state_value,
              },
            ],
          });

        service.hasFeature(key, userId).subscribe({
          next: result => {
            expect(typeof result).toEqual('boolean');
            expect(result).toBe(enabled);
          },
          complete,
        });
      });
    });

    describe('getValue()', () => {
      it('should get with key', complete => {
        key = 'key';
        feature_state_value = faker.random.arrayElement([
          faker.datatype.string(),
          faker.datatype.number(),
          faker.datatype.boolean(),
        ]);

        nock(url)
          .get('/flags/')
          .reply(200, [
            {
              feature: { name: key },
              feature_state_value,
            },
          ]);

        service.getValue(key).subscribe({
          next: result => {
            expect(typeof result).toBe(typeof feature_state_value);
            expect(result).toBe(feature_state_value);
          },
          complete,
        });
      });

      it('should get with key and userId', complete => {
        key = 'key';
        userId = 'userId';
        feature_state_value = faker.random.arrayElement([
          faker.datatype.string(),
          faker.datatype.number(),
          faker.datatype.boolean(),
        ]);

        nock(url)
          .get('/identities/')
          .query({ identifier: userId })
          .reply(200, {
            flags: [
              {
                feature: {
                  name: key,
                },
                feature_state_value,
              },
            ],
          });

        service.getValue(key, userId).subscribe({
          next: result => {
            expect(typeof result).toBe(typeof feature_state_value);
            expect(result).toBe(feature_state_value);
          },
          complete,
        });
      });
    });

    describe('getTrait()', () => {
      it('get traits', complete => {
        userId = 'userId';
        key = 'key';
        let trait_value = faker.datatype.string();

        nock(url)
          .get('/identities/')
          .query({ identifier: userId })
          .reply(200, {
            flags: [],
            traits: [
              {
                trait_key: key,
                trait_value,
              },
            ],
          });

        service.getTrait(userId, key).subscribe({
          next: result => expect(result).toBe(trait_value),
          complete,
        });
      });
    });

    describe('getFlags()', () => {
      it('should get flags', complete => {
        key = 'key';
        enabled = faker.datatype.boolean();
        feature_state_value = faker.random.arrayElement([
          faker.datatype.string(),
          faker.datatype.number(),
          faker.datatype.boolean(),
        ]);

        nock(url)
          .get('/flags/')
          .reply(200, [
            {
              feature: {
                name: key,
              },
              enabled,
              feature_state_value,
            },
          ]);

        service.getFlags().subscribe({
          complete,
          next: result =>
            expect(result).toMatchObject({
              key: {
                enabled,
                value: feature_state_value,
              },
            }),
        });
      });
    });

    describe('getFlagsForUser', () => {
      it('should get flags for user', complete => {
        key = 'key';
        userId = 'userId';
        enabled = faker.datatype.boolean();
        feature_state_value = faker.random.arrayElement([
          faker.datatype.string(),
          faker.datatype.number(),
          faker.datatype.boolean(),
        ]);

        nock(url)
          .get('/identities/')
          .query({ identifier: userId })
          .reply(200, {
            flags: [
              {
                feature: {
                  name: key,
                },
                enabled,
                feature_state_value,
              },
            ],
          });

        service.getFlagsForUser(userId).subscribe({
          complete,
          next: result =>
            expect(result).toMatchObject({
              key: {
                enabled,
                value: feature_state_value,
              },
            }),
        });
      });
    });

    describe('getUserIdentity', () => {
      it('should get user identity', complete => {
        userId = 'userId';
        key = 'key';
        feature_state_value = faker.random.arrayElement([
          faker.datatype.string(),
          faker.datatype.number(),
          faker.datatype.boolean(),
        ]);
        enabled = faker.datatype.boolean();
        let trait_value = faker.datatype.string();

        nock(url)
          .get('/identities/')
          .query({ identifier: userId })
          .reply(200, {
            flags: [
              {
                feature: {
                  name: key,
                },
                enabled,
                feature_state_value,
              },
            ],
            traits: [
              {
                trait_key: key,
                trait_value,
              },
            ],
          });

        service.getUserIdentity(userId).subscribe({
          complete,
          next: result =>
            expect(result).toMatchObject({
              flags: {
                key: {
                  enabled,
                  value: feature_state_value,
                },
              },
              traits: {
                key: trait_value,
              },
            }),
        });
      });
    });

    describe('setTrait()', () => {
      it('should set new trait for user', complete => {
        userId = 'userId';
        key = 'key';
        feature_state_value = faker.random.arrayElement([
          faker.datatype.string(),
          faker.datatype.number(),
          faker.datatype.boolean(),
        ]);
        enabled = faker.datatype.boolean();
        let trait_value = faker.datatype.string();

        nock(url)
          .post('/traits/', {
            identity: { identifier: userId },
            trait_key: key,
            trait_value,
          })
          .reply(200, { success: true })
          .get('/identities/')
          .query({ identifier: userId })
          .reply(200, {
            flags: [
              {
                feature: {
                  name: key,
                },
                enabled,
                feature_state_value,
              },
            ],
            traits: [
              {
                trait_key: key,
                trait_value,
              },
            ],
          });

        service.setTrait(userId, key, trait_value).subscribe({
          complete,
          next: result =>
            expect(result).toMatchObject({
              flags: {
                key: {
                  enabled,
                  value: feature_state_value,
                },
              },
              traits: {
                key: trait_value,
              },
            }),
        });
      });
    });
  });
});
