/**
 * Neural Network Salary Predictor with Backpropagation
 * Predicts salary based on skills, experience, location, education, and job type
 */

class NeuralNetworkSalaryPredictor {
  constructor() {
    // Network architecture: Input -> Hidden1 -> Hidden2 -> Output
    this.inputSize = 50;   // Feature vector size
    this.hidden1Size = 32; // First hidden layer
    this.hidden2Size = 16; // Second hidden layer
    this.outputSize = 1;   // Salary prediction
    
    // Learning parameters
    this.learningRate = 0.01;
    this.momentum = 0.9;
    
    // Initialize weights with Xavier initialization
    this.initializeWeights();
    
    // Pre-trained flag (in production, load from DB/file)
    this.isTrained = false;
    
    // Feature mappings
    this.skillsIndex = this.buildSkillsIndex();
    this.locationIndex = this.buildLocationIndex();
    this.categoryIndex = this.buildCategoryIndex();
  }

  /**
   * Initialize network weights using Xavier initialization
   */
  initializeWeights() {
    // Weights from input to hidden1
    this.W1 = this.randomMatrix(this.inputSize, this.hidden1Size, 
      Math.sqrt(2.0 / this.inputSize));
    this.b1 = new Array(this.hidden1Size).fill(0);
    
    // Weights from hidden1 to hidden2
    this.W2 = this.randomMatrix(this.hidden1Size, this.hidden2Size,
      Math.sqrt(2.0 / this.hidden1Size));
    this.b2 = new Array(this.hidden2Size).fill(0);
    
    // Weights from hidden2 to output
    this.W3 = this.randomMatrix(this.hidden2Size, this.outputSize,
      Math.sqrt(2.0 / this.hidden2Size));
    this.b3 = new Array(this.outputSize).fill(0);
    
    // Velocity for momentum (SGD with momentum)
    this.vW1 = this.zeroMatrix(this.inputSize, this.hidden1Size);
    this.vb1 = new Array(this.hidden1Size).fill(0);
    this.vW2 = this.zeroMatrix(this.hidden1Size, this.hidden2Size);
    this.vb2 = new Array(this.hidden2Size).fill(0);
    this.vW3 = this.zeroMatrix(this.hidden2Size, this.outputSize);
    this.vb3 = new Array(this.outputSize).fill(0);
  }

