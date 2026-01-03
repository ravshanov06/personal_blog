import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client.js';

const login = async (req, res) => {
  try {
    // 1. Get email/password from req.body
    const { email, password } = req.body;
    // 2. Find user in database by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(404).json({ data: 'User not found' });
    }
    bcrypt.compare(password, user.password, function(err, isMatch) {
      if (err) {
        res.status(500).json({ data: err });
      }
      if (isMatch) {
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY );
        res.status(200).json({ jwt: token, user: user });
      } else {
        res.status(400).json({ data: 'passwords don\'t match' });
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { login };