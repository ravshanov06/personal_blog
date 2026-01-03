import prisma from '../../prisma/client.js';

const getAllPosts = async (req, res) => {
  const response = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  res.json({ data: response });
};

const createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    await prisma.post.create({
      data: {
        title, content, authorId: req.user.id,
        },
    });
    res.status(200).json({ alert : 'Post created' });
  } catch(err) {
    res.status(500).json({ alert: 'Post created mistake' });
  }

};

export { createPost, getAllPosts };