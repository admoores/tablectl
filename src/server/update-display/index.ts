import * as Hapi from '@hapi/hapi';
import { Plugin } from '@hapi/hapi';
import Route from './routes';

async function register(server: Hapi.Server): Promise<void> {
  Route(server);
}

const UpdatePlugin: Plugin<object> = {
  name: 'Update',
  version: '1.0.0',
  register,
};

export default UpdatePlugin;
