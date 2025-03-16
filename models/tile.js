/**
 * Data structure for Carousal Item/Tile or Any card with minimal details.
 */
class AppTile {
  constructor(id, name, image, duration, type, author, category) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.duration = duration;
    this.type = type;
    this.author = author;
    this.category = category;
  }
}

export default AppTile;
