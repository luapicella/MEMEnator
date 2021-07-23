const { check, validationResult } = require('express-validator');

exports.postMemesValidator = () => {
    return (
        [
            check('image')
                .not().isEmpty()
                .withMessage(' image is required')
                .bail()  //Stops running validations if any of the previous ones have failed.
                .isInt()
                .withMessage('image must be an integer'),
            check('title')
                .isLength({ min: 1 })
                .withMessage('must have at least one character')
                .bail()
                .isLength({ max: 100 })
                .withMessage('must have a maximum of one hundred characters'),
            check('phrases')
                .not().isEmpty()
                .withMessage('is required')
                .bail()
                .isArray({ min: 1 })
                .withMessage('at least one phrase is required'),
            check('phrases.*.id')  //wildcard
                .not().isEmpty()
                .withMessage('is required')
                .bail()
                .isInt()
                .withMessage('must be an integer'),
            check('phrases.*.text')  
                .not().isEmpty()
                .withMessage('is required')
                .bail()
                .isLength({ min: 1 })
                .withMessage('must have at least one character')
                .isLength({ max: 100 })
                .withMessage('must have a maximum of one hundred characters'),
            check('protect')
                .not().isEmpty()
                .withMessage('is required')
                .bail()
                .isBoolean()
                .withMessage('must be a boolean value'),
            check('color')
                .not().isEmpty()
                .withMessage('is required')
                .bail()
                .isIn(['white', 'green', 'red', 'blue']),
            check('font')
                .not().isEmpty()
                .withMessage('is required')
                .bail()
                .isIn(['impact', 'helvetica']),

        ]
    )
}

exports.deleteMemesValidator = () => {
    return(
        [
            check('id')
                .isInt()
                .withMessage('must be an integer'),
        ]
    )
}
