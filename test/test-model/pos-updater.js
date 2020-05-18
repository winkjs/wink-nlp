var updater=function(a,b,c){var d=b.cache;for(let e=0;e<a.length;e+=1){const f=a[e][2],g=a[e][0];0>f?c[g]=Math.abs(f):d.isMemberPOS(b.tokens[4*g],f)&&(c[g]=f)}};module.exports=updater;
