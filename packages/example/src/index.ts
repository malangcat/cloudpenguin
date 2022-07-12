import { itemController } from './item/item.controller';
import { create } from '@cloudpenguin/core';

export default {
  fetch: create([itemController], { cors: true }),
};
