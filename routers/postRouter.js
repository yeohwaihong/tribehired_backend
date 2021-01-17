const express = require("express");
const router = new express.Router();
const axios = require("axios");

router.get("/api/posts/getAllSortedPostsWithComments", async (req, res) => {
  getAllPosts().then(async (posts) => {
    let data = await Promise.all(
      posts.data
        .map(async (mappedPosts) => {
          let c = await getCommentCountWithPostID(mappedPosts.id, (count) => {
            return {
              post_id: mappedPosts.id,
              post_title: mappedPosts.title,
              post_body: mappedPosts.body,
              total_number_of_comments: count,
            };
          });
          return c;
        })
        .sort((a, b) => {
          return b.total_number_of_comments - a.total_number_of_comments;
        })
    );
    res.status(200).send({ status: true, posts: data });
  });
});

function getAllPosts() {
  return axios.get("https://jsonplaceholder.typicode.com/posts");
}

const getCommentCountWithPostID = async (postID, callback) => {
  let res = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${Number(postID)}`);
  return callback(res.data.length);
};

module.exports = router;
