import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

/**
 * 로그인 페이지 컴포넌트
 */
function LoginPage({ onLoginSuccess }) {
    const navigate = useNavigate(); 

    // ─── 폼 데이터 및 에러 상태 관리 ───
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });

    // ─── 입력값 변경 핸들러 ───
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
     
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setErrors({ ...errors, email: emailRegex.test(value) ? '' : '올바른 이메일 형식이 아닙니다.' });
        }
        if (name === 'password') {
            setErrors({ ...errors, password: value.length >= 8 ? '' : '비밀번호는 최소 8자 이상 입력해주세요.' });
        }
    };

    // ─── 로그인 제출 핸들러 ───
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!errors.email && !errors.password && formData.email && formData.password) {
            // 1. 로그인 상태 업데이트
            onLoginSuccess();
            
            // 2. 이전 화면으로 돌아가기
            navigate(-1);
        } else {
            alert("입력 정보를 확인해주세요.");
        }
    };

    // ─── 스타일 정의 ───
    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial, sans-serif' },
        loginBox: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
        title: { textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold', color: '#333' },
        inputGroup: { marginBottom: '20px' },
        label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666', fontWeight: '500' },
        input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' },
        passwordContainer: { position: 'relative' },
        toggleBtn: { position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center' },
        button: { width: '100%', padding: '14px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' },
        signupText: { textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' },
        signupLink: { color: '#007bff', marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold' },
        errorText: { color: '#ff4d4f', fontSize: '12px', marginTop: '5px' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2 style={styles.title}>로그인</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>이메일</label>
                        <input 
                            type="email" name="email" placeholder="example@email.com"
                            style={{ ...styles.input, borderColor: errors.email ? '#ff4d4f' : '#ddd' }} 
                            value={formData.email} onChange={handleChange} required
                        />
                        {errors.email && <div style={styles.errorText}>{errors.email}</div>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>비밀번호</label>
                        <div style={styles.passwordContainer}>
                            <input 
                                type={showPassword ? "text" : "password"} name="password" placeholder="8자 이상 입력"
                                style={{ ...styles.input, borderColor: errors.password ? '#ff4d4f' : '#ddd', paddingRight: '45px' }} 
                                value={formData.password} onChange={handleChange} required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.toggleBtn}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <div style={styles.errorText}>{errors.password}</div>}
                    </div>

                    <button type="submit" style={styles.button}>로그인하기</button>
                </form>

                <div style={styles.signupText}>
                    계정이 없으신가요? 
                    <span onClick={() => navigate('/signup', { replace: true })} style={styles.signupLink}>회원가입</span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;