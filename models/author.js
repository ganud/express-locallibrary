const mongoose = require("mongoose");

const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("lifespan").get(function () {
  return `${
    this.date_of_birth
      ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
          DateTime.DATE_MED
        )
      : ""
  } - ${this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : "Alive"}`;
});
// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Virtual for author's URL
AuthorSchema.virtual("DOBformatted").get(function () {
  if (this.date_of_birth) {
    return this.date_of_birth.toISOString().split("T")[0];
  }
  this.date_of_birth;
});

AuthorSchema.virtual("DODformatted").get(function () {
  if (this.date_of_death) {
    return this.date_of_death.toISOString().split("T")[0];
  }
  this.date_of_death;
});
// Export model
module.exports = mongoose.model("Author", AuthorSchema);
