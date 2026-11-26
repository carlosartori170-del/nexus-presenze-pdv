// Same calculation as Gestionale Rete / calcolaPremioProduttivita:
// max(0, gross hours - configured alignment hours), then total parcels / total net hours.
const numeric=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
export function netDay(row){
 const complete=row.completo===true&&numeric(row.minuti)&&numeric(row.colli)&&typeof row.allineamento==='boolean'&&(!row.allineamento||numeric(row.ore_allineamento));
 if(!complete)return {complete:false,netHours:null,alignmentHours:null,rate:null};
 const alignmentHours=row.allineamento?row.ore_allineamento:0;
 const netHours=Math.max(0,row.minuti/60-alignmentHours);
 return {complete:true,alignmentHours,netHours,rate:netHours>0?row.colli/netHours:null};
}
export function netPeriod(rows){
 const days=rows.map(netDay),incomplete=days.filter(d=>!d.complete).length,drafts=rows.filter(r=>r.stato!=='confermata').length;
 if(!rows.length||incomplete)return {complete:false,incomplete,drafts,parcels:null,netHours:null,rate:null};
 const parcels=rows.reduce((s,r)=>s+r.colli,0),netHours=days.reduce((s,d)=>s+d.netHours,0);
 return {complete:true,incomplete:0,drafts,parcels,netHours,rate:netHours>0?parcels/netHours:null};
}
export const rateLabel=value=>value===null?'—':new Intl.NumberFormat('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
