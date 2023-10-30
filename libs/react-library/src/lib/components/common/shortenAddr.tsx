import { maskString, truncateAddress } from '../../utils';

export const ShortenAddr = ({ addr }: { addr: string }) =>
  truncateAddress(addr);

export const ShortenId = ({ id }: { id: string }) => maskString(id);
