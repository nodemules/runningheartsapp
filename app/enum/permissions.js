{
  function permissionsEnum() {
    var permissions = {
      'ADD_VENUE': 1,
      'ADD_PLAYER': 2,
      'ADD_EVENT': 3,
      'ADD_SEASON': 4,
      'ADD_GAME': 5,
      'EDIT_VENUE': 6,
      'EDIT_PLAYER': 7,
      'EDIT_EVENT': 8,
      'EDIT_SEASON': 9,
      'EDIT_GAME': 10,
      'DELETE_VENUE': 11,
      'DELETE_PLAYER': 12,
      'DELETE_EVENT': 13,
      'DELETE_SEASON': 14,
      'DELETE_GAME': 15,
      'MODIFY_FINISHED_GAME': 16,
      'MAKE_DIRECTOR': 17,
      'VIEW_USER_DETAILS': 18
    };

    var myEnum = new Enum(permissions)
    return myEnum;
  }

  module.exports = permissionsEnum();
}
