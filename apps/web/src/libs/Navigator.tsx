import { Link } from '@tanstack/react-router';
import { homeRoute, selectCredentialRoute } from '../router';

export function Navigator() {
  return (
    <div className="navigation">
      <Link to={homeRoute.id}>Index</Link>{' '}
      <Link to={selectCredentialRoute.id}>Authorize</Link>
    </div>
  );
}
