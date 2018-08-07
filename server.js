const http=require('http');
const express=require('express');
const app=express();
const server=http.createServer(app);
const bodyParser=require('body-parser');
/* const cookieParser=require('cookie-parser'); */


server.listen(8080,()=>{
  console.log('listening 80801');
});

 app.use(bodyParser.urlencoded({
     extended: true
 }));
app.use(bodyParser.json());
/* app.use(cookieParser()); */
app.use(express.static(__dirname));

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index.html');
});
