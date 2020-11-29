export const batchUsers = async (keys, models) => {
    console.log('keys', keys);

    const users = await models.User.find({
        _id: {
            $in: keys,
        },
    });
    console.log('users', users);
    // return [{ id: `1` }, { id: `2` }, { id: `3` }];
    return users
};