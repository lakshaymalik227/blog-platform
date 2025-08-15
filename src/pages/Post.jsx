import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((fetchedPost) => {
                if (fetchedPost) {
                    setPost(fetchedPost);

                    // ✅ Debug logs
                    console.log("Fetched post from Appwrite:", fetchedPost);
                    console.log("Featured Image ID:", fetchedPost.featuredImage);

                    if (fetchedPost.featuredImage) {
                        try {
                            const preview = appwriteService.getFilePreview(
                                fetchedPost.featuredImage
                            );

                            // Handle if preview is a URL object or string
                            const url =
                                preview && typeof preview === "object" && preview.href
                                    ? preview.href
                                    : preview;

                            console.log("Resolved Preview URL:", url);
                            setPreviewUrl(url);
                        } catch (err) {
                            console.error("Error generating file preview:", err);
                        }
                    }
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                if (post.featuredImage) {
                    appwriteService.deleteFile(post.featuredImage);
                }
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={
                            previewUrl ||
                            "https://via.placeholder.com/800x400?text=No+Image"
                        }
                        alt={post.title}
                        className="rounded-xl max-h-[400px] object-cover"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6 flex gap-3">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500">Edit</Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">{parse(post.content)}</div>
            </Container>
        </div>
    ) : null;
}
