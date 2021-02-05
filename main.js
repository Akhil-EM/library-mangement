// importing modules
const express=require('express');
const chalk=require('chalk');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const path=require('path');
const {Router}=require('express');

let dateFormat = require('dateformat');

//declare a port
port=1200;
const app=new express();

// importing routers
const libraryRouter=require('./src/routers/Library')();
const memberRouter=require('./src/routers/Members')();
const adminRouter=require('./src/routers/Admin')();
const booksRouter=require('./src/routers/books')();


const db=mongoose.connection;
mongoose.Promise =global.Promise;
app.use(express.static(path.join(__dirname,'/public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) //mandatory (as per the Node docs)
});

// connection string of mongo db
mongoose.connect("mongodb+srv://akhilem:9539770998@cluster0-rmbxp.mongodb.net/library-management?retryWrites=true&w=majority",{
   useNewUrlParser:true,
   useFindAndModify:false,
   useCreateIndex:true,
   useUnifiedTopology:true  
});
db.on('error',(error)=>{
    console.log(chalk.redBright(error));
});
db.once('open',()=>{
    console.log( chalk.yellowBright( "successfully connected with mongodb  :)"));
})



// entry point of application
app.get('/',(req,res)=>{
    console.log(chalk.blueBright('app base called!!'));
    res.json({status:'success'});
});



// handles the router
app.use('/library',libraryRouter);
app.use('/members',memberRouter);
app.use('/admin',adminRouter);
app.use('/books',booksRouter);




app.listen(process.env.PORT || port,()=>{
     console.log(chalk.yellowBright(`Port ${port} is active !!\n`));
     console.log(chalk.yellowBright(`*************************** \n\n`));
});