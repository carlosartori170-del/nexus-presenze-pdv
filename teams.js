import {esc} from './core.js';
let generation=0,selected=8;
export async function teamPage(ctx){
 const ticket=++generation,{me,api,modal,closeModal,action,message,isCurrent}=ctx;
 const shops=me.negozi_squadre||[];if(!shops.length)throw new Error('Gestione squadre non autorizzata.');
 if(!shops.some(s=>s.id===selected))selected=shops[0].id;
 const shopId=selected;
 const [data,people]=await Promise.all([api('squadre_elenco',{pdv:shopId}),api('persone')]);
 if(ticket!==generation||!isCurrent())return;
 const $=id=>document.getElementById(id),shop=shops.find(s=>s.id===shopId),enabled=data.righe.filter(r=>r.attivo);
 $('content').innerHTML=`<div class="page-head"><div><p class="eyebrow" style="color:var(--green)">ANAGRAFICA OPERATIVA</p><h1>Squadre abituali</h1><p class="muted">Le persone della squadra compaiono nel foglio giornaliero del negozio.</p></div><button id="team-add" class="primary">Aggiungi persona</button></div><div class="card filters"><label>Punto vendita<select id="team-store">${shops.map(s=>`<option value="${s.id}" ${s.id===shopId?'selected':''}>${esc(s.nome)} · ${s.id}</option>`).join('')}</select></label><label>Cerca nella squadra<input id="team-search" type="search" placeholder="Nome o cognome"></label></div><section class="card team-card"><div class="card-title"><h2>${esc(shop.nome)}</h2><span class="muted small">${enabled.length} ${enabled.length===1?'persona abilitata':'persone abilitate'}</span></div><div class="table-wrap"><table><thead><tr><th>Persona</th><th></th></tr></thead><tbody>${enabled.map(r=>`<tr data-team-row data-name="${esc(r.nome.toLocaleLowerCase('it'))}"><td><strong>${esc(r.nome)}</strong></td><td><button data-team-delete="${esc(r.id)}" aria-label="Elimina ${esc(r.nome)} dalla squadra">Elimina</button></td></tr>`).join('')}</tbody></table></div>${enabled.length?'':'<p class="empty">Nessuna persona abilitata. Usa “Aggiungi persona” per comporre la squadra.</p>'}<p class="small muted" id="team-no-match" hidden>Nessuna persona corrisponde alla ricerca.</p></section>`;
 $('team-store').onchange=()=>{selected=Number($('team-store').value);action(()=>teamPage(ctx));};
 $('team-search').oninput=()=>{const term=$('team-search').value.trim().toLocaleLowerCase('it');const rows=[...document.querySelectorAll('[data-team-row]')];rows.forEach(r=>r.hidden=!r.dataset.name.includes(term));$('team-no-match').hidden=rows.some(r=>!r.hidden)||!rows.length;};
 document.querySelectorAll('[data-team-delete]').forEach(b=>b.onclick=()=>action(async()=>{
  await api('squadra_elimina',{pdv:shopId,revisione:data.revisione,id:b.dataset.teamDelete},true);
  await teamPage(ctx);message('Persona eliminata dalla squadra.');
 }));
 $('team-add').onclick=()=>{
  const choices=people.filter(p=>p.attivo===true&&!enabled.some(r=>r.persona===p.id));let person=null;
  modal(`<h2>Aggiungi persona</h2><p class="muted">${esc(shop.nome)}</p><label>Cerca nella rete<input id="team-person-search" type="search" placeholder="Nome o cognome" autocomplete="off"></label><div id="helper-list" role="radiogroup" aria-label="Persone da aggiungere alla squadra"></div><p id="team-error" role="alert"></p><div class="modal-actions"><button data-close>Annulla</button><button id="team-confirm-add" class="primary" disabled>Aggiungi</button></div>`);
  const render=()=>{
   const term=$('team-person-search').value.trim().toLocaleLowerCase('it');const filtered=choices.filter(p=>p.nome.toLocaleLowerCase('it').includes(term));
   if(!filtered.some(p=>p.id===person))person=null;
   $('helper-list').innerHTML=filtered.map(p=>`<label class="helper-choice"><input type="radio" name="team-person" value="${p.id}" ${p.id===person?'checked':''}><span>${esc(p.nome)}</span></label>`).join('')||'<p class="empty">Nessuna persona attiva da aggiungere corrisponde alla ricerca.</p>';
   $('team-confirm-add').disabled=person===null;
   $('helper-list').querySelectorAll('input').forEach(input=>input.onchange=()=>{person=Number(input.value);$('team-confirm-add').disabled=false;});
  };
  $('team-person-search').oninput=render;render();
  $('team-confirm-add').onclick=()=>action(async()=>{try{
   if(!choices.some(p=>p.id===person))return;
   await api('squadra_aggiungi',{pdv:shopId,revisione:data.revisione,persona:person},true);
   closeModal();await teamPage(ctx);message('Persona aggiunta alla squadra.');
  }catch(e){if($('team-error'))$('team-error').textContent=e.message;throw e;}});
 };
}
