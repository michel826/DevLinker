import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해 추가
import Header from './Header'; 

function MainPage({ isLoggedIn, onLogout }) {
    // --- 상태 관리 (State) ---
    // 서버에서 받아올 프로젝트 목록 데이터 저장
    const [projects, setProjects] = useState([]);
    // 데이터 로딩 중인지 여부 확인
    const [isLoading, setIsLoading] = useState(true);

    // 라우터 이동을 위한 navigate 함수
    const navigate = useNavigate();

    // --- 데이터 패칭 시뮬레이션 ---
    useEffect(() => {
        const timer = setTimeout(() => {
            // 임시 데이터 생성 (7개 이상 노출을 위해 데이터 추가)
            const mockData = [
                { id: 1, title: "플레이스홀더" },
                { id: 2, title: "임시 내용입니다" },
                { id: 3, title: "해당 내용은 작성 중입니다" },
                { id: 4, title: "ㅁㄴㅇㄹ" },
                { id: 5, title: "신규 구인 공고" },
                { id: 6, title: "여섯 번째 게시글" },
                { id: 7, title: "일곱 번째 게시글" },
                { id: 8, title: "여덟 번째 데이터" },
            ].map(item => ({
                ...item,
                // Math.random()을 사용하여 ongoing 또는 completed를 랜덤으로 부여
                status: Math.random() > 0.5 ? "ongoing" : "completed"
            }));

            // 최신 글이 위로 오도록 정렬
            const sortedData = [...mockData].sort((a, b) => b.id - a.id);

            setProjects(sortedData);
            setIsLoading(false); 
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    const styles = {
        // 전체 컨테이너
        container: { minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Arial' },
        
        // 메인 콘텐츠 영역 (가로 3열 배치를 위한 Flex 설정)
        contentWrapper: { 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',    // 화면이 좁아지면 아래로 떨어짐
            gap: '24px',         // 카드 사이 간격
            justifyContent: 'center',
            alignItems: 'stretch' // 모든 카드의 높이를 통일
        },
        
        // 섹션 카드 스타일 (세로 길이를 충분히 확보)
        sectionCard: { 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            padding: '30px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)', 
            flex: '1 1 320px',    // 최소 너비 320px 유지하며 확장
            maxWidth: '380px',    // 최대 너비 제한
            minHeight: '550px',   // 카드의 최소 세로 길이 확보
            boxSizing: 'border-box',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'space-between' // 내부 요소를 위아래로 분산
        },
        
        // 섹션 타이틀 (최근 프로젝트 등)
        sectionTitle: { 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '5px', 
            color: '#333', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '2px solid #007bff', 
            paddingBottom: '10px' 
        },
        
        // 전체보기 링크
        moreLink: { fontSize: '13px', color: '#007bff', cursor: 'pointer', fontWeight: 'normal' },
        
        // 프로젝트 리스트 레이아웃
        projectList: { listStyle: 'none', padding: 0, margin: 0, flex: 1 },
        projectItem: { padding: '13px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', cursor: 'pointer' },
        
        // 상태 태그 스타일
        statusTag: {
            width: '65px',       
            height: '23px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '4px', 
            fontSize: '11px', 
            fontWeight: 'bold', 
            marginRight: '15px', 
            color: '#fff', 
            flexShrink: 0 
        },
        tagOngoing: { backgroundColor: '#28a745' },
        tagCompleted: { backgroundColor: '#6c757d' },
        
        // 하단 작성 버튼
        bottomWriteBtn: { width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
        
        // 빈 공간/로딩 텍스트
        placeholderContent: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999', textAlign: 'center', border: '2px dashed #eee', borderRadius: '8px', margin: '10px 0' }
    };

    return (
        <div style={styles.container}>
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main style={styles.contentWrapper}>
                {/* 섹션 1: 최근 프로젝트 모집 */}
                <section style={styles.sectionCard}>
                    <div>
                        <div style={styles.sectionTitle}>
                            최신 프로젝트
                            <span style={styles.moreLink} onClick={() => navigate('/list')}>전체보기 &gt;</span>
                        </div>
                    
                        {isLoading ? (
                            <div style={styles.placeholderContent}>데이터를 불러오는 중...</div>
                        ) : (
                            <ul style={styles.projectList}>
                                {/* 최근 8개의 게시글만 잘라서 표시 */}
                                {projects.slice(0, 8).map((project) => (
                                    <li key={project.id} style={styles.projectItem} onClick={() => navigate(`/post/${project.id}`)}>
                                        <span style={{ 
                                            ...styles.statusTag, 
                                            ...(project.status === 'ongoing' ? styles.tagOngoing : styles.tagCompleted) 
                                        }}>
                                            {/* 상태 텍스트 변경 */}
                                            {project.status === 'ongoing' ? '모집 중' : '모집 완료'}
                                        </span>
                                        <span style={{ fontSize: '14px', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {project.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 작성 버튼 클릭 시 작성 페이지(/write)로 이동 */}
                    <button 
                        style={styles.bottomWriteBtn} 
                        onClick={() => isLoggedIn ? navigate('/write') : navigate('/login')}
                    >
                        {isLoggedIn ? '+ 새 프로젝트 모집' : '로그인하고 시작하기'}
                    </button>
                </section>

                {/* 섹션 2: 새로운 메뉴 1 */}
                <section style={styles.sectionCard}>
                    <div style={styles.sectionTitle}>새로운 메뉴 1</div>
                    <div style={styles.placeholderContent}>
                        <p>준비 중인 서비스입니다.</p>
                    </div>
                </section>

                {/* 섹션 3: 새로운 메뉴 2 */}
                <section style={styles.sectionCard}>
                    <div style={styles.sectionTitle}>새로운 메뉴 2</div>
                    <div style={styles.placeholderContent}>
                        <p>준비 중인 서비스입니다.</p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default MainPage;