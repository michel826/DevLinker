import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; 

/**
 * 모집글 작성 페이지 컴포넌트
 */
function WritePostPage({ isLoggedIn, onLogout }) {
    const navigate = useNavigate();

    // ─── 폼 데이터 상태 관리 ───
    const [formData, setFormData] = useState({
        title: '',
        // 화면에는 없지만, 데이터 전송 시 기본값으로 'ongoing'을 유지합니다.
        status: 'ongoing', 
        tags: '',
        content: ''
    });

    // ─── 입력값 변경 핸들러 ───
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ─── 작성 제출 핸들러 ───
    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("새 모집글 데이터:", {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            date: new Date().toISOString() 
        });

        alert("모집글이 등록되었습니다.");
        navigate('/list'); 
    };

    // --- 스타일 정의 ---
    const styles = {
        container: { 
            minHeight: '100vh', 
            backgroundColor: '#f4f7f6', 
            fontFamily: 'Arial, sans-serif', 
            boxSizing: 'border-box' 
        },
        contentWrapper: { 
            maxWidth: '800px', 
            margin: '40px auto', 
            padding: '0 20px' 
        },
        card: { 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            padding: '25px 40px 40px 40px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)' 
        },
        pageTitle: { 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '30px', 
            color: '#333',
            borderBottom: '2px solid #007bff', 
            paddingBottom: '10px',
            display: 'inline-block'
        },
        inputGroup: { 
            marginBottom: '20px' 
        },
        label: { 
            display: 'block', 
            fontSize: '15px', 
            fontWeight: 'bold', 
            marginBottom: '8px', 
            color: '#555' 
        },
       input: { 
            width: '100%', 
            padding: '12px 15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            fontSize: '16px', 
            fontFamily: 'inherit', // 전체 폰트 설정 상속
            boxSizing: 'border-box', 
            outline: 'none',
            transition: 'border-color 0.2s'
        },
        textarea: { 
            width: '100%', 
            height: '300px', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            fontSize: '16px', 
            fontFamily: 'inherit', // 전체 폰트 설정 상속
            boxSizing: 'border-box', 
            outline: 'none', 
            resize: 'vertical', 
            lineHeight: '1.6'
        },
        buttonGroup: { 
            display: 'flex', 
            gap: '12px', 
            marginTop: '30px' 
        },
        cancelBtn: { 
            flex: 1, 
            padding: '15px', 
            backgroundColor: '#eee', 
            color: '#666', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
        },
        submitBtn: { 
            flex: 2, 
            padding: '15px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
        }
    };

    return (
        <div style={styles.container}>
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main style={styles.contentWrapper}>
                <div style={styles.card}>
                    <h2 style={styles.pageTitle}>새 프로젝트 모집글 작성</h2>
                    
                    <form onSubmit={handleSubmit}>
                        {/* 1. 제목 입력 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>프로젝트 제목</label>
                            <input 
                                type="text" 
                                name="title"
                                placeholder="제목을 입력해주세요"
                                style={styles.input}
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 2. 상세 내용 입력  */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>상세 내용</label>
                            <textarea 
                                name="content"
                                placeholder="프로젝트의 목적, 요구되는 기술 스택, 예상 기간 등을 자세히 적어주세요."
                                style={styles.textarea}
                                value={formData.content}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 3. 태그 입력  */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>태그 (쉼표로 구분)</label>
                            <input 
                                type="text" 
                                name="tags"
                                placeholder=""
                                style={styles.input}
                                value={formData.tags}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 4. 버튼 영역 */}
                        <div style={styles.buttonGroup}>
                            <button 
                                type="button" 
                                style={styles.cancelBtn}
                                onClick={() => navigate(-1)}
                            >
                                취소
                            </button>
                            <button 
                                type="submit" 
                                style={styles.submitBtn}
                            >
                                모집글 등록하기
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default WritePostPage;