import { knexSnakeCaseMappers } from 'objection';
import knexfile from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knex = environment === 'test' ? knexfile.test : knexfile.development;

export const PORT = process.env.PORT || 4000;

export const JWT_SECRET = process.env.JWT_SECRET;

export const KNEX_CONFIG = {
  ...knex,
  ...knexSnakeCaseMappers(),
};