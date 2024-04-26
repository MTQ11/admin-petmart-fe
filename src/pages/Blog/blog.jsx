import React, { useState, useEffect } from 'react';
import './blog.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import PostForm from './postForm';
import baseURL from '../../utils/api';

const Blog = () => {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stateForm, setStateForm] = useState('create')
    const [dataEditingPost, setDataEditingPost] = useState(null);
    const [showPostList, setShowPostList] = useState(true);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        loadPosts();
    }, [showPostList]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/post/get-post`);
            setPosts(response.data.data);
            const allCategories = response.data.data.map(post => post.category);
            const uniqueCategories = Array.from(new Set(allCategories)); // Loại bỏ các category trùng lặp
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false); // Kết thúc loading dù có lỗi hay không
        }
    };

    const handleEditForm = (post) => {
        setDataEditingPost(post);
        setShowPostList(false);
        setStateForm('edit')
    };

    const handleCreateForm = () => {
        setShowPostList(false);
        setStateForm('create')
    };

    const handlecloseform = () => {
        setShowPostList(true);
    }

    return (

        <div>
            <h1>Blog</h1>
            {!showPostList && (
                <PostForm
                    stateForm={stateForm}
                    handlecloseform={handlecloseform}
                    {...(stateForm === 'edit' ? { dataEditingPost: dataEditingPost } : {})}
                />
            )}
            <div className='blog-container'>
                {showPostList && (
                    <>
                        <div className='post-form-action'>
                            <div className="category-menu">
                                <button onClick={() => setSelectedCategory('')} className={selectedCategory === '' ? 'selected' : ''}>All Posts</button>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={category === selectedCategory ? 'selected' : ''}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            <input
                                className='search-post'
                                placeholder='Tìm kiếm...'
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <button className='create-post-button' onClick={handleCreateForm}>Tạo bài viết</button>
                        </div>
                        {loading ? ( // Hiển thị loading khi đang fetching
                            <div>
                                <FontAwesomeIcon icon={faSpinner} spin /> {/* Biểu tượng xoay tròn */}
                            </div>
                        ) : (
                            <ul className="card-list">
                                {posts
                                    .filter(post => selectedCategory === '' || post.category === selectedCategory)
                                    .filter(post =>
                                        post.title.toLowerCase().includes(searchInput.toLowerCase())
                                    )
                                    .map(post => (
                                        <li key={post._id} className="card" onClick={() => handleEditForm(post)}>
                                            <div className="card-content">
                                                <div>
                                                    {post.images.length > 0 && <img src={post.images[0]} alt="Ảnh bài viết" />}
                                                </div>
                                                <h2>
                                                    {post.title}
                                                </h2>
                                            </div>
                                        </li>
                                    ))}

                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Blog;
