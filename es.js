/*! (c) Andrea Giammarchi */
const{max:t,min:e}=Math,{fromCharCode:r}=String,n=n=>{let s=0,a=1/0;const o=[];for(const l of(t=>{let e=0;const n=new Map;return t.replace(/\S+/g,(t=>{if(!n.has(t)){let s="";do{s=r(e++)}while(/[\r\n\t ]/.test(s));n.set(t,s)}return n.get(t)}))})(n).split(/[\r\n]+/)){const r=l.trimEnd().length;r&&(s=t(s,r),a=e(a,l.length-l.trimStart().length),o.push(l))}return o.map((t=>t.slice(a).padEnd(s-a))).join("\n")};var s=t=>{let e="",r=[];const s=[r];for(const a of n(t))switch(a){case" ":case"\t":a===e?(e="",r.push(".")):e=a;break;case"\n":s.push(r=[]);break;default:e=a,r.push("g"+a.charCodeAt(0))}const a=s.flat().filter((t=>"."!==t));return t=s.map((t=>`'${t.join(" ")}'`)).join(" "),{applyTo(e){let r=0;const n=new Map,{children:s,style:o}=e;o.display="grid",o["grid-template-areas"]=t;for(const t of a)if(!n.has(t)){const e=s[r++];e.style["grid-area"]=t,n.set(t,e)}return e},cssFor(e){let r=0;const n=new Set,s=[`${e}{display:grid;grid-template-areas:${t}}`];for(const t of a)n.has(t)||(s.push(`${e}>*:nth-child(${++r}){grid-area:${t}}`),n.add(t));return s.join("\n")}}};export{s as default};
