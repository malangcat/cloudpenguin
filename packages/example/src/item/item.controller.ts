import { get, ok, post, controller } from '@cloudpenguin/core';
import { Env } from '../env.interface';
import { addItemSchema } from './schemas/item.schema';

export const itemController = controller((env: Env) => {
  const getItems = get('/items', {}, async () => {
    const items = [
      {
        name: 'hello',
        amount: 1,
      },
    ];
    return ok(items);
  });

  const addItems = post(
    '/items',
    {
      body: addItemSchema,
    },
    async ({ body: addItemDto }) => {
      console.log(addItemDto.name);
      console.log(addItemDto.amount);
      return ok({ result: 'success' });
    }
  );

  return [getItems, addItems];
});
