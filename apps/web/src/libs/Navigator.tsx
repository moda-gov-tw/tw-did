import { Link } from '@tanstack/react-router';
import {
  ethereumLoginRoute,
  homeRoute,
  registerRoute,
  selectCredentialRoute,
  semaphoreRoute,
} from '../router';

export function Navigator() {
  return (
    <div className="navigation">
      <Link to={homeRoute.id}>Index</Link>{' '}
      <Link to={registerRoute.id}>Register</Link>{' '}
      <Link to={ethereumLoginRoute.id}>Ethereum Login</Link>{' '}
      <Link to={semaphoreRoute.id}>Semaphore</Link>{' '}
      <Link to={selectCredentialRoute.id}>Select Credentials</Link>{' '}
    </div>
  );
}
