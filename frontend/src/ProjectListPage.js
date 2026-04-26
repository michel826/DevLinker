import React, { useState, useMemo } from 'react'; 
import { useSearchParams, useNavigate } from 'react-router-dom'; // URL 관리 및 이동을 위해 추가
import Header from './Header'; 

// 날짜 포맷 변환 함수
const formatDisplayDate = (dateString) => {
    const postDate = new Date(dateString); 
    const now = new Date();               

    // '오늘'인지 확인
    const isToday = 
        postDate.getFullYear() === now.getFullYear() &&
        postDate.getMonth() === now.getMonth() &&
        postDate.getDate() === now.getDate();

    if (isToday) {
        // 오늘이라면 '시:분' 표시
        return postDate.toLocaleTimeString('ko-KR', {
            hour: '2-digit', minute: '2-digit', hour12: false
        });
    } else {
        // 오늘 이전이라면 '월.일' 표시
        return postDate.toLocaleDateString('ko-KR', {
            month: '2-digit', day: '2-digit'
        }).replace(/\s/g, '').replace(/\.$/, '');
    }
};

function ProjectListPage({ isLoggedIn, onLogout }) {
    // 라우터 이동을 위한 navigate 함수
    const navigate = useNavigate();
    // URL 쿼리 스트링 관리를 위한 Hook
    const [searchParams, setSearchParams] = useSearchParams();
    
    // 1. URL에서 검색 조건, 페이지 정보, 필터 상태 추출
    const currentType = searchParams.get('type') || "title_content"; // 기본값: 제목+내용
    const currentKeyword = searchParams.get('keyword') || "";       // 기본값: 빈 문자열
    const currentPage = parseInt(searchParams.get('page')) || 1;    // 기본값: 1페이지
    const currentFilter = searchParams.get('filter') || "all";      // 추가: 상태 필터 (all, ongoing, completed)

    // 하단 검색바 입력 상태 (실제 '검색' 버튼을 누르기 전까지의 로컬 상태)
    const [searchInput, setSearchInput] = useState(currentKeyword);
    const [searchTypeInput, setSearchTypeInput] = useState(currentType);

    // 2. 전체 데이터 생성 (테스트용 1000개)
    const allProjects = useMemo(() => 
        Array.from({ length: 1000 }, (_, i) => ({
            id: 1000 - i, 
            title: `플레이스홀더 ${1000 - i}`,
            status: Math.random() > 0.5 ? "ongoing" : "completed", 
            date: new Date(Date.now() - i * 3600000).toISOString(),
            views: Math.floor(Math.random() * 1500),
            comments: Math.floor(Math.random() * 150)
        })), []
    );

    // 3. 검색 및 상태 필터링 통합 로직
    const filteredProjects = useMemo(() => {
        return allProjects.filter(p => {
            // A. 검색어 필터링 (현재는 제목 기준)
            const keyword = currentKeyword.toLowerCase();
            const matchesKeyword = p.title.toLowerCase().includes(keyword);

            // B. 상태 필터링 (all이 아니면 ongoing/completed 값 비교)
            const matchesStatus = currentFilter === "all" || p.status === currentFilter;

            return matchesKeyword && matchesStatus;
        });
    }, [allProjects, currentKeyword, currentFilter]);

    // 4. 페이지네이션 및 슬라이딩 윈도우 계산 로직
    const itemsPerPage = 15;
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
    const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    const maxPageButtons = 10; 

    let startPage, endPage;
    if (totalPages <= maxPageButtons) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const half = Math.floor(maxPageButtons / 2);
        if (currentPage <= half) {
            startPage = 1;
            endPage = maxPageButtons;
        } else if (currentPage + half >= totalPages) {
            startPage = totalPages - maxPageButtons + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - half + 1;
            endPage = currentPage + (maxPageButtons - half);
        }
    }

    // 5. 검색 실행 함수 (URL 이동 경로를 /list로 수정)
    const handleSearch = () => {
        // 검색 시 현재 선택된 필터(filter) 상태도 함께 URL에 포함하여 유지함
        const query = `/list?type=${searchTypeInput}&keyword=${encodeURIComponent(searchInput)}&page=1&filter=${currentFilter}`;
        navigate(query);
    };

    // 6. 상단 색인 필터 변경 핸들러
    const handleFilterChange = (e) => {
        const nextFilter = e.target.value;
        // 필터가 변경되면 결과가 달라지므로 페이지를 1로 리셋하여 URL 이동
        setSearchParams({ 
            type: currentType, 
            keyword: currentKeyword, 
            page: 1, 
            filter: nextFilter 
        });
    };

    // 7. 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setSearchParams({ type: currentType, keyword: currentKeyword, page: pageNumber, filter: currentFilter });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- 스타일 정의  ---
    const styles = {
        // 전체 페이지 배경 및 레이아웃 컨테이너
        container: { 
            minHeight: '100vh', 
            backgroundColor: '#f4f7f6', 
            fontFamily: 'Arial', 
            paddingBottom: '40px', 
            boxSizing: 'border-box' 
        },
        // 실제 콘텐츠가 들어가는 중앙 정렬 래퍼
        contentWrapper: { 
            maxWidth: '1000px', 
            margin: '40px auto', 
            padding: '0 20px' 
        },
        // 게시글 목록을 감싸는 흰색 카드 박스
        listCard: { 
            backgroundColor: '#fff', 
            borderRadius: '12px', 
            padding: '30px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)' 
        },
        // 상단 제목 및 버튼(작성하기)이 배치되는 영역
        titleSection: { 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '10px', 
            paddingBottom: '10px' 
        },
        // 페이지 메인 타이틀(전체 모집글 목록 등) 스타일
        pageTitle: { 
            fontSize: '22px', 
            fontWeight: 'bold', 
            margin: 0 
        },
        // 하단 검색바를 감싸는 컨테이너
        searchContainer: { 
            display: 'flex', 
            marginTop: '30px', 
            gap: '8px', 
            maxWidth: '700px', 
            margin: '30px auto 0 auto' 
        },
        // 검색 옵션 선택 박스(Select) 스타일
        searchSelect: { 
            padding: '10px 30px 10px 15px', // 우측 화살표 공간 확보를 위해 오른쪽 패딩을 늘림
            borderRadius: '6px', 
            border: '1px solid #ddd', 
            fontSize: '14px', 
            backgroundColor: '#fff', 
            outline: 'none', 
            cursor: 'pointer', 
            minWidth: '110px',
            appearance: 'none',            // 브라우저 기본 화살표 숨기기
            WebkitAppearance: 'none',      // 사파리용 기본 화살표 숨기기
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `left 90% center`, // 화살표 위치 조절
            backgroundSize: '16px',        // 화살표 아이콘 크기
        },
        // 검색어 입력창(Input) 스타일
        searchInput: { 
            flex: 1, 
            padding: '10px 15px', 
            borderRadius: '6px', 
            border: '1px solid #ddd', 
            fontSize: '14px', 
            outline: 'none' 
        },
        // 검색 실행 버튼 스타일
        searchBtn: { 
            padding: '0 25px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            whiteSpace: 'nowrap', 
            flexShrink: 0
        },
        // 리스트 최상단 인덱스(상태, 제목, 작성일 등) 헤더 행
        listHeader: { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '12px 0', 
            borderBottom: '2px solid #333' 
        },
        // 헤더 행 내부의 글자 라벨 스타일
        headerLabel: { 
            fontSize: '13px', 
            fontWeight: 'bold', 
            color: '#666', 
            textAlign: 'center' 
        },
        // 상단 색인의 상태 필터링 드롭다운 스타일
        headerFilterSelect: {
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '13px',
            fontWeight: 'bold',
            cursor: 'pointer',
            outline: 'none',
            textAlign: 'center',
            width: '80px',
            marginLeft: '5px',
            marginRight: '20px'
        },
        // 개별 게시글 리스트 항목(Row) 스타일
        projectItem: { 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '10px 0', 
            borderBottom: '1px solid #eee', 
            cursor: 'pointer' 
        },
        // 상태 태그(모집 중 / 모집 완료) 공통 스타일
        statusTag: { 
            width: '60px', 
            height: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '4px', 
            fontSize: '11px', 
            fontWeight: 'bold', 
            marginLeft: '10px',
            marginRight: '35px', 
            color: '#fff', 
            flexShrink: 0 
        },
        // '모집 중' 상태 배경색 (초록)
        tagOngoing: { backgroundColor: '#28a745' },
        // '모집 완료' 상태 배경색 (회색)
        tagCompleted: { backgroundColor: '#6c757d' },
        // 게시글 제목 스타일 (말줄임표 적용)
        projectTitle: { 
            fontSize: '17px', 
            fontWeight: '500', 
            color: '#333', 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            flex: 1 
        },
        // 리스트 우측 정보(댓글, 날짜, 조회수) 묶음 영역
        rightGroup: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            flexShrink: 0 
        },
        // 페이지네이션 버튼들을 감싸는 영역
        paginationContainer: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '5px', 
            marginTop: '30px' 
        },
        // 개별 페이지 숫자/화살표 버튼 스타일
        pageBtn: { 
            minWidth: '32px', 
            height: '32px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            borderRadius: '4px', 
            border: '1px solid #dee2e6', 
            backgroundColor: '#fff', 
            cursor: 'pointer', 
            fontSize: '13px' 
        },
        // 현재 선택된 페이지 버튼 강조 스타일 (파란색)
        activePageBtn: { 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: '1px solid #007bff', 
            fontWeight: 'bold' 
        }
    };

    return (
        <div style={styles.container}>
            <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />

            <main style={styles.contentWrapper}>
                <div style={styles.listCard}>
                    <div style={styles.titleSection}>
                        <h1 style={styles.pageTitle}>
                            {currentKeyword ? `'${currentKeyword}' 검색 결과` : '전체 모집글 목록'}
                        </h1>
                        {/* ─── 수정 포인트: 작성 버튼 클릭 시 작성 페이지(/write)로 이동 ─── */}
                        <button 
                            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={() => isLoggedIn ? navigate('/write') : navigate('/login')}
                        >
                            + 새 모집글 작성
                        </button>
                    </div>

                    {/* ─── 리스트 헤더 (상태 라벨을 드롭다운 메뉴로 구현) ─── */}
                    <div style={styles.listHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>                           
                            {/* "상태" 텍스트를 select 박스로 변경하여 필터 기능 제공 */}
                            <select 
                                style={styles.headerFilterSelect} 
                                value={currentFilter}
                                onChange={handleFilterChange}
                            >
                                <option value="all">모두 보기</option>
                                <option value="ongoing">모집 중</option>
                                <option value="completed">모집 완료</option>
                            </select>
                            <span style={{ ...styles.headerLabel, textAlign: 'left' }}>제목</span>
                        </div>
                        <div style={styles.rightGroup}>
                            <span style={{ ...styles.headerLabel, width: '40px' }}>댓글</span>
                            <span style={{ ...styles.headerLabel, width: '50px' }}>작성일</span>
                            <span style={{ ...styles.headerLabel, width: '40px' }}>조회수</span>
                        </div>
                    </div>

                    {/* ─── 리스트 본문 ─── */}
                    <div style={{ minHeight: '400px' }}>
                        {currentProjects.length > 0 ? (
                            currentProjects.map((p) => (
                                <div key={p.id} style={styles.projectItem} onClick={() => navigate(`/post/${p.id}`)}>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                                        <span style={{ ...styles.statusTag, ...(p.status === 'ongoing' ? styles.tagOngoing : styles.tagCompleted) }}>
                                            {p.status === 'ongoing' ? '모집 중' : '모집 완료'}
                                        </span>
                                        <span style={styles.projectTitle}>{p.title}</span>
                                    </div>
                                    <div style={styles.rightGroup}>
                                        <span style={{ fontSize: '13px', color: '#999', width: '40px', textAlign: 'center' }}>{p.comments >= 100 ? '99+' : p.comments}</span>
                                        <span style={{ fontSize: '14px', color: '#999', width: '50px', textAlign: 'center' }}>{formatDisplayDate(p.date)}</span>
                                        <span style={{ fontSize: '13px', color: '#bbb', width: '40px', textAlign: 'center' }}>{p.views >= 1000 ? '999+' : p.views}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '100px 0', color: '#999' }}>결과가 없습니다.</div>
                        )}
                    </div>

                    {/* 페이지네이션 버튼 영역 */}
                    {totalPages > 1 && (
                        <div style={styles.paginationContainer}>
                            {currentPage > 1 && <button style={styles.pageBtn} onClick={() => handlePageChange(1)}>{"<<"}</button>}
                            {currentPage > 1 && <button style={styles.pageBtn} onClick={() => handlePageChange(currentPage - 1)}>{"<"}</button>}
                            
                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNum => (
                                <button 
                                    key={pageNum} 
                                    style={{ ...styles.pageBtn, ...(currentPage === pageNum ? styles.activePageBtn : {}) }} 
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            ))}
                            
                            {currentPage < totalPages && <button style={styles.pageBtn} onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>}
                            {currentPage < totalPages && <button style={styles.pageBtn} onClick={() => handlePageChange(totalPages)}>{" >>"}</button>}
                        </div>
                    )}

                    {/* 하단 검색창 영역 */}
                    <div style={styles.searchContainer}>
                        <select style={styles.searchSelect} value={searchTypeInput} onChange={(e) => setSearchTypeInput(e.target.value)}>
                            <option value="title_content">제목+내용</option>
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                        </select>
                        <input type="text" placeholder="검색어를 입력하세요" style={styles.searchInput} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
                        <button style={styles.searchBtn} onClick={handleSearch}>검색</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProjectListPage;