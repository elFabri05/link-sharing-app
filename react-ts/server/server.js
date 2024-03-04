import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import session from 'express-session';
import multer from 'multer';
import sharp from 'sharp';

const Schema = mongoose.Schema;
const LocalStrategy = passportLocal.Strategy;
const saltRounds = 10;

const app = express();
app.use(express.json());
const port = 3300;

const mongoDb = "mongodb+srv://fabriziomaffoni:lRLPADPx9PhiX9KT@cluster0.ath8pdx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoDb)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const LinkSchema = new Schema({
  platform: String,
  link: String,
});

const UserSchema = new Schema({
  emailAddress: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  links: [LinkSchema],
  profilePicture: { type: Buffer },
  firstName: String,
  lastName: String,
  profileEmail: String,
});

// Compile the schema into a model if it hasn't been already compiled
const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.post('/', async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    const newUser = await User.create({
      emailAddress,
      password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

app.post('/links-settings', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User is not authenticated');
  }

  const userId = req.user._id;
  const { newLink } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { links: newLink } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const upload = multer({
  limits: { fileSize: 500000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
      return cb(new Error('Please upload an image.'));
    }
    cb(undefined, true);
  }
});

app.post('/profile-settings]', upload.single('profilePicture'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
  
  await User.findByIdAndUpdate(req.user.id, { profilePicture: buffer });
  res.send();
}, (error, req, res ) => {
  res.status(400).send({ error: error.message });
});

app.post('/profile-settings', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User is not authenticated');
  }

  const userId = req.user._id;
  const { firstName, lastName, email: profileEmail } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { firstName, lastName, profileEmail } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
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
