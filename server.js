const http=require('http');
const express=require('express');
const app=express();
const server=http.createServer(app);
const bodyParser=require('body-parser');
/* const cookieParser=require('cookie-parser'); */


server.listen(process.env.PORT || 3000 ,function(){
  console.log("up and running on port "+process.env.PORT);
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
