const users = require('../model/Users');
const professionals = require('../model/Professionals');

const update_professional_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;
  if(!user_id) return res.sendStatus(401);

  let updated_prof = req.body;
  if(!updated_prof.id || 
    !updated_prof.first_name || 
    !updated_prof.last_name || 
    !updated_prof.domain || 
    !updated_prof.gender || 
    !updated_prof.email) 
  return res.sendStatus(400);

  const user = await users.findOne({ id: user_id });

  const { avatar } = await professionals.findOne({ id: updated_prof.id });
  updated_prof = { ...updated_prof, avatar };

  const filtered_updated_profs = user.updated_professionals.filter(update => update.id !== updated_prof.id);
  user.updated_professionals = [...filtered_updated_profs, updated_prof];

  await user.save();

  return res.sendStatus(200);
};

module.exports = { update_professional_handler }