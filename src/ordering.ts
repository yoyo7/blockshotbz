import * as express from 'express';
import { Request, Response } from "express";
import { ordermodel as Order } from '../schemas/Order';
const router = express.Router();
router.use(express.json());
router.post("/buy", async (req: Request, res: Response) => {
  const order = new Order({
    item: req.body.item,
    price: req.body.price,
    sellbuy: "buy",
    amount: req.body.amount,
    amountnotfulfilled: req.body.amount,
    fulfilled: false
  });
  

  var orders = await Order.find({ item: req.body.item, price: req.body.price, sellbuy: "sell" });
  //console.log(orders);
  if (orders.length > 0) {
    for (let i = 0; i < orders.length; i++) {
      let thisbuyorder = order.toJSON();
      let thissellorder = orders[i].toJSON();
      if (thisbuyorder.amountnotfulfilled - thissellorder.amountnotfulfilled > 0) {
        
        orders[i].set({amountnotfulfilled: 0, fulfilled: true})
        order.set({amountnotfulfilled: thisbuyorder.amountnotfulfilled - thissellorder.amountnotfulfilled})
        await orders[i].save();
            
          
        
      } else {
        if (thissellorder.amountnotfulfilled == thisbuyorder.amountnotfulfilled) {
          orders[i].set({amountnotfulfilled: 0, fulfilled: true})         
        } else { 
          orders[i].set({amountnotfulfilled: thissellorder.amountnotfulfilled - thisbuyorder.amountnotfulfilled})
        }
        order.set({amountnotfulfilled: 0, fulfilled: true})
        await orders[i].save();
        break
      }
      
    }
    
    
  }
  
  const ordersave = await order.save();
  
  res.json(ordersave.toJSON()); 

});

router.post("/sell", async (req: Request, res: Response) => {
  let i = 0;
  const order = new Order({
    item: req.body.item,
    price: req.body.price,
    sellbuy: "sell",
    amount: req.body.amount,  
    amountnotfulfilled: req.body.amount,
    fulfilled: false
  });
  

  var orders = await Order.find({ item: req.body.item, price: req.body.price, sellbuy: "buy", fulfilled: false });
  //console.log(orders.length);
  if (orders.length > 0) {
    //console.log('reached if sta')
    while(order.toJSON().amountnotfulfilled > 0 && order.toJSON().fulfilled == false){
      //console.log('reached while loop');
      let thisbuyorder = orders[i].toJSON();
      //console.log(thisbuyorder);
      let thissellorder = order.toJSON();
      //console.log(thissellorder);  
      if (thisbuyorder.amountnotfulfilled >= thissellorder.amountnotfulfilled) {
        //last iteration
        if (thisbuyorder.amountnotfulfilled == thissellorder.amountnotfulfilled) {
          orders[i].set({amountnotfulfilled: 0, fulfilled: true})
        } else {
          orders[i].set({amountnotfulfilled: thisbuyorder.amountnotfulfilled - thissellorder.amountnotfulfilled})
        }
        order.set({amountnotfulfilled: 0, fulfilled: true})
        await orders[i].save();
        //console.log('reached sell final');
      } else if (thisbuyorder.amountnotfulfilled < thissellorder.amountnotfulfilled){
        //repeated many times
        
        orders[i].set({amountnotfulfilled: 0, fulfilled: true})
        order.set({amountnotfulfilled: thissellorder.amountnotfulfilled - thisbuyorder.amountnotfulfilled})
        await orders[i].save();
        //console.log('reached sell repeat');
        
      }
      
      i++
    
      
    }
    
  }
  
  
  const ordersave = await order.save();
  
  
  res.json(ordersave.toJSON()); 


});

export { router };
