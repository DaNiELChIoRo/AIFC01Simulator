/**
 * AIF-C01 Exam Sim — question bank.
 *
 * 66 scenario questions translated to English from a Spanish AWS Certified AI
 * Practitioner study set, each tagged to one of the five official content
 * domains in domains.js.
 *
 * Shape:
 *   { id, domain, prompt, options: [{ text, correct }], explanation }
 *
 * Every item here is single-answer (exactly one `correct: true`), matching the
 * source set. The engine still derives single vs. multiple response from the
 * answer key, so a multi-correct item added later renders as "select all that
 * apply" with no other change.
 *
 * Option order is shuffled at runtime, so never write an option that refers to
 * another by letter ("both A and B").
 */
window.EXAM_QUESTIONS = [
  /* ==================================================================== D1 */
  {
    id: "q4", domain: "d1",
    prompt: "A company has built an image-classification model to detect diseases on plant leaves and wants to measure how many images it classified correctly overall. Which evaluation metric should it use?",
    options: [
      { text: "Accuracy", correct: true },
      { text: "Mean squared error (MSE)", correct: false },
      { text: "Log loss", correct: false },
      { text: "Edit distance", correct: false },
    ],
    explanation: "Accuracy is the share of correct predictions out of all predictions, which is exactly \"how many did it get right overall\" for a balanced classification problem. MSE is a regression metric, log loss scores predicted probabilities rather than correct counts, and edit distance compares text strings.",
  },
  {
    id: "q6", domain: "d1",
    prompt: "A company runs a production ML pipeline on Amazon SageMaker with large input payloads and needs near-real-time inference. Which SageMaker inference option meets the requirement?",
    options: [
      { text: "SageMaker real-time endpoints", correct: true },
      { text: "SageMaker Batch Transform", correct: false },
      { text: "Asynchronous SageMaker training jobs", correct: false },
      { text: "Offline model evaluation runs", correct: false },
    ],
    explanation: "Real-time endpoints keep the model loaded on persistent instances behind an HTTPS endpoint, so individual requests return with low latency. Batch Transform is for large offline jobs, training jobs fit models rather than serve them, and offline evaluation produces no live predictions.",
  },
  {
    id: "q7", domain: "d1",
    prompt: "A company wants to avoid building new models from scratch and would rather adapt existing pre-trained models to new but related tasks. Which machine learning strategy should it apply?",
    options: [
      { text: "Transfer learning", correct: true },
      { text: "Greatly increasing the number of training epochs", correct: false },
      { text: "Reducing the learning rate to zero", correct: false },
      { text: "Removing all hidden layers from the base model", correct: false },
    ],
    explanation: "Transfer learning reuses a model trained on a large general corpus and adapts it to a related task with a much smaller dataset, saving both time and compute. More epochs, a zero learning rate (which stops learning entirely), and stripping hidden layers do not reuse pre-trained knowledge.",
  },
  {
    id: "q12", domain: "d1",
    prompt: "A data science team using Amazon SageMaker needs an interactive, collaborative Jupyter-based environment for data exploration and rapid model prototyping. Which service or feature should the team use?",
    options: [
      { text: "Amazon SageMaker Studio (or SageMaker notebook instances)", correct: true },
      { text: "Amazon CloudWatch Logs", correct: false },
      { text: "Amazon S3 Glacier Flexible Retrieval", correct: false },
      { text: "A single-invocation AWS Lambda function", correct: false },
    ],
    explanation: "SageMaker Studio is the web-based IDE purpose-built for machine learning, providing fully managed Jupyter notebooks for exploring data and prototyping models. CloudWatch Logs stores logs, Glacier is archival storage, and Lambda is short-lived event compute — none is an interactive notebook environment.",
  },
  {
    id: "q13", domain: "d1",
    prompt: "A financial institution wants to automatically extract printed and handwritten data from scanned loan application forms and load it straight into a database. Which AWS service is best suited to this task?",
    options: [
      { text: "Amazon Textract", correct: true },
      { text: "Amazon Rekognition", correct: false },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Lex", correct: false },
    ],
    explanation: "Amazon Textract goes beyond traditional OCR: it extracts text, handwriting, form key-value pairs and table structure from scanned documents. Rekognition analyses images and video, Polly synthesises speech, and Lex builds conversational interfaces.",
  },
  {
    id: "q14", domain: "d1",
    prompt: "A company wants to deploy an automated customer-service solution that lets users interact naturally through both voice and text in a conversation. Which managed AWS service should it use?",
    options: [
      { text: "Amazon Lex", correct: true },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Transcribe", correct: false },
      { text: "Amazon Comprehend", correct: false },
    ],
    explanation: "Amazon Lex is the managed service for building conversational interfaces — chatbots and voice assistants — with built-in automatic speech recognition and natural language understanding. Polly, Transcribe and Comprehend each handle one piece (speech synthesis, transcription, text analysis) rather than the whole dialogue.",
  },
  {
    id: "q15", domain: "d1",
    prompt: "A team wants to convert audio recordings of contact-centre calls into structured text so it can then run sentiment analysis. Which service should it use first, for the speech-to-text step?",
    options: [
      { text: "Amazon Transcribe", correct: true },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Translate", correct: false },
      { text: "Amazon Rekognition", correct: false },
    ],
    explanation: "Amazon Transcribe uses automatic speech recognition to turn audio files into accurate, timestamped text. Polly runs in the opposite direction (text to speech), Translate converts between languages, and Rekognition works on images and video.",
  },
  {
    id: "q16", domain: "d1",
    prompt: "A global e-commerce company needs to translate its product descriptions into more than 30 languages quickly and automatically. Which AWS service meets this requirement?",
    options: [
      { text: "Amazon Translate", correct: true },
      { text: "Amazon Comprehend", correct: false },
      { text: "Amazon Rekognition", correct: false },
      { text: "Amazon Kendra", correct: false },
    ],
    explanation: "Amazon Translate is the neural machine translation service, delivering fast, high-quality, cost-effective translation across a wide range of languages. Comprehend extracts insights from text, Rekognition analyses images, and Kendra is enterprise search.",
  },
  {
    id: "q17", domain: "d1",
    prompt: "A company analyses customer reviews on social media to determine whether the overall tone of the comments is positive, negative or neutral. Which AWS service supports this text-analysis task?",
    options: [
      { text: "Amazon Comprehend", correct: true },
      { text: "Amazon Textract", correct: false },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Personalize", correct: false },
    ],
    explanation: "Amazon Comprehend applies NLP to extract insights from text, including sentiment analysis, entity recognition, key-phrase extraction and language detection. Textract extracts data from documents, Polly synthesises speech, and Personalize generates recommendations.",
  },
  {
    id: "q18", domain: "d1",
    prompt: "An online video streaming platform wants to serve personalised movie recommendations in real time based on each user's browsing history. Which AWS service is purpose-built for this?",
    options: [
      { text: "Amazon Personalize", correct: true },
      { text: "Amazon Forecast", correct: false },
      { text: "Amazon Rekognition", correct: false },
      { text: "Amazon SageMaker Clarify", correct: false },
    ],
    explanation: "Amazon Personalize lets developers build high-quality product and content recommendations using the same technology Amazon.com uses, with no prior ML expertise required. Forecast handles time-series prediction, Rekognition handles vision, and Clarify measures bias and explainability.",
  },
  {
    id: "q19", domain: "d1",
    prompt: "A retail company needs to predict future inventory demand for its products from historical seasonal sales data. Which managed AWS service is most appropriate?",
    options: [
      { text: "Amazon Forecast", correct: true },
      { text: "Amazon Personalize", correct: false },
      { text: "Amazon Lex", correct: false },
      { text: "Amazon Bedrock", correct: false },
    ],
    explanation: "Amazon Forecast is the fully managed service that uses machine learning to produce highly accurate time-series forecasts — inventory demand, financial planning, resource capacity — without deep statistics or ML knowledge. Personalize recommends, Lex converses, and Bedrock serves foundation models.",
  },
  {
    id: "q20", domain: "d1",
    prompt: "A company wants to automatically detect inappropriate, violent or unsafe content across millions of user-uploaded images on its platform. Which AWS service should it integrate?",
    options: [
      { text: "Amazon Rekognition", correct: true },
      { text: "Amazon Comprehend", correct: false },
      { text: "Amazon Textract", correct: false },
      { text: "Amazon Macie", correct: false },
    ],
    explanation: "Amazon Rekognition adds image and video analysis through simple APIs, including object and face detection, text in images, activity recognition and unsafe-content moderation. Comprehend and Textract work on text, and Macie discovers sensitive data in Amazon S3.",
  },
  {
    id: "q22", domain: "d1",
    prompt: "A development team wants to add intelligent search over its internal knowledge base so employees can ask questions in natural language and get precise answers from company documents. Which AWS service should it implement?",
    options: [
      { text: "Amazon Kendra", correct: true },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Rekognition", correct: false },
      { text: "Amazon Macie", correct: false },
    ],
    explanation: "Amazon Kendra is the ML-powered enterprise search service that lets users find answers inside internal documents using natural-language questions. Polly, Rekognition and Macie address speech synthesis, image analysis and sensitive-data discovery respectively.",
  },
  {
    id: "q24", domain: "d1",
    prompt: "A company wants to monitor data drift and prediction quality for its production models on Amazon SageMaker over time. Which feature should it configure?",
    options: [
      { text: "Amazon SageMaker Model Monitor", correct: true },
      { text: "Amazon SageMaker Ground Truth", correct: false },
      { text: "AWS Cost Explorer", correct: false },
      { text: "Amazon Inspector", correct: false },
    ],
    explanation: "SageMaker Model Monitor continuously watches deployed models for data-quality drift, model-quality degradation, bias drift and feature-attribution drift, and raises alerts when statistics diverge from a baseline. Ground Truth labels data, Cost Explorer analyses spend, and Inspector scans workloads for vulnerabilities.",
  },
  {
    id: "q25", domain: "d1",
    prompt: "A developer needs to label large volumes of images quickly to train a computer vision model, combining machine learning with human review to guarantee high quality. Which AWS service should be used?",
    options: [
      { text: "Amazon SageMaker Ground Truth", correct: true },
      { text: "Amazon Rekognition Custom Labels", correct: false },
      { text: "AWS Glue DataBrew", correct: false },
      { text: "Amazon Athena", correct: false },
    ],
    explanation: "SageMaker Ground Truth builds highly accurate training datasets using ML-assisted labelling workflows with human-in-the-loop review. Rekognition Custom Labels trains a vision model on data you already labelled, DataBrew prepares tabular data, and Athena queries data with SQL.",
  },
  {
    id: "q26", domain: "d1",
    prompt: "A financial company wants to train a custom fraud-detection model using its own proprietary algorithm packaged in Docker containers, while keeping full control of the compute configuration. Which Amazon SageMaker option offers the most flexibility?",
    options: [
      { text: "SageMaker custom estimators with your own containers (script mode / bring your own container)", correct: true },
      { text: "SageMaker built-in algorithms", correct: false },
      { text: "The default models available in Amazon Bedrock", correct: false },
      { text: "Serverless inference through third-party APIs", correct: false },
    ],
    explanation: "Script mode and bring-your-own-container let data scientists package their exact training code and dependencies and choose the instance types SageMaker runs them on — maximum flexibility. Built-in algorithms and Bedrock's hosted models constrain you to what AWS provides, and third-party APIs give up control entirely.",
  },
  {
    id: "q27", domain: "d1",
    prompt: "A company wants to optimise inference cost for a model deployed on an Amazon SageMaker endpoint that sees highly unpredictable traffic spikes through the day. Which scaling strategy should it configure on the endpoint?",
    options: [
      { text: "Application Auto Scaling driven by the invocations-per-instance metric", correct: true },
      { text: "Keep a fixed, heavily over-provisioned fleet running 24 hours a day", correct: false },
      { text: "Turn CloudWatch logging off completely", correct: false },
      { text: "Switch to a single batch job once a month", correct: false },
    ],
    explanation: "Application Auto Scaling adjusts the number of instances behind a SageMaker endpoint in response to real load — commonly tracking InvocationsPerInstance — so you pay for capacity only when traffic demands it. Over-provisioning wastes money, disabling logs saves almost nothing, and monthly batch jobs cannot serve live traffic.",
  },
  {
    id: "q30", domain: "d1",
    prompt: "A business analyst with no programming or data science background needs to build, train and deploy a predictive model through a guided visual interface. Which AWS tool should they use?",
    options: [
      { text: "Amazon SageMaker Canvas", correct: true },
      { text: "AWS Lambda with advanced Python scripts", correct: false },
      { text: "Amazon EKS (Elastic Kubernetes Service)", correct: false },
      { text: "AWS CloudShell", correct: false },
    ],
    explanation: "SageMaker Canvas is the no-code tool that lets business analysts generate accurate ML predictions through a point-and-click visual interface. Lambda, EKS and CloudShell all require writing code or managing infrastructure.",
  },
  {
    id: "q44", domain: "d1",
    prompt: "Which evaluation metric is commonly used in regression problems to measure the average magnitude of prediction errors without regard to their direction?",
    options: [
      { text: "Mean absolute error (MAE)", correct: true },
      { text: "Accuracy", correct: false },
      { text: "Precision and recall", correct: false },
      { text: "Binary log loss", correct: false },
    ],
    explanation: "MAE averages the absolute differences between predicted and actual values, making it a standard and directly interpretable error metric for regression — the absolute value is what removes the direction of the error. Accuracy, precision/recall and log loss are all classification metrics.",
  },
  {
    id: "q48", domain: "d1",
    prompt: "A company needs to run a large volume of historical transaction data through a machine learning model on Amazon SageMaker. The results are not needed immediately, only in scheduled blocks overnight. Which SageMaker inference option is most appropriate?",
    options: [
      { text: "SageMaker Batch Transform", correct: true },
      { text: "Real-time inference with dedicated 24/7 endpoints", correct: false },
      { text: "Edge inference on mobile devices", correct: false },
      { text: "Individual synchronous calls through API Gateway", correct: false },
    ],
    explanation: "Batch Transform is built to score large datasets asynchronously, spinning compute up for the job and down afterwards, which keeps cost low when latency does not matter. An always-on endpoint bills continuously, edge inference does not apply to a bulk server-side job, and per-record synchronous calls would be slow and expensive.",
  },
  {
    id: "q50", domain: "d1",
    prompt: "A company wants to add advanced optical character recognition (OCR) to extract text and tables from scanned invoices with complex layouts. Which AWS service should it select?",
    options: [
      { text: "Amazon Textract", correct: true },
      { text: "Amazon Rekognition label detection", correct: false },
      { text: "Amazon Comprehend syntax analysis", correct: false },
      { text: "Amazon Polly neural voices", correct: false },
    ],
    explanation: "Textract understands document structure — tables, forms and key-value pairs in invoices and contracts — rather than returning a flat stream of characters like conventional OCR. Rekognition labels objects in images, Comprehend parses text you already have, and Polly generates speech.",
  },
  {
    id: "q57", domain: "d1",
    prompt: "A company wants to analyse large volumes of structured and unstructured data in a data lake to prepare training datasets, using standard SQL queries. Which AWS service integrates natively for this?",
    options: [
      { text: "Amazon Athena", correct: true },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Lex", correct: false },
      { text: "Amazon Rekognition", correct: false },
    ],
    explanation: "Amazon Athena is a serverless interactive query service that analyses data directly in Amazon S3 using standard SQL, with no infrastructure to manage — a natural fit for exploring and preparing data for AI projects. Polly, Lex and Rekognition are application-level AI services, not query engines.",
  },
  {
    id: "q58", domain: "d1",
    prompt: "Which capability within Amazon SageMaker automates the search for the best hyperparameters to maximise a model's performance?",
    options: [
      { text: "SageMaker Automatic Model Tuning (hyperparameter optimisation)", correct: true },
      { text: "SageMaker Ground Truth Plus", correct: false },
      { text: "AWS Trusted Advisor", correct: false },
      { text: "Amazon Macie rules", correct: false },
    ],
    explanation: "Automatic Model Tuning runs many training jobs with different hyperparameter values and converges on the combination that optimises your chosen objective metric. Ground Truth Plus is a managed labelling service, Trusted Advisor gives account best-practice checks, and Macie finds sensitive data.",
  },
  {
    id: "q60", domain: "d1",
    prompt: "Which type of machine learning is used when a model learns from data that has no labels, discovering hidden patterns, groupings or structure on its own?",
    options: [
      { text: "Unsupervised learning", correct: true },
      { text: "Classic supervised learning", correct: false },
      { text: "Reinforcement learning from strict human rewards", correct: false },
      { text: "Binary classification with predefined labels", correct: false },
    ],
    explanation: "Unsupervised learning analyses unlabelled datasets to uncover inherent structure, as clustering and dimensionality-reduction algorithms do. Supervised learning and binary classification both require labels, and reinforcement learning learns from a reward signal rather than from unlabelled data.",
  },
  {
    id: "q65", domain: "d1",
    prompt: "When training a machine learning model, what happens if the model suffers from overfitting?",
    options: [
      { text: "It memorises the training data, including its noise, and performs poorly on new, unseen data", correct: true },
      { text: "It is too simple and fails to learn any useful trend at all", correct: false },
      { text: "Training time drops to exactly zero seconds", correct: false },
      { text: "Test-set evaluation metrics improve automatically and without limit", correct: false },
    ],
    explanation: "Overfitting is a model fitting the specific details and noise of the training set so closely that it loses the ability to generalise, which shows up as strong training performance and weak validation performance. A model that is too simple to learn the trend is underfitting — the opposite failure.",
  },

  /* ==================================================================== D2 */
  {
    id: "q28", domain: "d2",
    prompt: "What is the main advantage of using pre-trained foundation models instead of training a traditional machine learning model from scratch?",
    options: [
      { text: "They dramatically cut development time and the amount of proprietary data needed, thanks to transfer learning", correct: true },
      { text: "They require millions of dollars of mandatory upfront hardware spend", correct: false },
      { text: "They remove any need to evaluate ethical bias", correct: false },
      { text: "They work exclusively offline on older mobile hardware", correct: false },
    ],
    explanation: "Foundation models arrive pre-trained on vast general datasets, so an organisation can adapt one to its specific need with a fraction of the data, time and effort that training from scratch demands. Bias evaluation remains necessary — arguably more so — and using a managed FM avoids upfront hardware cost rather than requiring it.",
  },
  {
    id: "q33", domain: "d2",
    prompt: "A company wants to speed up deep learning training and inference on AWS while reducing cost and getting better hardware efficiency. Which AWS purpose-built AI processors should it consider?",
    options: [
      { text: "AWS Inferentia and AWS Trainium", correct: true },
      { text: "S3 Glacier magnetic storage", correct: false },
      { text: "Standard VPC network routers", correct: false },
      { text: "Aurora relational database instances", correct: false },
    ],
    explanation: "Trainium and Inferentia are AWS-designed silicon: Trainium accelerates training and Inferentia accelerates inference, both aimed at higher throughput per dollar than general-purpose GPU instances. The other options are storage, networking and database components with no ML acceleration role.",
  },
  {
    id: "q35", domain: "d2",
    prompt: "A development team needs to deploy a web application that calls a language model in Amazon Bedrock asynchronously, without managing servers. Which complementary AWS service is commonly used for this?",
    options: [
      { text: "AWS Lambda", correct: true },
      { text: "Dedicated on-premises physical servers", correct: false },
      { text: "Cold-storage magnetic tape", correct: false },
      { text: "A traditional local area network", correct: false },
    ],
    explanation: "AWS Lambda runs code serverlessly in response to events and integrates cleanly with Amazon Bedrock to handle AI requests on demand at scale, with no servers to provision or patch. The other options are not compute services for handling application requests.",
  },
  {
    id: "q37", domain: "d2",
    prompt: "Which statement best describes a key advantage of foundation models over traditional machine learning models?",
    options: [
      { text: "They are versatile, general-purpose models that can be adapted to a wide variety of tasks through fine-tuning or prompt engineering", correct: true },
      { text: "They need thousands of manually labelled task-specific datasets built from scratch for every new task", correct: false },
      { text: "They only work offline and require obsolete hardware", correct: false },
      { text: "They cannot be adjusted or modified under any circumstances", correct: false },
    ],
    explanation: "A foundation model's defining property is broad adaptability: one pre-trained model serves many downstream use cases with minimal additional training, via prompting, RAG or fine-tuning. Needing fresh labelled data for every task describes traditional task-specific ML, the very thing FMs improve on.",
  },
  {
    id: "q42", domain: "d2",
    prompt: "What is the primary purpose of the custom AWS Trainium chips?",
    options: [
      { text: "To accelerate heavy machine learning and deep learning training workloads with high cost efficiency", correct: true },
      { text: "To store relational databases on solid-state media", correct: false },
      { text: "To translate text documents without an internet connection", correct: false },
      { text: "To filter suspected phishing email", correct: false },
    ],
    explanation: "Trainium is purpose-built to accelerate deep learning training, processing large datasets faster and at lower cost than comparable traditional GPU instances. (Its sibling, Inferentia, targets inference.) The other options describe storage, translation and email security, none of which Trainium performs.",
  },
  {
    id: "q47", domain: "d2",
    prompt: "Which of the following describes an important limitation or risk of using large language models (LLMs)?",
    options: [
      { text: "A tendency to generate false or fabricated information stated with apparent confidence (hallucinations)", correct: true },
      { text: "A complete inability to generate text in English", correct: false },
      { text: "A strict requirement for quantum computing", correct: false },
      { text: "Zero operating cost under all circumstances", correct: false },
    ],
    explanation: "Hallucination is the well-known LLM failure mode: the model produces incorrect or invented content in a fluent, persuasive form, which is why grounding techniques such as RAG and human review matter. The remaining options are simply false statements about how LLMs work.",
  },
  {
    id: "q52", domain: "d2",
    prompt: "What is the main purpose of Amazon Bedrock Custom Model Import?",
    options: [
      { text: "To let customers bring their own custom models — trained or fine-tuned outside AWS — and run them on Bedrock's managed infrastructure and APIs", correct: true },
      { text: "To download paid models for offline installation on laptops", correct: false },
      { text: "To remove the need for encryption keys on your data", correct: false },
      { text: "To automatically translate legacy COBOL code into Python", correct: false },
    ],
    explanation: "Custom Model Import lets an organisation bring an open-source or self-trained model into Amazon Bedrock and serve it through the same unified, secure, scalable APIs as Bedrock's built-in models. It does not change encryption requirements or perform code conversion.",
  },
  {
    id: "q55", domain: "d2",
    prompt: "What is the main advantage of consuming foundation models through a managed API such as Amazon Bedrock rather than deploying and operating them yourself on dedicated Amazon EC2 instances?",
    options: [
      { text: "You no longer provision infrastructure, patch servers or size GPUs by hand, and you pay only for what you use", correct: true },
      { text: "The models incur no network or inference cost at all", correct: false },
      { text: "The model is guaranteed never to make a mistake or hallucinate", correct: false },
      { text: "Customer data is shared publicly by default", correct: false },
    ],
    explanation: "A fully managed service removes the operational burden — capacity planning, patching, scaling, GPU selection — and bills on consumption. Managed hosting does not make inference free, does not eliminate hallucinations, and Bedrock explicitly does not share your data or use it to train the base models.",
  },
  {
    id: "q66", domain: "d2",
    prompt: "What is the benefit of using instances backed by AWS Inferentia processors to run machine learning models?",
    options: [
      { text: "High inference throughput at a significantly lower cost per transaction", correct: true },
      { text: "Complete replacement of relational databases in the cloud", correct: false },
      { text: "Letting mobile devices operate with no battery", correct: false },
      { text: "Accelerating manual labelling of printed images on paper", correct: false },
    ],
    explanation: "AWS Inferentia is custom silicon designed specifically for deep learning inference, delivering high throughput and lower cost per inference than general-purpose infrastructure. It is an accelerator for serving models, not a database replacement or a labelling tool.",
  },

  /* ==================================================================== D3 */
  {
    id: "q2", domain: "d3",
    prompt: "A law firm wants to build an AI application that uses large language models (LLMs) to read legal documents and extract their key points. Which solution meets this requirement?",
    options: [
      { text: "Build a document-summarisation assistant powered by an LLM", correct: true },
      { text: "Build an automatic named-entity recognition system", correct: false },
      { text: "Build a recommendation engine", correct: false },
      { text: "Build a multilingual translation system", correct: false },
    ],
    explanation: "Reading long documents, holding their context and condensing the key points is a summarisation task, which is exactly what an LLM-backed summarisation assistant does. Named-entity recognition extracts only entity mentions, and recommendation and translation solve unrelated problems.",
  },
  {
    id: "q5", domain: "d3",
    prompt: "A company uses a pre-trained LLM to build a product-recommendation chatbot, but needs the answers to be short and written in a specific language. Which solution aligns the response quality with these expectations?",
    options: [
      { text: "Use prompt engineering with explicit format, length and language constraints in the system instructions", correct: true },
      { text: "Retrain the base model from scratch on separate on-premises infrastructure", correct: false },
      { text: "Disable the inference temperature setting entirely", correct: false },
      { text: "Massively increase the amount of raw unsupervised training data", correct: false },
    ],
    explanation: "Prompt engineering and a well-written system prompt are the fastest, cheapest way to control an LLM's tone, length and output language — no retraining required. Retraining and adding raw data are enormously expensive for a formatting requirement, and temperature governs randomness, not length or language.",
  },
  {
    id: "q10", domain: "d3",
    prompt: "A company wants to use language models to build an inference application on edge devices with the lowest possible latency and no dependence on a constant cloud connection. Which solution meets this requirement?",
    options: [
      { text: "Deploy small, optimised language models (SLMs) directly on the edge devices", correct: true },
      { text: "Have the devices make continuous calls to a central cloud API", correct: false },
      { text: "Use very large GPU instances in the primary AWS Region", correct: false },
      { text: "Replace the LLMs with traditional relational databases", correct: false },
    ],
    explanation: "Small language models are compact enough to run on the device's own hardware, so inference happens locally with no round trip and no dependence on connectivity. Both cloud-call options reintroduce network latency and a connectivity requirement, and a relational database cannot perform language inference.",
  },
  {
    id: "q23", domain: "d3",
    prompt: "An organisation is designing a Retrieval-Augmented Generation (RAG) architecture on Amazon Bedrock and needs a secure place to store and search embedded data vectors. Which kind of database or feature is commonly used for this on AWS?",
    options: [
      { text: "A vector database, such as Amazon OpenSearch Service or Amazon Aurora with vector support", correct: true },
      { text: "A traditional relational database with no text indexes", correct: false },
      { text: "Magnetic tape storage in Amazon S3 Glacier", correct: false },
      { text: "Static Amazon DynamoDB tables with no preprocessing", correct: false },
    ],
    explanation: "Vector databases store high-dimensional numeric representations (embeddings) and support fast similarity search, which is what supplies relevant context to the model in a RAG architecture. An unindexed relational database, archival storage and raw key-value tables cannot perform similarity search over embeddings.",
  },
  {
    id: "q31", domain: "d3",
    prompt: "A company wants to connect a large language model in Amazon Bedrock to its private corporate data in near real time, without retraining the model from scratch. Which architecture or approach should it use?",
    options: [
      { text: "Retrieval-Augmented Generation (RAG)", correct: true },
      { text: "Reinforcement learning only", correct: false },
      { text: "Classic linear regression models", correct: false },
      { text: "Batch processing in Amazon S3", correct: false },
    ],
    explanation: "RAG enriches an LLM's answers by retrieving relevant information from an external knowledge base or vector store and passing it in as context at inference time, which grounds responses in current private data and sharply reduces hallucination — with no retraining. The other options do not give a model access to your documents.",
  },
  {
    id: "q32", domain: "d3",
    prompt: "What is the primary function of Amazon Bedrock Knowledge Bases?",
    options: [
      { text: "To provide a fully managed implementation of RAG, connecting your data sources to foundation models", correct: true },
      { text: "To automate manual image labelling", correct: false },
      { text: "To automatically translate text into more than 100 languages", correct: false },
      { text: "To provide physical servers for quantum computing", correct: false },
    ],
    explanation: "Knowledge Bases automates the whole RAG workflow — ingesting and syncing data from sources such as Amazon S3, chunking and embedding it into a vector store, retrieving relevant passages, and handing them to the foundation model. Labelling, translation and quantum hardware are unrelated.",
  },
  {
    id: "q36", domain: "d3",
    prompt: "An e-commerce company wants to let users search its product catalogue using photos taken with their phone cameras. Which technology or combination of services enables this visual similarity search?",
    options: [
      { text: "Image embedding models combined with a vector database", correct: true },
      { text: "Plain-text machine translation", correct: false },
      { text: "Audio summarisation with Amazon Polly", correct: false },
      { text: "Static spreadsheets stored in Amazon S3", correct: false },
    ],
    explanation: "A vision model converts each image into an embedding vector; storing those vectors in a vector database lets you retrieve visually similar products by nearest-neighbour search on a new photo's embedding. Translation, speech synthesis and spreadsheets provide no notion of visual similarity.",
  },
  {
    id: "q46", domain: "d3",
    prompt: "Which AWS service lets developers build autonomous agents that carry out complex tasks by combining LLMs, knowledge bases and corporate APIs?",
    options: [
      { text: "Amazon Bedrock Agents", correct: true },
      { text: "Amazon Polly text-to-speech", correct: false },
      { text: "Amazon Translate batch translation", correct: false },
      { text: "AWS Database Migration Service", correct: false },
    ],
    explanation: "Bedrock Agents plan and execute multi-step tasks autonomously: they break a request into logical steps, query knowledge bases via RAG, and call APIs to act on external systems. Polly, Translate and DMS perform speech synthesis, translation and database migration.",
  },
  {
    id: "q51", domain: "d3",
    prompt: "A company deploying a generative AI solution needs a vector database for fast storage and retrieval of embeddings in a RAG architecture. Which AWS service offers fully managed vector search that is PostgreSQL-compatible?",
    options: [
      { text: "Amazon Aurora with the pgvector extension", correct: true },
      { text: "Amazon S3 Glacier Flexible Retrieval", correct: false },
      { text: "AWS Storage Gateway", correct: false },
      { text: "Amazon DynamoDB with no secondary indexes", correct: false },
    ],
    explanation: "Aurora PostgreSQL supports the pgvector extension, so you can store embeddings and run high-performance vector similarity queries inside a managed relational database. Glacier is archival storage, Storage Gateway bridges on-premises storage to AWS, and DynamoDB is a key-value store without native vector similarity search.",
  },
  {
    id: "q54", domain: "d3",
    prompt: "A development team wants a language model in Amazon Bedrock to reply in strict JSON so the output can be consumed by a backend application. How can this be achieved efficiently?",
    options: [
      { text: "Through careful prompt engineering together with response-schema constraints in the model configuration", correct: true },
      { text: "By waiting and hoping the model randomly guesses the right format", correct: false },
      { text: "By disabling the VPC's internet connectivity", correct: false },
      { text: "By retraining a model from scratch over six months", correct: false },
    ],
    explanation: "Structured prompts combined with inference-time output constraints (a response schema or tool/function definition) reliably produce machine-readable output. Network settings have no bearing on output format, and retraining is a disproportionate response to a formatting requirement.",
  },
  {
    id: "q56", domain: "d3",
    prompt: "In a RAG architecture on Amazon Bedrock, which component converts document text into the numeric vectors the system searches over?",
    options: [
      { text: "Embedding models", correct: true },
      { text: "Video compression algorithms", correct: false },
      { text: "BGP routing protocols", correct: false },
      { text: "Speech-to-text servers", correct: false },
    ],
    explanation: "Embedding models transform words, sentences or whole documents into dense vector representations that capture semantic meaning, which is what makes similarity search possible. Compression, routing and transcription serve entirely different purposes.",
  },
  {
    id: "q62", domain: "d3",
    prompt: "What is the primary role of Amazon OpenSearch Service in AWS generative AI solutions?",
    options: [
      { text: "To act as a high-performance vector database that stores embeddings and runs semantic similarity search for RAG architectures", correct: true },
      { text: "To generate synthetic voices for audiobooks", correct: false },
      { text: "To translate static web pages into other languages", correct: false },
      { text: "To store compressed backup archives long term", correct: false },
    ],
    explanation: "OpenSearch Service is widely used as the vector store behind retrieval-augmented generation, powering fast and accurate semantic search across corporate data. Speech synthesis, translation and archival backup are handled by other services.",
  },
  {
    id: "q64", domain: "d3",
    prompt: "Which AWS service lets users work with models by creating intelligent agents that can break complex tasks into steps and use external tools?",
    options: [
      { text: "Amazon Bedrock Agents", correct: true },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Textract", correct: false },
      { text: "Amazon Translate", correct: false },
    ],
    explanation: "Bedrock Agents orchestrate complex workflows, letting an LLM reason through steps, consult knowledge bases and invoke APIs to take action autonomously. Polly, Textract and Translate are single-purpose AI services with no orchestration capability.",
  },

  /* ==================================================================== D4 */
  {
    id: "q1", domain: "d4",
    prompt: "A company produces quarterly forecasts to optimise its operations, and an AI specialist is preparing a report on the trained machine learning models to give stakeholders transparency and explainability. What should the report include to meet that requirement?",
    options: [
      { text: "Partial dependence plots (PDPs)", correct: true },
      { text: "The model's training code", correct: false },
      { text: "Sample training data", correct: false },
      { text: "Model convergence tables", correct: false },
    ],
    explanation: "Partial dependence plots visualise the marginal effect of one or two features on a model's predicted outcome, making them the standard explainability artefact for helping non-technical stakeholders see how individual inputs drive predictions. Training code, raw samples and convergence tables document how the model was built, not how it reasons.",
  },
  {
    id: "q3", domain: "d4",
    prompt: "A company wants to classify human genes into 20 categories based on their characteristics and needs an ML approach that lets it document how the internal mechanism affects the output. Which approach is most appropriate?",
    options: [
      { text: "Use an inherently interpretable model — such as logistic regression or a depth-limited decision tree — where the feature contributions are transparent", correct: true },
      { text: "Use a deep \"black box\" neural network with no additional analysis tooling", correct: false },
      { text: "Skip feature evaluation and rely solely on reinforcement learning", correct: false },
      { text: "Implement complex diffusion models with no traceability", correct: false },
    ],
    explanation: "When explainability and traceability of the internal mechanism are mandatory requirements, inherently interpretable models (or interpretable models plus auditing tooling) let you document how each gene feature influences the resulting category. The other options explicitly discard the traceability the requirement demands.",
  },
  {
    id: "q8", domain: "d4",
    prompt: "A company is building a solution that generates images of protective eyewear, and the solution must strictly minimise the risk of hallucinated or incorrect annotations. Which approach best ensures high accuracy?",
    options: [
      { text: "Human-in-the-loop validation using Amazon SageMaker Ground Truth Plus", correct: true },
      { text: "Data augmentation through an Amazon Bedrock knowledge base", correct: false },
      { text: "Automatic image recognition with Amazon Rekognition", correct: false },
      { text: "Data summarisation with Amazon QuickSight Q", correct: false },
    ],
    explanation: "When the accuracy of generated or annotated content is critical, human-in-the-loop review workflows such as SageMaker Ground Truth Plus catch errors before anything reaches production. Augmentation, automated recognition and BI summarisation add no human verification step.",
  },
  {
    id: "q21", domain: "d4",
    prompt: "A company wants to use Amazon Bedrock to evaluate and mitigate bias in the responses its language models generate, keeping content safe and aligned with corporate policy. Which Amazon Bedrock feature should it use?",
    options: [
      { text: "Amazon Bedrock Guardrails", correct: true },
      { text: "Amazon SageMaker Model Monitor", correct: false },
      { text: "AWS Trusted Advisor", correct: false },
      { text: "Amazon CloudWatch alarms", correct: false },
    ],
    explanation: "Bedrock Guardrails applies configurable, policy-based safeguards: it blocks denied topics, filters harmful content, masks sensitive data and applies contextual grounding checks to reduce hallucinated or biased output. Model Monitor watches SageMaker models, and Trusted Advisor and CloudWatch alarms are account and operational tooling.",
  },
  {
    id: "q29", domain: "d4",
    prompt: "A company implementing a responsible AI programme needs to evaluate bias and explainability for its tabular models in Amazon SageMaker in an automated way. Which SageMaker tool supports this?",
    options: [
      { text: "Amazon SageMaker Clarify", correct: true },
      { text: "Amazon SageMaker Canvas", correct: false },
      { text: "Amazon Bedrock Agents", correct: false },
      { text: "Amazon Translate", correct: false },
    ],
    explanation: "SageMaker Clarify detects bias both before and after training and produces explainability metrics showing which features most influence a model's predictions. Canvas is a no-code model builder, Bedrock Agents orchestrate LLM workflows, and Translate handles language conversion.",
  },
  {
    id: "q34", domain: "d4",
    prompt: "Which pillar of responsible AI on AWS focuses on ensuring that AI systems treat all user groups equitably, without harmful bias?",
    options: [
      { text: "Fairness", correct: true },
      { text: "Cloud processing speed", correct: false },
      { text: "Multimedia file compression", correct: false },
      { text: "Multi-Region redundant storage", correct: false },
    ],
    explanation: "Fairness is the responsible AI dimension concerned with identifying and mitigating algorithmic bias so that AI decisions do not unfairly disadvantage any demographic group. The other options are performance, storage and media concerns, not responsible AI dimensions.",
  },
  {
    id: "q45", domain: "d4",
    prompt: "A company wants to prevent its generative AI applications from disclosing confidential financial information or answering questions on topics the company prohibits. Which native Amazon Bedrock capability implements this control?",
    options: [
      { text: "Amazon Bedrock Guardrails", correct: true },
      { text: "Amazon SageMaker Debugger", correct: false },
      { text: "AWS WAF (Web Application Firewall)", correct: false },
      { text: "Amazon Inspector", correct: false },
    ],
    explanation: "Guardrails applies content filters, denied-topic rules and PII masking to both model inputs and outputs, which is precisely the control needed here. SageMaker Debugger inspects training jobs, WAF filters HTTP traffic, and Inspector scans for software vulnerabilities — none inspects model responses for prohibited content.",
  },
  {
    id: "q49", domain: "d4",
    prompt: "Which tool within Amazon SageMaker helps data scientists audit and understand the importance of individual variables in a model's predictions, in support of explainable AI?",
    options: [
      { text: "Amazon SageMaker Clarify", correct: true },
      { text: "Amazon CloudWatch dashboards", correct: false },
      { text: "AWS Cost Anomaly Detection", correct: false },
      { text: "Amazon S3 Intelligent-Tiering", correct: false },
    ],
    explanation: "Clarify produces detailed feature-attribution reports (based on SHAP values) alongside its pre- and post-training bias metrics, which is what makes a model's reasoning auditable. Dashboards, cost anomaly detection and storage tiering address monitoring, spend and storage cost.",
  },
  {
    id: "q61", domain: "d4",
    prompt: "A healthcare company wants to guarantee that no language model exposes social security numbers or medical histories in its public responses. Which mechanism prevents this automatically in Amazon Bedrock?",
    options: [
      { text: "Personally identifiable information (PII) filters in Amazon Bedrock Guardrails", correct: true },
      { text: "Increasing the base model's learning rate", correct: false },
      { text: "Using symmetric encryption keys in S3 Glacier", correct: false },
      { text: "Disabling CloudWatch logging", correct: false },
    ],
    explanation: "Bedrock Guardrails includes built-in sensitive-information filters that automatically detect and either mask or block PII in both prompts and completions. Learning rate is a training hyperparameter, encrypting archived storage does not filter model output, and turning logging off only reduces your visibility.",
  },
  {
    id: "q63", domain: "d4",
    prompt: "Which responsible AI practice aims to ensure that AI systems operate dependably and safely, and stay robust in the face of unexpected inputs or failures?",
    options: [
      { text: "Reliability and safety", correct: true },
      { text: "Deliberately slowing down response times", correct: false },
      { text: "Massively increasing storage costs", correct: false },
      { text: "Removing all access-control policies", correct: false },
    ],
    explanation: "The reliability and safety dimension covers predictable model behaviour, resistance to adversarial or malformed input, and avoiding operational or content-level harm. The other options describe degradations, not responsible AI practices.",
  },

  /* ==================================================================== D5 */
  {
    id: "q9", domain: "d5",
    prompt: "A company wants to build a chatbot with a foundation model in Amazon Bedrock that reads encrypted data in an Amazon S3 bucket, but the requests are failing with an access error. Which solution resolves the problem?",
    options: [
      { text: "Make sure the IAM role Amazon Bedrock assumes has explicit permission to decrypt the data with the correct encryption key", correct: true },
      { text: "Configure the S3 buckets to allow public access over the internet", correct: false },
      { text: "Use prompt engineering to tell the model to read S3 anonymously", correct: false },
      { text: "Remove encryption from every object in S3", correct: false },
    ],
    explanation: "A managed service such as Amazon Bedrock accesses your data through a service role, so that role needs both the S3 read permissions and the key permissions required to decrypt the objects. Opening the bucket publicly or stripping encryption would \"fix\" the error by removing your security controls, and prompting cannot grant access.",
  },
  {
    id: "q11", domain: "d5",
    prompt: "A company is developing a generative AI application on Amazon Bedrock and must satisfy strict regulatory standards on data storage and data residency. Which characteristic of Amazon Bedrock should it evaluate?",
    options: [
      { text: "Regional compliance coverage together with encryption of data at rest and in transit, using customer-managed or AWS-managed keys", correct: true },
      { text: "The ability to store training data publicly so that any user can audit it", correct: false },
      { text: "Automatic deletion of CloudTrail audit records", correct: false },
      { text: "A requirement to move all data out of the chosen Region for global processing", correct: false },
    ],
    explanation: "Bedrock supports enterprise privacy and compliance: your data is not used to train the underlying base models, it is encrypted at rest and in transit, and it stays within the AWS Region you select. Publishing training data, deleting audit trails and forcing data out of Region all work against the stated requirement.",
  },
  {
    id: "q38", domain: "d5",
    prompt: "Which AWS service or feature is used to govern, track and manage the metadata and artefacts of machine learning experiments across a structured lifecycle?",
    options: [
      { text: "Amazon SageMaker Model Registry and SageMaker Experiments", correct: true },
      { text: "Amazon CloudFront", correct: false },
      { text: "Amazon Inspector", correct: false },
      { text: "AWS Shield", correct: false },
    ],
    explanation: "SageMaker Experiments organises and compares training runs while the Model Registry versions approved models and tracks their lineage, together giving centralised ML governance. CloudFront is a CDN, Inspector scans for vulnerabilities, and Shield defends against DDoS.",
  },
  {
    id: "q39", domain: "d5",
    prompt: "A company needs to make sure the data used to train its AI models complies with privacy regulations and contains no exposed personally identifiable information (PII). Which AWS service helps discover and protect sensitive data?",
    options: [
      { text: "Amazon Macie", correct: true },
      { text: "Amazon Polly", correct: false },
      { text: "Amazon Rekognition", correct: false },
      { text: "Amazon Lex", correct: false },
    ],
    explanation: "Amazon Macie uses machine learning and pattern matching to automatically discover, classify and help protect sensitive data such as PII in Amazon S3 buckets. Polly, Rekognition and Lex are speech, vision and conversational services.",
  },
  {
    id: "q40", domain: "d5",
    prompt: "When deploying a generative AI solution with Amazon Bedrock, who is primarily responsible for security *in* the cloud under the AWS shared responsibility model?",
    options: [
      { text: "The customer, who is responsible for their data, user access, IAM permissions and guardrail configuration", correct: true },
      { text: "AWS, which fully manages physical hardware and global network security", correct: false },
      { text: "The original authors of any third-party open-source model", correct: false },
      { text: "No one, because AI services operate without security rules", correct: false },
    ],
    explanation: "The model splits responsibility: AWS secures the cloud itself — the infrastructure running the service — while the customer secures what they put *in* the cloud: their data, identities, permissions, policies and safe use of the models. AWS's responsibility for physical hardware is security *of* the cloud, which is the other half of the split.",
  },
  {
    id: "q41", domain: "d5",
    prompt: "A company running a language model on Amazon Bedrock wants to record user prompts and generated responses for auditing and debugging. Which AWS feature should it enable?",
    options: [
      { text: "Amazon Bedrock model invocation logging", correct: true },
      { text: "AWS Shield Advanced", correct: false },
      { text: "Amazon S3 Glacier Vault Lock", correct: false },
      { text: "AWS Trusted Advisor", correct: false },
    ],
    explanation: "Model invocation logging captures Bedrock request and response data to Amazon S3 or Amazon CloudWatch Logs for security auditing, compliance and usage analysis. Shield Advanced is DDoS protection, Vault Lock enforces archive retention policy, and Trusted Advisor provides best-practice checks.",
  },
  {
    id: "q43", domain: "d5",
    prompt: "A data science team needs to fine-tune a pre-trained model in Amazon Bedrock using its own private data held in Amazon S3. What is required for the process to succeed?",
    options: [
      { text: "Grant Amazon Bedrock the necessary access to the S3 bucket through IAM policies and a service role", correct: true },
      { text: "Make every object in the bucket publicly accessible over the internet", correct: false },
      { text: "Disable AWS KMS encryption completely", correct: false },
      { text: "Use only local physical disks attached to the developers' laptops", correct: false },
    ],
    explanation: "Bedrock reads your training and validation data through an IAM service role, so that role must be configured with permission to access the bucket (and to use the KMS key, if the objects are encrypted with one). Public access and disabling encryption are unnecessary and unsafe, and Bedrock cannot read local disks.",
  },
  {
    id: "q53", domain: "d5",
    prompt: "Which AWS service is used for real-time monitoring of application performance, infrastructure metrics and alarms associated with deployed models?",
    options: [
      { text: "Amazon CloudWatch", correct: true },
      { text: "AWS Cost Explorer", correct: false },
      { text: "Amazon Inspector", correct: false },
      { text: "AWS Shield Standard", correct: false },
    ],
    explanation: "Amazon CloudWatch collects metrics, logs and events, letting you watch the health of AI workloads, set alarms and track operational behaviour. Cost Explorer analyses spend, Inspector assesses vulnerabilities, and Shield Standard mitigates DDoS attacks.",
  },
  {
    id: "q59", domain: "d5",
    prompt: "A financial organisation requires an immutable audit record of every API call made to AI services in order to satisfy strict regulations. Which AWS service records that API activity?",
    options: [
      { text: "AWS CloudTrail", correct: true },
      { text: "Amazon CloudFront", correct: false },
      { text: "AWS Elastic Beanstalk", correct: false },
      { text: "Amazon Lightsail", correct: false },
    ],
    explanation: "AWS CloudTrail records account activity — actions taken through the console, SDKs, CLI and APIs — which is the foundation of auditing and compliance on AWS, and log file validation plus S3 Object Lock make that record tamper-evident. CloudFront, Elastic Beanstalk and Lightsail are content delivery, application deployment and simplified compute services.",
  },
];
