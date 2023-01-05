/**
 * Eva interpreter
 */
const Environment = require("./Environment");

class Eva {
  /**
   * creates an Eva instance with the global environment.
   */
  constructor(global = new Environment()) {
    this.global = global;
  }

  /**
   * Evaluates an expression in the given environment.
   */
  eval(exp, env = this.global) {
    // self evaluations
    if (this.isNumber(exp)) {
      return exp;
    }
    if (this.isString(exp)) {
      return exp.slice(1, -1);
    }

    // math operations
    if (exp[0] === "+") {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }
    if (exp[0] === "*") {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }

    // Comparison operations
    if (exp[0] === ">") {
      return this.eval(exp[1], env) > this.eval(exp[2], env);
    }

    if (exp[0] === ">=") {
      return this.eval(exp[1], env) >= this.eval(exp[2], env);
    }

    if (exp[0] === "<") {
      return this.eval(exp[1], env) < this.eval(exp[2], env);
    }

    if (exp[0] === "<=") {
      return this.eval(exp[1], env) <= this.eval(exp[2], env);
    }

    if (exp[0] === "=") {
      return this.eval(exp[1], env) === this.eval(exp[2], env);
    }

    // Block: sequence of expressions
    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    // Variable declarations: (var foo 10)
    if (exp[0] === "var") {
      const [_, name, value] = exp;
      return env.define(name, this.eval(value, env));
    }
    // Variable assignment: (set foo 10)
    if (exp[0] === "set") {
      const [_, name, value] = exp;
      return env.assign(name, this.eval(value, env));
    }
    // Variable access: foo
    if (this.isVariableName(exp)) {
      return env.lookup(exp);
    }

    // if-expression:
    if (exp[0] === "if") {
      const [_tag, condition, consequent, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(consequent, env);
      }
      return this.eval(alternate, env);
    }

    throw `unimplemented: ${JSON.stringify(exp)}`;
  }

  _evalBlock(block, env) {
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });

    return result;
  }

  isNumber(exp) {
    return typeof exp === "number";
  }

  isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }

  isVariableName(exp) {
    return typeof exp === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
  }
}

module.exports = Eva;
