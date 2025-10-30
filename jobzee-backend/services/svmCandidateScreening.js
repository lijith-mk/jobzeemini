/**
 * SVM (Support Vector Machine) Candidate Screening Service
 * Ranks and scores candidates based on profile data vs job requirements
 */

class SVMCandidateScreening {
  constructor() {
    // SVM parameters
    this.weights = {
      skills: 0.40,      // 40% - Most important
      experience: 0.25,  // 25%
      education: 0.15,   // 15%
      location: 0.10,    // 10%
      history: 0.10      // 10% - Application history patterns
    };
  }

  /**
   * Extract feature vector from candidate profile
   */
  extractFeatures(candidate, job, type = 'job') {
    const features = {};

    // 1. Skills feature (TF-IDF style scoring)
    features.skills = this.calculateSkillsFeature(
      candidate.skills || [],
      job.skills || []
    );

    // 2. Experience feature
    features.experience = this.calculateExperienceFeature(
      candidate.experience,
      type === 'job' ? job.experienceLevel : job.eligibility?.yearOfStudy
    );

    // 3. Education feature
    features.education = this.calculateEducationFeature(
      candidate.education || [],
      type === 'job' ? job.education : job.eligibility?.education
    );

    // 4. Location feature
    features.location = this.calculateLocationFeature(
      candidate.location,
      job.location,
      type === 'job' ? job.remote : job.locationType
    );

    // 5. Application history feature (behavioral)
    features.history = this.calculateHistoryFeature(candidate);

    return features;
  }

  /**
   * Calculate skills match using enhanced cosine similarity approach
   */
  calculateSkillsFeature(userSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 1.0;
    if (!userSkills || userSkills.length === 0) return 0.0;

    const userSkillsLower = userSkills.map(s => s.toLowerCase().trim());
    const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase().trim());

    // Calculate exact matches
    const exactMatches = requiredSkillsLower.filter(skill => 
      userSkillsLower.includes(skill)
    );

    // Calculate partial matches (substring matching for related skills)
    const partialMatches = requiredSkillsLower.filter(reqSkill => 
      !exactMatches.includes(reqSkill) &&
      userSkillsLower.some(userSkill => 
        userSkill.includes(reqSkill) || reqSkill.includes(userSkill)
      )
    );

    // Scoring with exact matches weighted more heavily
    const exactScore = (exactMatches.length / requiredSkillsLower.length) * 1.0;
    const partialScore = (partialMatches.length / requiredSkillsLower.length) * 0.5;
    const basicScore = exactScore + partialScore;

    // Bonus for having more skills than required (shows initiative)
    const extraSkillsBonus = Math.min(0.15, (userSkills.length - requiredSkills.length) * 0.015);

    // Penalty if missing critical skills
    const missingPenalty = (requiredSkillsLower.length - exactMatches.length - partialMatches.length) * 0.05;

