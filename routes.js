const express= require('express');
const router = express.Router();
const records = require('./records');

router.get('/hello', (req, res)=>{
  res.json({greeting: "Hello World!"});
});


function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
      next(err);
    }
  };
}
//read quote list (GET)
router.get('/quotes', async (req, res)=>{
  try{
  const quotes = await records.getQuotes();
  res.json (quotes);
}catch(err){
  res.json({message:err.message});
}
});

//read a specific quote-/quotes/:id (GET)
router.get('/quotes/:id',async  (req, res)=>{
  try{
  const quote = await records.getQuote(req.params.id);
  if(quote){
  res.json(quote);
}else{
  res.status(404).json({message:"No quote"});
}
}catch(err){
  res.status(500).json({message:err.message});
}
});
//create new quote (POST)
router.post('/quotes',async (req,res)=>{
try{
    if(req.body.quote && req.body.author){
      const quote = await records.createQuote({
      quote:req.body.quote,
      author:req.body.author
 });
      res.status(201).json (quote);
    } else {
     res.status(400).json({message:"quotes are empty"});
     }
   }
 catch(err){
   res.status(500).json ({message: err.message});
 }
});

//update or edit the quote (PUT)
router.put('/quotes/:id',async (req,res)=>{
  try{
    const quote = await records.getQuote(req.params.id);
    if(quote){
      quote.quote=req.body.quote;
      quote.author= req.body.author;
      await records.updateQuote(quote);
      res.status(204).end();
    }else{
      res.status(404).json({message:"quote not found"});
    }
  }
  catch(err){
     res.status(500).json ({message: err.message});
  }

});
//delete the quote(DELETE)
  router.delete('/quotes/:id' ,async (req,res)=>{
    try{
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
    res.status(204).end();
  }catch(err){
      res.status(500).json ({message: err.message});
  }

  });


//view the random quote (GET)
router.get('/quotes/quote/random',async (req,res)=>{
  try{
   const quote = await records.getRandomQuote();
   res.json(quote);
 }catch (err){
     res.status(500).json ({message: err.message});
 }
});


module.exports= router ;
