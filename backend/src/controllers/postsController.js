import prisma from '../../prisma/client.js';

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            username: true,
            id: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                username: true,
                id: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
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

const allPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            id: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                username: true,
                id: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

const togglePublish = async (req, res) => {
  const postId = parseInt(req.params.id);
  const { published } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        published: published,
        publishedAt: published ? new Date() : null
      }
    });
    res.json({ data: post, message: `Post ${published ? 'published' : 'unpublished'}` });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const editPost = async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { username: true } }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't get the post" });
  }
};


const updatePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, content, published } = req.body;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
        published,
        updatedAt: new Date(),
        publishedAt: published ? new Date() : undefined
      }
    });

    res.json({ data: updatedPost, message: 'Post updated' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: "Couldn't update the post" });
  }
};

const deletePost = async (req, res) => {
  const postId = parseInt(req.params.id);
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postId }
    });
    res.json({ data: deletedPost, message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Post not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete post' });
    }
  }
};

export {
  createPost,
  getAllPosts,
  allPosts,
  togglePublish,
  editPost,
  updatePost,
  deletePost
};