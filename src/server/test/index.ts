import * as Hapi from '@hapi/hapi';
import { Plugin } from '@hapi/hapi';
import Route from './routes';

async function register(server: Hapi.Server): Promise<void> {
  Route(server);
}

const TestPlugin: Plugin<object> = {
  name: 'Test',
  version: '1.0.0',
  register,
};

export default TestPlugin;
