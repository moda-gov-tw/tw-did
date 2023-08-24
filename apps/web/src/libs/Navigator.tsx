import { Link } from '@tanstack/react-router';
import { homeRoute, authorizeRoute } from '../router';

export function Navigator() {
  return (
    <div className="navigation">
      <Link to={homeRoute.id}>Index</Link>{' '}
      <Link to={authorizeRoute.id}>Authorize</Link>
    </div>
  );
}
