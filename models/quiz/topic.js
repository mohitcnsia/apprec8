/**
 *  Data Structure for Overview Screens and Reading Screens
 */
class Topic {
  constructor(
    id,
    title,
    description,
    content,
    coverImage,
    author,
    additionaImages,
    categoryIds
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.categoryIds = categoryIds;
    this.content = content;
    this.coverImage = coverImage;
    this.author = author;
    this.additionaImages = additionaImages;
  }
}

export default Topic;
