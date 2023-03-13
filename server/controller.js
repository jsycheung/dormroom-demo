require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const Sequelize = require("sequelize");
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
// manually setting the userId of the user viewing the page, for simplicity purposes
const userId = 5;

module.exports = {
  seed: (req, res) => {
    // seeding the db
    sequelize
      .query(
        `
        DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            display_name VARCHAR(255) NOT NULL,
            institution VARCHAR(255),
            year VARCHAR(255),
            major VARCHAR(255)
        );
        
        
        CREATE TABLE posts (
            post_id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(user_id),
            title VARCHAR(255) NOT NULL,
            looking_for VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            vacancy VARCHAR(255) NOT NULL,
            qualification VARCHAR(255) NOT NULL,
            description TEXT NOT NULL
        );

        CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            post_id INTEGER NOT NULL REFERENCES posts(post_id),
            user_id INTEGER NOT NULL REFERENCES users(user_id),
            comment TEXT NOT NULL
        );

        INSERT INTO users (display_name, institution, year, major)
        VALUES ('Jasmine Cheung', 'Massachusetts Institute of Technology', 'G1', 'Chemistry'),
        ('Jennifer Chan', 'The University of Hong Kong', '5', 'Speech and Hearing Sciences'),
        ('Andy Li', 'Open University', '1', 'English Studies'),
        ('David Ng', 'California Institute of Technology', '3', 'Chemical Engineering'),
        ('Alice Baker', 'The Hong Kong University of Science and Technology', '4', 'Finance'),
        ('Zach Zimmerman', 'Oxford University', '2', 'Computer Science'),
        ('Jason Wolf','Technical University of Munich', '3', 'Science Education');
        
          
        INSERT INTO posts (user_id, title, looking_for, location, vacancy, qualification, description)
        VALUES (1, 'ML speech therapy services', 'project collaborator', 'Boston', '2', 'machine learning experience, bachelors degree in computer science, natural sciences or social sciences-related fields', 'Hi All! I am interested in exploring the possibility of using machine learning to assist in delivering speech therapy services. Please reach out if you would like to know more about the idea!'),
        (7, 'Education equality social media page', 'project partners', 'Germany', '3', 'education/DE&I experience, any education level', 'Hello, I am passionate about making access to high quality education equal for everyone. If you wish to collaborate with me on launching a campaign on social media to provide information to high school students on higher education options, please contact me!');
        
        INSERT INTO comments (post_id, user_id, comment)
        VALUES (1, 2, 'Such an interesting project!'),
        (1, 6, 'great idea, would love to explore this'),
        (2, 3, 'Sounds exciting! I have reached out.');
        
        `
      )
      .then(() => {
        console.log("DB seeded");
        res.sendStatus(200);
      })
      .catch((err) => console.log(err));
  },
  getPosts: (req, res) => {
    // getting post information and author information from the db
    sequelize
      .query(
        `SELECT p.post_id, p.title, p.looking_for, p.location, p.vacancy, p.qualification, p.description, u.display_name, u.institution, u.user_id
      FROM posts AS p
      JOIN users AS u ON p.user_id = u.user_id
      ORDER BY p.post_id DESC;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  getComments: (req, res) => {
    // getting comment and author information from the db
    sequelize
      .query(
        `SELECT c.post_id, c.comment, u.display_name
        FROM comments AS c
        JOIN users AS u ON c.user_id = u.user_id
        ORDER BY c.comment_id;`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  getProfile: (req, res) => {
    // getting profile information from the db
    sequelize
      .query(
        `
        SELECT display_name, institution, year, major FROM users WHERE user_id = ${userId}
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  createComment: (req, res) => {
    // get the comment from the frontend and insert into db
    let { postId, commentContent } = req.body;
    postId = parseInt(postId);
    sequelize
      .query(
        `
        INSERT INTO comments (post_id, user_id, comment)
        VALUES (${postId}, ${userId}, '${commentContent}');
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  createPost: (req, res) => {
    // get the post content from the frontend and insert into db
    let { title, looking_for, location, vacancy, qualification, description } =
      req.body;
    sequelize
      .query(
        `
            INSERT INTO posts (user_id, title, looking_for, location, vacancy, qualification, description)
            VALUES (${userId}, '${title}', '${looking_for}', '${location}', '${vacancy}', '${qualification}', '${description}');
            `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  deletePost: (req, res) => {
    // get the post id from frontend and delete the post from the db
    let { id } = req.params;
    sequelize
      .query(`DELETE FROM posts WHERE posts.post_id = ${id};`)
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  editPost: (req, res) => {
    // get the updated post content from frontend and update in db
    let {
      postId,
      title,
      looking_for,
      location,
      vacancy,
      qualification,
      description,
    } = req.body;
    sequelize
      .query(
        `
            UPDATE posts
            SET title = '${title}',
            looking_for = '${looking_for}',
            location = '${location}',
            vacancy = '${vacancy}',
            qualification = '${qualification}',
            description = '${description}'
            WHERE post_id = ${postId};
            `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  getAPost: (req, res) => {
    // get the post id from frontend and query the specific post in db
    let { id } = req.params;
    postId = parseInt(id);
    sequelize
      .query(
        `
        SELECT title, looking_for, location, vacancy, qualification, description
        FROM posts
        WHERE post_id = ${postId}
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
};
