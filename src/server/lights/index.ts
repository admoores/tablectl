import * as Hapi from '@hapi/hapi';
import { Plugin } from '@hapi/hapi';
import Route from './routes';

async function register(server: Hapi.Server): Promise<void> {
  Route(server);
}

const LightsPlugin: Plugin<object> = {
  name: 'Lights',
  version: '1.0.0',
  register,
};

export default LightsPlugin;
