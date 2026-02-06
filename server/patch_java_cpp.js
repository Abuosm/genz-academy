const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
require('dotenv').config();

const patchJavaCpp = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tai-learning-platform');
    const assignments = await Assignment.find();

    for (let assignment of assignments) {
      const fName = assignment.functionName || 'solution';

      // Build Java Boilerplate
      const javaCode = `class Solution {\n    public Object ${fName}(Object input) {\n        // Write your logic here\n        return null;\n    }\n}`;

      // Build C++ Boilerplate
      const cppCode = `#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nauto ${fName}(auto input) {\n    // Write your logic here\n    return 0;\n}`;

      assignment.initialCode.java = javaCode;
      assignment.initialCode.cpp = cppCode;

      await assignment.save();
    }

    console.log(`Successfully patched ${assignments.length} assignments with Java/C++ boilerplate!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

patchJavaCpp();
