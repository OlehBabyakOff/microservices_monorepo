import configs from './configs/index.js';

if (configs.CLUSTER) {
  import('./cluster.js');
} else {
  import('./server.js');
}

