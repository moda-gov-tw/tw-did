export const ShortenAddr = ({ addr }: { addr: string }) => (
  <>{addr.slice(0, 4) + '...' + addr.slice(-4)}</>
);
export const ShortenID = ({ id }: { id: string }) => (
  <> {id.split(':')[3].slice(0, 4) + '...' + id.slice(-4)}</>
);
