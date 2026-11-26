import {addDays} from './core.js';

// Proposals only: the payload still contains both explicit local datetimes.
export function proposeDates(reference, row, previous = null) {
 let ad = reference;
 if (previous?.bt && previous?.bd) {
  ad = previous.bd;
  if (row.at && row.at < previous.bt) ad = addDays(ad, 1);
 }
 if (row.manualStart) ad = row.ad;
 let bd = ad;
 // Equal times remain invalid, rather than silently creating a 24-hour shift.
 if (ad && row.at && row.bt && row.bt < row.at) bd = addDays(ad, 1);
 if (row.manualEnd) bd = row.bd;
 return {...row, ad, bd};
}

export function restoreDateModes(reference, intervals) {
 const rows = [];
 for (const interval of intervals) {
  const row = {at:(interval.inizio||'').slice(11,16), bt:(interval.fine||'').slice(11,16), manualStart:false, manualEnd:false};
  const previous = rows.at(-1);
  let proposed = proposeDates(reference,row,previous);
  const ad = (interval.inizio||'').slice(0,10), bd = (interval.fine||'').slice(0,10);
  if (ad && ad !== proposed.ad) {row.ad=ad;row.manualStart=true;proposed=proposeDates(reference,row,previous);}
  if (bd && bd !== proposed.bd) {row.bd=bd;row.manualEnd=true;}
  rows.push(proposeDates(reference,row,previous));
 }
 return rows;
}
