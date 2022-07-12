import { IHTTPMethods, Router } from 'itty-router';
import { Controller } from './controller';
import { BadRequestException, NotFoundException } from './error';
import { handleOptions } from './handle-options';
import { openapi } from './openapi';
import { badRequest, internalServerError, notFound } from './response';
import { Req } from './type';

export function create(controllers: Controller[], options: { cors: boolean }) {
  const router = Router<Request, IHTTPMethods>();

  return (request: Request, env: unknown, ctx: unknown) => {
    if (options.cors) {
      if (request.method === 'OPTIONS') {
        return handleOptions(request);
      }
    }

    controllers.forEach((controller) => {
      const routes = controller(env);
      routes.forEach((route) =>
        router[route.method](route.path, async (req: Req) => {
          if (route.options.body) {
            const result = route.options.body.safeParse(await req.json());
            if (!result.success) {
              return badRequest(result.error.issues);
            }
            return route.handler({ req, body: result.data });
          }
          return route.handler({ req });
        })
      );
    });

    openapi(router, controllers, env);

    router.all('*', () => notFound('404, not found!'));

    return router
      .handle(request, env, ctx)
      .catch((error) => {
        if (error instanceof BadRequestException) {
          return badRequest({ error: error.message });
        }
        if (error instanceof NotFoundException) {
          return notFound({ error: error.message });
        }
        return internalServerError({ error: 'Internal Server Error' });
      })
      .then((response: Response) => {
        if (!response.headers.get('Content-Type')) {
          response.headers.set('Content-Type', 'application/json');
        }
        if (options.cors) {
          response.headers.set('Access-Control-Allow-Origin', '*');
        }
        return response;
      });
  };
}
