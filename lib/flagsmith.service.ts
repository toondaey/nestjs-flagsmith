import {
  getFlags,
  getTrait,
  getValue,
  setTrait,
  hasFeature,
  getFlagsForUser,
  getUserIdentity,
} from 'flagsmith-nodejs';
import { from, Observable } from 'rxjs';
import * as flagsmith from 'flagsmith-nodejs';
import { Inject, Injectable } from '@nestjs/common';

import { FLAGSMITH_INSTANCE_TOKEN } from './flagsmith.constant';

@Injectable()
export class FlagsmithService {
  @Inject(FLAGSMITH_INSTANCE_TOKEN)
  private readonly flagsmith!: typeof flagsmith;

  hasFeature(
    key: string,
  ): Observable<
    ReturnType<typeof hasFeature> extends Promise<infer T> ? T : never
  >;
  hasFeature(
    key: string,
    userId: string,
  ): Observable<
    ReturnType<typeof hasFeature> extends Promise<infer T> ? T : never
  >;
  hasFeature(
    ...params: Partial<Parameters<typeof hasFeature>>
  ): Observable<
    ReturnType<typeof hasFeature> extends Promise<infer T> ? T : never
  > {
    return from(
      this.flagsmith.hasFeature(
        ...(params as Required<Parameters<typeof hasFeature>>),
      ),
    );
  }

  getValue(
    key: string,
  ): Observable<
    ReturnType<typeof getValue> extends Promise<infer T> ? T : never
  >;
  getValue(
    key: string,
    userId: string,
  ): Observable<
    ReturnType<typeof getValue> extends Promise<infer T> ? T : never
  >;
  getValue(
    ...params: Partial<Parameters<typeof getValue>>
  ): Observable<
    ReturnType<typeof getValue> extends Promise<infer T> ? T : never
  > {
    return from(
      this.flagsmith.getValue(
        ...(params as Required<Parameters<typeof getValue>>),
      ),
    );
  }

  getTrait(
    ...params: Parameters<typeof getTrait>
  ): Observable<
    ReturnType<typeof getTrait> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.getTrait(...params));
  }

  getFlags(): Observable<
    ReturnType<typeof getFlags> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.getFlags());
  }

  getFlagsForUser(
    ...params: Parameters<typeof getFlagsForUser>
  ): Observable<
    ReturnType<typeof getFlagsForUser> extends Promise<infer T>
      ? T
      : never
  > {
    return from(this.flagsmith.getFlagsForUser(...params));
  }

  getUserIdentity(
    ...params: Parameters<typeof getUserIdentity>
  ): Observable<
    ReturnType<typeof getUserIdentity> extends Promise<infer T>
      ? T
      : never
  > {
    return from(this.flagsmith.getUserIdentity(...params));
  }

  setTrait(
    ...params: Parameters<typeof setTrait>
  ): Observable<
    ReturnType<typeof setTrait> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.setTrait(...params) as never);
  }
}
