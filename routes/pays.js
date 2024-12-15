const express = require('express');
const router = express.Router();
const Pays = require('../model/pays');
const paysController = require('../controller/PaysController');
const validate = require('../middleware/validation');
/* GET home page. */
router.get('/getAll', paysController.getAll);
router.get('/get/:id', paysController.getById);
router.post('/add',validate, paysController.add);

router.delete('/delete/:id',paysController.deletebyid);
router.put('/update/:id',paysController.update);


// Fonction 3: [UPDATE] ---> directement dans la route comme ATELIER 3
router.put("/update1/:id", async function (req, res) {
    try {
      
      await pays.findByIdAndUpdate(req.params.id, req.body, { new: true });
     
    } catch (err) {
      res.send(err);
    }
  });
  
  
  // Fonction 4: [DELETE]  ---> directement dans la route comme ATELIER 3
  router.delete("/delete1/:id", async function (req, res) {
    try {
        console.log(req.params.id);
        // Utilisée pour les anciennes versions
              //await pays.findByIdAndRemove(req.params.id);
     await pays.findByIdAndDelete(req.params.id);
  
    } catch (err) {
      res.send(err);
    }
  });
module.exports = router;
