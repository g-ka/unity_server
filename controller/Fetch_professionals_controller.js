const users = require('../model/Users');
const professionals = require('../model/Professionals');

const fetch_professionals_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;

  let { page_number, domain, gender, avail, search } = req.query;
  let professionals_list = [];

  const original_professionals_list = await professionals.find();

  // INSERTING UPDATES:
  const { updated_professionals } = await users.findOne({ id: user_id });
  const updated_id = updated_professionals.map(professional => professional.id);
  const professional_list_id = original_professionals_list.map(professional => professional.id);
  
  const filtered_professional_list = original_professionals_list.filter(professional => !updated_id.includes(professional.id));
  const filtered_updated_professionals = updated_professionals.filter(professional => professional_list_id.includes(professional.id));
  
  const final_list = [...filtered_professional_list, ...filtered_updated_professionals];
  const udpated_professionals_list = final_list.sort((a, b) => a.id - b.id);

  if(domain === 'All' && gender === 'All' && avail === 'All')
  {           
    professionals_list = search ? 
                          udpated_professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                            udpated_professionals_list.slice((page_number - 1)*10, (page_number)*20);
  }  
  else
  {
    if(domain !== 'All' && gender === 'All' && avail === 'All') 
    {            
      professionals_list = udpated_professionals_list.filter(professional => professional.domain === domain);
      professionals_list = search ? 
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }    
    else if(domain === 'All' && gender !== 'All' && avail === 'All')
    {      
      professionals_list = udpated_professionals_list.filter(professional => professional.gender === gender);
      professionals_list = search ? 
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }    
    else if(domain === 'All' && gender === 'All' && avail !== 'All')
    {
      if(avail === 'Available') avail = true;
      else avail = false
            
      professionals_list = udpated_professionals_list.filter(professional => professional.available === avail);      
      professionals_list = search ? 
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }    
    else if(domain !== 'All' && gender !== 'All' && avail === 'All') 
    {            
      professionals_list = udpated_professionals_list.filter(professional => professional.domain === domain && professional.gender === gender);      
      professionals_list = search ? 
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }    
    else if(domain == 'All' && gender !== 'All' && avail !== 'All') 
    {
      if(avail === 'Available') avail = true;
      else avail = false
            
      professionals_list = udpated_professionals_list.filter(professional => professional.gender === gender && professional.available === avail);      
      professionals_list = search ?  
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }  
    else if(domain !== 'All' && gender === 'All' && avail !== 'All') 
    {
      if(avail === 'Available') avail = true;
      else avail = false
            
      professionals_list = udpated_professionals_list.filter(professional => professional.domain === domain && professional.available === avail);      
      professionals_list = search ? 
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }    
    else if(domain !== 'All' && gender !== 'All' && avail !== 'All')
    {
      if(avail === 'Available') avail = true;
      else avail = false
            
      professionals_list = udpated_professionals_list.filter(professional => professional.domain === domain && professional.gender === gender && professional.available === avail);      
      professionals_list = search ? 
                            professionals_list.filter(professional => professional.first_name.toLowerCase().includes(search.toLowerCase()) || professional.last_name.toLowerCase().includes(search.toLowerCase())) :
                              professionals_list.slice((page_number - 1)*10, (page_number)*20);
    }    
  }  

  return res.status(200).json({ professionals_list })
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