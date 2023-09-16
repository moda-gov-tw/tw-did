import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;
window.process = { browser: true, env: { NODE_DEBUG: false } } as any;
