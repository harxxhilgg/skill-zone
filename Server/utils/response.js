export const respond = (res, message, statuscode, success, data = null) => {
    const response = { message, success, status: statuscode };
    if (data !== null) {
        response.data = data;
    }
    // res.status(response.status).json(response);
    res.status(response.status).json(response);
};

// Usage when there is data
// respond(res, "all reviews fetched successfully", 200, true, allReviews);

// Usage when there is no data
// respond(res, "Operation successful", 200, true);
