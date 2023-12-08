const { v4: uuid } = require('uuid');
const users = require('../model/Users');

const session_check_handler = async (req, res) =>
{
  const id = req.cookies?.id;

  try
  {
    if(!id)
    {
      const new_id = uuid();

      await users.create({
        id: new_id
      });
      
      res.cookie('id', new_id, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 365*24*60*60*1000});
      return res.sendStatus(200);
    }
    else
    {
      return res.sendStatus(200);
    }
  }
  catch(err)
  {
    return res.sendStatus(500);
  }  
};

module.exports = { session_check_handler }