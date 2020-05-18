var setter=function(a,b,c,d){let e=0;for(let f=0;f<a.tokens.length;f+=c,e+=1)0===a.tokens[f+2]&&(a.tokens[f+2]=b[e]<<d)};module.exports=setter;
