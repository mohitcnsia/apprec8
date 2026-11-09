import fs from "fs";
const root = process.argv[2];
let tot=0, bad=0; const per={}; const ex=[];
for (const u of ["b1","b2","b3","b4","b5","b6"]) {
  const src = fs.readFileSync(`${root}/data/englishQuest/units/${u}.js`,"utf8");
  const re = /t\("([^"]*)",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*\[(.*?)\]\],/g;
  let m; per[u]=[0,0];
  while ((m = re.exec(src))) {
    const [ , , stem, correct, opts] = m;
    const ore = /\["((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)"/g; let o;
    while ((o = ore.exec(opts+"]"))) {
      tot++; per[u][0]++;
      const why=o[3]; const ctx=(stem+" "+correct+" "+o[1]).toLowerCase().replace(/[’']/g,"'");
      const quoted=[...why.matchAll(/'([^']{2,60})'/g)].map(x=>x[1].toLowerCase());
      const miss=quoted.filter(q=>!ctx.includes(q.replace(/\.\.\./g,"").trim()) && !/→|e\.g\./.test(q));
      if (miss.length){bad++; per[u][1]++; if(ex.length<6) ex.push(`${u}: "${stem.slice(0,70)}" | opt "${o[1].slice(0,50)}" | why quotes ${JSON.stringify(miss)}`);}
    }
  }
}
console.log({tot,bad,per}); console.log(ex.join("\n"));
