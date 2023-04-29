const getAllUsers = async (req, res) => {
  res.send('get all users')
};

const getSingleUser = async (req, res) => {
  res.send('get single user')
};

const showCurrentUser = async (req, res) => {
  res.send('show Current User')
};

const updateUser = async (req, res) => {
  res.send('update User')
};

const updateUserPassword = async (req, res) => {
  res.send('update User Password')
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword
};
