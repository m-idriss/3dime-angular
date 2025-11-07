// src/app/libs/ical-wrapper.ts
import ICALModule from 'ical.js';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICAL: any = (ICALModule as any).default || ICALModule; // ensures parse is available
export default ICAL;
