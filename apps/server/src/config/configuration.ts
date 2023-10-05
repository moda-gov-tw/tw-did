export interface Config {
  mongo: MongoConfig;
  twfido: TwFidoConfig;
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

class PropertyNotFoundError extends Error {
  constructor(missingProperties: string[]) {
    const missings = missingProperties.join(', ');
    super(`The following properties could not be found: ${missings}`);
    this.name = 'PropertyNotFoundError';
    Object.setPrototypeOf(this, PropertyNotFoundError.prototype);
  }
}

export function getConfig(): Config {
  const config = {
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
  };

  const missingProperties = Object.keys(config.mongo).filter(
    (key) => !config.mongo[key]
  );

  if (missingProperties.length > 0) {
    throw new PropertyNotFoundError(missingProperties);
  }

  return config;
}
