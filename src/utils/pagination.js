/**
 * Creates an advanced pagination response object
 * @param {Array} results - The array of results for the current page
 * @param {number} page - The current page number
 * @param {number} limit - The number of items per page
 * @param {number} total - The total number of items across all pages
 * @param {Object} options - Additional options for pagination
 * @param {number} [options.maxPages=5] - Maximum number of page links to show
 * @param {Object} [options.query={}] - Additional query parameters to include in page links
 * @param {string} baseUrl - The base URL for generating page links
 * @return {Object} The pagination response object
 */
const createPaginationResponse = (
  results,
  page,
  limit,
  total,
  options = {},
  baseUrl
) => {
  const { maxPages = 5, query = {} } = options;

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  const endPage = Math.min(totalPages, startPage + maxPages - 1);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const createPageUrl = (pageNum) => {
    const queryString = new URLSearchParams({
      ...query,
      page: pageNum,
      limit,
    }).toString();
    return `${baseUrl}?${queryString}`;
  };

  return {
    results,
    pagination: {
      currentPage,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      nextPage:
        currentPage < totalPages ? createPageUrl(currentPage + 1) : null,
      prevPage: currentPage > 1 ? createPageUrl(currentPage - 1) : null,
      firstPage: createPageUrl(1),
      lastPage: createPageUrl(totalPages),
      pages: pages.map((pageNum) => ({
        page: pageNum,
        isCurrent: pageNum === currentPage,
        url: createPageUrl(pageNum),
      })),
    },
  };
};

module.exports = createPaginationResponse;
