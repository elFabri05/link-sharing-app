import express from 'express';
import session from 'express-session';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const saltRounds = 10;

const app = express();
app.use(express.json());
const port = 3300;

const mongoDb = "mongodb+srv://fabriziomaffoni:Papurri1!@cluster0.ath8pdx.mongodb.net/";
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const LinkSchema = new Schema({
  platform: String,
  link: String,
});

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  emailAddress: String,
  links: [LinkSchema], 
});

// Compile the schema into a model if it hasn't been already compiled
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Validation Middleware
const validateUser = [
  body('username').trim().escape(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter'),
  body('emailAddress').isEmail().withMessage('Invalid email address').normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Route with Validation Middleware
app.post('/submit-form', validateUser, async (req, res) => {
  const { username, password, emailAddress } = req.body;
  try {
    const newUser = await User.create({
      username,
      password,
      emailAddress,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Corrected Express route for updating user links
app.post('/update-links', async (req, res) => {
  const { username, links } = req.body; // Ensure username is included in your request for identification
  
  try {
    // Directly update the user's links without re-processing if they match the LinkSchema
    const updatedUser = await User.findOneAndUpdate(
      { username: username }, // Use username to find the user
      { $set: { links: links } }, // Update links directly
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser); // Send back the updated user
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(session({ secret: "cats", 
                  resave: false, 
                  saveUninitialized: true, 
                  cookie: { secure: true } }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

