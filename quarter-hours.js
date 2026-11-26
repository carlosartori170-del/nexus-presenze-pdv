import {esc} from './core.js';
export const quarterTimes=Array.from({length:96},(_,i)=>String(Math.floor(i/4)).padStart(2,'0')+':'+String(i%4*15).padStart(2,'0'));
export function quarterErrors(data){
 return (data.righe||[]).flatMap(r=>(r.intervalli||[]).some(s=>[s.inizio,s.fine].some(v=>v&&!quarterTimes.includes(v.slice(11))))?[`Usa orari al quarto d’ora (:00, :15, :30, :45) per ${r.nome}.`]:[]);
}
export function timeSelect(part,value=''){
 const legacy=value&&!quarterTimes.includes(value);
 return `<select data-part="${part}" data-initial-time="${esc(value)}" aria-label="${part==='at'?'Ora entrata':'Ora uscita'}"><option value="">—:—</option>${legacy?`<option value="${esc(value)}" selected disabled>${esc(value)} · da correggere</option>`:''}${quarterTimes.map(t=>`<option value="${t}" ${t===value?'selected':''}>${t}</option>`).join('')}</select>`;
}

export function initializeTimeSelects(root){
 root.querySelectorAll('select[data-initial-time]').forEach(s=>{s.value=s.dataset.initialTime;delete s.dataset.initialTime;});
}
