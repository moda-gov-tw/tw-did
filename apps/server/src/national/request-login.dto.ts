export class RequestLoginDto {
  nationalId: string;
  method: 'QRCODE' | 'NOTIFY';
}
