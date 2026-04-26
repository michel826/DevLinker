import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * 회원가입 페이지 컴포넌트
 */
function SignupPage() {
    const navigate = useNavigate(); 

    // ─── 폼 데이터 및 상태 관리 ───
    const [formData, setFormData] = useState({ email: '', password: '', passwordConfirm: '', nickname: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '', passwordConfirm: '', nickname: '' });

    // ─── 입력값 변경 및 실시간 유효성 검사 핸들러 ───
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        let errorMsg = '';
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errorMsg = emailRegex.test(value) ? '' : '올바른 이메일 형식이 아닙니다.';
        } else if (name === 'password') {
            errorMsg = value.length >= 8 ? '' : '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (name === 'passwordConfirm') {
            errorMsg = value === formData.password ? '' : '비밀번호가 일치하지 않습니다.';
        } else if (name === 'nickname') {
            errorMsg = value.trim().length >= 2 ? '' : '닉네임은 최소 2자 이상이어야 합니다.';
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    // ─── 회원가입 제출 핸들러 ───
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const hasError = Object.values(errors).some(msg => msg !== '');
        const isComplete = Object.values(formData).every(val => val !== '');

        if (!hasError && isComplete) {
            alert("회원가입이 완료되었습니다!");

            navigate('/login', { replace: true }); 
        } else {
            alert("입력 정보를 확인해주세요.");
        }
    };

    // ─── 스타일 정의 ───
    const styles = {
        container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial', padding: '20px' },
        card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', width: '100%', maxWidth: '450px', boxSizing: 'border-box' },
        title: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px', color: '#333' },
        inputGroup: { marginBottom: '18px' },
        label: { display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#666' },
        input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box', outline: 'none' },
        passwordContainer: { position: 'relative', display: 'flex', alignItems: 'center' },
        toggleBtn: { position: 'absolute', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' },
        errorText: { color: '#ff4d4f', fontSize: '12px', marginTop: '5px' },
        button: { width: '100%', padding: '14px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' },
        footerText: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#666' },
        link: { color: '#007bff', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>DevLinker 회원가입</h2>
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>닉네임</label>
                        <input 
                            type="text" name="nickname" placeholder="활동할 별명을 입력하세요"
                            style={{ ...styles.input, borderColor: errors.nickname ? '#ff4d4f' : '#ddd' }}
                            value={formData.nickname} onChange={handleChange} required
                        />
                        {errors.nickname && <div style={styles.errorText}>{errors.nickname}</div>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>이메일 주소</label>
                        <input 
                            type="email" name="email" placeholder="example@link.com"
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

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>비밀번호 확인</label>
                        <div style={styles.passwordContainer}>
                            <input 
                                type={showPasswordConfirm ? "text" : "password"} name="passwordConfirm" placeholder="비밀번호 재입력"
                                style={{ ...styles.input, borderColor: errors.passwordConfirm ? '#ff4d4f' : '#ddd', paddingRight: '45px' }}
                                value={formData.passwordConfirm} onChange={handleChange} required
                            />
                            <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} style={styles.toggleBtn}>
                                {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.passwordConfirm && <div style={styles.errorText}>{errors.passwordConfirm}</div>}
                    </div>

                    <button type="submit" style={styles.button}>가입하기</button>
                </form>
                
                <div style={styles.footerText}>
                    이미 계정이 있으신가요?{' '}
                    <span style={styles.link} onClick={() => navigate('/login', { replace: true })}>로그인</span>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;