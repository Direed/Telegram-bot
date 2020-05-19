const buttons = require('./buttons');

module.exports = {
    start: [
        [buttons.start.user, buttons.start.ghost]
    ],
    main_user: [
        [buttons.main_user.replacements_user, buttons.main_user.schedule_user],
        [buttons.main_user.back_user]
    ],
    main_ghost: [
        [buttons.main_ghost.replacements_ghost, buttons.main_ghost.schedule_ghost],
        [buttons.main_ghost.back_ghost]
    ]
}