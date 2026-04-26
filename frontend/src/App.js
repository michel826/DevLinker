import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 라우터 도구들 추가
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import MainPage from './MainPage';
import PostDetailPage from './PostDetailPage';
import ProjectListPage from './ProjectListPage';
import WritePostPage from './WritePostPage';
import './index.css';

function App() {
    // 로그인 여부만 상태로 관리합니다.
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        // 전체를 BrowserRouter로 감싸야 useSearchParams를 쓸 수 있습니다.
        <BrowserRouter>
            <div className="App">
                <Routes>
                    {/* 메인 페이지 */}
                    <Route path="/" element={
                        <MainPage 
                            isLoggedIn={isLoggedIn} 
                            onLogout={handleLogout} 
                        // 뷰 변경 대신 URL 이동(Navigate)은 각 컴포넌트 내부에서 Link나 useNavigate를 씁니다.
                        />
                    } />

                    {/* 목록 페이지 */}
                    <Route path="/list" element={
                        <ProjectListPage 
                            isLoggedIn={isLoggedIn}
                            onLogout={handleLogout}
                        />
                    } />

                    {/* 상세 페이지 (URL 파라미터 :postId 사용) */}
                    <Route path="/post/:postId" element={
                        <PostDetailPage 
                            isLoggedIn={isLoggedIn}
                            onLogout={handleLogout}
                        />
                    } />

                    {/* 로그인/회원가입 */}
                    <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/signup" element={<SignupPage onSignupSuccess={() => { }} />} />
                    
                    {/* 잘못된 경로 접속 시 메인으로 */}
                    <Route path="*" element={<Navigate to="/" />} />

                    {/* 작성 화면 */}
                    <Route path="/write" element={<WritePostPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />

                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;