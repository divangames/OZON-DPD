// Развёртывание отдельного сайта в /var/www/OZON-DPD через SFTP.
const fs=require('node:fs');
const path=require('node:path');
const {Client}=require('ssh2');
const root=path.resolve(__dirname,'..');
const target='/var/www/OZON-DPD';
const source=path.join(root,'dist');
// Читает локальные данные VPS; файл никогда не входит в Git и dist.
function getAccess(){
 const raw=fs.readFileSync(path.join(root,'info/VPS.txt'),'utf8');
 const field=name=>raw.match(new RegExp(`${name}:\\s*(.*)`))?.[1]?.trim();
 const host=process.env.VPS_HOST||field('Адрес');
 const username=process.env.VPS_USER||field('Логин');
 const password=process.env.VPS_PASSWORD||field('Пароль');
 if(!host||!username||!password)throw new Error('Проверьте локальный info/VPS.txt.');
 return{host,username,password};
}
// Выполняет удалённую команду и проверяет код завершения.
function execute(conn,cmd){return new Promise((resolve,reject)=>conn.exec(cmd,(error,stream)=>{if(error)return reject(error);let output='';stream.on('data',d=>output+=d);stream.stderr.on('data',d=>output+=d);stream.on('close',code=>code===0?resolve(output):reject(new Error(output)));}));}
// Загружает дерево сборки без удаления существующих файлов сервера.
async function upload(sftp,local,remote){
 await new Promise((resolve,reject)=>sftp.mkdir(remote,error=>error&&error.code!==4?reject(error):resolve()));
 // Главная страница публикуется после ресурсов, включая новые видео.
 const items=fs.readdirSync(local,{withFileTypes:true}).sort((a,b)=>Number(a.name==='index.html')-Number(b.name==='index.html'));
 for(const item of items){
  const from=path.join(local,item.name),to=`${remote}/${item.name}`;
  if(item.isDirectory())await upload(sftp,from,to);
  else await new Promise((resolve,reject)=>sftp.fastPut(from,to,error=>error?reject(error):resolve()));
 }
}
if(!fs.existsSync(path.join(source,'index.html')))throw new Error('Сначала выполните npm run build.');
const conn=new Client();
conn.on('ready',async()=>{try{
 await execute(conn,`mkdir -p ${target}`);
 const sftp=await new Promise((resolve,reject)=>conn.sftp((error,value)=>error?reject(error):resolve(value)));
 await upload(sftp,source,target);
 console.log(`Сборка загружена: ${target}`);
 console.log('Проверьте адрес сайта, настроенный в Nginx.');
}catch(error){console.error(error.message);process.exitCode=1;}finally{conn.end();}}).on('error',error=>{console.error(error.message);process.exitCode=1;}).connect(getAccess());
