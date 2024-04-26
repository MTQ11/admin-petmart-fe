import React, { useState, useEffect } from 'react';
import './commentForm.css'
import axios from 'axios';
import decodeToken from '../../utils/DecodeToken';
import UserInfo from './userInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import baseURL from '../../utils/api';

const CommentForm = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({
        content: '',
    });
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState('');
    const [update, setUpdate] = useState(false); // Biến trạng thái update

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${baseURL}/comment/get-comment?post=${postId}`);
                setComments(response.data.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [postId, update]); // Sử dụng biến update trong dependency array

    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem('token');
            const { id } = decodeToken(token)
            const response = await axios.post(`${baseURL}/comment/admin-add/${id}`,
                {
                    content: newComment.content,
                    post: postId,
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            }
            );
            setComments([...comments, response.data]);
            setNewComment({ content: '' });
            setUpdate(!update); // Cập nhật biến update để render lại giao diện
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${baseURL}/comment/admin-update/${commentId}`,
                {
                    content: editCommentContent,
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            }
            );
            const updatedComments = comments.map(comment =>
                comment._id === commentId ? { ...comment, content: response.data.content } : comment
            );
            setComments(updatedComments);
            setEditingCommentId(null);
            setEditCommentContent('');
            setUpdate(!update); // Cập nhật biến update để render lại giao diện
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${baseURL}/comment/admin-delete/${commentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `bearer ${token}`
                }
            });
            const updatedComments = comments.filter(comment => comment._id !== commentId);
            setComments(updatedComments);
            setUpdate(!update); // Cập nhật biến update để render lại giao diện
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="comment-form">
            <h2>Bình luận</h2>
            <ul className="comment-list">
                {comments.map(comment => (
                    <li className="comment-item" key={comment._id}>
                        {editingCommentId === comment._id ? (
                            <div className="comment-container">
                                <input
                                    className="comment-content"
                                    type="text"
                                    value={editCommentContent}
                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                />
                                <FontAwesomeIcon className='button-icon' icon={faCheck} onClick={() => handleEditComment(comment._id)}/>
                            </div>
                        ) : (
                            <div className="comment-container">
                                <UserInfo userId={comment.user} />
                                <p className="comment-content">{comment.content}</p>
                                <div className="comment-buttons">
                                    <div className="comment-buttons">
                                        {/* <FontAwesomeIcon className='button-icon' icon={faEdit}
                                            onClick={() => {
                                                setEditingCommentId(comment._id);
                                                setEditCommentContent(comment.content);
                                            }}
                                        /> */}
                                        <FontAwesomeIcon className='button-icon' icon={faTrash}
                                            onClick={() => handleDeleteComment(comment._id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <div>
                <textarea
                    placeholder='Nhập bình luận...'
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
        </div>

    );
};

export default CommentForm;
