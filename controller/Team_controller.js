const users = require('../model/Users');
const professionals = require('../model/Professionals');

const team_details_handler = async (req, res) =>
{
  const id = req.cookies?.id;
  if(!id) return res.sendStatus(403);

  const user = await users.findOne({ id });
  const { team_name, team_members } = user; 

  const team_members_list = await professionals.find({ id: { $in: team_members } });

  res.status(200).json({ team_name, team_members_list });
};

const team_create_handler = async (req, res) =>
{
  const id = req.cookies?.id;
  if(!id) return res.sendStatus(403);

  const { team_name } = req.body;
  if(!team_name) return res.sendStatus(400);

  const user = await users.findOne({ id });
  
  user.team_name = team_name;

  await user.save();

  return res.sendStatus(200);
};

const team_add_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;
  if(!user_id) return res.sendStatus(401);

  const { prof_id } = req.body;
  if(!prof_id) return res.sendStatus(400);

  const user = await users.findOne({ id: user_id });
  const { team_name, team_members } = user; 

  if(!team_name) return res.status(200).json({ clash: 'Create team'})

  const id_clash = team_members.find(member_id => member_id == prof_id);
  if(id_clash) return res.status(200).json({ clash: 'Id' });

  const new_member = await professionals.findOne({ id: prof_id });

  if(new_member.available === false) return res.status(200).json({ clash: 'Availability' });

  const old_members = await professionals.find({ id: { $in: team_members } });

  const domain_clash = old_members.find(old_member => old_member.domain === new_member.domain);
  if(domain_clash) return res.status(200).json({ clash: 'Domain' });

  user.team_members = [...team_members, prof_id];

  await user.save();

  return res.status(200).json({ clash: 'None' });
};

const team_delete_handler = async (req, res) =>
{
  const user_id = req.cookies?.id;
  if(!user_id) return res.sendStatus(401);

  const delete_id = req.params.id;

  const user = await users.findOne({ id: user_id });

  const new_team = user.team_members.filter(id => id != delete_id);

  user.team_members = new_team;

  await user.save();

  return res.sendStatus(200);
};

module.exports = { team_create_handler, team_details_handler, team_add_handler, team_delete_handler }