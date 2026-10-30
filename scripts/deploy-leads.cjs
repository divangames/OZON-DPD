// Deploys only this site's form endpoint. Credentials stay outside dist and logs.
const fs=require('node:fs');
const path=require('node:path');
const {Client}=require('ssh2');
const root=path.resolve(__dirname,'..');
const raw=fs.readFileSync(path.join(root,'info/VPS.txt'),'utf8');
const field=name=>raw.match(new RegExp(`${name}:\\s*(.*)`))?.[1]?.trim();
const config=Object.fromEntries(fs.readFileSync(path.join(root,'info/Telegram.txt'),'utf8').split(/\r?\n/).filter(line=>line.includes('=')).map(line=>{const i=line.indexOf('=');return[line.slice(0,i).trim(),line.slice(i+1).trim()]}));
if(!/^\d{6,}:[A-Za-z0-9_-]{20,}$/.test(config.TELEGRAM_BOT_TOKEN||'')||!/^[-\d]+$/.test(config.TELEGRAM_CHAT_ID||''))throw new Error('Проверьте локальный info/Telegram.txt.');
const env=`TELEGRAM_BOT_TOKEN=${config.TELEGRAM_BOT_TOKEN}\nTELEGRAM_CHAT_ID=${config.TELEGRAM_CHAT_ID}\nLEADS_ORIGIN=https://dpd-ozon.ru\n`;
const conn=new Client();
function exec(command){return new Promise((resolve,reject)=>conn.exec(command,(error,stream)=>{if(error)return reject(error);let output='';stream.on('data',data=>output+=data);stream.stderr.on('data',data=>output+=data);stream.on('close',code=>code===0?resolve(output):reject(new Error(output)));}));}
function read(sftp,file){return new Promise((resolve,reject)=>{let data='';const stream=sftp.createReadStream(file,{encoding:'utf8'});stream.on('data',chunk=>data+=chunk);stream.on('end',()=>resolve(data));stream.on('error',reject);});}
function write(sftp,file,content,mode=0o644){return new Promise((resolve,reject)=>{const stream=sftp.createWriteStream(file,{mode});stream.on('close',resolve);stream.on('error',reject);stream.end(content);});}
conn.on('ready',async()=>{let backup;try{
 const sftp=await new Promise((resolve,reject)=>conn.sftp((e,s)=>e?reject(e):resolve(s)));
 await exec('install -d -m 755 /opt/ozon-dpd-leads && install -d -m 700 -o www-data -g www-data /var/lib/ozon-dpd-leads');
 await write(sftp,'/opt/ozon-dpd-leads/leads.py',fs.readFileSync(path.join(root,'server/leads.py')));
 await write(sftp,'/etc/systemd/system/ozon-dpd-leads.service',fs.readFileSync(path.join(root,'deploy/ozon-dpd-leads.service')));
 await write(sftp,'/etc/ozon-dpd-leads.env',env,0o600);
 await exec('chmod 600 /etc/ozon-dpd-leads.env && systemctl daemon-reload && systemctl enable ozon-dpd-leads >/dev/null && systemctl restart ozon-dpd-leads');
 const file='/etc/nginx/sites-available/ozon-dpd';const original=await read(sftp,file);
 if(!original.includes('location = /api/leads')){
  const anchor='    location / { try_files $uri $uri/ =404; }';
  if(!original.includes(anchor))throw new Error('Не найдена ожидаемая HTTPS-конфигурация сайта.');
  const location=`    location = /api/leads {\n        limit_except POST { deny all; }\n        client_max_body_size 8k;\n        proxy_pass http://127.0.0.1:4192;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_read_timeout 15s;\n    }\n`;
  backup=`${file}.backup-${Date.now()}`;await write(sftp,backup,original,0o600);await write(sftp,file,original.replace(anchor,location+anchor));
 }
 try{await exec('nginx -t && systemctl reload nginx');}catch(error){if(backup){await exec(`cp ${backup} /etc/nginx/sites-available/ozon-dpd && nginx -t && systemctl reload nginx`);}throw error;}
 console.log(await exec('systemctl is-active ozon-dpd-leads; curl --retry 5 --retry-connrefused --retry-delay 1 -fsS http://127.0.0.1:4192/health'));
 console.log('Обработчик Telegram опубликован. Токен хранится вне сайта.');
}catch(error){console.error(error.message.replace(/\d{6,}:[A-Za-z0-9_-]+/g,'[TOKEN]'));process.exitCode=1;}finally{conn.end();}}).on('error',error=>{console.error(error.message);process.exitCode=1;}).connect({host:field('Адрес'),username:field('Логин'),password:field('Пароль')});
