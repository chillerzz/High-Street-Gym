import BottomNav from "../../common/BottomNav";
import { BlogPost } from "./BlogPost";
import { MobilePageHeader } from "../../common/MobilePageHeader";
import { useAuthentication } from "../authentication";
import * as Blog from "../../api/blog";
import { useState } from "react";

export function BlogPage() {
    const [user] = useAuthentication();
    const [statusMessage, setStatusMessage] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });

    const addPost = (e) => {
        e.preventDefault();

        setStatusMessage("Posting...");
        
        // Check if both title and content are filled out
        if (formData.title.trim() === "" || formData.content.trim() === "") {
            setStatusMessage("Please fill out both title and content.");
            return;
        }

        const postData = {
            ...formData,
            user_id: user.id,
            date: new Date().toISOString().slice(0, 10),
            time: "10:00:00"
        };

        Blog.create(postData, user.authenticationKey)
            .then((result) => {
                setStatusMessage(result.message);
                setFormData({
                    title: "",
                    content: ""
                });
                // Close the modal after successful post creation
                document.getElementById("my_modal_2").close();
            })
            .catch((error) => {
                setStatusMessage(error);
            });
    };

    const clearForm = () => {
        setFormData({
            title: "",
            content: ""
        });
    };

    return (
        <div className="bg-background-primary min-h-screen overflow-hidden pb-20">
            <main className="px-4">
                <MobilePageHeader pageTitle="Blog" />
                <button
                    className="btn shadow bg-test w-full p-5 card m-auto md:w-96"
                    onClick={() => document.getElementById("my_modal_2").showModal()}
                >
                    Create Post
                </button>
                <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <section>
                            <div className="flex justify-center mt-5">
                                <div className="w-full bg-base-100md:w-96">
                                    <form className="py-4" onSubmit={addPost}>
                                        <span className="text-2xl font-semibold flex justify-center">Share some tips!</span>
                                        <label className="flex items-center gap-2 m-4">
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                className="input input-bordered w-full"
                                                value={formData.title}
                                                onChange={(e) =>
                                                    setFormData((existing) => ({
                                                        ...existing,
                                                        title: e.target.value
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label className="flex items-center gap-2 m-4">
                                            <textarea
                                                className="textarea textarea-bordered w-full"
                                                placeholder="Message"
                                                value={formData.content}
                                                onChange={(e) =>
                                                    setFormData((existing) => ({
                                                        ...existing,
                                                        content: e.target.value
                                                    }))
                                                }
                                            ></textarea>
                                        </label>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="btn border-test border-2"
                                                disabled={!formData.title.trim() || !formData.content.trim()}
                                            >
                                                Post
                                            </button>
                                            <button className="btn btn-ghost" onClick={clearForm}>
                                                Clear
                                            </button>
                                        </div>
                                        <label className="label mt-2 flex justify-end">
                                            <span className="label-text-alt">{statusMessage}</span>
                                        </label>
                                    </form>
                                </div>
                            </div>
                        </section>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
                <section className="my-2 flex flex-col gap-1">
                    <BlogPost />
                </section>
            </main>
            <BottomNav />
        </div>
    );
}

export default BlogPage;