  /**
   * Create random matrix with given dimensions and scale
   */
  randomMatrix(rows, cols, scale) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = [];
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = (Math.random() * 2 - 1) * scale;
      }
    }
    return matrix;
  }

  /**
   * Create zero matrix
   */
  zeroMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(cols).fill(0);
    }
    return matrix;
  }

  /**
   * ReLU activation function
   */
  relu(x) {
    return Math.max(0, x);
  }

  /**
   * ReLU derivative
   */
  reluDerivative(x) {
    return x > 0 ? 1 : 0;
  }

  /**
   * Sigmoid activation function
   */
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  /**
   * Sigmoid derivative
   */
  sigmoidDerivative(x) {
    const s = this.sigmoid(x);
    return s * (1 - s);
  }

  /**
   * Matrix-vector multiplication
   */
  matmul(matrix, vector) {
    const result = [];
    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum);
    }
    return result;
  }

  /**
   * Add bias to vector
   */
  addBias(vector, bias) {
    return vector.map((v, i) => v + bias[i]);
  }

  /**
   * Forward propagation through the network
   */
  forward(input) {
    // Input to Hidden1
    let z1 = this.addBias(this.matmul(this.transposeMatrix(this.W1), input), this.b1);
    let a1 = z1.map(x => this.relu(x));
    
    // Hidden1 to Hidden2
    let z2 = this.addBias(this.matmul(this.transposeMatrix(this.W2), a1), this.b2);
    let a2 = z2.map(x => this.relu(x));
    
    // Hidden2 to Output
    let z3 = this.addBias(this.matmul(this.transposeMatrix(this.W3), a2), this.b3);
    let output = z3; // Linear activation for regression
    
    return {
      z1, a1, z2, a2, z3, output,
      input
    };
  }

  /**
   * Transpose matrix
   */
  transposeMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    
    for (let j = 0; j < cols; j++) {
      result[j] = [];
      for (let i = 0; i < rows; i++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  }

  /**
   * Build skills index (top skills mapping to indices)
   */
  buildSkillsIndex() {
    return {
      'javascript': 0, 'python': 1, 'java': 2, 'react': 3, 'node': 4,
      'angular': 5, 'vue': 6, 'typescript': 7, 'php': 8, 'ruby': 9,
      'go': 10, 'rust': 11, 'c++': 12, 'c#': 13, 'swift': 14,
      'kotlin': 15, 'sql': 16, 'mongodb': 17, 'postgresql': 18, 'mysql': 19,
      'aws': 20, 'azure': 21, 'gcp': 22, 'docker': 23, 'kubernetes': 24,
      'devops': 25, 'ml': 26, 'ai': 27, 'data-science': 28, 'blockchain': 29
    };
  }

  /**
   * Build location index (major cities)
   */
  buildLocationIndex() {
    return {
      'bangalore': 0, 'mumbai': 1, 'delhi': 2, 'hyderabad': 3, 'pune': 4,
      'chennai': 5, 'kolkata': 6, 'ahmedabad': 7, 'remote': 8, 'gurgaon': 9
    };
  }

  /**
   * Build category index
   */
  buildCategoryIndex() {
    return {
      'technology': 0, 'design': 1, 'marketing': 2, 'sales': 3, 
      'hr': 4, 'finance': 5, 'operations': 6, 'consulting': 7,
      'customer-service': 8, 'other': 9
    };
  }

  /**
   * Extract features from profile/job data
   */
  extractFeatures(data) {
    const features = new Array(this.inputSize).fill(0);
    let idx = 0;

    // Skills (30 features)
    if (data.skills && Array.isArray(data.skills)) {
      data.skills.forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (this.skillsIndex[skillLower] !== undefined) {
          features[this.skillsIndex[skillLower]] = 1;
        }
      });
    }
    idx += 30;

    // Location (10 features)
    if (data.location) {
      const locationLower = data.location.toLowerCase();
      for (const [loc, locIdx] of Object.entries(this.locationIndex)) {
        if (locationLower.includes(loc)) {
          features[idx + locIdx] = 1;
        }
      }
    }
    idx += 10;

    // Experience level (5 features - one-hot encoding)
    const expLevels = ['entry', 'mid', 'senior', 'executive', 'fresher'];
    const userExp = (data.experienceLevel || data.experience || '').toLowerCase();
    const expIdx = expLevels.indexOf(userExp);
    if (expIdx !== -1) {
      features[idx + expIdx] = 1;
    }
    idx += 5;

    // Education level (3 features)
    if (data.education && Array.isArray(data.education) && data.education.length > 0) {
      const highestDegree = (data.education[0].degree || '').toLowerCase();
      if (highestDegree.includes('phd') || highestDegree.includes('doctorate')) {
        features[idx + 2] = 1;
      } else if (highestDegree.includes('master') || highestDegree.includes('mba')) {
        features[idx + 1] = 1;
      } else if (highestDegree.includes('bachelor') || highestDegree.includes('btech')) {
        features[idx] = 1;
      }
    }
    idx += 3;

    // Category (2 features - encoded as numerical)
    if (data.category) {
      const catIdx = this.categoryIndex[data.category] || 9;
      features[idx] = catIdx / 10; // Normalize
      features[idx + 1] = catIdx % 2; // Even/odd indicator
    }

    return features;
  }

  /**
   * Predict salary for given profile/job
   */
  predict(data) {
    const features = this.extractFeatures(data);
    const result = this.forward(features);
    
    // Denormalize output (scale from 0-1 to actual salary range)
    const normalizedSalary = result.output[0];
    
    // Use sigmoid to constrain between 0-1, then scale
    const sigmoidOutput = this.sigmoid(normalizedSalary);
    
    // Salary range: ₹2,00,000 to ₹50,00,000
    const minSalary = 200000;
    const maxSalary = 5000000;
    const predictedSalary = minSalary + (sigmoidOutput * (maxSalary - minSalary));
    
    // Calculate confidence based on feature completeness
    const featureCompleteness = features.filter(f => f !== 0).length / this.inputSize;
    const confidence = Math.min(95, 50 + (featureCompleteness * 50));
    
    // Generate salary range (±15%)
    const lowerBound = Math.round(predictedSalary * 0.85);
    const upperBound = Math.round(predictedSalary * 1.15);
    const average = Math.round(predictedSalary);
    
    return {
      predicted: {
        min: lowerBound,
        max: upperBound,
        average: average,
        currency: 'INR'
      },
      confidence: Math.round(confidence),
      marketInsights: this.generateMarketInsights(data, average),
      breakdown: this.generateSalaryBreakdown(data, average),
      algorithm: 'Neural Network (Backpropagation)'
    };
  }

  /**
   * Generate market insights
   */
  generateMarketInsights(data, predictedSalary) {
    const insights = [];
    
    // Location insight
    const locationBonus = {
      'bangalore': 1.15,
      'mumbai': 1.10,
      'delhi': 1.08,
      'hyderabad': 1.05,
      'pune': 1.03,
      'remote': 1.12
    };
    
    const location = (data.location || '').toLowerCase();
    for (const [loc, multiplier] of Object.entries(locationBonus)) {
      if (location.includes(loc)) {
        const diff = Math.round(((multiplier - 1) * 100));
        insights.push({
          factor: 'Location',
          impact: `${diff > 0 ? '+' : ''}${diff}%`,
          message: `${loc.charAt(0).toUpperCase() + loc.slice(1)} offers ${diff}% higher salaries`
        });
        break;
      }
    }
    
    // Skills insight
    const hotSkills = ['react', 'node', 'python', 'aws', 'kubernetes', 'ml', 'ai'];
    if (data.skills && Array.isArray(data.skills)) {
      const hasHotSkills = data.skills.some(skill => 
        hotSkills.includes(skill.toLowerCase())
      );
      if (hasHotSkills) {
        insights.push({
          factor: 'Skills',
          impact: '+10%',
          message: 'High-demand skills increase your market value'
        });
      }
    }
    
    // Experience insight
    const exp = (data.experienceLevel || data.experience || '').toLowerCase();
    if (exp.includes('senior') || exp.includes('executive')) {
      insights.push({
        factor: 'Experience',
        impact: '+25%',
        message: 'Senior positions command premium salaries'
      });
    }
    
    return insights;
  }

  /**
   * Generate salary breakdown
   */
  generateSalaryBreakdown(data, totalSalary) {
    return {
      base: Math.round(totalSalary * 0.70),
      variable: Math.round(totalSalary * 0.15),
      bonus: Math.round(totalSalary * 0.10),
      benefits: Math.round(totalSalary * 0.05),
      total: totalSalary
    };
  }

  /**
   * Backward propagation
   */
  backward(forward, target) {
    const { input, z1, a1, z2, a2, z3, output } = forward;
    
    // Output layer gradients
    const dz3 = output.map((o, i) => 2 * (o - target[i])); // MSE derivative
    
    // Hidden layer 2 gradients
    const dz2 = [];
    for (let i = 0; i < this.hidden2Size; i++) {
      let sum = 0;
      for (let j = 0; j < this.outputSize; j++) {
        sum += dz3[j] * this.W3[i][j];
      }
      dz2.push(sum * this.reluDerivative(z2[i]));
    }
    
    // Hidden layer 1 gradients
    const dz1 = [];
    for (let i = 0; i < this.hidden1Size; i++) {
      let sum = 0;
      for (let j = 0; j < this.hidden2Size; j++) {
        sum += dz2[j] * this.W2[i][j];
      }
      dz1.push(sum * this.reluDerivative(z1[i]));
    }
    
    // Update W3 and b3 with momentum
    for (let i = 0; i < this.hidden2Size; i++) {
      for (let j = 0; j < this.outputSize; j++) {
        const gradient = dz3[j] * a2[i];
        this.vW3[i][j] = this.momentum * this.vW3[i][j] + this.learningRate * gradient;
        this.W3[i][j] -= this.vW3[i][j];
      }
    }
    for (let j = 0; j < this.outputSize; j++) {
      this.vb3[j] = this.momentum * this.vb3[j] + this.learningRate * dz3[j];
      this.b3[j] -= this.vb3[j];
    }
    
    // Update W2 and b2 with momentum
    for (let i = 0; i < this.hidden1Size; i++) {
      for (let j = 0; j < this.hidden2Size; j++) {
        const gradient = dz2[j] * a1[i];
        this.vW2[i][j] = this.momentum * this.vW2[i][j] + this.learningRate * gradient;
        this.W2[i][j] -= this.vW2[i][j];
      }
    }
    for (let j = 0; j < this.hidden2Size; j++) {
      this.vb2[j] = this.momentum * this.vb2[j] + this.learningRate * dz2[j];
      this.b2[j] -= this.vb2[j];
    }
    
    // Update W1 and b1 with momentum
    for (let i = 0; i < this.inputSize; i++) {
      for (let j = 0; j < this.hidden1Size; j++) {
        const gradient = dz1[j] * input[i];
        this.vW1[i][j] = this.momentum * this.vW1[i][j] + this.learningRate * gradient;
        this.W1[i][j] -= this.vW1[i][j];
      }
    }
    for (let j = 0; j < this.hidden1Size; j++) {
      this.vb1[j] = this.momentum * this.vb1[j] + this.learningRate * dz1[j];
      this.b1[j] -= this.vb1[j];
    }
  }

  /**
   * Train the neural network with real salary data
   */
  train(trainingData, epochs = 100) {
    console.log(`Training Neural Network with ${trainingData.length} samples for ${epochs} epochs...`);
    
    const learningHistory = [];
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      
      // Shuffle training data
      const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
      
      for (const sample of shuffled) {
        // Extract features
        const input = this.extractFeatures(sample);
        
        // Normalize salary (0-1 range)
        const targetSalary = sample.salary;
        const normalized = (targetSalary - 200000) / (5000000 - 200000);
        const target = [Math.max(0, Math.min(1, normalized))];
        
        // Forward pass
        const forward = this.forward(input);
        const prediction = forward.output;
        
        // Calculate loss (MSE)
        const loss = Math.pow(prediction[0] - target[0], 2);
        totalLoss += loss;
        
        // Backward pass
        this.backward(forward, target);
      }
      
      const avgLoss = totalLoss / trainingData.length;
      learningHistory.push(avgLoss);
      
      if (epoch % 10 === 0) {
        console.log(`Epoch ${epoch}/${epochs}, Loss: ${avgLoss.toFixed(6)}`);
      }
    }
    
    this.isTrained = true;
    console.log('Training completed!');
    return learningHistory;
  }

  /**
   * Load and train with real Indian salary data
   */
  trainWithRealData() {
    try {
      const trainingData = require('../data/salaryTrainingData');
      console.log(`Loaded ${trainingData.length} real salary records from India`);
      this.train(trainingData, 100);
      console.log('Neural Network trained with real Indian salary data!');
    } catch (error) {
      console.error('Failed to load training data:', error.message);
      console.log('Using pre-initialized weights');
    }
  }

  /**
   * Get market comparison
   */
  getMarketComparison(predictedSalary, data) {
    // Simulate market data (in production, query database)
    const category = data.category || 'technology';
    const experience = data.experienceLevel || data.experience || 'entry';
    
    const marketAverages = {
      'technology': { 'entry': 600000, 'mid': 1200000, 'senior': 2000000 },
      'design': { 'entry': 500000, 'mid': 900000, 'senior': 1500000 },
      'marketing': { 'entry': 450000, 'mid': 850000, 'senior': 1400000 },
      'finance': { 'entry': 550000, 'mid': 1100000, 'senior': 1900000 }
    };
    
    const marketAvg = marketAverages[category]?.[experience] || 800000;
    const difference = predictedSalary - marketAvg;
    const percentDiff = Math.round((difference / marketAvg) * 100);
    
    return {
      marketAverage: marketAvg,
      yourPrediction: predictedSalary,
      difference: difference,
      percentDifference: percentDiff,
      status: percentDiff > 10 ? 'above' : percentDiff < -10 ? 'below' : 'at',
      message: percentDiff > 10 
        ? `${percentDiff}% above market average`
        : percentDiff < -10 
        ? `${Math.abs(percentDiff)}% below market average`
        : 'In line with market average'
    };
  }
}

module.exports = new NeuralNetworkSalaryPredictor();
