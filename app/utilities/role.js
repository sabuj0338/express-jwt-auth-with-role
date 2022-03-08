class Role {
    static superAdmin = "super-admin";
    static admin = "admin";
    static moderator = "moderator";
    static user = "user";
    static all = [this.superAdmin, this.admin, this.moderator, this.user];
    static onlyAdminAndModerator = [this.admin, this.moderator];
}

module.exports = Role;