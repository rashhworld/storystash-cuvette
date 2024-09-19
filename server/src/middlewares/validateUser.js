const { body, validationResult } = require('express-validator');

const validateUser = [
    body('userName')
        .notEmpty().withMessage('Username cannot be empty.')
        .matches(/^[A-Za-z0-9]{6,}$/).withMessage('Username must be at least 6 characters and contain only letters and numbers without any space.'),

    body('userPass')
        .notEmpty().withMessage('Password cannot be empty.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/).withMessage('Password must be at least 6 characters long, with one number, one letter and one special character.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw Object.assign(Error(errors.array()[0].msg), { code: 404 });
        next();
    }
];

module.exports = { validateUser };
