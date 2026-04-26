import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header'; 

function PostDetailPage({ isLoggedIn, onLogout }) {
    const { postId } = useParams();
    const navigate = useNavigate();

    // 1. 서버에서 받아올 데이터를 저장할 상태
    const [postData, setPostData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ─── 댓글 및 모달 상태 관리 ───
    const [comments, setComments] = useState([]); 
    const [newComment, setNewComment] = useState(""); 
    const [showLoginModal, setShowLoginModal] = useState(false); 

    // ─── 댓글 페이지네이션 상태 ───
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const commentsPerPage = 50; // 한 페이지당 표시할 댓글 수

    useEffect(() => {
        setIsLoading(true);
        const fetchPostData = async () => {
            try {
                // 서버 통신 시뮬레이션
                await new Promise(resolve => setTimeout(resolve, 100));

                const data = {
                    id: postId,
                    title: `임시 제목 (${postId}번 글)`,
                    status: Math.random() > 0.5 ? "ongoing" : "completed",
                    author: "임시 닉네임",
                    date: "2026-04-19T14:30:00",
                    content: "플레이스홀더 내용입니다.\n여기에 게시글의 상세 내용이 표시됩니다...",
                    tags: ["임시태그 1", "임시태그 2", "임시태그 3"]
                };

                // ─── 50개 단위 페이징 테스트를 위한 임시 데이터 120개 생성 ───
                const mockComments = Array.from({ length: 120 }, (_, i) => ({
                    id: i + 1,
                    author: `임시 닉네임${120 - i}`,
                    text: `이것은 ${120 - i}번째로 작성된 임시 댓글입니다. \n페이지네이션 테스트를 위해 자동 생성되었습니다.\n페이지네이션 테스트를 위해 자동 생성되었습니다.\n페이지네이션 테스트를 위해 자동 생성되었습니다.`,
                    // 시간차를 두어 정렬 확인
                    date: new Date(Date.now() - i * 60000).toISOString()
                }));

                // 댓글을 최신순(내림차순)으로 정렬
                const sortedComments = mockComments.sort((a, b) => new Date(b.date) - new Date(a.date));

                setPostData(data);
                setComments(sortedComments);
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostData();
    }, [postId]);

    const formatFullDateTime = (dateString) => {
        if (!dateString) return "";
        const d = new Date(dateString);
        const datePart = d.toLocaleDateString('en-CA');
        const timePart = d.toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
        return `${datePart} ${timePart}`;
    };

    // ─── 댓글 작성 핸들러 ───
    const handleCommentSubmit = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true); 
            return;
        }

        if (!newComment.trim()) {
            alert("댓글 내용을 입력해주세요.");
            return;
        }

        const newCommentObj = {
            id: Date.now(), 
            author: "현재로그인유저", 
            text: newComment,
            date: new Date().toISOString()
        };

        setComments([newCommentObj, ...comments]);
        setNewComment(""); 
        setCurrentCommentPage(1); // 새 댓글 작성 시 무조건 1페이지로 이동
        alert("댓글이 작성되었습니다.");
    };

    // ─── 댓글 페이지네이션 계산 로직 ───
    const totalCommentPages = Math.ceil(comments.length / commentsPerPage) || 1;
    const currentComments = comments.slice((currentCommentPage - 1) * commentsPerPage, currentCommentPage * commentsPerPage);
    
    // 표시할 최대 페이지 버튼 수 (예: 1 2 3 4 5)
    const maxPageButtons = 5; 
    let startPage, endPage;
    
    if (totalCommentPages <= maxPageButtons) {
        startPage = 1;
        endPage = totalCommentPages;
    } else {
        const half = Math.floor(maxPageButtons / 2);
        if (currentCommentPage <= half) {
            startPage = 1;
            endPage = maxPageButtons;
        } else if (currentCommentPage + half >= totalCommentPages) {
            startPage = totalCommentPages - maxPageButtons + 1;
            endPage = totalCommentPages;
        } else {
            startPage = currentCommentPage - half + 1;
            endPage = currentCommentPage + (maxPageButtons - half);
        }
    }

    const handleCommentPageChange = (pageNumber) => {
        setCurrentCommentPage(pageNumber);
    };

    const styles = {
        container: { minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
        contentWrapper: { maxWidth: '800px', margin: '40px auto', padding: '0 20px', paddingBottom: '60px' },
        card: { backgroundColor: '#fff', borderRadius: '12px', padding: '5px 30px 30px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
        backLink: { color: '#007bff', cursor: 'pointer', marginBottom: '20px', display: 'inline-block', fontWeight: 'bold' },
        title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '15px', marginTop: '20px' },
        metaInfo: { 
            display: 'flex', gap: '15px', color: '#888', fontSize: '14px', 
            marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '12px', alignItems: 'center'
        },
        contentBody: { fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap', padding: '5px 0' },
        tagSection: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '20px' },
        
        // 댓글 섹션 스타일
        commentCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px 30px 30px 30px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginTop: '30px' },
        commentTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#333', borderBottom: '2px solid #f4f7f6', paddingBottom: '10px', marginTop: 0 },
        commentItem: { padding: '10px 0', borderBottom: '1px solid #eee' },
        commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
        commentAuthor: { fontWeight: 'bold', fontSize: '15px', color: '#333' },
        commentDate: { fontSize: '12px', color: '#999' },
        commentText: { fontSize: '15px', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-wrap' },
        
        // 페이지네이션 스타일
        paginationContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginTop: '25px', marginBottom: '10px' },
        pageBtn: { minWidth: '32px', height: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px', border: '1px solid #dee2e6', backgroundColor: '#fff', cursor: 'pointer', fontSize: '13px' },
        activePageBtn: { backgroundColor: '#007bff', color: '#fff', border: '1px solid #007bff', fontWeight: 'bold' },

        commentInputWrapper: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
        commentTextarea: { 
            width: '100%', height: '80px', padding: '12px', borderRadius: '8px', 
            border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', 
            resize: 'none', outline: 'none', fontFamily: 'inherit' 
        },
        commentSubmitBtn: { 
            alignSelf: 'flex-end', padding: '10px 20px', backgroundColor: '#333', 
            color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
        },

        // 모달 스타일
        modalOverlay: { 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
        },
        modalContent: { 
            backgroundColor: '#fff', padding: '30px', borderRadius: '12px', textAlign: 'center', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '350px', width: '100%' 
        },
        modalText: { fontSize: '16px', lineHeight: '1.6', color: '#333', marginBottom: '25px', fontWeight: '500' },
        modalBtnGroup: { display: 'flex', gap: '10px', justifyContent: 'center' },
        modalLoginBtn: { flex: 1, padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
        modalCancelBtn: { flex: 1, padding: '12px', backgroundColor: '#eee', color: '#666', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>;
    if (!postData) return <div style={{ textAlign: 'center', padding: '50px' }}>글을 찾을 수 없습니다.</div>;

    return (
        <div style={styles.container}>
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main style={styles.contentWrapper}>
                <div style={styles.backLink} onClick={() => navigate('/list')}>〈 목록으로 돌아가기</div>
                
                <article style={styles.card}>
                    <h1 style={styles.title}>{postData.title}</h1>
                    <div style={styles.metaInfo}>
                        <span>작성자: {postData.author}</span> | <span>작성일: {formatFullDateTime(postData.date)}</span> | 
                        <span style={{ color: postData.status === 'ongoing' ? '#28a745' : '#6c757d', fontWeight: 'bold' }}>
                            {postData.status === 'ongoing' ? '모집 중' : '완료'}
                        </span>
                    </div>

                    <div style={styles.contentBody}>{postData.content}</div>

                    <div style={styles.tagSection}>
                        {postData.tags.map(tag => (
                            <span key={tag} style={{ backgroundColor: '#e9ecef', padding: '5px 12px', borderRadius: '15px', fontSize: '13px' }}>#{tag}</span>
                        ))}
                    </div>

                    <button 
                        style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px', fontSize: '20px' }}
                        onClick={() => alert('준비 중입니다')}
                    >
                        이 프로젝트에 지원하기
                    </button>
                </article>

                {/* 댓글 섹션 */}
                <section style={styles.commentCard}>
                    <h3 style={styles.commentTitle}>댓글 ({comments.length})</h3>
                    <div>
                        {currentComments.length > 0 ? (
                            // comments 대신 currentComments를 매핑합니다
                            currentComments.map(comment => (
                                <div key={comment.id} style={styles.commentItem}>
                                    <div style={styles.commentHeader}>
                                        <span style={styles.commentAuthor}>{comment.author}</span>
                                        <span style={styles.commentDate}>{formatFullDateTime(comment.date)}</span>
                                    </div>
                                    <div style={styles.commentText}>{comment.text}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '20px 0', fontSize: '14px' }}>첫 번째 댓글을 남겨보세요!</div>
                        )}
                    </div>

                    {/* 댓글 페이지네이션 UI */}
                    {totalCommentPages > 1 && (
                        <div style={styles.paginationContainer}>
                            {currentCommentPage > 1 && <button style={styles.pageBtn} onClick={() => handleCommentPageChange(1)}>{"<<"}</button>}
                            {currentCommentPage > 1 && <button style={styles.pageBtn} onClick={() => handleCommentPageChange(currentCommentPage - 1)}>{"<"}</button>}
                            
                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNum => (
                                <button 
                                    key={pageNum} 
                                    style={{ ...styles.pageBtn, ...(currentCommentPage === pageNum ? styles.activePageBtn : {}) }} 
                                    onClick={() => handleCommentPageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            
                            {currentCommentPage < totalCommentPages && <button style={styles.pageBtn} onClick={() => handleCommentPageChange(currentCommentPage + 1)}>{">"}</button>}
                            {currentCommentPage < totalCommentPages && <button style={styles.pageBtn} onClick={() => handleCommentPageChange(totalCommentPages)}>{" >>"}</button>}
                        </div>
                    )}

                    <div style={styles.commentInputWrapper}>
                        <textarea 
                            style={styles.commentTextarea}
                            placeholder="프로젝트에 대한 궁금한 점이나 의견을 남겨주세요."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button style={styles.commentSubmitBtn} onClick={handleCommentSubmit}>댓글 작성</button>
                    </div>
                </section>
            </main>

            {/* 로그인 안내 모달 */}
            {showLoginModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <p style={styles.modalText}>
                            로그인해야 이용하실 수 있습니다.<br />
                            로그인하시겠습니까?
                        </p>
                        <div style={styles.modalBtnGroup}>
                            <button 
                                style={styles.modalCancelBtn}
                                onClick={() => setShowLoginModal(false)}
                            >
                                돌아가기
                            </button>
                            <button 
                                style={styles.modalLoginBtn}
                                onClick={() => {
                                    setShowLoginModal(false);
                                    navigate('/login'); 
                                }}
                            >
                                로그인하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostDetailPage;