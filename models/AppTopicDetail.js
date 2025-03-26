class AppTopicStudy {
  constructor(
    id,
    parentId,
    title,
    author,
    coverImage,
    content,
    additionalImages,
    type
  ) {
    this.id = id;
    this.title = title;
    this.parentId = parentId;
    this.author = author;
    this.coverImage = coverImage;
    this.content = content;
    this.additionalImages = additionalImages;
    this.type = type; // [link, ]
  }
}

export default AppTopic;
