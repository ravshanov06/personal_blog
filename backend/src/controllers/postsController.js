import prisma from '../../prisma/client.js';

const getAllPosts = async (req, res) => {
  const response = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  res.json({ data: response });
};

const createPost = (req, res) => {
  res.json({ data: success });
};

export { createPost, getAllPosts };