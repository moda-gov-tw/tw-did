import { Link } from '@tanstack/react-router';
import {
  ethereumLoginRoute,
  homeRoute,
  selectCredentialRoute,
} from '../router';

export function Navigator() {
  return (
    <div className="navigation">
      <Link to={homeRoute.id}>Index</Link>{' '}
      <Link to={selectCredentialRoute.id}>Authorize</Link>{' '}
      <Link to={ethereumLoginRoute.id}>Login</Link>
    </div>
  );
}
