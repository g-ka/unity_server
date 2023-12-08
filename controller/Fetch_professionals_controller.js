const professionals = require('../model/Professionals');

const fetch_professionals_handler = async (req, res) =>
{
  let { page_number, domain, gender, avail } = req.query;
  let professionals_list = [];

  if(domain === 'All' && gender === 'All' && avail === 'All')
  professionals_list = await professionals.find().skip((page_number-1)*10).limit(20);
  else
  {
    if(domain !== 'All' && gender === 'All' && avail === 'All') 
    professionals_list = await professionals.find({ $and: [{ domain: domain }] }).skip((page_number-1)*10).limit(20);
    else if(domain === 'All' && gender !== 'All' && avail === 'All')
    professionals_list = await professionals.find({ $and: [{ gender: gender }] }).skip((page_number-1)*10).limit(20);
    else if(domain === 'All' && gender === 'All' && avail !== 'All')
    {
      if(avail === 'Available') avail = true;
      else avail = false

      professionals_list = await professionals.find({ $and: [{ available: avail }] }).skip((page_number-1)*10).limit(20);
    }    
    if(domain !== 'All' && gender !== 'All' && avail === 'All') 
    professionals_list = await professionals.find({ $and: [{ domain: domain }, { gender: gender }] }).skip((page_number-1)*10).limit(20);
    if(domain == 'All' && gender !== 'All' && avail !== 'All') 
    {
      if(avail === 'Available') avail = true;
      else avail = false

      professionals_list = await professionals.find({ $and: [{ gender: gender }, { available: avail }] }).skip((page_number-1)*10).limit(20);
    }  
    if(domain !== 'All' && gender === 'All' && avail !== 'All') 
    {
      if(avail === 'Available') avail = true;
      else avail = false

      professionals_list = await professionals.find({ $and: [{ domain: domain }, { available: avail }] }).skip((page_number-1)*10).limit(20);
    }    
    if(domain !== 'All' && gender !== 'All' && avail !== 'All')
    {
      if(avail === 'Available') avail = true;
      else avail = false

      professionals_list = await professionals.find({ $and: [{ domain: domain }, { gender: gender }, { available: avail }] }).skip((page_number-1)*10).limit(20);
    }    
  }  

  return res.status(200).json({ professionals_list })
};

module.exports = { fetch_professionals_handler }