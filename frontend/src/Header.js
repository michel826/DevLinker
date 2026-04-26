import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가

/**
 * Header 컴포넌트
 * @param {Boolean} isLoggedIn -로그인 상태 여부
     * @param {Function} onLogout -로그아웃 버튼 클릭 시 실행될 함수
     */
function Header({ isLoggedIn, onLogout }) {
    // 라우터 이동을 위한 navigate 함수 선언
    const navigate = useNavigate();

    // 배너 관련 스타일 객체
    const styles = {
        header: { 
            display: 'flex', 
            justifyContent: 'space-between', // 로고는 왼쪽, 버튼은 오른쪽 끝에 배치
            alignItems: 'center',           // 세로 중앙 정렬
            padding: '0 10%',               // 좌우 여백
            height: '60px',                 // 배너 높이
            backgroundColor: '#fff', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // 하단 그림자 효과
            width: '100%', 
            position: 'sticky',             // 스크롤 시 상단 고정
            top: 0, 
            zIndex: 1000,                   // 다른 콘텐츠보다 위에 표시
            boxSizing: 'border-box'
        },
        logo: { 
            fontSize: '22px', 
            fontWeight: 'bold', 
            color: '#007bff', 
            cursor: 'pointer',              // 마우스 오버 시 손가락 모양
            letterSpacing: '-0.5px' 
        },
        navBtn: { 
            padding: '8px 20px', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '14px', 
            fontWeight: '600',
            transition: 'all 0.2s ease'     // 상태 변화 시 부드러운 애니메이션
        }
    };

    return (
        <header style={styles.header}>
            {/* 서비스 로고 영역 - 클릭 시 메인(/)으로 이동 */}
            <div style={styles.logo} onClick={() => navigate('/')}>
                DevLinker
            </div>
            
            {/* 로그인 상태에 따른 우측 버튼 조건부 렌더링 */}
            <nav>
                {isLoggedIn ? (
                    // 로그인 상태일 때는 로그아웃 버튼 표시
                    <button 
                        style={{ ...styles.navBtn, backgroundColor: '#f8f9fa', color: '#666', border: '1px solid #ddd' }} 
                        onClick={onLogout}
                    >
                        로그아웃
                    </button>
                ) : (
                    // 로그아웃 상태일 때는 로그인 버튼 표시 - 클릭 시 /login으로 이동
                    <button 
                        style={{ ...styles.navBtn, backgroundColor: '#007bff', color: 'white' }} 
                        onClick={() => navigate('/login')}
                    >
                        로그인
                    </button>
                )}
            </nav>
        </header>
    );
}

export default Header;