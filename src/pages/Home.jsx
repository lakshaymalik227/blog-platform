import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Container, PostCard } from '../components';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        if (currentUser && currentUser.$id) {
          const response = await appwriteService.getPosts(currentUser.$id);
          if (response && response.documents) {
            // Map posts so featuredImage is converted to preview URL
            const updatedPosts = response.documents.map(post => ({
              ...post,
              featuredImage: post.featuredImage
                ? appwriteService.getFilePreview(post.featuredImage)
                : null
            }));
            setPosts(updatedPosts);
          } else {
            setPosts([]);
          }
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (!user) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                No posts available
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div key={post.$id} className="p-2 w-1/4">
              <PostCard
                $id={post.$id}
                title={post.title}
                featuredImage={post.featuredImage} // This is now a real URL
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
