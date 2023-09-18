import { Link } from '@tanstack/react-router';
import {
  ethereumLoginRoute,
  homeRoute,
  nationalLoginRoute,
  selectCredentialRoute,
} from '../router';

export function Navigator() {
  return (
    <div className="navigation">
      <Link to={homeRoute.id}>Index</Link>{' '}
      <Link to={selectCredentialRoute.id}>Authorize</Link>{' '}
      <Link to={ethereumLoginRoute.id}>Ethereum Login</Link>{' '}
      <Link to={nationalLoginRoute.id}>National Login</Link>
    </div>
  );
}
