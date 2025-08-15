import React from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";

function PostCard({ $id, title, featuredImage }) {
  // Handle missing images with a fallback
  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage) // returns string now
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <Link
      to={`/post/${$id}`}
      className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
