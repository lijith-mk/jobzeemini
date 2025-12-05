const Mentor = require('../models/Mentor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

exports.registerMentor = async (req, res) => {
    try {
        const { name, email, phone, password, country, city } = req.body;

        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const existingMentor = await Mentor.findOne({ email: email.toLowerCase() });
        if (existingMentor) {
            return res.status(400).json({ message: 'Mentor already exists with this email' });
        }

        let photoUrl = '';
        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file, 'jobzee/mentors');
                photoUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Photo upload failed:', uploadError);
                // Continue without photo or return error? 
                // Requirement says Photo is a field, but maybe optional? 
                // Let's assume it's okay to fail upload but warn, or fail registration.
                // For now, let's fail registration if upload fails as it seems to be a required field in the form.
                return res.status(500).json({ message: 'Failed to upload photo', error: uploadError.message });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const mentor = await Mentor.create({
            name,
            email,
            phone,
            password: hashedPassword,
            photo: photoUrl,
            country,
            city
        });

        res.status(201).json({ message: 'Mentor registered successfully. Please wait for admin approval.', mentorId: mentor._id });
    } catch (error) {
        console.error('Mentor registration error:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.loginMentor = async (req, res) => {
    try {
        const { email, password } = req.body;

        const mentor = await Mentor.findOne({ email: email.toLowerCase() });
        if (!mentor) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (mentor.status !== 'approved') {
            return res.status(403).json({ message: 'Your account is not approved yet. Please contact admin.' });
        }

        const isMatch = await bcrypt.compare(password, mentor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: mentor._id, role: 'mentor', email: mentor.email },
            process.env.JWT_SECRET || 'fallback_jwt_secret_key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            mentor: {
                _id: mentor._id,
                name: mentor.name,
                email: mentor.email,
                role: mentor.role,
                photo: mentor.photo
            }
        });
    } catch (error) {
        console.error('Mentor login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find().select('-password').sort({ createdAt: -1 });
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch mentors', error: error.message });
    }
};

exports.updateMentorStatus = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const mentor = await Mentor.findByIdAndUpdate(
            mentorId,
            { status },
            { new: true }
        );

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json({ message: `Mentor status updated to ${status}`, mentor });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update mentor status', error: error.message });
    }
};
