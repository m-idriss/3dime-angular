// src/app/libs/ical-wrapper.ts
import ICALModule from 'ical.js';
const ICAL: any = (ICALModule as any).default || ICALModule; // ensures parse is available
export default ICAL;
