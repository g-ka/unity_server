const users = require('../model/Users');
const professionals = require('../model/Professionals');

const fetch_professionals_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;

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

  // INSERTING UPDATES:
  const { updated_professionals } = await users.findOne({ id: user_id });
  const updated_id = updated_professionals.map(professional => professional.id);
  const professional_list_id = professionals_list.map(professional => professional.id);
  
  const filtered_professional_list = professionals_list.filter(professional => !updated_id.includes(professional.id));
  const filtered_updated_professionals = updated_professionals.filter(professional => professional_list_id.includes(professional.id));
  
  const final_list = [...filtered_professional_list, ...filtered_updated_professionals];
  const sorted_final_list = final_list.sort((a, b) => a.id - b.id);

  return res.status(200).json({ professionals_list: sorted_final_list })
};

const fetch_professional_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;
  if(!user_id) return res.sendStatus(401);

  const { id } = req.params;
  if(!id) return res.sendStatus(400);

  const { updated_professionals } = await users.findOne({ id: user_id });

  const exist = updated_professionals.find(professional => professional.id == id);
  if(exist) return res.status(200).json({ professional: exist });

  const professional = await professionals.findOne({ id });

  return res.status(200).json({ professional });
};

module.exports = { fetch_professionals_handler, fetch_professional_handler }