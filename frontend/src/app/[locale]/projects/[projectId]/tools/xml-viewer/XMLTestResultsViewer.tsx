'use client';
import { useState, ChangeEvent, DragEvent } from 'react';
import { Button, Card, CardBody, Chip, Divider, addToast } from '@heroui/react';
import { Upload, FileText, CheckCircle2, XCircle, SkipForward, AlertCircle } from 'lucide-react';
import { TestCaseResult, TestSuite } from '@/types/xmlTestResults';
import { XMLTestResultsViewerMessages } from '@/types/xmlTestResults';

type Props = {
  messages: XMLTestResultsViewerMessages;
};

export default function XMLTestResultsViewer({ messages }: Props) {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const parseXML = (xmlText: string): TestSuite[] => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid XML format');
      }

      const suites: TestSuite[] = [];
      const testsuiteElements = xmlDoc.querySelectorAll('testsuite');

      testsuiteElements.forEach((suiteElement) => {
        const name = suiteElement.getAttribute('name') || '';
        const tests = parseInt(suiteElement.getAttribute('tests') || '0', 10);
        const failures = parseInt(suiteElement.getAttribute('failures') || '0', 10);
        const skipped = parseInt(suiteElement.getAttribute('skipped') || '0', 10);

        const testcases: TestCaseResult[] = [];
        const testcaseElements = suiteElement.querySelectorAll('testcase');

        testcaseElements.forEach((testcaseElement) => {
          const testcase: TestCaseResult = {
            name: testcaseElement.getAttribute('name') || '',
            classname: testcaseElement.getAttribute('classname') || '',
            time: testcaseElement.getAttribute('time') || '0',
          };

          const failureElement = testcaseElement.querySelector('failure');
          if (failureElement) {
            testcase.failure = {
              message: failureElement.getAttribute('message') || '',
              text: failureElement.textContent || '',
            };
          }

          const skippedElement = testcaseElement.querySelector('skipped');
          if (skippedElement) {
            testcase.skipped = {
              message: skippedElement.getAttribute('message') || '',
            };
          }

          testcases.push(testcase);
        });

        suites.push({
          name,
          tests,
          failures,
          skipped,
          testcases,
        });
      });

      return suites;
    } catch (error) {
      throw new Error('Failed to parse XML file');
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xml')) {
      addToast({
        title: messages.error,
        color: 'danger',
        description: messages.invalidFileType,
      });
      return;
    }

    setFileName(file.name);

    try {
      const text = await file.text();
      const suites = parseXML(text);
      setTestSuites(suites);
      addToast({
        title: messages.success,
        color: 'success',
        description: messages.fileLoaded,
      });
    } catch (error) {
      addToast({
        title: messages.error,
        color: 'danger',
        description: messages.failedToParse,
      });
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const getTotalTests = () => {
    return testSuites.reduce((sum, suite) => sum + suite.tests, 0);
  };

  const getTotalFailures = () => {
    return testSuites.reduce((sum, suite) => sum + suite.failures, 0);
  };

  const getTotalSkipped = () => {
    return testSuites.reduce((sum, suite) => sum + suite.skipped, 0);
  };

  const getTotalPassed = () => {
    return getTotalTests() - getTotalFailures() - getTotalSkipped();
  };

  const getTestCaseStatus = (testCase: TestCaseResult) => {
    if (testCase.failure) return 'failed';
    if (testCase.skipped) return 'skipped';
    return 'passed';
  };

  return (
    <div className="container mx-auto max-w-7xl pt-6 px-6">
      <h1 className="text-2xl font-bold mb-6">{messages.title}</h1>

      <Card className="mb-6">
        <CardBody>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'border-primary bg-primary-50' : 'border-divider'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <Upload size={48} className="mx-auto mb-4 text-default-400" />
            <p className="text-lg font-semibold mb-2">{messages.uploadTitle}</p>
            <p className="text-sm text-default-500 mb-4">{messages.uploadDescription}</p>
            <input
              type="file"
              accept=".xml"
              onChange={handleInput}
              className="hidden"
              id="xml-file-input"
            />
            <Button
              as="label"
              htmlFor="xml-file-input"
              color="primary"
              startContent={<FileText size={16} />}
            >
              {messages.selectFile}
            </Button>
            {fileName && (
              <p className="mt-4 text-sm text-default-600">
                {messages.selectedFile}: <strong>{fileName}</strong>
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {testSuites.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-default-500">{messages.totalTests}</p>
                    <p className="text-2xl font-bold">{getTotalTests()}</p>
                  </div>
                  <FileText size={32} className="text-default-400" />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-default-500">{messages.passed}</p>
                    <p className="text-2xl font-bold text-success">{getTotalPassed()}</p>
                  </div>
                  <CheckCircle2 size={32} className="text-success" />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-default-500">{messages.failed}</p>
                    <p className="text-2xl font-bold text-danger">{getTotalFailures()}</p>
                  </div>
                  <XCircle size={32} className="text-danger" />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-default-500">{messages.skipped}</p>
                    <p className="text-2xl font-bold text-warning">{getTotalSkipped()}</p>
                  </div>
                  <SkipForward size={32} className="text-warning" />
                </div>
              </CardBody>
            </Card>
          </div>

          <Divider className="my-6" />

          {testSuites.map((suite, suiteIndex) => (
            <Card key={suiteIndex} className="mb-4">
              <CardBody>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{suite.name}</h2>
                  <div className="flex gap-2">
                    <Chip size="sm" color="default" variant="flat">
                      {messages.tests}: {suite.tests}
                    </Chip>
                    {suite.failures > 0 && (
                      <Chip size="sm" color="danger" variant="flat">
                        {messages.failures}: {suite.failures}
                      </Chip>
                    )}
                    {suite.skipped > 0 && (
                      <Chip size="sm" color="warning" variant="flat">
                        {messages.skipped}: {suite.skipped}
                      </Chip>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {suite.testcases.map((testCase, caseIndex) => {
                    const status = getTestCaseStatus(testCase);
                    return (
                      <div
                        key={caseIndex}
                        className={`p-3 rounded-lg border ${
                          status === 'failed'
                            ? 'border-danger bg-danger-50'
                            : status === 'skipped'
                            ? 'border-warning bg-warning-50'
                            : 'border-success bg-success-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {status === 'failed' && <XCircle size={20} className="text-danger" />}
                          {status === 'skipped' && <SkipForward size={20} className="text-warning" />}
                          {status === 'passed' && <CheckCircle2 size={20} className="text-success" />}
                          <span className="font-semibold">{testCase.name}</span>
                          <Chip size="sm" variant="flat" className="ml-auto">
                            {testCase.time}s
                          </Chip>
                        </div>
                        {testCase.classname && (
                          <p className="text-sm text-default-500 mb-2">{messages.classname}: {testCase.classname}</p>
                        )}
                        {testCase.failure && (
                          <div className="mt-2 p-2 bg-danger-100 rounded border border-danger">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertCircle size={16} className="text-danger" />
                              <span className="font-semibold text-danger">{messages.failure}</span>
                            </div>
                            {testCase.failure.message && (
                              <p className="text-sm text-danger mb-1">
                                <strong>{messages.message}:</strong> {testCase.failure.message}
                              </p>
                            )}
                            {testCase.failure.text && (
                              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
                                {testCase.failure.text}
                              </pre>
                            )}
                          </div>
                        )}
                        {testCase.skipped && (
                          <div className="mt-2 p-2 bg-warning-100 rounded border border-warning">
                            <div className="flex items-center gap-2">
                              <SkipForward size={16} className="text-warning" />
                              <span className="text-sm text-warning">
                                {testCase.skipped.message || messages.skipped}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}

