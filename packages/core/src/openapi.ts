import { generateSchema } from '@anatine/zod-openapi';
import { IHTTPMethods, Router } from 'itty-router';
import { OpenApiBuilder, PathItemObject } from 'openapi3-ts';
import { Controller } from './controller';
import { ok } from './response';

export function openapi(
  router: Router<Request, IHTTPMethods>,
  controllers: Controller[],
  env: unknown
) {
  router.get('/openapi.json', () => {
    const builder = new OpenApiBuilder();
    builder.addOpenApiVersion('3.0.0');

    const paths: Record<string, PathItemObject> = {};
    controllers.forEach((controller) => {
      const routes = controller(env);
      routes.forEach((route) => {
        paths[route.path] = {
          ...(paths[route.path] ?? {}),
          [route.method]: {
            requestBody: route.options.body
              ? {
                  content: {
                    'application/json': {
                      schema: generateSchema(route.options.body),
                    },
                  },
                }
              : undefined,
            responses: [],
          },
        };
      });
    });

    Object.entries(paths).forEach(([path, obj]) => {
      builder.addPath(path, obj);
    });
    return ok(builder.getSpecAsJson());
  });

  router.get('/docs', () => {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="SwaggerUI"
        />
        <title>SwaggerUI</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
      </head>
      <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: 'http://localhost:8787/openapi.json',
            dom_id: '#swagger-ui',
          });
        };
      </script>
      </body>
      </html>`,
      {
        headers: {
          'content-type': 'text/html',
        },
      }
    );
  });
}
