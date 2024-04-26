import React, { useState } from 'react';
import './postForm.css';
import axios from 'axios';
import decodeToken from '../../utils/DecodeToken';
import CommentForm from './commentForm';
import baseURL from '../../utils/api';

const PostForm = ({ handlecloseform, dataEditingPost, stateForm }) => {
    const [numSections, setNumSections] = useState(dataEditingPost?.sections.length || 1)
    const [initialState, setInitialState] = useState(() => {
        if (stateForm === 'edit') {
            return {
                id: dataEditingPost?._id,
                title: dataEditingPost?.title,
                sections: dataEditingPost?.sections,
                category: dataEditingPost?.category,
                view: dataEditingPost?.view,
                tags: dataEditingPost?.tags,
                images: dataEditingPost?.images,
                user: dataEditingPost?.user
            };
        } else {
            return {
                title: '',
                sections: [{ sectionTitle: '', content: '' }],
                category: '',
                view: 0,
                tags: [],
                images: [],
                user: null
            };
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const { id } = decodeToken(token)

        if (stateForm === 'create') {
            try {
                const postData = {
                    title: initialState.title,
                    sections: initialState.sections,
                    category: initialState.category,
                    views: initialState.view,
                    tags: initialState.tags,
                    images: initialState.images,
                    user: id
                };

                const response = await axios.post(`${baseURL}/post/create-post`, postData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error creating post:', error);
            }
        } else if (stateForm === 'edit') {
            try {
                const postData = {
                    title: initialState.title,
                    sections: initialState.sections,
                    category: initialState.category,
                    views: initialState.view,
                    tags: initialState.tags,
                    images: initialState.images,
                    user: id
                };
                const response = await axios.put(`${baseURL}/post/update-post/${initialState.id}`, postData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error creating post:', error);
            }
        }
        handlecloseform()
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = [];
        const uniqueImages = []; // Mảng để lưu trữ các ảnh duy nhất

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.readAsDataURL(files[i]);
            reader.onload = () => {
                imagesArray.push(reader.result);
                // Kiểm tra xem ảnh có trong mảng uniqueImages chưa
                if (!uniqueImages.includes(reader.result)) {
                    uniqueImages.push(reader.result); // Nếu không có, thêm vào mảng
                    setInitialState(prevState => ({ ...prevState, images: [...prevState.images, reader.result] }));
                }
            };
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...initialState.images];
        updatedImages.splice(index, 1);
        setInitialState({ ...initialState, images: updatedImages });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'tags') {
            // Split the input value by spaces to create an array of tags
            const tagsArray = value.split(' ');
            setInitialState(prevState => ({
                ...prevState,
                tags: tagsArray
            }));
        } else if (name.includes('sectionTitle') || name.includes('content')) {
            const updatedSections = [...initialState.sections];
            const sectionIndex = parseInt(name.split('-')[1]); // Extract section index from input name
            if (!updatedSections[sectionIndex]) {
                updatedSections[sectionIndex] = {};
            }
            if (name.includes('sectionTitle')) {
                updatedSections[sectionIndex].sectionTitle = value;
            } else if (name.includes('content')) {
                updatedSections[sectionIndex].content = value;
            }
    
            setInitialState(prevState => ({
                ...prevState,
                sections: updatedSections
            }));
        } else {
            setInitialState(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    


    const handleAddSection = () => {
        setNumSections(prevNumSections => prevNumSections + 1);
    };

    const handleRemoveSection = (index) => {
        const updatedSections = [...initialState.sections];
        updatedSections.splice(index, 1);
        setInitialState({ ...initialState, sections: updatedSections });
        setNumSections(prevNumSections => prevNumSections - 1);
    };

    const deletePost = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${baseURL}/post/delete/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error deleting post:', error);
        }
        handlecloseform()
    };

    return (
        <div className='post-container'>
            <div className='post-form-container'>
                <button className="back-button" type="button" onClick={handlecloseform}>Quay lại</button>
                <form className='post-form' onSubmit={handleSubmit}>
                    <label htmlFor="title">Tiêu đề bài viết</label>
                    <input type="text" name="title" placeholder="Nhập tiêu đề..." value={initialState.title} onChange={handleInputChange} required />
                    <label htmlFor="category">Thể loại</label>
                    <input type="text" name="category" placeholder="Chọn thể loại" value={initialState.category} onChange={handleInputChange} required />
                    <label htmlFor="images">Ảnh</label>
                    <input type="file" name="images" multiple onChange={handleImageChange} />
                    <div className="image-container">
                        {initialState.images && initialState.images.map((image, index) => (
                            <div key={index} className="image-wrapper">
                                <img className='img-post-form' src={image} alt={`Ảnh ${index + 1}`} />
                                <div className="remove-image-button" onClick={() => handleRemoveImage(index)}>x</div>
                            </div>
                        ))}
                    </div>
                    <label htmlFor="tags">Từ khóa</label>
                    <input type="text" name="tags" placeholder="Nhập các từ khóa cách nhau" value={initialState.tags.join(' ')} onChange={handleInputChange} required />
                    {[...Array(numSections)].map((_, index) => (
                        <div className="section" key={index}>
                            <div className='content'>
                                <label htmlFor="sectionTitle">Đoạn</label>
                                <input
                                    type="text"
                                    name={`sectionTitle-${index}`} Ư
                                    placeholder={`Đoạn ${index + 1}`}
                                    value={initialState.sections[index] ? initialState.sections[index].sectionTitle : ''}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                />
                                <textarea
                                    name={`content-${index}`}
                                    placeholder={`Nội dung đoạn ${index + 1}`}
                                    value={initialState.sections[index] ? initialState.sections[index].content : ''}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                />
                            </div>
                            <div className="section-remove-button" type="button" onClick={() => handleRemoveSection(index)}>xóa</div>
                        </div>
                    ))}
                    <button className='button-form-post' type="button" onClick={handleAddSection}>Thêm Section</button>
                    {stateForm === 'create' ? (<button className='button-form-post' type="submit">Tạo</button>) : (
                        <div>
                            <button className='button-form-post' type="submit">Lưu</button>
                            <button className='button-form-post' type="button" onClick={() => deletePost(initialState.id)}>Xóa bài</button>
                        </div>
                    )}

                </form>
            </div>
            {stateForm === 'create' ? null : <CommentForm postId={initialState.id} />}
        </div>
    );
};

export default PostForm;
