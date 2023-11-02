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
  enableValidation: boolean;
}

export interface VeramoConfig {
  infuraProjectId: string;
  ethrNetwork: string;
}

export interface ServerConfig {
  apiPrefix: string;
}

class MissingEnvVarsError extends Error {
  constructor(missingVars: string[]) {
    const message = `The following environment variables are required but were not provided: ${missingVars.join(
      ', '
    )}`;
    super(message);
    this.name = 'MissingEnvVarsError';
    Object.setPrototypeOf(this, MissingEnvVarsError.prototype);
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
      enableValidation: process.env.TWFIDO_ENABLE_VALIDATION !== '0',
    },
    veramo: {
      infuraProjectId: process.env.VERAMO_INFURA_PROJECT_ID,
      ethrNetwork: process.env.VERAMO_ETHR_NETWORK,
    },
    server: {
      apiPrefix: process.env.SERVER_API_PREFIX || 'http://localhost:3000/api',
    },
  };

  const requiredEnvs = [
    'MONGO_DATABASE_USERNAME',
    'MONGO_DATABASE_PASSWORD',
    'MONGO_HOST',
    'MONGO_DATABASE',
    'TWFIDO_API_URL',
    'VERAMO_INFURA_PROJECT_ID',
    'VERAMO_ETHR_NETWORK',
  ];

  const missingEnvs = requiredEnvs.filter(
    (envVar) => typeof process.env[envVar] === 'undefined'
  );

  if (missingEnvs.length > 0) {
    throw new MissingEnvVarsError(missingEnvs);
  }

  return config;
}
