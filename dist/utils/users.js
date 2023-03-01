"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.userLeave = exports.userJoin = void 0;
let users = [];
const userJoin = (id, username) => {
    let user = users.find((user) => user.username === username);
    if (user) {
        return false;
    }
    users.push({ id, username });
    return true;
};
exports.userJoin = userJoin;
const userLeave = (id) => {
    users = users.filter((user) => user.id !== id);
};
exports.userLeave = userLeave;
const getUsers = () => users;
exports.getUsers = getUsers;
