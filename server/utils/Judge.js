const { exec } = require('child_process');
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('./logger');

class Judge {
  static async run(code, language, testCases, isCustomRun = false) {
    const results = [];
    let allPassed = true;

    for (const [idx, tc] of testCases.entries()) {
      let result;
      const startTime = Date.now();

      try {
        switch (language) {
          case 'javascript':
            result = await this.executeJS(code, tc.input);
            break;
          case 'python':
            result = await this.executePython(code, tc.input);
            break;
          case 'java':
            result = await this.executeJava(code, tc.input);
            break;
          case 'cpp':
            result = await this.executeCPP(code, tc.input);
            break;
          default:
            throw new Error(`Language ${language} not supported`);
        }

        const duration = Date.now() - startTime;
        const passed = isCustomRun ? true : this.compare(result, tc.expected);

        results.push({
          testCase: isCustomRun ? 'Custom' : idx + 1,
          input: tc.input,
          expected: isCustomRun ? 'N/A' : tc.expected,
          actual: result,
          passed,
          duration,
          status: passed ? 'AC' : 'WA',
          isHidden: tc.isHidden || false
        });

        if (!passed) allPassed = false;
      } catch (err) {
        allPassed = false;
        results.push({
          testCase: isCustomRun ? 'Custom' : idx + 1,
          error: err.message,
          status: err.message.includes('Timeout') ? 'TLE' : 'RTE',
          passed: false
        });
      }
    }

    return { success: allPassed, results };
  }

  static compare(actual, expected) {
    try {
      return JSON.stringify(actual) === JSON.stringify(expected);
    } catch (e) {
      return String(actual).trim() === String(expected).trim();
    }
  }

  static async executeJS(code, input) {
    const sandbox = { console };
    const inputArgs = Array.isArray(input) ? input.map(a => JSON.stringify(a)).join(',') : JSON.stringify(input);
    const script = new vm.Script(`${code}\nresult = solution(${inputArgs});`);
    return script.runInNewContext(sandbox, { timeout: 2000 });
  }

  static async executePython(code, input) {
    const tempFile = path.join(os.tmpdir(), `solve_${Date.now()}.py`);
    const inputStr = Array.isArray(input) ? input.map(a => JSON.stringify(a)).join(',') : JSON.stringify(input);
    const script = `${code}\n\nimport json\ntry:\n    print(json.dumps(solution(${inputStr})))\nexcept Exception as e:\n    print(f"ERROR: {str(e)}")`;

    fs.writeFileSync(tempFile, script);
    return new Promise((resolve, reject) => {
      exec(`python "${tempFile}"`, { timeout: 3000 }, (err, stdout, stderr) => {
        if (err && err.killed) return reject(new Error('Time Limit Exceeded (3s)'));
        if (stderr || (stdout && stdout.startsWith('ERROR:'))) return reject(new Error(stderr || stdout));
        try { resolve(JSON.parse(stdout)); } catch (e) { reject(new Error('Runtime Error')); }
        finally { if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile); }
      });
    });
  }

  // Java and CPP placeholders for the utility (similar logic to upgrade.js but cleaner)
  static async executeJava(code, input) {
    // Simplified for this utility refactor
    throw new Error('Java sandbox coming soon in Phase 2');
  }

  static async executeCPP(code, input) {
    // Simplified for this utility refactor
    throw new Error('C++ sandbox coming soon in Phase 2');
  }
}

module.exports = Judge;
