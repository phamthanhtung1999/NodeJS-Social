const formatApiResponse = (data, status) => {
    return {
        data: data,  // Gán data truyền vào vào key 'data'
        status_text: status && status === 1 ? 'Success' : 'Error',  // Ví dụ: gán 'Success' nếu status là 1, 'Error' nếu không
    };
};

module.exports = { formatApiResponse };