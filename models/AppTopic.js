class AppTopic {
  constructor(id, parentId, title, type, activities) {
    this.id = id;
    this.parentId = parentId;
    this.title = title;
    this.type = type;
    this.activities = activities; // Possible values - [ "STUDY" , "ACTIVITY", "COURSE", "QUIZ"]
  }
}

export default AppTopic;
