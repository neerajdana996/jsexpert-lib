import { readFileSync } from 'fs';

export class ErrorTracker {
  private sourceCodeCache: Map<string, string[]>;

  constructor() {
    this.sourceCodeCache = new Map();
  }

  captureError(error: Error): void {
    const stackTrace: any = error.stack;
    const errorLines = stackTrace.split('\n');

    const sourceCode = this.retrieveSourceCode(errorLines);

    this.reportError(error, sourceCode);
  }
  retrieveSourceCode(errorLines: string[]): string {
    const sourceCodeLines: any[] = [];
    const matches = errorLines[1].match(/at (.+):(\d+):(\d+)/);
    if (matches) {
      console.log('matches', matches);

      //cons match 1 = `at /home/neeraj/works/jsexper/jslib/node-express-typescript/dist/index.js:46:15`
      const filePath = matches[1];
      const lineNumber = parseInt(matches[2]);
      const sourceCodeLine = this.getSourceCodeLine(filePath, lineNumber);

      if (sourceCodeLine) {

        sourceCodeLines.push({
          filePath, lineNumber, sourceCodeLine
        });
      }
    }

    return sourceCodeLines.map(a => JSON.stringify(a.sourceCodeLine, null, 4)).join('\n');
  }

  getSourceCode(filePath: string, fromLine: number, toLine: number): string {
    const fileContent = readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    return lines.slice(fromLine, toLine).join('\n');
  }
  getSourceCodeLine(filePath: string, lineNumber: number) {

    const fromLine = lineNumber - 5 > 0 ? lineNumber - 5 : 0;
    const toLine = lineNumber + 5;

    console.log('filePath', filePath);


    if (this.sourceCodeCache.has(filePath)) {
      return this.sourceCodeCache.get(filePath)![lineNumber - 1];
    }
    const fileContent = readFileSync(filePath, 'utf8');
    const allLines = fileContent.split('\n');
    const lines = allLines.slice(fromLine, toLine)
    console.log('lineNumber', lineNumber, fromLine, toLine, allLines.length, lines.length);

    this.sourceCodeCache.set(filePath, lines);
    return lines;
  }

  reportError(error: Error, sourceCode: string): void {
    console.log('Error :', error.message);
    console.log('Stack Trace:', error.stack);
    console.log('Source Code:', sourceCode);
  }
}

// Example usage
