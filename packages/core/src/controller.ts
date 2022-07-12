import { RouteDefinition } from './route';

export function controller(fn: (env: any) => RouteDefinition[]) {
  return fn;
}

export type Controller = (env: any) => RouteDefinition[];
