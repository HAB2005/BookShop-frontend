import styles from './Pagination.module.css';

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    hasNextPage,
    hasPrevPage,
    showPageNumbers = true,
    maxVisiblePages = 5
}) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages = [];
        const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = showPageNumbers ? getVisiblePages() : [];

    return (
        <div className={styles.pagination}>
            {/* Previous button */}
            <button
                className={`${styles.pageButton} ${styles.navButton}`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                aria-label="Previous page"
            >
                ‹
            </button>

            {/* Page numbers */}
            {showPageNumbers && (
                <>
                    {/* First page if not visible */}
                    {visiblePages[0] > 0 && (
                        <>
                            <button
                                className={styles.pageButton}
                                onClick={() => onPageChange(0)}
                            >
                                1
                            </button>
                            {visiblePages[0] > 1 && (
                                <span className={styles.ellipsis}>...</span>
                            )}
                        </>
                    )}

                    {/* Visible page numbers */}
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''
                                }`}
                            onClick={() => onPageChange(page)}
                        >
                            {page + 1}
                        </button>
                    ))}

                    {/* Last page if not visible */}
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <>
                            {visiblePages[visiblePages.length - 1] < totalPages - 2 && (
                                <span className={styles.ellipsis}>...</span>
                            )}
                            <button
                                className={styles.pageButton}
                                onClick={() => onPageChange(totalPages - 1)}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </>
            )}

            {/* Next button */}
            <button
                className={`${styles.pageButton} ${styles.navButton}`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNextPage}
                aria-label="Next page"
            >
                ›
            </button>

            {/* Page info */}
            <div className={styles.pageInfo}>
                Page {currentPage + 1} of {totalPages}
            </div>
        </div>
    );
}

export default Pagination;