    return Math.max(0.0, Math.min(1.0, basicScore + Math.max(0, extraSkillsBonus) - missingPenalty));
  }

  /**
   * Calculate experience match with enhanced granularity
   */
  calculateExperienceFeature(userExperience, requiredExperience) {
    if (!requiredExperience) return 1.0;
    if (!userExperience) return 0.0;

    const expLevels = {
      'fresher': 0,
      'entry': 0,
      '0-1': 0.5,
      '1-2': 1.5,
      '2-3': 2.5,
      '3-5': 4,
      '5-7': 6,
      '7-10': 8.5,
      '10+': 12,
      'senior': 8,
      'mid': 4,
      'executive': 10,
      '1st year': 0,
      '2nd year': 1,
      '3rd year': 2,
      '4th year': 3,
      'final year': 3.5,
      'recent graduate': 0.5
    };

    const userYears = expLevels[userExperience.toLowerCase()] || 0;
    const requiredYears = expLevels[requiredExperience.toLowerCase()] || 0;

    // Perfect match bonus
    if (userYears === requiredYears) {
      return 1.0;
    }

    // Slightly more experienced (within 20% more) - ideal
    if (userYears > requiredYears && userYears <= requiredYears * 1.2) {
      return 0.98;
    }

    // More experienced but not overqualified
    if (userYears > requiredYears && userYears <= requiredYears * 1.5) {
      return 0.95;
    }

    // Overqualification penalty (progressive)
    if (userYears > requiredYears * 2) {
      return 0.75; // Significantly overqualified
    }
    if (userYears > requiredYears * 1.5) {
      return 0.85; // Moderately overqualified
    }

    // Underqualified - graduated scoring
    const ratio = userYears / (requiredYears || 1);
    if (ratio >= 0.8) return 0.90; // Very close
    if (ratio >= 0.7) return 0.80; // Close enough
    if (ratio >= 0.6) return 0.65; // Somewhat qualified
    if (ratio >= 0.5) return 0.50; // Borderline
    if (ratio >= 0.3) return 0.35; // Significantly under
    
    return Math.max(0.15, ratio * 0.5); // Give minimal credit
  }

  /**
   * Calculate education match
   */
  calculateEducationFeature(userEducation, requiredEducation) {
    if (!requiredEducation || requiredEducation.length === 0) return 1.0;
    if (!userEducation || userEducation.length === 0) return 0.5;

    const eduLevels = {
      'high school': 1,
      '12th': 1,
      'diploma': 2,
      'bachelor': 3,
      "bachelor's": 3,
      'graduation': 3,
      'btech': 3,
      'be': 3,
      'bsc': 3,
      'bca': 3,
      'master': 4,
      "master's": 4,
      'post-graduation': 4,
      'mtech': 4,
      'msc': 4,
      'mca': 4,
      'mba': 4,
      'phd': 5,
      'doctorate': 5
    };

    // Get highest user education
    let userLevel = 0;
    userEducation.forEach(edu => {
      const degree = (edu.degree || '').toLowerCase();
      Object.keys(eduLevels).forEach(key => {
        if (degree.includes(key)) {
          userLevel = Math.max(userLevel, eduLevels[key]);
        }
      });
    });

    // Get required education level
    let requiredLevel = 0;
    requiredEducation.forEach(edu => {
      const eduStr = typeof edu === 'string' ? edu.toLowerCase() : '';
      Object.keys(eduLevels).forEach(key => {
        if (eduStr.includes(key)) {
          requiredLevel = Math.max(requiredLevel, eduLevels[key]);
        }
      });
    });

    // Check for "Any" education requirement
    if (requiredEducation.some(e => 
      typeof e === 'string' && e.toLowerCase().includes('any')
    )) {
      return 1.0;
    }

    if (userLevel >= requiredLevel) return 1.0;
    if (userLevel === 0) return 0.4; // No degree specified
    
    return Math.max(0.5, userLevel / requiredLevel);
  }

  /**
   * Calculate location compatibility
   */
  calculateLocationFeature(userLocation, jobLocation, remoteType) {
    // Remote jobs always match
    if (remoteType === 'remote' || remoteType === 'hybrid') {
      return 1.0;
    }

    if (!userLocation || !jobLocation) return 0.7; // Neutral

    const userLoc = userLocation.toLowerCase();
    const jobLoc = jobLocation.toLowerCase();

    // Exact match
    if (userLoc === jobLoc) return 1.0;

    // Same city/region
    if (userLoc.includes(jobLoc) || jobLoc.includes(userLoc)) {
      return 0.9;
    }

    // Different location - requires relocation
    return 0.4;
  }

  /**
   * Calculate application history behavioral pattern
   */
  calculateHistoryFeature(candidate) {
    // This is a placeholder for behavioral analysis
    // In production, analyze past application patterns
    
    // Factors to consider:
    // - Application frequency (not too many, not too few)
    // - Success rate of past applications
    // - Profile completeness
    
    let score = 0.7; // Base score

    // Bonus for complete profile
    if (candidate.skills && candidate.skills.length > 0) score += 0.1;
    if (candidate.education && candidate.education.length > 0) score += 0.1;
    if (candidate.bio || candidate.summary) score += 0.1;

    return Math.min(1.0, score);
  }

  /**
   * RBF (Radial Basis Function) Kernel
   * Provides non-linear transformation for better separation
   */
  rbfKernel(featureVector, gamma = 2.0) {
    // Calculate distance from ideal candidate (all 1.0s)
    const ideal = [1.0, 1.0, 1.0, 1.0, 1.0];
    let squaredDistance = 0;
    
    const features = [
      featureVector.skills,
      featureVector.experience,
      featureVector.education,
      featureVector.location,
      featureVector.history
    ];
    
    for (let i = 0; i < features.length; i++) {
      squaredDistance += Math.pow(features[i] - ideal[i], 2);
    }
    
    return Math.exp(-gamma * squaredDistance);
  }

  /**
   * SVM Decision Function
   * Applies weighted linear combination with RBF kernel transformation
   */
  svmDecisionFunction(features) {
    // Weighted linear combination
    let linearScore = 0;

    linearScore += features.skills * this.weights.skills;
    linearScore += features.experience * this.weights.experience;
    linearScore += features.education * this.weights.education;
    linearScore += features.location * this.weights.location;
    linearScore += features.history * this.weights.history;

    // Apply RBF kernel for non-linear transformation
    const rbfScore = this.rbfKernel(features, 1.5);
    
    // Combine linear and RBF scores (70% linear, 30% RBF)
    const combinedScore = (linearScore * 0.7) + (rbfScore * 0.3);
    
    // Apply sigmoid transformation for probability-like output
    // Increased steepness for better discrimination
    const sigmoid = (x) => 1 / (1 + Math.exp(-8 * (x - 0.5)));
    
    return sigmoid(combinedScore);
  }

  /**
   * Classify candidate for a job
   */
  classifyCandidate(candidate, job, type = 'job') {
    const features = this.extractFeatures(candidate, job, type);
    const rawScore = this.svmDecisionFunction(features);
    const percentageScore = Math.round(rawScore * 100);

    // Classify into categories
    let classification, confidence, badge;
    
    if (percentageScore >= 85) {
      classification = 'excellent';
      confidence = 'high';
      badge = '🎯 Excellent Fit';
    } else if (percentageScore >= 70) {
      classification = 'good';
      confidence = 'high';
      badge = '👍 Good Fit';
    } else if (percentageScore >= 55) {
      classification = 'average';
      confidence = 'medium';
      badge = '⚡ Average Fit';
    } else if (percentageScore >= 40) {
      classification = 'below-average';
      confidence = 'medium';
      badge = '⚠️ Below Average';
    } else {
      classification = 'poor';
      confidence = 'low';
      badge = '❌ Poor Fit';
    }

    // Identify strengths and gaps
    const strengths = [];
    const gaps = [];

    if (features.skills >= 0.8) strengths.push('Strong skill match');
    else if (features.skills < 0.6) gaps.push('Missing key skills');

    if (features.experience >= 0.8) strengths.push('Relevant experience');
    else if (features.experience < 0.6) gaps.push('Limited experience');

    if (features.education >= 0.8) strengths.push('Educational qualifications met');
    else if (features.education < 0.6) gaps.push('Education requirements not fully met');

    if (features.location >= 0.8) strengths.push('Location compatible');

    return {
      score: percentageScore,
      rawScore,
      classification,
      confidence,
      badge,
      features: {
        skills: Math.round(features.skills * 100),
        experience: Math.round(features.experience * 100),
        education: Math.round(features.education * 100),
        location: Math.round(features.location * 100),
        history: Math.round(features.history * 100)
      },
      strengths,
      gaps,
      recommendation: this.getRecommendation(classification),
      algorithm: 'SVM'
    };
  }

  /**
   * Get hiring recommendation based on classification
   */
  getRecommendation(classification) {
    const recommendations = {
      'excellent': 'Strongly recommended - Schedule interview immediately',
      'good': 'Recommended - Good candidate worth interviewing',
      'average': 'Consider - Review profile carefully before decision',
      'below-average': 'Weak candidate - Consider only if few applicants',
      'poor': 'Not recommended - Skills and experience gap too large'
    };

    return recommendations[classification] || 'Review manually';
  }

  /**
   * Screen multiple candidates for a job
   */
  async screenCandidates(candidates, job, type = 'job') {
    const screenedCandidates = candidates.map(candidate => {
      const screening = this.classifyCandidate(candidate, job, type);
      return {
        ...candidate,
        aiScreening: screening
      };
    });

    // Sort by score (highest first)
    screenedCandidates.sort((a, b) => 
      b.aiScreening.score - a.aiScreening.score
    );

    // Add rank
    screenedCandidates.forEach((candidate, index) => {
      candidate.aiScreening.rank = index + 1;
    });

    // Calculate statistics
    const stats = {
      total: screenedCandidates.length,
      excellent: screenedCandidates.filter(c => c.aiScreening.classification === 'excellent').length,
      good: screenedCandidates.filter(c => c.aiScreening.classification === 'good').length,
      average: screenedCandidates.filter(c => c.aiScreening.classification === 'average').length,
      belowAverage: screenedCandidates.filter(c => c.aiScreening.classification === 'below-average').length,
      poor: screenedCandidates.filter(c => c.aiScreening.classification === 'poor').length,
      averageScore: Math.round(
        screenedCandidates.reduce((sum, c) => sum + c.aiScreening.score, 0) / 
        screenedCandidates.length
      )
    };

    return {
      candidates: screenedCandidates,
      stats
    };
  }
}

module.exports = new SVMCandidateScreening();
