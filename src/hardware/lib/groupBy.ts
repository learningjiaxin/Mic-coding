class Group<T> {
    public key: string;
    public members: T[] = [];

    constructor(key: string) {
        this.key = key;
    }
}

export default <T>(list: T[], func: (x: T) => string): Array<Group<T>> => {
    const res: Array<Group<T>> = [];
    // @ts-ignore
    let group: Group<T> = null;
    list.forEach((o) => {
        const groupName = func(o);
        if (group === null) {
            group = new Group<T>(groupName);
        }
        if (groupName !== group.key) {
            res.push(group);
            group = new Group<T>(groupName);
        }
        group.members.push(o);
    });
    if (group != null) {
        res.push(group);
    }
    return res;
};
