import prisma from '../../prisma/client.js';

const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: { select: { username: true, email: true } },
        post: { select: { title: true, id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

const createComment = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Comment content required' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: userId,
        postId: parseInt(postId)
      },
      include: {
        author: { select: { username: true } }
      }
    });

    res.json({ data: comment, message: 'Comment added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

const deleteComment = async (req, res) => {
  const commentId = parseInt(req.params.id);
  try {
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ data: deletedComment, message: 'Comment deleted' });
  } catch (err) {
    console.error(err);
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Comment not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  }
};


export { getAllComments, createComment, deleteComment };