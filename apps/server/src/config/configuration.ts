export interface Config {
  mongo: MongoConfig;
  twfido: TwFidoConfig;
  veramo: VeramoConfig;
  server: ServerConfig;
}

export interface MongoConfig {
  username: string;
  password: string;
  host: string;
  database: string;
}

export interface TwFidoConfig {
  apiKey: string;
  serviceId: string;
  apiUrl: string;
}

export interface VeramoConfig {
  infuraProjectId: string;
  ethrNetwork: string;
}

export interface ServerConfig {
  apiPrefix: string;
}

class PropertyNotFoundError extends Error {
  constructor(missingProperties: string[]) {
    const missings = missingProperties.join(', ');
    super(`The following properties could not be found: ${missings}`);
    this.name = 'PropertyNotFoundError';
    Object.setPrototypeOf(this, PropertyNotFoundError.prototype);
  }
}

export function getConfig(): Config {
  const config: Config = {
    mongo: {
      username: process.env.MONGO_DATABASE_USERNAME,
      password: process.env.MONGO_DATABASE_PASSWORD,
      host: process.env.MONGO_HOST,
      database: process.env.MONGO_DATABASE,
    },
    twfido: {
      serviceId: process.env.TWFIDO_SERVICE_ID,
      apiKey: process.env.TWFIDO_API_KEY,
      apiUrl: process.env.TWFIDO_API_URL,
    },
    veramo: {
      infuraProjectId: process.env.VERAMO_INFURA_PROJECT_ID,
      ethrNetwork: process.env.VERAMO_ETHR_NETWORK,
    },
    server: {
      apiPrefix: process.env.SERVER_API_PREFIX || 'http://localhost:3000/api',
    },
  };

  const missingProperties = Object.keys(config.mongo).filter(
    (key) => !config.mongo[key]
  );

  if (missingProperties.length > 0) {
    throw new PropertyNotFoundError(missingProperties);
  }

  return config;
}
