import dotenv from 'dotenv-flow';
dotenv.config();
import express from 'express';
import cors from 'cors'; 
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import session from 'express-session';
import multer from 'multer';
import sharp from 'sharp';
import helmet from 'helmet';
import serverlessHttp from 'serverless-http';

const Schema = mongoose.Schema;
const LocalStrategy = passportLocal.Strategy;

const app = express();
app.use(express.json());
app.use(cors({origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3302', credentials: true, optionsSuccessStatus: 200 }));
app.use(helmet());
const PORT = process.env.PORT || 3301;
const saltRounds = process.env.SALT_ROUNDS || 10;

app.use(session({ secret: "cats", 
                  resave: false, 
                  saveUninitialized: true, 
                  cookie: { secure: process.env.NODE_ENV === 'production' }
                }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy({
    usernameField: 'emailAddress'
  }, async (emailAddress, password, done) => {
    try {
      const user = await User.findOne({ emailAddress: emailAddress});
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ success: false, message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.status(202).send({ success: true, message: "Authenticated successfully" });
    });
  })(req, res, next);
});

app.post('/create-account', async (req, res) => {
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

app.post('/links-settings', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User is not authenticated');
  }

  const userId = req.user._id;
  const { newLinks } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { links: newLinks } },
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
  limits: { fileSize: 2500000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
      return cb(new Error('Please upload an image.'));
    }
    cb(undefined, true);
  }
});

app.post('/profile-settings', upload.single('profilePicture'), async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User is not authenticated');
  }
  
  if (req.file) {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    await User.findByIdAndUpdate(req.user.id, { profilePicture: buffer });
  }

  next();
}, async (req, res) => {
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
}, (error, req, res) => {
  res.status(400).send({ error: error.message });
});

app.get('/links-settings', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User is not authenticated');
  }

  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.links);
  } catch (error) {
    console.error('Error fetching user links:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile-settings', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('User is not authenticated');
  }

  try {
    const user = await User.findById(req.user.id).select('firstName lastName profileEmail profilePicture links');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const profilePictureBase64 = user.profilePicture ? `data:image/png;base64,${user.profilePicture.toString('base64')}` : null;

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      profileEmail: user.profileEmail,
      profilePicture: profilePictureBase64,
      links: user.links,
    });

  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/profile', async (req, res) => {
  console.log('Attempting to retrieve user profile');
  if (!req.isAuthenticated()) {
    console.log("User is not authenticated");
    return res.status(401).send({ message: 'User is not authenticated' });
  }

  try {
    const user = await User.findById(req.user.id).select('-emailAddress -password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const profilePictureBase64 = user.profilePicture ? `data:image/png;base64,${user.profilePicture.toString('base64')}` : null;

    const userData = {
      ...user.toObject(),
      profilePicture: profilePictureBase64,
    };

    res.json(userData);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

const handler = serverlessHttp(app);
export const serverlessHandler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
});