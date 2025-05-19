// Script to generate API client using openapi-typescript-codegen
import pkg from 'openapi-typescript-codegen';
import path from 'path';
import { fileURLToPath } from 'url';

const { generateApi } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for API generation
const options = {
  input: path.resolve(__dirname, 'openapi.yaml'),
  output: path.resolve(__dirname, 'lib/generated/api'),
  httpClient: 'axios',
  useOptions: true,
  useUnionTypes: true,
  exportCore: true,
  exportServices: true,
  exportModels: true,
  exportSchemas: false,
  indent: '  ',
  modelPropertyNaming: 'original',
  supportsES6: true,
  npmName: 'api-client',
  withSeparateModelsAndApi: true
};

// Generate the API client
generateApi(options)
  .then(() => {
    console.log('API client generated successfully!');
  })
  .catch(err => {
    console.error('Error generating API client:', err);
    process.exit(1);
  });