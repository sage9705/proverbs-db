const createPaginationResponse = (results, page, limit, total, baseUrl) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    results,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage
        ? `${baseUrl}?page=${page + 1}&limit=${limit}`
        : null,
      prevPage: hasPrevPage
        ? `${baseUrl}?page=${page - 1}&limit=${limit}`
        : null,
    },
  };
};

module.exports = createPaginationResponse;
