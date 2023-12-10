const professionals = require('../model/Professionals');

const search_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;
  if(!user_id) return res.sendStatus(401);

  const { search, page_number } = req.body;

  if(search === '')
  {
    const search_list = await professionals.find().skip((page_number-1)*10).limit(20);

    return res.status(200).json({ search_list });
  }

  const professionals_list = await professionals.find();
  const professionals_name_list = professionals_list.map(professional => 
    { 
      return(
        {
          id: professional.id,
          full_name: professional.first_name.toLowerCase() + ' ' + professional.last_name.toLowerCase()        
        }
      )      
    });
  const filtered_name_list = professionals_name_list.filter(professional => professional.full_name.includes(search.toLowerCase()));
  const filtered_id = filtered_name_list.map(professional => professional.id);

  const search_list = await professionals.find({ id: { $in: filtered_id } });

  // INSERTING UPDATES:
  const { updated_professionals } = await users.findOne({ id: user_id });
  const updated_id = updated_professionals.map(professional => professional.id);
  
  const filtered_professional_list = search_list.filter(professional => !updated_id.includes(professional.id));
  
  const final_list = [...filtered_professional_list, ...updated_professionals];
  const sorted_final_list = final_list.sort((a, b) => a.id - b.id);

  return res.status(200).json({ search_list: sorted_final_list });
};

module.exports = { search_handler }