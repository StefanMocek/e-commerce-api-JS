
const registerController = async (req, res) => {
  res.send('registerd')
};

const loginController = async (req, res) => {
  res.send('login')
};

const logoutController = async (req, res) => {
  res.send('logout')
};

module.exports = {
  registerController,
  loginController,
  logoutController
}