function sanitize(body: unknown) {
  return typeof body === 'string' ? body : JSON.stringify(body);
}

export function ok(body: unknown) {
  return new Response(sanitize(body), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function badRequest(body: unknown) {
  return new Response(sanitize(body), {
    status: 400,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function notFound(body: unknown) {
  return new Response(sanitize(body), {
    status: 404,
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function internalServerError(body: unknown) {
  return new Response(sanitize(body), {
    status: 500,
    headers: {
      'content-type': 'application/json',
    },
  });
}
