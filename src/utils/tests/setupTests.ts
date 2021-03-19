import 'es6-shim';
import 'reflect-metadata';
import { loadEnvVars } from '../../config/envVars';

export default async function (): Promise<void> {
  loadEnvVars();
}
