import flagsmith, {
  getFlags,
  getTrait,
  getValue,
  setTrait,
  hasFeature,
  getUserIdentity,
  getFlagsForUser,
} from 'flagsmith-nodejs';
import { from, Observable, of } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';

import { FLAGSMITH_INSTANCE_TOKEN } from './flagsmith.constant';

@Injectable()
export class FlagsmithService {
  @Inject(FLAGSMITH_INSTANCE_TOKEN)
  private flagsmith: typeof flagsmith;

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
    return from(this.flagsmith.hasFeature(...params));
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
    return from(this.flagsmith.getValue(...params));
  }

  getTrait(
    ...params: Parameters<typeof getTrait>
  ): Observable<
    ReturnType<typeof getTrait> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.getTrait(...params));
  }

  getFlags(
    ...params: Parameters<typeof getFlags>
  ): Observable<
    ReturnType<typeof getFlags> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.getFlags(...params));
  }

  getFlagsForUser(
    ...params: Parameters<typeof getFlagsForUser>
  ): Observable<
    ReturnType<typeof getFlagsForUser> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.getFlagsForUser(...params));
  }

  getUserIdentity(
    ...params: Parameters<typeof getUserIdentity>
  ): Observable<
    ReturnType<typeof getUserIdentity> extends Promise<infer T> ? T : never
  > {
    return from(this.flagsmith.getUserIdentity(...params));
  }

  setTrait(
    ...params: Parameters<typeof setTrait>
  ): Observable<ReturnType<typeof setTrait>> {
    return of(this.flagsmith.setTrait(...params));
  }
}
