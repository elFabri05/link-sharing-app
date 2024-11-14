import dotenv from 'dotenv-flow';
import express from 'express';
import cors from 'cors'; 
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import multer from 'multer';
import sharp from 'sharp';
import helmet from 'helmet';
import serverlessHttp from 'serverless-http';
import jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

dotenv.config();

const Schema = mongoose.Schema;
const LocalStrategy = passportLocal.Strategy;

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(express.json());
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(helmet());

const PORT = process.env.PORT || 3303;
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;

const mongoDb = process.env.MONGO_URI;
mongoose.connect(mongoDb)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a strong secret in production

app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));

// User Schema and Model
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

// Passport Local Strategy for Login
passport.use(
  new LocalStrategy({
    usernameField: 'emailAddress'
  }, async (emailAddress, password, done) => {
    try {
      const user = await User.findOne({ emailAddress: emailAddress });
      if (!user) {
        return done(null, false, { message: "Incorrect email address" });
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

// Passport JWT Strategy for Protected Routes
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.sub);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);

// Login Route
app.post("/", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ success: false, message: info.message });
    }
    // Generate JWT Token
    const payload = {
      sub: user.id,
      iat: Date.now(),
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({ token: `Bearer ${token}`, message: "Authenticated successfully" });
  })(req, res, next);
});

// Create Account Route
app.post('/create-account', async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const newUser = await User.create({
      emailAddress,
      password,
    });
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to Protect Routes
const authenticateJwt = passport.authenticate('jwt', { session: false });

// Links Settings Route
app.post('/links-settings', authenticateJwt, async (req, res) => {
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

// Upload Middleware for Profile Picture
const upload = multer({
  limits: { fileSize: 2500000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
      return cb(new Error('Please upload an image.'));
    }
    cb(undefined, true);
  }
});

// Profile Settings Route
app.post('/profile-settings', authenticateJwt, upload.single('profilePicture'), async (req, res, next) => {
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

// Get Links Settings Route
app.get('/links-settings', authenticateJwt, async (req, res) => {
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

// Get Profile Settings Route
app.get('/profile-settings', authenticateJwt, async (req, res) => {
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

// Get Profile Route
app.get('/profile', authenticateJwt, async (req, res) => {
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

// Serve Static Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

// Conditional app.listen for Local Development
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
}

// Export the handler for Vercel
export default serverlessHttp(app);
