const http=require('http');
const fs=require('fs');
var requests=require('requests');


const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
   let temperature=tempVal.replace("{%tempval%}", orgVal.main.temp);
   temperature=temperature.replace("{%tempmin%}", orgVal.main.temp_min);
   temperature=temperature.replace("{%tempmax%}", orgVal.main.temp_max);
   temperature=temperature.replace("{%location%}", orgVal.name);
   temperature=temperature.replace("{%country%}", orgVal.sys.country);
   temperature=temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
   return temperature;
};

const server=http.createServer((req,res)=>{
    if(req.url=='/'){
      requests("http://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=0b6058fb8e1f5af2463ec36f7ce7bee3")
      .on('data',(chunk)=>{
          const objData=JSON.parse(chunk);
          const arrData=[objData];
         const realTimeData=arrData.map((val) => replaceVal(homeFile, val)).join("");
         res.write(realTimeData);
       })
      .on('end',(err)=>{
      if (err) return console.log('connection closed due to errors', err);
       res.end();
      console.log('end');
      });
    }
    else
      res.write("<h1>Error 404</h1><br/> Page not Found")
});

server.listen(8000,"localhost");