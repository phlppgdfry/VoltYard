const zones={
 'B-EV-1':{count:480,max:520},'B-EV-2':{count:486,max:520},'C-EV-3':{count:516,max:480},'D-EV-4':{count:481,max:500}
};
document.querySelectorAll('[data-zone]').forEach(button=>button.addEventListener('click',()=>{
 const code=button.dataset.zone,z=zones[code],over=z.count>z.max;
 document.querySelectorAll('[data-zone]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-zone-map]>rect:first-child').forEach(rect=>{rect.style.stroke='none';rect.style.strokeWidth='0';});
 const selected=document.querySelector(`[data-zone-map="${code}"]>rect:first-child`);selected.style.stroke='#164e63';selected.style.strokeWidth='3';
 const status=document.getElementById('zone-status');status.textContent=over?'Capacity exceeded':'Within configured capacity';status.classList.toggle('ok',!over);
 document.getElementById('zone-name').textContent=code+(over?' needs attention.':' has room to move.');
 document.getElementById('zone-description').textContent=over?`${z.count} EVs in a zone configured for ${z.max}. Redistribute vehicles before adding more.`:`${z.count} EVs against a configured limit of ${z.max}. ${z.max-z.count} spaces remain within the EV limit.`;
 const link=document.getElementById('zone-link');link.href='demo/?zone='+encodeURIComponent(code)+'#safety';link.setAttribute('aria-label',`Explore ${code} in the demo`);
}));
