import React from 'react'
import Navbar from '~/components/Navbar'
import { useState } from 'react';
import FileUploader from '~/components/FileUploader';
import { usePuterStore } from '~/lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from '~/lib/pdf2img';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions,AIResponseFormat } from 'constants/index';

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('Upload your resume to get started!');
  const [file, setFile] = useState<File | null>(null);
  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async({companyName, jobTitle, jobDescription, file}: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    // Implement the analysis logic here
    setIsProcessing(true);
    setStatusText('Uploading the file...');
    const uploadedFile = await fs.upload([file])
    if(!uploadedFile){
      return setStatusText('Failed to upload the file. Please try again.');
    }
    setStatusText('Converting to image...');
    const imageFile = await convertPdfToImage(file);
    if(!imageFile.file) {
      return setStatusText('Failed to convert PDF to image.');
    }
    setStatusText('Uploading the image')
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) {
      return setStatusText('Failed to upload the image.');
    }
    setStatusText('Preparing data...');
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: '',
    }
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analyzing resume...');

    const feedback = await ai.feedback(
      uploadedFile.path, 
      prepareInstructions({
        jobTitle,
        jobDescription,
        AIResponseFormat
      })
    );

    if (!feedback) {
      return setStatusText('Failed to analyze the resume. Please try again.');
    }

    const feedbackText = typeof feedback.message.content ==='string'
      ? feedback.message.content
      : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Analysis complete! Redirecting to results...');
    console.log(data);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: HTMLFormElement | null = e.currentTarget.closest('form');
    if(!form) return;
    const formData = new FormData(form);
    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if(!file) {
      setStatusText('Please upload your resume.');
      return;
    }
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      
      <section className="main-section">
  <div className="page-heading py-16 text-center">
    <h1>Smart Feedback for your dream Job</h1>
    {isProcessing ? (
      <>
        <h2>{statusText}</h2>
        <img src="/images/resume-scan.gif" alt="Loading..." className="w-full" />
      </>
    ) : (
      <h2>
        Drop your resume for an ATS score <span className="font-bold">out of 100</span>
      </h2>
    )}
  </div>

  {!isProcessing && (
    <form
      id="upload-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mt-8 max-w-2xl mx-auto w-full"
    >
      <div className="form-div">
        <label htmlFor="company-name">Company Name</label>
        <input type="text" id="company-name" name="company-name" placeholder="Enter company name" required />
      </div>
      <div className="form-div">
        <label htmlFor="job-title">Job Title</label>
        <input type="text" id="job-title" name="job-title" placeholder="Enter job title" />
      </div>

      <div className="form-div">
        <label htmlFor="job-description">Job Description</label>
        <textarea
          id="job-description"
          name="job-description"
          placeholder="Paste job description here"
          rows={5}
          required
        ></textarea>
      </div>

      <div className="form-div">
        <label htmlFor="uploader">Upload your resume</label>
        <FileUploader onFileSelect={handleFileSelect} />
      </div>

      <button className="primary-button" type="submit">Analyze Resume</button>
    </form>
  )}
</section>

    </main>
  )
}

export default upload
