import { z, ZodTypeAny } from 'zod';
import { Req } from './type';

export interface RouteDefinition {
  method: 'get' | 'post';
  path: string;
  options: {
    body?: ZodTypeAny;
  };
  handler: (payload: { req: Req; body?: any }) => Response | Promise<Response>;
}

export function get(
  path: string,
  options: {},
  handler: (payload: { req: Req }) => Response | Promise<Response>
): RouteDefinition {
  return {
    method: 'get',
    path,
    options,
    handler,
  };
}

export function post<T extends ZodTypeAny>(
  path: string,
  options: {
    body?: T;
  },
  handler: (payload: {
    req: Req;
    body: z.infer<T>;
  }) => Response | Promise<Response>
): RouteDefinition {
  return {
    method: 'post',
    path,
    options,
    handler,
  } as RouteDefinition;
}
