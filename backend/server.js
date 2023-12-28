require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const app = express();
const PORT = process.env.PORT || 5000;;

app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI, {dbName: 'workis'}, { useNewUrlParser: true, useUnifiedTopology: true });
const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

app.post('/api/register', async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    res.json({ success: true });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });

  delete user.password;
  delete user.__v;

  res.json({ success: true, token, user });
});

app.post('/api/verify-token', verifyToken, async (req, res) => {
  res.json({ message: 'Token is valid' });
});

app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    let query = {};

    if (req.query.searchTerm) {
      query.title = { $regex: new RegExp(req.query.searchTerm, 'i') };
    }

    const jobs = await Job.find(query).populate({
      path: 'employer',
      select: '-password -__v -email -role',
    }).skip(skip).limit(pageSize);

    const totalJobs = await Job.countDocuments(query);
    res.json({
      jobs,
      totalPages: Math.ceil(totalJobs / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const { title, description, location, type, salary, company, employer } = req.body;

    const newJob = new Job({
      title,
      description,
      location,
      type,
      salary,
      company,
      employer,
    });
    await newJob.save();

    res.json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/:id/applications', async (req, res) => {
  try {
    const jobId = req.params.id;

    const page = req.query.page || 1;
    const pageSize = 2;
    const skip = (page - 1) * pageSize;

    const job = await Job.findById(jobId).populate({
      path: 'applications',
      options: {
        skip: skip,
        limit: pageSize,
      },
    });

    const applications = job.applications;
    const jobWithoutSkip = await Job.findById(jobId).populate('applications');
    const totalApplications = jobWithoutSkip.applications.length;

    res.json({
      applications,
      totalPages: Math.ceil(totalApplications / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/:id/applications', async (req, res) => {
  try {
    const { id } = req.params;
    const { applicantId, name, surname, summary, resume, email } = req.body;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    const existingApplication = await Application.findOne({
      jobId: job._id,
      applicantId: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      jobId: job._id,
      applicantId,
      name,
      surname,
      summary,
      resume,
      email,
    });

    await application.save();

    job.applications.push(application._id);
    await job.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/employers/:id/jobs', async (req, res) => {
  try {
    const employerId = req.params.id;

    const jobs = await Job.find({ employer: employerId });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs for employer:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location, type, description, salary, company } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { title, location, type, description, salary, company },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job post not found' });
    }

    res.json({ success: true, updatedJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// app.delete('/api/jobs/:jobId', async (req, res) => {
//   const { jobId } = req.params;
//   const userId = req.query.user;

//   try {
//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: 'Job not found' });
//     }
    
//     if (job.employer.toString() !== userId.toString()) {
//       return res.status(403).json({ message: 'Unauthorized to delete this job' });
//     }

//     await Application.deleteMany({ job: jobId });

//     await job.deleteOne();

//     res.json({ message: 'Job and associated applications deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting job:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

app.get('/api/applications/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const userApplications = await Application.find({ applicant: userId }).populate('job');

    res.json(userApplications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.get('/api/applications/', async (req, res) => {
//   try {
//     const page = req.query.page || 1;
//     const pageSize = 10;
//     const skip = (page - 1) * pageSize;

//     const applications = await Application.find().populate('jobId').populate('applicantId').skip(skip).limit(pageSize);
//     const totalApplications = await Application.countDocuments();
//     res.json({
//       applications,
//       totalPages: Math.ceil(totalApplications / pageSize),
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error('Error fetching jobs:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.get('/api/jobs/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const jobs = await Application.find().populate('jobId').populate('applicantId').skip(skip).limit(pageSize);
    const total = await Application.countDocuments();
    res.json({
      applications,
      totalPages: Math.ceil(totalApplications / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/jobs/:jobId', getJob, (req, res) => {
  res.json(res.job);
});

app.post('/api/jobs', async (req, res) => {
  const job = new Job({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    type: req.body.type,
    salary: req.body.salary,
    company: req.body.company,
    employer: req.body.employer,
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/jobs/:jobId', getJob, async (req, res) => {
  try {
    const updatedJob = await res.job.set(req.body);
    await updatedJob.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/jobs/:jobId', getJob, async (req, res) => {
  try {
    await Application.deleteMany({ jobId: req.params.jobId });
    await res.job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (job == null) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.job = job;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:userId', getUser, (req, res) => {
  res.json(res.user);
});

app.post('/api/users', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/users/:userId', getUser, async (req, res) => {
  try {
    const updatedUser = await res.user.set(req.body);
    await updatedUser.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/users/:userId', getUser, async (req, res) => {
  try {
    await res.user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/applications/:applicationId', getApplication, (req, res) => {
  res.json(res.application);
});

app.post('/api/applications', async (req, res) => {
  const application = new Application({
    jobId: req.body.jobId,
    applicantId: req.body.applicantId,
    name: req.body.name,
    surname: req.body.surname,
    summary: req.body.summary,
    resume: req.body.resume,
    email: req.body.email,
  });

  try {
    const newApplication = await application.save();
    res.status(201).json(newApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/applications/:applicationId', getApplication, async (req, res) => {
  try {
    const updatedApplication = await res.application.set(req.body);
    await updatedApplication.save();
    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/applications/:applicationId', getApplication, async (req, res) => {
  try {
    await res.application.deleteOne();
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getApplication(req, res, next) {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (application == null) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.application = application;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


app.get('/api/users/:userId/applications', async (req, res) => {
  try {
    const userId = req.params.userId;
    const applications = await Application.find({ applicantId: userId }).populate('jobId');
    res.json(applications);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ error: 'Failed to fetch user applications.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


