export type TestCaseResult = {
  name: string;
  classname: string;
  time: string;
  failure?: {
    message: string;
    text?: string;
  };
  skipped?: {
    message: string;
  };
};

export type TestSuite = {
  name: string;
  tests: number;
  failures: number;
  skipped: number;
  testcases: TestCaseResult[];
};

export type TestResults = {
  testsuites: {
    testsuite: TestSuite[];
  };
};

export type XMLTestResultsViewerMessages = {
  title: string;
  uploadTitle: string;
  uploadDescription: string;
  selectFile: string;
  selectedFile: string;
  totalTests: string;
  passed: string;
  failed: string;
  skipped: string;
  tests: string;
  failures: string;
  classname: string;
  failure: string;
  message: string;
  success: string;
  error: string;
  invalidFileType: string;
  fileLoaded: string;
  failedToParse: string;
};
