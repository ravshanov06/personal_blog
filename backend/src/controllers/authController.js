import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../prisma/client.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
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

const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.email === email ?
          'Email already registered' :
          'Username already taken'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      }
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      user: userWithoutPassword,
      token,
      message: 'Registration successful'
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export default { login, register };